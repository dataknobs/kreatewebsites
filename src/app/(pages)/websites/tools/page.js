"use client";
import React, { Suspense, useContext, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { CgWebsite } from "react-icons/cg";
import { useRouter, useSearchParams } from "next/navigation";
import "./tools.css";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useDomainValidation } from "@/hooks/validation";
import { IoArrowBack } from "react-icons/io5";

const Tools = () => {
  const { loader, domains, user } = useContext(SessionContext);
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");

  // Redirect to login page if user is not present
  useEffect(() => {
    if (!loader && !user) {
      // Check loader to avoid redirecting while loading
      router.push("/login?page=websites");
    }
  }, [loader, user, router]);

  useDomainValidation(domains, loader, site, id);

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
            <CgWebsite size={40} />
          </div>
          <h1 className="display-5 fw-bold mb-3">Website Tools</h1>
          <p className="lead mb-4">
            Elevate your online presence with AI tools that enhance creativity
            and streamline workflows. Effortlessly generate and customize
            content.
          </p>
          <Button
            variant="primary"
            size="lg"
            href="#tools"
            style={{ borderRadius: "50px" }}
          >
            Explore Tools
          </Button>
        </div>
      </Container>
      {domains.length > 0 ? (
        <div className="container py-5 mb-4" style={{ minHeight: "100vh" }}>
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h4 className="text-uppercase font-weight-bold text-dark">
              <IoArrowBack onClick={handleGoBack} className="back-icon me-3" />{" "}
              Tools
            </h4>
          </div>

          <Row className="g-4 mt-4" id="tools">
            <div className="col-lg-12">
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="row g-4">
                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-person fs-2"></i>
                        </div>
                        <h5 className="mb-3">
                          Generate Pages With Your Prompt
                        </h5>
                        <p>
                          Create and customize pages using prompts for various
                          content needs, enhancing your online presence
                          effortlessly.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/generate-pages?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Generate
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-text fs-2"></i>
                        </div>
                        <h5 className="mb-3">Create Pages with Your Article</h5>
                        <p>
                          Transform your articles into professional pages to
                          share insights and stories, expanding your reach
                          effectively.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/create-article?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Start Now
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-spreadsheet fs-2"></i>
                        </div>
                        <h5 className="mb-3">
                          Generate Pages Using CSV Prompts
                        </h5>
                        <p>
                          Quickly generate multiple pages by importing prompts
                          from CSV files. A streamlined approach for bulk page
                          creation.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/generate-pages-using-csv?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Try CSV Upload
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-ppt-fill fs-2"></i>
                        </div>
                        <h5 className="mb-3">Generate Slides</h5>
                        <p>
                          Easily create professional slides for your
                          presentations. Choose from templates to enhance your
                          visual storytelling.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/generate-slides?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Generate Slides
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-spreadsheet fs-2"></i>
                        </div>
                        <h5 className="mb-3">Generate Slides Using CSV</h5>
                        <p>
                          Import data from CSV files to generate slide decks
                          efficiently, perfect for structured presentations and
                          bulk content.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/generate-slides-using-csv?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Try CSV Slide Gen
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-globe2 fs-2"></i>
                        </div>
                        <h5 className="mb-3">Generate Portfolio Site</h5>
                        <p>
                          Create a stunning portfolio website effortlessly.
                          Simply upload your resume to generate a professional
                          site showcasing your skills and achievements.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/generate-portfolio?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Generate
                        </a>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-cloud-arrow-up fs-2"></i>
                        </div>
                        <h5 className="mb-3">Upload Files</h5>
                        <p>
                          Easily upload files from Google Drive, OneDrive, or
                          your local device. Manage and access all your files
                          from one centralized location.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href={
                            !site || !id
                              ? "#"
                              : `/websites/tools/upload-files?site=${site}&id=${id}`
                          }
                          onClick={(e) => {
                            if (!site || !id) e.preventDefault();
                          }}
                        >
                          Start Upload
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
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
      <Tools />
    </Suspense>
  );
}
