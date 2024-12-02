// hooks/validation.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

const cloud = process.env.NEXT_PUBLIC_CLOUD_VERSION;

// Domain Validation Hook
export const useDomainValidation = (domains, loader, site, id) => {
  const router = useRouter();

  useEffect(() => {
    if (loader) {
      return; // Exit if loader is true
    }

    // Check if both site and id are present
    if (site && id) {
      // Check if domains array exists and has items
      if (domains && domains.length > 0) {
        // Find a matching domain based on id and site
        const matchingDomain = domains.find(
          (domain) => domain.domain_id === id && domain.url === site,
        );

        // Redirect to error page if no matching domain is found
        if (!matchingDomain) {
          router.push("/error-page");
        }
      }
    }
  }, [domains, loader, id, site, router]); // Include router in dependencies
};

// Route Validation Hook
export const useRouteValidation = (domains, loader, site, id) => {
  const router = useRouter();

  useEffect(() => {
    if (loader) {
      return; // Exit if loader is true
    }

    // Check if both site and id are present
    if (site && id) {
      // Check if domains array exists and has items
      if (domains && domains.length > 0) {
        // Find a matching domain based on id and site
        const matchingDomain = domains.find(
          (domain) => domain.domain_id === id && domain.url === site,
        );

        // Redirect to error page if no matching domain is found
        if (!matchingDomain) {
          router.push("/error-page");
        }
      }
    } else {
      // Redirect if either site or id is missing
      router.push("/error-page");
    }
  }, [domains, loader, id, site, router]); // Include router in dependencies
};

// Bucket Data Fetching Hook
export const fetchSiteBucket = (id) => {
  const [siteBucket, setSiteBucket] = useState(null);
  const [driveBucket, setDriveBucket] = useState(null);

  useEffect(() => {
    const fetchBucketData = async () => {
      if (!id) return;

      try {
        const domainDocRef = doc(db, "domains", id);
        const domainDocSnapshot = await getDoc(domainDocRef);
        if (domainDocSnapshot.exists()) {
          const domainData = domainDocSnapshot.data();
          if (cloud === "gcp") {
            await setSiteBucket(domainData.site_bucket);
            await setDriveBucket(domainData.drive_bucket);
          } else if (cloud === "azure") {
            await setSiteBucket(domainData.azure_site_bucket);
            await setDriveBucket(domainData.azure_drive_bucket);
          }
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching domain data:", error);
      }
    };

    fetchBucketData();
  }, [id]);

  return { siteBucket, driveBucket };
};
