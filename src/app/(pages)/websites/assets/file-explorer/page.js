"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  Suspense,
} from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Breadcrumb,
  Modal,
  Button,
  Dropdown,
} from "react-bootstrap";
import { FaFolder, FaHome } from "react-icons/fa";
import { LuFilePlus } from "react-icons/lu";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { CgBitbucket } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./file-explorer.css";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { IoArrowBack } from "react-icons/io5";
import Loader from "@/components/loader";
import { SessionContext } from "@/app/SessionContext";
import Footer from "@/components/footer";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import cms from "@/services/cmsService";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

const FileExplorer = () => {
  const { domains, loader, cmsBuckets, cloud } = useContext(SessionContext);
  const router = useRouter();
  const searchParam = useSearchParams();
  const bucketName =
    searchParam.get("cms-bucket-name") || searchParam.get("bucket-name");
  const cmsBucket = !!searchParam.get("cms-bucket-name");
  const site = searchParam.get("site");
  const id = searchParam.get("id");

  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [folderModal, setFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editPath, setEditPath] = useState("");
  const [newFile, setNewFile] = useState({
    name: "",
    content: "",
    modal: false,
  });
  const [template, setTemplate] = useState({
    bucket: "cnc_data",
    path: "pdfs/zapario_template_new.html",
    filenames: "",
    image_template: "",
    content_template: "",
  });

  const handleClose = () => {
    setFolderModal(false);
    setFolderName(""); // Reset folder name on close
  };

  const fetchTemplateData = async (id) => {
    try {
      const domainDocRef = doc(db, "domains", id);
      const domainDocSnapshot = await getDoc(domainDocRef);
      if (domainDocSnapshot.exists()) {
        const domainData = domainDocSnapshot.data();
        // Check if domainData.template exists; if not, fallback to default
        setTemplate(
          domainData.template || {
            bucket: "cnc_data",
            path: "pdfs/zapario_template_new.html",
            filenames: "",
            image_template: "",
            content_template: "",
          },
        );
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.error("Error fetching domain data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => setFolderModal(true);

  useEffect(() => {
    if (loader) {
      return;
    }

    // Logic when "cms-bucket-name" is passed
    if (cmsBucket) {
      try {
        // Check if the bucket exists in cmsBuckets by comparing names
        const bucketExists = cmsBuckets.some(
          (bucket) => bucket.name === bucketName,
        );

        if (!bucketExists) {
          throw new Error("Bucket not found in cmsBuckets array"); // Throw an error if the bucket is not found
        }

        // Fetch items if the bucket exists in the array
        fetchItems(currentPath);
      } catch (error) {
        console.error("Error:", error.message || error);
        router.push("/error-page"); // Redirect to error page on any error
      }
    }

    // Logic when "bucketName", "site", and "id" are passed
    else if (bucketName && site && id) {
      if (domains && domains.length > 0) {
        const matchingDomain = domains.find(
          (domain) => domain.domain_id === id,
        );
        if (matchingDomain) {
          fetchTemplateData(id);
          fetchItems(currentPath);
        } else {
          router.push("/error-page");
        }
      }
    }
  }, [currentPath, domains, loader, bucketName, cmsBucket, id]);

  const fetchItems = useCallback(async (path) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/list-files-combined/${bucketName}?folderPath=${path}&cloud=${cloud}`,
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
    } else {
      const newPath = `${currentPath ? `${currentPath}/` : ""}${item.name}`;
    }
  };

  const handleCreateFolder = () => {
    cms.createFolder(
      bucketName,
      folderName,
      currentPath,
      fetchItems,
      handleClose,
    );
  };

  const handleRenameClick = (item) => {
    setOldName(item.name);
    setNewName(item.name);
    setShowRenameModal(true);
  };

  const handleRenameSubmit = () => {
    cms.renameItem(
      bucketName,
      oldName,
      newName,
      currentPath,
      fetchItems,
      setShowRenameModal,
      true,
    );
  };

  const handleEditClick = async (item) => {
    try {
      const res = await axios.get(
        `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/get-content?combined=true&bucketName=${bucketName}&filePath=${item.name}&cloud=${cloud}`,
      );
      setEditPath(item.name);
      setEditContent(res.data.list);
      setEditModal(true);
    } catch (error) {
      console.error("Error fetching file content:", error);
      console.error("Error message: " + error.message);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setEditModal(false); // Close the modal

      const data = {
        bucketName: bucketName, // Bucket name
        filePath: editPath, // Base file path (without extension)
        newContent: editContent, // Array of files with extensions and content
      };

      // Send PUT request to update the file content(s)
      const res = await axios.put(
        `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/edit-content?combined=true&cloud=${cloud}`,
        data,
      );
      toast.success(res.data);
    } catch (error) {
      toast.error("Error updating file content:", error);
    }
  };

  const handleNewFileClick = () => {
    handleNewFileChange("modal", true);
  };

  const handleNewFileChange = (key, value) => {
    setNewFile((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleNewFileSubmit = async () => {
    try {
      handleNewFileChange("modal", false); // Close the modal
      await cms.createOrUpdateFile(
        bucketName,
        currentPath,
        newFile,
        fetchItems,
        handleNewFileChange,
      ); // Call the service method
      setNewFile({ name: "", content: "" }); // Reset new file state
    } catch (error) {
      console.error("Error during file submission:", error);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    cms.deleteItem(
      bucketName,
      deleteItem.name,
      currentPath,
      fetchItems,
      setShowDeleteConfirm,
    );
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

  const handleGoBack = () => {
    router.back();
  };

  if (loader) {
    return <Loader />;
  }

  const handleGenerateWebPage = async (item) => {
    try {
      setApiLoading(true);
      const fetchContentUrl = `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/get-content?bucketName=${bucketName}&filePath=${item.name}.articleslist&cloud=${cloud}`;
      const generateHtmlUrl =
        "https://html-creation-539996738539.us-central1.run.app/generate_html_content";

      // Fetch data from the specified API using item.name + ".articlelist" as the filePath
      const fetchResponse = await axios.get(fetchContentUrl);
      let fileContent = fetchResponse.data;
      // Replace backslashes with forward slashes and extract content up to the fourth slash
      fileContent = fileContent.replace(/\\/g, "/");
      const fourthSlashIndex = fileContent.split("/", 4).join("/").length;
      const articleRootFirstPath = fileContent.slice(0, fourthSlashIndex + 1);

      // Define the folder path by removing the last part of item.name
      const folderPath = item.name.substring(0, item.name.lastIndexOf("/"));

      // Initialize form data
      const formData = new FormData();
      formData.append("project_id", "abexperiment-prod");
      formData.append("json_key", "pdm-nasa-a3a442bd3181.json");
      formData.append("bucket_name", bucketName);
      formData.append("folder_path", folderPath);
      formData.append("filenames", template.filenames);
      formData.append("template_bucket_name", template.bucket);
      formData.append("image_tags_template_path", template.image_template);
      formData.append("content_template_path", template.content_template);
      formData.append("format_template_file_path", template.path);

      //article_root_path list with modified paths
      formData.append(
        "article_root_path",
        JSON.stringify([
          articleRootFirstPath, // First item
          `gs://${bucketName}/`, // Second item
        ]),
      );

      formData.append("header_path", ""); // Empty field
      formData.append("footer_path", ""); // Empty field
      formData.append("add_gallery", "False");
      formData.append("max_gimg", "4");

      // Send the form data to the HTML generation API
      const response = await axios.post(generateHtmlUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Web page generated successfully");
    } catch (error) {
      toast.error("Error submitting form data:", error.message);
      console.log(error.message);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <>
      <Header customBg="light-blue" />
      {domains.length > 0 ? (
        <div className="container py-5" style={{ minHeight: "100vh" }}>
          <div className="d-flex flex-column flex-md-row justify-content-between mb-4 border-bottom pb-2">
            <div className="d-flex">
              <h4 className="text-uppercase font-weight-bold text-dark">
                <IoArrowBack
                  onClick={handleGoBack}
                  className="back-icon me-3"
                />{" "}
                File Manager
              </h4>
              <p>
                {site && (
                  <>
                    <TbWorldWww size={30} className="mb-1 ms-4" /> {site}
                  </>
                )}
              </p>
              <p>
                <CgBitbucket size={30} className="mb-1 ms-4" /> {bucketName}
              </p>
            </div>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={handleNewFileClick}
              >
                <LuFilePlus className="me-1" size={24} /> New File
              </button>

              <button
                className="btn btn-outline-secondary me-2"
                onClick={handleShow}
              >
                <MdOutlineCreateNewFolder className="me-1" size={25} /> New
                Folder
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb className="bg-light rounded p-2 shadow-sm mb-4">
            <Breadcrumb.Item
              onClick={() => setCurrentPath("")}
              className="text-primary cursor-pointer"
            >
              <FaHome className="me-1" size={14} /> Home
            </Breadcrumb.Item>
            {currentPath
              .split("/")
              .filter(Boolean)
              .map((part, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() =>
                    setCurrentPath(
                      currentPath
                        .split("/")
                        .slice(0, index + 1)
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

                        {/* 3-Dots Menu */}
                        <Dropdown className="position-relative">
                          <Dropdown.Toggle
                            variant="link"
                            id="dropdown-basic"
                            className="p-0"
                            size="lg"
                          >
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {item.type === "file" && (
                              <Dropdown.Item
                                onClick={() => handleGenerateWebPage(item)}
                              >
                                Generate Webpage
                              </Dropdown.Item>
                            )}
                            {item.type === "file" && (
                              <Dropdown.Item
                                onClick={() => handleEditClick(item)}
                              >
                                Edit Content
                              </Dropdown.Item>
                            )}
                            {/* {item.type === "file" && (
                              <Dropdown.Item
                                onClick={() => handleRenameClick(item)}
                              >
                                Rename
                              </Dropdown.Item>
                            )} */}
                            <Dropdown.Item
                              onClick={() => handleDeleteClick(item)}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card>
                  </Col>
                ))}
                {apiLoading && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      zIndex: "1000",
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
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

          <Modal
            show={showRenameModal}
            onHide={() => setShowRenameModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Rename Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="form-control"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowRenameModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRenameSubmit}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Content Confirmation Modal */}
          <Modal
            show={editModal}
            onHide={() => setEditModal(false)}
            centered
            size="lg" // Smaller size for compact view
            className="custom-modal"
            style={{
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)", // More defined shadow for a cool effect
              border: "none",
            }}
          >
            <Modal.Header
              closeButton
              style={{
                borderBottom: "none",
                backgroundColor: "#f7f9fc",
                padding: "1.2rem 1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Modal.Title
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#343a40",
                }}
              >
                Edit File Content
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                backgroundColor: "#ffffff",
                padding: "1.5rem 1.5rem 1rem",
              }}
            >
              <Form>
                {editContent &&
                  editContent.map((file, index) => (
                    <Form.Group
                      key={index}
                      controlId={`fileContent-${file.ext}`}
                      className="mb-4"
                    >
                      <Form.Label
                        style={{
                          fontSize: "0.95rem",
                          color: "#495057",
                          fontWeight: "600",
                        }}
                      >
                        {file.file}.{file.ext}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={file.content}
                        onChange={(e) => {
                          const updatedContent = [...editContent];
                          updatedContent[index].content = e.target.value;
                          setEditContent(updatedContent);
                        }}
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.95rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          backgroundColor: "#f0f4f8",
                          border: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#007bff")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
                      />
                    </Form.Group>
                  ))}
              </Form>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#f7f9fc", padding: "1rem 1.5rem" }}
            >
              <Button
                variant="dark"
                onClick={handleEditSubmit}
                className="w-100"
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={newFile.modal}
            onHide={() => handleNewFileChange("modal", false)}
            centered
            size="lg" // Adjust modal size to large
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title className="w-100 text-center">
                Create New File
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="fileTitle">
                  <Form.Label>File Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newFile.name}
                    onChange={(e) =>
                      handleNewFileChange("name", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group controlId="fileContent" className="mt-3">
                  <Form.Label>File Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={newFile.content}
                    onChange={(e) =>
                      handleNewFileChange("content", e.target.value)
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => handleNewFileChange("modal", false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleNewFileSubmit}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete {getDisplayName(deleteItem)}?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={folderModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Create New Folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                className="form-control"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateFolder}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
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

export default function Page() {
  return (
    <Suspense>
      <FileExplorer />
    </Suspense>
  );
}
