import React from "react";
import "./loader.css"; // Import the global CSS

const Loader = () => {
  return (
    <div className="loader-container">
      <p className="loader-text">Loading your dashboard...</p>
      <div className="loader-bar-container">
        <div className="loader-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
