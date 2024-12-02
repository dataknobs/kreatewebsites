"use client";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { CgBitbucket } from "react-icons/cg";
import { TbWorldWww } from "react-icons/tb";
import { IoArrowBack } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./assets.css";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

import Footer from "@/components/footer";

const Assets = () => {
  const { domains, loader, cloud } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [siteBucket, setSiteBucket] = useState("");
  const [driveBucket, setDriveBucket] = useState("");

  const router = useRouter();
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const site = searchParam.get("site");

  const fetchBucketData = async (id) => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loader) {
      return;
    }

    if (domains && domains.length > 0) {
      const matchingDomain = domains.find((domain) => domain.domain_id === id);
      if (matchingDomain) {
        fetchBucketData(id);
      } else {
        router.push("/error-page");
      }
    }
  }, [id, domains, loader]);

  const handleBucketClick = (bucketName) => {
    // Highlight bucket on single click
    setSelectedBucket(bucketName === selectedBucket ? null : bucketName);
  };

  const handleBucketDoubleClick = (bucketName) => {
    // Navigate to FileManager
    router.push(
      `/websites/assets/file-explorer?site=${encodeURIComponent(site)}&id=${encodeURIComponent(
        id,
      )}&bucket-name=${encodeURIComponent(bucketName)}`,
    );
  };
  const handleGoBack = () => {
    router.back();
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <Header customBg="light-blue" />
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div className="d-flex">
            <h4 className="text-uppercase font-weight-bold text-dark">
              <IoArrowBack onClick={handleGoBack} className="back-icon me-3" />
              Explore your content
            </h4>
            <p>
              <TbWorldWww size={30} className="mb-1 ms-4" /> {site}
            </p>
          </div>
        </div>
        {domains.length > 0 ? (
          <Row className="g-4 mt-4">
            {loading ? (
              <Row>
                {[...Array(12)].map((_, index) => (
                  <Col key={index} md={3}>
                    <Card className="folder-card m-2">
                      <Card.Body className="d-flex align-items-center">
                        <Skeleton circle={true} height={60} width={60} />
                        <Skeleton height={24} width={110} className="ms-3" />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <>
                {siteBucket && driveBucket ? (
                  <>
                    <Col xs={12} md={4} lg={3}>
                      <Card
                        onClick={() => handleBucketClick(siteBucket)}
                        onDoubleClick={() =>
                          handleBucketDoubleClick(siteBucket)
                        }
                        className={`bucket-card shadow-sm border-0 p-3 rounded hover-card glass-card ${
                          selectedBucket === siteBucket ? "bucket-selected" : ""
                        }`}
                      >
                        <div className="d-flex align-items-center">
                          <CgBitbucket size={30} className="bucket-icon me-3" />
                          <Card.Title className="text-truncate fw-semibold mb-0 bucket-title">
                            {siteBucket}
                          </Card.Title>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={12} md={4} lg={3}>
                      <Card
                        onClick={() => handleBucketClick(driveBucket)}
                        onDoubleClick={() =>
                          handleBucketDoubleClick(driveBucket)
                        }
                        className={`bucket-card shadow-sm border-0 p-3 rounded hover-card glass-card ${
                          selectedBucket === driveBucket
                            ? "bucket-selected"
                            : ""
                        }`}
                      >
                        <div className="d-flex align-items-center">
                          <CgBitbucket size={30} className="bucket-icon me-3" />
                          <Card.Title className="text-truncate fw-semibold mb-0 bucket-title">
                            {driveBucket}
                          </Card.Title>
                        </div>
                      </Card>
                    </Col>
                  </>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "40vh" }}
                  >
                    <div className="text-center">
                      <h2 className="text-danger">Buckets not allotted</h2>
                      <p className="text-muted">
                        You have not been allotted any content buckets for your
                        subscription.
                      </p>
                      <p className="text-muted">
                        Please contact our support team to enable your content
                        buckets.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </Row>
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
      </div>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Assets />
    </Suspense>
  );
}
