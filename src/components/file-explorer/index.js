"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Card, Row, Col, Breadcrumb } from "react-bootstrap";
import { FaFolder, FaHome } from "react-icons/fa";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./file-explorer.css";
import { SessionContext } from "@/app/SessionContext";

const FileExplorer = ({
  site,
  id,
  bucketName,
  handleInputChange,
  cms = false,
}) => {
  const initialPath = cms ? `` : `${site}/input/content/`;
  const key = cms ? "article_dir" : "subfolder";
  const { cloud } = useContext(SessionContext);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState(null);

  useEffect(() => {
    try {
      let modifiedPath;

      if (!cms) {
        modifiedPath = currentPath
          .split("/")
          .filter(Boolean)
          .slice(3) // Exclude the first 3 parts
          .join("/"); // Join the remaining parts back into a string
      } else {
        modifiedPath = currentPath; // Use the unmodified path if cms is true
      }

      // Call handleInputChange with the determined key and modified path
      handleInputChange(key, modifiedPath);
      fetchItems(currentPath);
    } catch (error) {
      console.error("Error:", error.message || error);
    }
  }, [currentPath, bucketName, id, cms]);

  const fetchItems = useCallback(async (path) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/list-folder/${bucketName}?folderPath=${path}&cloud=${cloud}`,
      );
      setItems(response.data.data);
    } catch (err) {
      console.error("Fetch items error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleItemClick = (item) => {
    if (item.type === "folder") {
      setCurrentPath(item.name);
      setHighlightedItem(null);
    }
  };

  const getDisplayName = (item) => {
    if (!item || !item.name) return "Unknown Item"; // Handle null or undefined item
    const nameParts = item.name.split("/").filter(Boolean);
    return nameParts[nameParts.length - 1];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      pdf: "https://img.icons8.com/material-outlined/24/000000/pdf-2.png",
      doc: "https://img.icons8.com/material-outlined/24/000000/docx.png",
      docx: "https://img.icons8.com/material-outlined/24/000000/docx.png",
      xls: "https://img.icons8.com/material-outlined/24/000000/xlsx.png",
      xlsx: "https://img.icons8.com/material-outlined/24/000000/xlsx.png",
      jpg: "https://img.icons8.com/material-outlined/24/000000/jpg.png",
      jpeg: "https://img.icons8.com/material-outlined/24/000000/jpg.png",
      png: "https://img.icons8.com/material-outlined/24/000000/png.png",
      gif: "https://img.icons8.com/material-outlined/24/000000/gif.png",
      mp4: "https://img.icons8.com/material-outlined/24/000000/mp4.png",
    };

    return (
      iconMap[extension] ||
      "https://img.icons8.com/material-outlined/24/000000/file.png"
    );
  };

  return (
    <>
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        {/* Breadcrumb */}
        <Breadcrumb className="bg-light rounded p-2 shadow-sm mb-4">
          <Breadcrumb.Item
            onClick={() => setCurrentPath(cms ? "" : `${site}/input/content`)}
            className="text-primary cursor-pointer"
          >
            <FaHome className="me-1" size={14} />
            Home
          </Breadcrumb.Item>
          {(cms
            ? [currentPath]
            : currentPath.split("/").filter(Boolean).slice(3)
          ) // Exclude the first 3 parts only if cms is false
            .map((part, index) => (
              <Breadcrumb.Item
                key={index}
                onClick={() =>
                  setCurrentPath(
                    cms
                      ? currentPath // Use the full path if cms is true
                      : currentPath
                          .split("/")
                          .slice(0, index + 4) // Adjust the slice to account for the first 3 parts excluded
                          .join("/"),
                  )
                }
                className="text-primary cursor-pointer"
              >
                {part}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>

        {/* Items List */}
        <Row className="g-3 mt-4 p-2">
          {!loading ? (
            <>
              {items.map((item) => (
                <Col xs={12} md={4} lg={3} key={item.name}>
                  <Card
                    onDoubleClick={() => handleItemClick(item)}
                    className={`shadow-sm border-0 d-flex p-2 rounded ${
                      highlightedItem === item.name
                        ? "border border-warning"
                        : ""
                    }`}
                    style={{ cursor: "pointer", height: "auto" }}
                  >
                    <div
                      className="p-2 d-flex justify-content-between"
                      style={{
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        className="me-4 d-flex align-items-center"
                        style={{ flexGrow: 1 }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          {item.type === "folder" ? (
                            <FaFolder size={24} className="text-warning" />
                          ) : (
                            <img
                              src={getFileIcon(item.name)}
                              alt={item.name}
                              width={24}
                              height={24}
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>

                        <Card.Title
                          className="ms-3 fw-bold"
                          style={{
                            fontSize: "14px",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            maxHeight: "38px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {getDisplayName(item)}
                        </Card.Title>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </>
          ) : (
            <>
              {" "}
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
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default FileExplorer;
