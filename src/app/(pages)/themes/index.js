"use client";
import React, { useState, useEffect, useContext } from "react";
import ThemeItem from "./ThemeItem";
import classes from "./index.module.css";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";

const Themes = () => {
  const { domains } = useContext(SessionContext);
  const { user, usermail } = useContext(SessionContext);
  //1.code for fetching the themes from the firestore database and sort them
  const [themes, setthemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  //this useEffect is for fetching the themes from the firestore database
  useEffect(() => {
    const fetchthemes = async () => {
      const querySnapshot = await getDocs(collection(db, "themes"));

      const loadedthemes = [];

      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          // Check if the document exists before accessing its data
          loadedthemes.push({
            id: doc.id,
            name: doc.data().name,
            images: doc.data().images,
            livelink: doc.data().livelink,
          });
        }
      });

      loadedthemes.sort((a, b) => {
        // Compare the "name" property of each object
        const numericA = parseInt(a.name.slice(5));
        const numericB = parseInt(b.name.slice(5));

        return numericA - numericB;
      });

      setthemes(loadedthemes);
      setIsLoading(false);
    };

    fetchthemes().catch((error) => {
      setIsLoading(false);
      setHttpError(`${error.message}... Error Loading Themes`);
    });
  }, []);
  //1.TILL HERE

  //2.Code to update the selectedTheme state
  const [selectedTheme, setSelectedTheme] = useState("");

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
  };
  //2.TILL HERE

  const [ismember, setIsMember] = useState(false);

  useEffect(() => {
    const unsubscribe = async () => {
      if (user) {
        const querySnapshot = await getDocs(
          query(collection(db, "userdata"), where("email", "==", usermail)),
        );

        if (!querySnapshot.empty) {
          setIsMember(true);
        }
      }
    };

    return () => {
      unsubscribe();
    };
  }, [user]);
  //3.TILL HERE

  //4.Function to confirm and update the selected theme in Firestore to the current user's currently selected website
  const handleConfirmTheme = async () => {
    const querySnapshotNew = await getDocs(
      query(
        collection(db, "domains"),
        where("subscriptionInfo.holders", "array-contains", usermail),
      ),
    );

    let domainData = [];

    await Promise.all(
      querySnapshotNew.docs.map(async (domainDoc) => {
        const domainDocData = domainDoc.data();
        if (domainDocData.subscriptionInfo) {
          domainData = domainData.concat(domainDocData.subscriptionInfo);
        }
      }),
    );

    const indexOfObject = domainData.findIndex(
      (person) => person.url === domains.url,
    );

    if (indexOfObject !== -1) {
      domainData[indexOfObject].theme = selectedTheme;

      const documentRef = doc(db, "domains", querySnapshotNew.docs[0].id);

      await updateDoc(documentRef, {
        subscriptionInfo: domainData,
      });

      domainData = [];
      toast.success(
        "Theme Updated Successfully! You can check under Website Configuration tab under My Account Page ",
      );
    } else {
      toast.error(
        "First please select the website from My Account page for which theme is to be selected",
      );
    }
  };
  //4.TILL HERE

  let loadingText = (
    <div className="d-flex justify-content-center mb-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  let errorText = (
    <section className={classes.themesError}>
      <p>{httpError}</p>
    </section>
  );

  const themesList = themes.map((theme) => (
    <ThemeItem
      key={theme.id}
      id={theme.id}
      name={theme.name}
      images={theme.images}
      livelink={theme.livelink}
      member={ismember}
      onThemeSelect={handleThemeSelect}
    />
  ));

  return (
    <>
      <Header />
      <div className="container-fluid pt-5 hero-header mb-5 bg-primary">
        <div className="container pt-5">
          <div className="row g-5 pt-5">
            <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
              <h1 className="display-4 text-white mb-4 animated slideInRight">
                Discover Your Perfect Theme:Unveil the Beauty of Your Website!
              </h1>
              <p className="text-white mb-4 animated slideInRight">
                Elevate your online presence with our easy-to-use theme
                selection and transform your website into a captivating
                masterpiece. <br></br>From sleek and modern designs to elegant
                and timeless classics, our collection offers the perfect
                backdrop to showcase your unique vision.
              </p>
            </div>
            <div className="col-lg-6 align-self-end text-center text-lg-end">
              <img
                className="img-fluid"
                src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/hero-img.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading && loadingText}
      {httpError && errorText}
      {!isLoading && !httpError && (
        <div className={`container ${classes.themes}`}>
          <h1 className="text-center m-2">List of Available Themes</h1>
          <ul className="row justify-content-between p-0 mb-0 list-unstyled">
            {themesList}
          </ul>
        </div>
      )}

      {!isLoading && !httpError && (
        <div className={classes.submit}>
          <button
            onClick={handleConfirmTheme}
            className={`${
              selectedTheme.trim() === "" ? classes.incorrect : classes.correct
            } ${user === null && ismember === false ? classes.disabled : ""}`}
            disabled={user === null && ismember === false}
          >
            Confirm Selected Theme
            <div>(Please Select One theme)</div>
          </button>
        </div>
      )}
    </>
  );
};

export default Themes;
