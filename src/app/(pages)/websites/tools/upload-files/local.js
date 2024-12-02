import { SessionContext } from "@/app/SessionContext";
import websiteService from "@/services/websiteService";
import React, { useContext, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Local({ site, id }) {
  const [file, setFile] = useState(null);
  const [subfolder, setSubfolder] = useState("");
  const [loading, setLoading] = useState(false);
  const { siteBucket, driveBucket, cloud } = useContext(SessionContext);

  const handleUploadFile = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const token = await websiteService.fetchToken(cloud);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("name", id);
    formData.append("file", file);
    formData.append("subfolder", subfolder);
    formData.append("site", site);
    formData.append("drive_bucket", driveBucket);
    formData.append("site_bucket", siteBucket);
    if (cloud == "azure") {
      formData.append("cloud", "AZURE");
    }

    setLoading(true);
    try {
      await websiteService.uploadFile(formData);
      setSubfolder("");
      setFile(null);
    } catch (error) {
      console.error("Error during upload:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-md-4 d-flex align-items-stretch">
      <div className="service-item w-100 d-flex flex-column justify-content-between text-center align-items-center rounded">
        <div className="service-icon btn-square">
          <i className="bi bi-upload fs-2"></i>
        </div>
        <h5 className="mb-3">Upload from Local</h5>
        <p>
          Choose files from your local device to upload and manage your website
          content efficiently.
        </p>
        <InputGroup className="w-75 mb-3">
          <Form.Control
            type="file"
            className="rounded-end"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </InputGroup>
        <InputGroup className="w-75 mb-3">
          <Form.Control
            type="text"
            className="rounded-end"
            placeholder="Enter subfolder"
            value={subfolder}
            onChange={(e) => {
              setSubfolder(e.target.value);
            }}
          />
        </InputGroup>
        <Button
          className="w-75"
          variant="dark"
          onClick={handleUploadFile}
          disabled={loading}
        >
          {!loading ? "Upload" : "Uploading"}
        </Button>
      </div>
    </div>
  );
}
