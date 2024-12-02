import React, { useContext, useState } from "react";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { SessionContext } from "@/app/SessionContext";
import websiteService from "@/services/websiteService";
import useDrivePicker from "react-google-drive-picker";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";

function Gdrive({ site, id }) {
  const [openPicker, authResponse] = useDrivePicker();
  const [fileDetails, setFileDetails] = useState("");
  const [gdriveLink, setGdriveLink] = useState("");
  const [subfolder, setSubfolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [historyLinks, setHistoryLinks] = useState([]);
  const { siteBucket, driveBucket, cloud } = useContext(SessionContext);

  const fetchHistoryLinks = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "domains"),
          where("subscriptionInfo.domain_id", "==", id),
        ),
      );

      if (!querySnapshot.empty) {
        const domainDoc = querySnapshot.docs[0].data();
        const gdriveLinks = domainDoc.subscriptionInfo?.gdriveLink || [];
        setHistoryLinks(gdriveLinks);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching past links:", error);
    }
  };

  const handleSelectLink = (link, subfolder) => {
    setGdriveLink(link);
    setSubfolder(subfolder);
    setShowModal(false);
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "988959267955-20sqvkrib6vhirdqkfo431v4qih4rakv.apps.googleusercontent.com",
      developerKey: "AIzaSyA3wxPSdmYeODbVn1Emo0t6w23KO-R2fq8",
      viewId: "FOLDERS",
      showUploadView: true,
      showUploadFolders: true,
      setSelectFolderEnabled: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        if (data.action === "picked" && data.docs?.length > 0) {
          const pickedFolder = data.docs[0];
          setFileDetails({
            name: pickedFolder.name,
            iconUrl: pickedFolder.iconUrl,
            url: pickedFolder.url,
          });
          setGdriveLink(pickedFolder.url);
        }
      },
    });
  };

  const handleUploadGdrive = async () => {
    const formData = new FormData();
    formData.append("sitename", site);
    formData.append("id", id);
    formData.append("url", gdriveLink);
    formData.append("subfolder", subfolder);
    formData.append("drive_bucket", driveBucket);
    formData.append("site_bucket", siteBucket);
    if (cloud === "azure") formData.append("cloud", "AZURE");

    setLoading(true);
    try {
      const response = await websiteService.uploadGdrive(formData);
      await handleUpdateLinks(gdriveLink, subfolder, response.bucket);
      setSubfolder("");
      setGdriveLink("");
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-md-4 d-flex align-items-stretch">
      <div className="service-item w-100 d-flex flex-column justify-content-between text-center align-items-center rounded">
        <div className="service-icon btn-square">
          <i className="bi bi-google fs-2"></i>
        </div>
        <h5 className="mb-3">Upload from Google Drive</h5>
        <p>Access your Google Drive files and upload them with ease.</p>
        <Button
          variant="success"
          className="mt-3 mb-3 w-75"
          onClick={handleOpenPicker}
        >
          Connect Google Drive
        </Button>
        <InputGroup className="w-75 mb-3">
          <Form.Control
            type="text"
            placeholder="Google Drive Link"
            value={gdriveLink}
            onChange={(e) => setGdriveLink(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="w-75 mb-3">
          <Form.Control
            type="text"
            placeholder="Enter Subfolder"
            value={subfolder}
            onChange={(e) => setSubfolder(e.target.value)}
          />
        </InputGroup>
        <Button
          variant="light"
          className="w-75 mb-3"
          onClick={fetchHistoryLinks}
        >
          <i class="bi bi-clock-history mt-4 me-1"></i> History
        </Button>

        <Button
          variant="dark"
          className="w-75"
          onClick={handleUploadGdrive}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {/* Modal for Past Links */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          className="border-0"
          style={{ border: "none" }}
        >
          <Modal.Title className="text-center w-100 fw-bold fs-5">
            Past Google Drive Links
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="bg-light p-4"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {historyLinks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Google Drive</th>
                    <th>Subfolder</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLinks.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-decoration-none fw-semibold"
                        >
                          Link
                        </a>
                      </td>
                      <td className="text-secondary">
                        {item.subfolder || "N/A"}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill"
                          onClick={() =>
                            handleSelectLink(item.link, item.subfolder)
                          }
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No past links found.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Gdrive;
