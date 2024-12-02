"use client";
import React, { useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgWebsite } from "react-icons/cg";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { IoArrowBack, IoCloudUploadOutline } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import axios from "axios";
import ".././tools.css";
import { toast } from "react-toastify";
import { fetchSiteBucket, useRouteValidation } from "@/hooks/validation";
import websiteService from "@/services/websiteService";

const GeneratePagesUsingCsv = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");
  const { domains, loader, userCredits, reduceCredits, cloud } =
    useContext(SessionContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { siteBucket, driveBucket } = fetchSiteBucket(id);

  useRouteValidation(domains, loader, site, id);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCredits !== null && userCredits > 0 && file) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("file", file);
      if (siteBucket && siteBucket.length > 0) {
        formData.append("site_bucket", siteBucket);
      }
      if (driveBucket && driveBucket.length > 0) {
        formData.append("drive_bucket", driveBucket);
      }
      if (cloud == "azure") {
        formData.append("cloud", "AZURE");
      }

      setLoading(true);

      let apiUrl =
        "https://apis-new-vtoo6mbt4q-uc.a.run.app/file_generate_presentation";
      if (cloud == "azure") {
        apiUrl =
          "https://bucket-next.azurewebsites.net/file_generate_presentation";
      }

      try {
        const response = await websiteService.submitSlidesUsingCsv(formData);
        console.log("Response Data:", response.data);
        toast.success("CSV file uploaded successfully!");
        reduceCredits(1);
      } catch (error) {
        console.error("Error uploading CSV:", error);
        toast.error(
          "Error uploading CSV: " +
            (error.response ? error.response.data.message : error.message),
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please ensure you have enough credits and a file selected.");
    }
  };

  if (loader) {
    return <Loader />;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header customBg="light-blue" />
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h4 className="text-uppercase font-weight-bold text-dark">
            <IoArrowBack onClick={handleGoBack} className="back-icon me-3" />
            <CgWebsite className="me-2" /> Generate Slides Using CSV
          </h4>
          <h6 className="font-weight-bold text-dark">
            <GiTwoCoins className="me-2" /> Available Credits : {userCredits}
          </h6>
        </div>

        <Row className="g-4 mt-5 d-flex justify-content-center w-100">
          <Col md={12}>
            <Card className="shadow-lg rounded-4 border-0 p-4 frosted-glass-card">
              <h3
                className="text-center mb-4"
                style={{
                  color: "#4B0082",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {site}
              </h3>
              <Form onSubmit={handleSubmit}>
                <Card
                  className="mb-4 p-4 frosted-step shadow-sm border-0"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  <h5 className="mb-3 step-title text-primary">
                    <IoCloudUploadOutline className="me-2" /> Upload CSV File
                  </h5>
                  <InputGroup className="custom-input">
                    <Form.Control
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="rounded-end"
                      required
                    />
                  </InputGroup>
                </Card>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mt-3 rounded-pill gradient-btn"
                  disabled={loading || !file}
                >
                  {!loading ? "Upload CSV" : "Uploading..."}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        <div className="container-fluid py-5">
          <div className="container py-5">
            <div
              className="mx-auto text-center wow fadeIn"
              data-wow-delay="0.1s"
              style={{ maxWidth: "500px" }}
            >
              <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                FAQ
              </div>
              <h3 className="mb-4 text-secondary">
                How should your CSV look like?
              </h3>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="accordion" id="accordionFAQ1">
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.1s"
                  >
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        This is how your file format should be
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionFAQ1"
                    >
                      <div className="accordion-body">
                        <ul
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.95rem" }}
                        >
                          <li>
                            <strong>topic</strong>: The topic or content to be
                            generated.
                          </li>
                          <li>
                            <strong>subfolder</strong>: Specify the folder
                            within your storage to organize files.
                          </li>
                          <li>
                            <strong>filename</strong>: The name for each
                            generated file.
                          </li>
                          <li>
                            <strong>num_slides</strong>: The number of slides.
                          </li>
                        </ul>
                      </div>
                    </div>
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
      <GeneratePagesUsingCsv />
    </Suspense>
  );
}
