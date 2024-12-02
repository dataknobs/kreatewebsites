"use client";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import cms from "@/services/cmsService";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCredits, setUserCredits] = useState();
  const [loader, setLoader] = useState(true);
  const [domains, setDomains] = useState([]);
  const [cmsBuckets, setCmsBuckets] = useState([]);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteBucket, setSiteBucket] = useState("");
  const [driveBucket, setDriveBucket] = useState("");
  const [cmsPath, setCmsPath] = useState(false);
  const cloud = process.env.NEXT_PUBLIC_CLOUD_VERSION;

  const fetchDomainData = async (email) => {
    const domainsCollectionRef = collection(db, "domains");
    const domainsQuery = query(
      domainsCollectionRef,
      where("subscriptionInfo.subscription", "==", true),
      where("subscriptionInfo.holders", "array-contains", email),
    );

    const domainsSnapshot = await getDocs(domainsQuery);
    const allDomains = domainsSnapshot.docs.map(
      (doc) => doc.data().subscriptionInfo,
    );

    if (allDomains.length > 0) {
      setDomains(allDomains);
    }
  };

  const fetchBucketData = async (id) => {
    try {
      setLoading(true);

      const domainDocRef = doc(db, "domains", id);
      const domainDocSnapshot = await getDoc(domainDocRef);

      if (domainDocSnapshot.exists()) {
        const domainData = domainDocSnapshot.data();
        if (cloud === "gcp") {
          await setSiteBucket(domainData.site_bucket);
          await setDriveBucket(domainData.drive_bucket);
          cms.checkCmsAccess(cmsBuckets, domainData.site_bucket, setCmsPath); // Check access after cmsBuckets is set
        } else if (cloud === "azure") {
          await setSiteBucket(id + "-prompt");
          await setDriveBucket(id + "-drive");
          cms.checkCmsAccess(cmsBuckets, id + "-prompt", setCmsPath);
        }
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.error("Error fetching domain data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchCmsBuckets = async (email) => {
    try {
      const cmsCollectionRef = collection(db, "cms");
      const userQuery = query(
        cmsCollectionRef,
        where("allotted", "==", true), // Fetch only allotted documents
      );
      const querySnapshot = await getDocs(userQuery);

      const fetchedBuckets = querySnapshot.docs
        .filter((doc) => {
          const subscriptionInfo = doc.data().subscriptionInfo || {};
          return (
            subscriptionInfo.users && subscriptionInfo.users.includes(email)
          );
        }) // Check if holders in subscriptionInfo contains the email
        .filter((doc) => doc.data().cloud === cloud) // Further filter if cloud matches
        .map((doc) => ({
          name: doc.id, // Assuming document ID represents the bucket name
          ...doc.data(),
        }));
      setCmsBuckets(fetchedBuckets);
    } catch (error) {
      console.error("Error fetching CMS buckets:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        await setUser(currentUser);
        if (
          currentUser.email === "prashantk@dataknobs.com" ||
          currentUser.email === "vishnu.dn@dataknobs.com"
        ) {
          setSuperAdmin(true);
        }
        const querySnapshotNew = await getDocs(
          query(
            collection(db, "userdata"),
            where("email", "==", currentUser.email),
          ),
        );

        if (!querySnapshotNew.empty) {
          const userData = querySnapshotNew.docs[0].data();
          setUserCredits(userData.credits);
        }
        await fetchDomainData(currentUser.email);
        await fetchCmsBuckets(currentUser.email);
        setLoader(false);
      } else {
        setUser(null);
        setLoader(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const reduceCredits = async (n) => {
    const querySnapshotNew = await getDocs(
      query(collection(db, "userdata"), where("email", "==", user.email)),
    );
    const documentRef = doc(db, "userdata", querySnapshotNew.docs[0].id);
    updateDoc(documentRef, {
      credits: userCredits - n,
    });
    setUserCredits((prev) => prev - n);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        cloud,
        userCredits,
        reduceCredits,
        setUserCredits,
        fetchDomainData,
        fetchCmsBuckets,
        fetchBucketData,
        loader,
        loading,
        setLoader,
        domains,
        cmsBuckets,
        siteBucket,
        driveBucket,
        cmsPath,
        superAdmin,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
