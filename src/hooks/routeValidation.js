// hooks/routeValidation.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const routeValidation = (domains, loader, site, id) => {
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
      router.push("/error-page");
    }
  }, [domains, loader, id, site, router]); // Include router in dependencies
};

export default routeValidation;
