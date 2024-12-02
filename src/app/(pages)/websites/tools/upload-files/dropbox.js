import React from "react";
import { Button } from "react-bootstrap";

function Dropbox({ site, id }) {
  return (
    <div className="col-12 col-md-4 d-flex align-items-stretch">
      <div className="service-item w-100 d-flex flex-column justify-content-between text-center align-items-center rounded">
        <div className="service-icon btn-square">
          <i className="bi bi-box fs-2"></i>
        </div>
        <h5 className="mb-3">Upload from Dropbox</h5>
        <p>
          Upload files directly from your Dropbox account and manage your
          content seamlessly.
        </p>
        <Button variant="light" className="mt-3" disabled={true}>
          Connect Dropbox
        </Button>
      </div>
    </div>
  );
}

export default Dropbox;
