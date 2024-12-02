"use client";
import React, { useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import ".././tools.css";
import { toast } from "react-toastify";
import { fetchSiteBucket, useRouteValidation } from "@/hooks/validation";
import SelectModal from "@/components/select-folder";
import websiteService from "@/services/websiteService";

const GeneratePortfolio = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");
  const { domains, loader, userCredits, reduceCredits, cloud } =
    useContext(SessionContext);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    filename: "",
    subfolder: "",
  });
  const [loading, setLoading] = useState(false);
  const { siteBucket, driveBucket } = fetchSiteBucket(id);

  const [showModal, setShowModal] = useState(false);
  useRouteValidation(domains, loader, site, id);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCredits !== null && userCredits > 0 && file) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("site", site);
      formData.append("file", file);
      formData.append("filename", data.filename);
      formData.append("subfolder", data.subfolder);

      setLoading(true);

      try {
        await websiteService.submitPortfolio(formData);
        reduceCredits(5);
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

  const handleInputChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleModalOpen = () => setShowModal(true);

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
            <i
              className="bi bi-arrow-left back-icon me-2"
              onClick={handleGoBack}
            ></i>
            <i className="bi bi-globe me-2"></i> Generate Slides Using CSV
          </h4>
          <h6 className="font-weight-bold text-dark">
            <i className="bi bi-cash-coin me-2"></i> Available Credits :{" "}
            {userCredits}
          </h6>
        </div>

        <Row className="g-4 mt-5 d-flex justify-content-center w-100">
          <Col md={12}>
            <Card className="shadow-lg rounded-4 border-0 p-4 frosted-glass-card">
              <h3
                className="text-center text-dark mb-4"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {site}
              </h3>
              <Form onSubmit={handleSubmit}>
                <Card
                  className="mb-4 p-4 frosted-step shadow-sm"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  <h5 className="mb-3 step-title text-primary">
                    <i className="bi bi-upload me-2"></i> Upload Resume
                  </h5>
                  <InputGroup className="custom-input">
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="rounded-end"
                      required
                    />
                  </InputGroup>
                </Card>

                <Card
                  className="mb-4 p-4 frosted-step shadow-sm"
                  style={{ borderRadius: "15px" }}
                >
                  <h5 className="d-flex align-items-center mb-3 step-title text-primary">
                    <i className="bi bi-diagram-2-fill"></i> Step 2: Set site
                    URL path and file name
                  </h5>
                  <Row>
                    {/* Subfolder Button */}
                    <Col md={6} className="mb-3">
                      <InputGroup className="mb-3">
                        <Button
                          variant="outline-secondary"
                          onClick={handleModalOpen}
                          className="rounded-start"
                        >
                          <i className="bi bi-folder-fill"></i>
                          Select folder
                        </Button>
                        <Form.Control
                          type="text"
                          name="subfolder"
                          value={data.subfolder}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="Enter a path"
                          className="rounded-end"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Filename Input */}
                    <Col md={6}>
                      <InputGroup className="custom-input mb-3">
                        <InputGroup.Text
                          className="bg-transparent text-secondary rounded-start icon-bg"
                          style={{
                            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <i className="bi bi-file-earmark-fill"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="filename"
                          value={data.filename}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="Enter a file name"
                          className="rounded-end"
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Card>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mt-3 rounded-pill gradient-btn"
                  onClick={handleSubmit}
                  disabled={loading || !file}
                >
                  {!loading ? "Upload" : "Uploading..."}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />

      <SelectModal
        show={showModal}
        onHide={() => {
          handleInputChange("subfolder", "");
          handleModalClose();
        }}
        handleModalClose={handleModalClose}
        handleInputChange={handleInputChange}
        site={site}
        id={id}
        bucketName={siteBucket}
      />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <GeneratePortfolio />
    </Suspense>
  );
}
