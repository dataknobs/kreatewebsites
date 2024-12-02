import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "@/app/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";

const ThemeSelector = ({ id }) => {
  const [themes, setThemes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [previousTheme, setPreviousTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch themes
      const themesCollection = collection(db, "themes");
      const themesSnapshot = await getDocs(themesCollection);
      const themesList = themesSnapshot.docs.map((doc) => doc.data());
      setThemes(themesList);

      // Fetch previously selected theme
      const siteRef = doc(db, "domains", id);
      const siteDoc = await getDoc(siteRef);
      if (siteDoc.exists()) {
        const data = siteDoc.data();
        const previous = themesList.find((t) => t.name === data.theme);
        setPreviousTheme(previous || null);
        setSelectedTheme(previous || null);
      }
    } catch (error) {
      toast.error("Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (theme) => {
    setSelectedTheme(theme);
    setShowModal(false);

    try {
      const siteRef = doc(db, "domains", id);
      await updateDoc(siteRef, {
        theme: theme.name,
      });

      toast.success("Theme updated successfully");
      setPreviousTheme(selectedTheme);
      setShowModal(false);
      await fetchData();
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  return (
    <>
      {/* Card with "Select Theme" button */}
      <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
          <div className="service-icon btn-square">
            <i className="bi bi-palette fs-2"></i>
          </div>
          <h5 className="mb-3">Theme Selection</h5>
          <p>
            Customize your website's appearance by selecting a theme from our
            collection. Your selected theme will define your site's look and
            feel.
          </p>
          {previousTheme && (
            <div className="d-flex justify-content-center mb-3 mt-4">
              <img
                src={previousTheme.images}
                alt="Previously Selected Theme"
                className="rounded me-3"
                style={{
                  width: "80px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <div>
                <h6 className="mb-1">
                  <Badge bg="primary">Selected Theme</Badge>
                </h6>
                <p>{previousTheme.name}</p>
              </div>
            </div>
          )}
          <a
            className="btn px-3 mt-auto mx-auto"
            onClick={() => setShowModal(true)}
          >
            Select Theme
          </a>
        </div>
      </div>

      {/* Modal for theme selection */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row className="g-3">
              {themes.map((theme, index) => (
                <Col key={index} md={4}>
                  <Card
                    className={`h-100 d-flex flex-column justify-content-between border ${selectedTheme?.name === theme.name ? "border-primary" : ""}`}
                  >
                    <Card.Img
                      variant="top"
                      src={theme.images}
                      className="img-fluid"
                      style={{
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="text-truncate">{theme.name}</h6>
                        <p className="text-muted small">
                          Click "Preview" to view this theme live or "Select" to
                          choose it for your website.
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleSubmit(theme)}
                        >
                          {selectedTheme?.name === theme.name
                            ? "Selected"
                            : "Select"}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => window.open(theme.livelink, "_blank")}
                        >
                          Preview
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ThemeSelector;
