import Header from "@/components/header";
import React from "react";

export const metadata = {
  title: "404 - Page Not Found",
  description:
    "The page you are looking for does not exist. It might have been moved or removed. Return to the homepage or explore other sections.",
  keywords: "404, page not found, error page, KreateCMS",
};

export default function ErrorPage() {
  return (
    <>
      <Header customBg="light-blue" />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="text-dark">Page Not Found</h2>
          <p className="text-muted">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-muted">
            You might have mistyped the address, or the page may have moved.
          </p>
          <a href="/" className="btn btn-primary mt-3">
            Go Back to Home
          </a>
        </div>
      </div>
    </>
  );
}
