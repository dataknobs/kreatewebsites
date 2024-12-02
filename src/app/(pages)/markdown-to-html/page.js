"use client";
import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaCopy, FaTrash, FaDownload } from "react-icons/fa";
import { marked } from "marked";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { html } from "@codemirror/lang-html";
import "./mdhtml.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MdToHtml = () => {
  const [markdownText, setMarkdownText] = useState("");
  const [htmlText, setHtmlText] = useState("");

  // Real-time Markdown to HTML conversion
  const handleMarkdownChange = (value) => {
    setMarkdownText(value);
    const convertedHtml = marked(value);
    setHtmlText(convertedHtml);
  };

  const handleClear = () => {
    setMarkdownText("");
    setHtmlText("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSave = () => {
    const blob = new Blob([htmlText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kreatedata-converted-markdown.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <Header customBg="light-blue" />
      <Container className="my-5 text-center">
        <h2 className="display-5 fw-bold text-secondary">
          Convert Markdown to HTML for Free
        </h2>
        <p className="text-muted lead mb-5">
          Effortlessly transform your markdown content into clean HTML with just
          a click.
        </p>
      </Container>

      <Container style={{ width: "100%", marginTop: "5%", marginBottom: "5%" }}>
        <Row className="justify-content-between">
          <Col lg={6}>
            <Card className="shadow-lg mb-4 card-equal-height">
              <Card.Header
                as="h5"
                className="bg-warning text-white d-flex justify-content-between align-items-center"
              >
                Markdown Editor
                <Button
                  variant="link"
                  onClick={() => handleCopy(markdownText)}
                  className="btn-icon"
                >
                  <FaCopy style={{ color: "whitesmoke" }} />
                </Button>
              </Card.Header>
              <Card.Body>
                <CodeMirror
                  value={markdownText}
                  height="400px"
                  extensions={[markdown()]}
                  onChange={handleMarkdownChange}
                  placeholder="Enter your Markdown here..."
                />
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="danger" onClick={handleClear}>
                    <FaTrash /> Clear
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="shadow-lg mb-4 card-equal-height">
              <Card.Header
                as="h5"
                className="bg-info text-white d-flex justify-content-between align-items-center"
              >
                HTML Output
                <div>
                  <Button
                    variant="link"
                    onClick={() => handleCopy(htmlText)}
                    className="btn-icon"
                  >
                    <FaCopy style={{ color: "whitesmoke" }} />
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleSave}
                    className="btn-icon"
                  >
                    <FaDownload style={{ color: "whitesmoke" }} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <CodeMirror
                  value={htmlText}
                  height="400px"
                  extensions={[html()]}
                  placeholder="HTML output will appear here..."
                  readOnly={true}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </main>
  );
};

export default MdToHtml;
