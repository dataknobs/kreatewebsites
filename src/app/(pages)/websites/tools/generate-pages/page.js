"use client";
import React, { useState, useContext, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgWebsite } from "react-icons/cg";
import Header from "@/components/header";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { FaPenFancy, FaFileAlt, FaFolderOpen } from "react-icons/fa";
import "../tools.css";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import SelectModal from "@/components/select-folder";
import { useRouteValidation } from "@/hooks/validation";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import websiteService from "@/services/websiteService";
import ImageSourceAccordion from "./ImageOption";

const GeneratePages = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const site = searchParam.get("site");
  const id = searchParam.get("id");
  const {
    domains,
    loader,
    userCredits,
    reduceCredits,
    cloud,
    cmsPath,
    fetchBucketData,
    siteBucket,
    driveBucket,
  } = useContext(SessionContext);
  const [data, setData] = useState({
    prompt: "",
    filename: "",
    subfolder: "",
    article_dir: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCmsModal, setShowCmsModal] = useState(false);
  useRouteValidation(domains, loader, site, id);

  const [selectedImageOption, setSelectedImageOption] = useState("");
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (loader) {
      return;
    } else {
      if (id) {
        // Ensure 'id' is valid before calling fetchBucketData
        fetchBucketData(id);
      }
    }
  }, [id, loader]);

  const handleInputChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (userCredits !== null && userCredits !== 0) {
      e.preventDefault();
      let endpoint = "/prompt";
      const formData = new FormData();
      formData.append("id", id); // Assuming `id` is defined in your component
      formData.append("site", site); // Assuming `site` is defined in your component
      formData.append("prompt", data.prompt);
      formData.append("filename", data.filename);
      formData.append("subfolder", data.subfolder);
      formData.append(
        "article_dir",
        data.article_dir && data.article_dir.length > 0
          ? data.article_dir
          : "na",
      );

      // Handle image selection
      if (selectedImageOption === "upload") {
        formData.append("image", img);
      }
      if (selectedImageOption === "googleDrive") {
        formData.append("gdrive_url", img);
        endpoint = "prompt_url";
      }
      if (selectedImageOption === "bucketName") {
        formData.append("bucket_url", img);
        endpoint = "prompt_url";
      }
      if (selectedImageOption === "prompt") {
        formData.append("gen_prompt", img);
        endpoint = "generateimageprompt";
      }

      if (siteBucket && siteBucket.length > 0) {
        formData.append("site_bucket", siteBucket);
      }

      if (driveBucket && driveBucket.length > 0) {
        formData.append("drive_bucket", driveBucket);
      }
      if (cloud == "azure") {
        formData.append("cloud", "AZURE");
      }

      setLoading(true); // Set loading to true before the request

      try {
        await websiteService.submitPrompt(formData, endpoint);
        // Reset form data
        setData({
          prompt: "",
          filename: "",
          subfolder: "",
          article_dir: "",
        });
        setSelectedImageOption("");
        setImg(null);
        reduceCredits(1);
      } catch (error) {
        // Handle error if needed (error is already logged in the service)
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    } else {
      toast.error(
        "Oops! You are out of credits. Buy more credits to continue.",
      );
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleModalOpen = () => setShowModal(true);

  const handleCmsModalClose = () => {
    setShowCmsModal(false);
  };
  const handleCmsModalOpen = () => setShowCmsModal(true);

  if (loader) {
    return <Loader />;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header customBg="light-blue" />
      {domains.length > 0 ? (
        <>
          <div className="container py-5" style={{ minHeight: "100vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h4 className="text-uppercase font-weight-bold text-dark">
                <IoArrowBack
                  onClick={handleGoBack}
                  className="back-icon me-3"
                />{" "}
                <CgWebsite className="me-2" /> Generate web pages using prompt
              </h4>

              <h6 className=" font-weight-bold text-dark">
                <GiTwoCoins className="me-2" /> Available Credits :{" "}
                {userCredits}
              </h6>
            </div>
            <Row className="g-4 mt-5 d-flex justify-content-center w-100">
              <Col md={12}>
                <Card className="border-0 p-4 frosted-glass-card">
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

                  {/* Prompt Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaPenFancy className="me-2" /> Step 1: Enter Your Prompt
                    </h5>
                    <InputGroup className="custom-input">
                      <InputGroup.Text
                        className="bg-transparent text-secondary rounded-start icon-bg"
                        style={{ boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <FaPenFancy />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="prompt"
                        value={data.prompt}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        placeholder="Enter your prompt"
                        className="rounded-end"
                        required
                      />
                    </InputGroup>
                  </Card>

                  {/* Step 2: Subfolder Button and Filename Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaFileAlt className="me-2" /> Step 2: Set site URL path
                      and file name
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
                            <FaFolderOpen className="me-2" />
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
                            <FaFileAlt />
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

                  {/* Step 3: CMS Path */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaFileAlt className="me-2" /> Step 5: Set CMS path
                    </h5>
                    <Row>
                      {/* Subfolder Button */}
                      <Col md={12} className="mb-3">
                        <InputGroup className="mb-3">
                          <Button
                            variant="outline-secondary"
                            onClick={handleCmsModalOpen}
                            className="rounded-start"
                            disabled={!cmsPath} // Disable button if cmsPath is false
                          >
                            <FaFolderOpen className="me-2" />
                            Select folder
                          </Button>
                          <Form.Control
                            type="text"
                            name="article_dir"
                            value={data.article_dir}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                            placeholder={
                              cmsPath ? "Enter CMS path" : "No active CMS plan" // Show appropriate placeholder
                            }
                            className="rounded-end"
                            required
                            disabled={!cmsPath} // Disable input if cmsPath is false
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Card>

                  <ImageSourceAccordion
                    setImg={setImg}
                    selectedImageOption={selectedImageOption}
                    setSelectedImageOption={setSelectedImageOption}
                  />

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mt-3 rounded-pill animated-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {!loading ? "Submit" : "Submitting"}
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>

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

          <SelectModal
            show={showCmsModal}
            onHide={() => {
              handleInputChange("article_dir", "");
              handleCmsModalClose();
            }}
            handleModalClose={handleCmsModalClose}
            handleInputChange={handleInputChange}
            site={site}
            id={id}
            bucketName={siteBucket}
            cms={true}
          />
        </>
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
      <GeneratePages />
    </Suspense>
  );
}
