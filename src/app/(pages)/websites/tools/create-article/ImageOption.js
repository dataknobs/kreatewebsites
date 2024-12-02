import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaImage, FaGoogleDrive, FaDatabase, FaPenFancy } from "react-icons/fa";
import "../tools.css";

const ImageSourceAccordion = ({
  setImg,
  selectedImageOption,
  setSelectedImageOption,
}) => {
  // Handle dropdown selection change
  const handleSelectChange = (event) => {
    setSelectedImageOption(event.target.value);
  };

  return (
    <div className="accordion" id="accordionFAQ1">
      <div className="accordion-item wow fadeIn" data-wow-delay="0.1s">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            Do you want to use an image?
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionFAQ1"
        >
          <div className="accordion-body p-4">
            {/* Dropdown Selection */}
            <Form.Group controlId="imageSourceSelect" className="mb-3">
              <Form.Label
                className="d-flex align-items-center step-title"
                style={{ color: "#6A0DAD" }}
              >
                <FaImage className="me-2" /> Select Image Source
              </Form.Label>
              <Form.Select
                aria-label="Select image source"
                onChange={handleSelectChange}
                className="custom-select"
              >
                <option value="">Choose an option</option>
                <option value="upload">Upload</option>
                <option value="googleDrive">Google Drive Link</option>
                <option value="bucketName">Bucket Name</option>
                <option value="prompt">Prompt</option>
              </Form.Select>
            </Form.Group>

            {/* Conditionally Rendered Input Fields */}
            {selectedImageOption === "upload" && (
              <Form.Group controlId="imageUpload" className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImg(e.target.files[0])}
                  className="custom-file-input"
                />
              </Form.Group>
            )}

            {selectedImageOption === "googleDrive" && (
              <InputGroup className="custom-input mb-3">
                <InputGroup.Text
                  className="bg-transparent text-secondary rounded-start icon-bg"
                  style={{ boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)" }}
                >
                  <FaGoogleDrive />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter Google Drive link"
                  onChange={(e) => setImg(e.target.value)}
                  className="rounded-end"
                />
              </InputGroup>
            )}

            {selectedImageOption === "bucketName" && (
              <InputGroup className="custom-input mb-3">
                <InputGroup.Text
                  className="bg-transparent text-secondary rounded-start icon-bg"
                  style={{ boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)" }}
                >
                  <FaDatabase />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter Bucket Name"
                  onChange={(e) => setImg(e.target.value)}
                  className="rounded-end"
                />
              </InputGroup>
            )}

            {selectedImageOption === "prompt" && (
              <InputGroup className="custom-input mb-3">
                <InputGroup.Text
                  className="bg-transparent text-secondary rounded-start icon-bg"
                  style={{ boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)" }}
                >
                  <FaPenFancy />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter prompt for image generation"
                  onChange={(e) => setImg(e.target.value)}
                  className="rounded-end"
                />
              </InputGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSourceAccordion;
