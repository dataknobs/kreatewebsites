import React from "react";
import { Modal, Button } from "react-bootstrap";
import FileExplorer from "@/components/file-explorer";

const SelectModal = ({
  show,
  onHide,
  handleInputChange,
  handleModalClose,
  site,
  id,
  bucketName,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Select Subfolder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FileExplorer
          site={site}
          id={id}
          bucketName={bucketName}
          handleInputChange={handleInputChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalClose}>
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectModal;
