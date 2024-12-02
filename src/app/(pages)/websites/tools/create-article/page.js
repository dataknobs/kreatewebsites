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
import "./create-article.css";
import { toast } from "react-toastify";
import SelectModal from "@/components/select-folder";
import { IoArrowBack } from "react-icons/io5";
import { useRouteValidation } from "@/hooks/validation";
import { GiTwoCoins } from "react-icons/gi";
import ImageSourceAccordion from "./ImageOption";
import websiteService from "@/services/websiteService";

const Article = () => {
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    keywords: "",
    article: "",
    filename: "",
    subfolder: "",
    article_dir: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showCmsModal, setShowCmsModal] = useState(false);
  const [selectedImageOption, setSelectedImageOption] = useState("");
  const [img, setImg] = useState(null);

  useRouteValidation(domains, loader, site, id);

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
      const formData = new FormData();
      formData.append("site", site); // Assuming `site` is defined in your component
      formData.append("id", id); // Assuming `id` is defined in your component
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("keywords", data.keywords);
      formData.append("article", data.article);
      formData.append("filename", data.filename);
      formData.append("subfolder", data.subfolder);
      formData.append(
        "article_dir",
        data.article_dir && data.article_dir.length > 0
          ? data.article_dir
          : "na",
      );
      if (cloud == "azure") {
        formData.append("cloud", "AZURE");
      }

      // Handle image selection
      if (selectedImageOption === "upload") {
        formData.append("image", img);
      }
      if (selectedImageOption === "googleDrive") {
        formData.append("gdrive_url", img);
      }
      if (selectedImageOption === "bucketName") {
        formData.append("bucket_url", img);
      }
      if (selectedImageOption === "prompt") {
        formData.append("gen_prompt", img);
      }

      if (siteBucket && siteBucket.length > 0) {
        formData.append("site_bucket", siteBucket);
      }

      if (driveBucket && driveBucket.length > 0) {
        formData.append("drive_bucket", driveBucket);
      }

      setLoading(true); // Set loading to true before the request

      try {
        await websiteService.submitArticle(formData);
        setData({
          title: "",
          description: "",
          keywords: "",
          article: "",
          filename: "",
          subfolder: "",
          article_dir: "",
        });
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
                <CgWebsite className="me-2" />
                web Page Using Article
              </h4>

              <h6 className=" font-weight-bold text-dark">
                <GiTwoCoins className="me-2" /> Available Credits :{" "}
                {userCredits}
              </h6>
            </div>
            <Row className="g-4 mt-5 d-flex justify-content-center w-100">
              <Col md={12}>
                <Card
                  className="shadow-lg rounded-4 border-0 p-4 frosted-glass-card"
                  style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "20px",
                    padding: "20px",
                  }}
                >
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

                  {/* Title Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaPenFancy className="me-2" />
                      {cmsPath && "true"} Step 1: Enter Article Title
                    </h5>
                    <Form.Control
                      type="text"
                      name="title"
                      value={data.title}
                      onChange={(e) =>
                        handleInputChange(e.target.name, e.target.value)
                      }
                      placeholder="Enter article title"
                      required
                    />
                  </Card>

                  {/* Description and Keywords Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaFileAlt className="me-2" /> Step 2: Enter Description
                      and Keywords
                    </h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="description"
                          value={data.description}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="Enter article description"
                          required
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="keywords"
                          value={data.keywords}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="Enter keywords (comma-separated)"
                          required
                        />
                      </Col>
                    </Row>
                  </Card>

                  {/* Article Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaFileAlt className="me-2" /> Step 3: Write Your Article
                    </h5>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="article"
                      value={data.article}
                      onChange={(e) =>
                        handleInputChange(e.target.name, e.target.value)
                      }
                      placeholder="Write your article here"
                      required
                    />
                  </Card>

                  {/* Step 4: Subfolder Button and Filename Section */}
                  <Card
                    className="mb-4 p-4 frosted-step"
                    style={{ borderRadius: "15px" }}
                  >
                    <h5
                      className="d-flex align-items-center mb-3 step-title"
                      style={{ color: "#6A0DAD" }}
                    >
                      <FaFileAlt className="me-2" /> Step 4: Set Site URL Path
                      and File Name
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
                            Select Folder
                          </Button>
                          <Form.Control
                            type="text"
                            name="subfolder"
                            value={data.subfolder}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                            placeholder="Enter a path"
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
                            required
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Card>

                  {/* Step 5: CMS Path */}
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
            <h2 className="text-danger">No Domains Found</h2>
            <p className="text-muted">
              Please ensure you have domains added to proceed.
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
      <Article />
    </Suspense>
  );
}
