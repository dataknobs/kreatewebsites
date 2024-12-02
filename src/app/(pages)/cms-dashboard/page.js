"use client";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { CgBitbucket } from "react-icons/cg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import "./cms-dashboard.css";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";

const CmsDashboard = () => {
  const {
    user,
    loader,
    cmsBuckets: buckets,
    loading,
  } = useContext(SessionContext);

  const [selectedBucket, setSelectedBucket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loader && !user) {
      router.push("/login?page=cms-dashboard");
    }
  }, [loader, user]);

  const handleBucketClick = (bucketName) => {
    setSelectedBucket(bucketName === selectedBucket ? null : bucketName);
  };

  const handleBucketDoubleClick = (bucketName) => {
    // Navigate to FileManager, passing only the bucket name
    router.push(
      `/file-manager?cms-bucket-name=${encodeURIComponent(bucketName)}`,
    );
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
              Explore your content
            </h4>
          </div>
        </div>
        {!loading ? (
          <Row className="g-4 mt-4">
            {buckets.length > 0 ? (
              <>
                {buckets.map((bucket) => (
                  <Col key={bucket.name} xs={12} md={4} lg={3}>
                    <Card
                      onClick={() => handleBucketClick(bucket.name)}
                      onDoubleClick={() => handleBucketDoubleClick(bucket.name)}
                      className={`bucket-card shadow-sm border-0 p-3 rounded hover-card glass-card ${
                        selectedBucket === bucket.name ? "bucket-selected" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center">
                        <CgBitbucket size={30} className="bucket-icon me-3" />
                        <Card.Title className="text-truncate fw-semibold mb-0 bucket-title">
                          {bucket.name}
                        </Card.Title>
                      </div>
                    </Card>
                  </Col>
                ))}
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "80vh" }}
                >
                  <div className="text-center">
                    <h2 className="text-danger">No available buckets</h2>
                    <p className="text-muted">
                      You don't have access to any content buckets at the
                      moment.
                    </p>
                  </div>
                </div>
              </>
            )}
          </Row>
        ) : (
          <Row className="g-4 mt-4">
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
        )}
      </div>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <CmsDashboard />
    </Suspense>
  );
}
