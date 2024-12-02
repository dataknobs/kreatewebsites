"use client";
import React, { useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgWebsite } from "react-icons/cg";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { FaPenFancy, FaFileAlt, FaFolderOpen } from "react-icons/fa";
import ".././tools.css";
import SelectModal from "@/components/select-folder";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import axios from "axios";
import { fetchSiteBucket } from "@/hooks/validation";
import websiteService from "@/services/websiteService";

const GenerateSlides = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const site = searchParam.get("site");
  const { userCredits, reduceCredits, cloud } = useContext(SessionContext);

  const { siteBucket, driveBucket } = fetchSiteBucket(id);

  const [slidesData, setSlidesData] = useState({
    topic: "",
    num_slides: "",
    filename: "",
    subfolder: "",
    theme_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (name, value) => {
    setSlidesData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModalClose = async () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCredits === null || userCredits === 0) {
      toast.error("You are out of credits. Buy more credits to continue.");
      return;
    }

    const formData = new FormData();
    formData.append("topic", slidesData.topic);
    formData.append("num_slides", slidesData.num_slides);
    formData.append("filename", slidesData.filename);
    formData.append("subfolder", slidesData.subfolder);
    formData.append("theme", slidesData.theme_url);
    formData.append("id", id);
    if (cloud == "azure") {
      formData.append("cloud", "AZURE");
    }

    // if (siteBucket && siteBucket.length > 0) {
    //     formData.append("site_bucket", siteBucket);
    //   }

    //   if (driveBucket && driveBucket.length > 0) {
    //     formData.append("drive_bucket", driveBucket);
    //   }

    setLoading(true);

    try {
      const response = await websiteService.submitSlides(formData);
      toast.success("Slides created successfully!");
      console.log(response);
      reduceCredits(1);
      setSlidesData({
        topic: "",
        num_slides: "",
        filename: "",
        subfolder: "",
        theme_url: "",
      });
    } catch (error) {
      toast.error(`Error: ${error.response?.data.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
            <CgWebsite className="me-2" /> Generate Slides
          </h4>
          <h6 className="font-weight-bold text-dark">
            <GiTwoCoins className="me-2" /> Available Credits: {userCredits}
          </h6>
        </div>
        <Row className="g-4 mt-5 d-flex justify-content-center w-100">
          <Col md={12}>
            <Card className="shadow-lg rounded-4 border-0 p-4 frosted-glass-card">
              <h3
                className="text-center mb-4"
                style={{ color: "#4B0082", fontWeight: "bold" }}
              >
                Generate Slides
              </h3>

              {/* Step 1: Topic Input */}
              <Card
                className="mb-4 p-4 frosted-step"
                style={{ borderRadius: "15px" }}
              >
                <h5
                  className="d-flex align-items-center mb-3 step-title"
                  style={{ color: "#6A0DAD" }}
                >
                  <FaPenFancy className="me-2" /> Step 1: Enter Topic
                </h5>
                <InputGroup className="custom-input">
                  <Form.Control
                    type="text"
                    name="topic"
                    value={slidesData.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                    placeholder="Enter slide topic"
                    required
                  />
                </InputGroup>
              </Card>

              {/* Step 2: Number of Slides */}
              <Card
                className="mb-4 p-4 frosted-step"
                style={{ borderRadius: "15px" }}
              >
                <h5
                  className="d-flex align-items-center mb-3 step-title"
                  style={{ color: "#6A0DAD" }}
                >
                  Step 2: Number of Slides
                </h5>
                <InputGroup className="custom-input">
                  <Form.Control
                    type="number"
                    name="num_slides"
                    value={slidesData.num_slides}
                    onChange={(e) =>
                      handleInputChange("num_slides", e.target.value)
                    }
                    placeholder="Enter number of slides"
                    required
                  />
                </InputGroup>
              </Card>

              {/* Step 3: Folder and Filename */}
              <Card
                className="mb-4 p-4 frosted-step"
                style={{ borderRadius: "15px" }}
              >
                <h5
                  className="d-flex align-items-center mb-3 step-title"
                  style={{ color: "#6A0DAD" }}
                >
                  <FaFileAlt className="me-2" /> Step 3: Set Subfolder and
                  Filename
                </h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <InputGroup className="mb-3">
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setShowModal(true);
                        }}
                        className="rounded-start"
                      >
                        <FaFolderOpen className="me-2" />
                        Select folder
                      </Button>
                      <Form.Control
                        type="text"
                        name="subfolder"
                        value={slidesData.subfolder}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        placeholder="Enter a path"
                        className="rounded-end"
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup className="custom-input mb-3">
                      <Form.Control
                        type="text"
                        name="filename"
                        value={slidesData.filename}
                        onChange={(e) =>
                          handleInputChange("filename", e.target.value)
                        }
                        placeholder="Enter filename"
                        required
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card>

              {/* Step 4: Theme URL */}
              <Card
                className="mb-4 p-4 frosted-step"
                style={{ borderRadius: "15px" }}
              >
                <h5
                  className="d-flex align-items-center mb-3 step-title"
                  style={{ color: "#6A0DAD" }}
                >
                  Step 4: Theme URL
                </h5>
                <InputGroup className="custom-input">
                  <Form.Control
                    type="text"
                    name="theme_url"
                    value={slidesData.theme_url}
                    onChange={(e) =>
                      handleInputChange("theme_url", e.target.value)
                    }
                    placeholder="Enter theme URL"
                    required
                  />
                </InputGroup>
              </Card>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mt-3 rounded-pill animated-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {!loading ? "Submit" : "Submitting..."}
              </Button>
            </Card>
          </Col>
        </Row>
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
      </div>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <GenerateSlides />
    </Suspense>
  );
}
