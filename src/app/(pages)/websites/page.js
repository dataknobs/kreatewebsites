"use client";
import React, { useContext, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { TbWorldWww } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { useRouter } from "next/navigation";
import "./websites.css";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { PiSquaresFourFill } from "react-icons/pi";

const Websites = () => {
  const { loader, domains, user } = useContext(SessionContext);
  const router = useRouter();

  // Redirect to login page if user is not present
  useEffect(() => {
    if (!loader && !user) {
      // Check loader to avoid redirecting while loading
      router.push("/login?page=websites");
    }
  }, [loader, user, router]);

  const handleToolsClick = (domain) => {
    // Navigate to bucket-manager with correct query parameters
    router.push(
      `/websites/tools?site=${encodeURIComponent(
        domain.url,
      )}&id=${encodeURIComponent(domain.domain_id)}`,
    );
  };

  const handleAssetsClick = (domain) => {
    // Navigate to bucket-manager with correct query parameters
    router.push(
      `/websites/assets?site=${encodeURIComponent(
        domain.url,
      )}&id=${encodeURIComponent(domain.domain_id)}`,
    );
  };

  const handleSettingsClick = (domain) => {
    // Navigate to bucket-manager with correct query parameters
    router.push(
      `/websites/settings?site=${encodeURIComponent(
        domain.url,
      )}&id=${encodeURIComponent(domain.domain_id)}`,
    );
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <Header customBg="light-blue" />

      {domains.length > 0 ? (
        <div className="container py-5" style={{ minHeight: "100vh" }}>
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h4 className="text-uppercase font-weight-bold text-dark">
              <CgWebsite className="me-2" /> Your Subscriptions.
            </h4>
          </div>

          <Row className="g-4 mt-4">
            {domains.map((domain) => (
              <Col xs={12} md={12} lg={4} key={domain.url} className="mb-4">
                <Card
                  onDoubleClick={() => handleToolsClick(domain)}
                  className={`site-card border-0 rounded hover-card glass-card`}
                >
                  <div className="d-flex flex-column flex-md-column">
                    <div
                      style={{
                        width: "2000px",
                        height: "240px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <iframe
                        src={`https://${domain.url}`}
                        name="iframe_a"
                        style={{
                          width: "100%",
                          height: "1100px",
                          border: "none",
                          transform: "scale(0.2)",
                          transformOrigin: "0 0",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          pointerEvents: "none",
                        }}
                      ></iframe>
                    </div>

                    <Card.Body className="p-3 w-100 d-flex flex-column justify-content-start">
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="text-truncate fw-medium mb-2 site-title">
                          <TbWorldWww size={30} className="me-2 text-primary" />
                          {domain.url}
                        </Card.Title>
                      </div>
                      <div className="d-flex mt-4">
                        <button
                          onClick={() => handleSettingsClick(domain)}
                          className="btn btn-light rounded-pill me-2"
                          style={{ textDecoration: "none" }}
                          title="Website configuration and settings"
                        >
                          <i className="bi bi-gear"></i> Settings
                        </button>
                        <button
                          onClick={() => handleAssetsClick(domain)}
                          className="btn btn-light rounded-pill me-2"
                          title="Website content management"
                        >
                          <i className="bi bi-folder"></i> Assets
                        </button>
                        <button
                          onClick={() => handleToolsClick(domain)}
                          className="btn btn-light rounded-pill"
                          style={{ textDecoration: "none" }}
                          title="Kreate tools to generate content"
                        >
                          <PiSquaresFourFill /> All tools
                        </button>
                      </div>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
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

export default Websites;
