"use client";

import React, { useContext, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useRouteValidation } from "@/hooks/validation";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";
import Configuration from "./configuration";
import Holders from "./holders";
import ThemeSelector from "./themeSelector";
import SetCms from "./setCms";

const Settings = () => {
  const { loader, domains, user } = useContext(SessionContext);
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");

  const [domainData, setDomainData] = useState(null);
  const [holders, setHolders] = useState([]);

  // Route validation and redirect if necessary
  useRouteValidation(domains, loader, site, id);

  useEffect(() => {
    if (!loader && !user) {
      router.push("/login?page=websites");
    } else {
      const domain = domains.find((d) => d.domain_id === id && d.url === site);
      if (domain) {
        setDomainData(domain);
        setHolders(domain.holders || []);
      }
    }
  }, [loader, user, router, domains, site, id]);

  if (loader) return <Loader />;

  if (!domainData) return null;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header customBg="light-blue" />

      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
              <div className="service-item btn btn-sm border rounded-pill text-primary px-3 mb-3">
                {site}
              </div>
              <h1 className="mb-4">Manage Your Domain Settings</h1>
              <p className="mb-4">
                In this section, you can easily view and configure all aspects
                of your domain. Manage your domain settings, add collaborators
                or team members, select the CMS container for storing content,
                and set the required theme to match your brand and preferences.
              </p>
              <p>
                KreateCMS provides an intuitive interface for seamless content
                management, ensuring that all configurations and customizations
                are at your fingertips to create the perfect digital experience
                for your domain.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="row g-4">
                    <Configuration domainData={domainData} />

                    <ThemeSelector id={id} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-4">
                    <Holders
                      user={user}
                      domainData={domainData}
                      holders={holders}
                      setHolders={setHolders}
                    />

                    <SetCms />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Settings />
    </Suspense>
  );
}
