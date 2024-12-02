"use client";
import React, { Suspense, useContext, useEffect } from "react";
import { Container, Row, Button, InputGroup, Form } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import ".././tools.css";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { IoArrowBack } from "react-icons/io5";
import Local from "./local";
import Gdrive from "./gdrive";
import Onedrive from "./onedrive";
import Dropbox from "./dropbox";

const UploadFiles = () => {
  const { loader, domains, user } = useContext(SessionContext);
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");

  // Redirect to login page if user is not present
  useEffect(() => {
    if (!loader && !user) {
      router.push("/login?page=websites");
    }
  }, [loader, user, router]);

  if (loader) {
    return <Loader />;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header customBg="light-blue" />
      <Container fluid className="hero-section text-center py-5">
        <div className="hero-content mx-auto">
          <div className="icon-container mb-3 mx-auto">
            <FaUpload size={40} />
          </div>
          <h1 className="display-5 fw-bold mb-3">Upload Files</h1>
          <p className="lead mb-4">
            Upload your files effortlessly from various sources and manage your
            content in one place.
          </p>
        </div>
      </Container>
      {domains.length > 0 ? (
        <div className="container py-5 mb-4" style={{ minHeight: "100vh" }}>
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h4 className="text-uppercase font-weight-bold text-dark">
              <IoArrowBack onClick={handleGoBack} className="back-icon me-3" />
              Upload Files
            </h4>
          </div>

          <Row className="g-4 mt-4" id="upload">
            <div className="col-lg-12">
              <div className="row g-4">
                <Local site={site} id={id} />
                <Gdrive site={site} id={id} />
                <Onedrive site={site} id={id} />
                {/* <Dropbox site={site} id={id} /> */}
              </div>
            </div>
          </Row>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <h2 className="text-danger">No available subscriptions</h2>
            <p className="text-muted">
              You don't have any subscriptions in your profile. Please use{" "}
              <a href="https://www.kreatewebsites.com/pricing-plans">
                Kreatewebsites
              </a>{" "}
              to subscribe to a new plan.
            </p>
            <p className="text-muted">
              You can contact support team for additional info.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <UploadFiles />
    </Suspense>
  );
}
