import React from "react";

function SetCms() {
  return (
    <div className="col-12 wow fadeIn" data-wow-delay="0.7s">
      <div className="service-item d-flex flex-column justify-content-center text-center rounded">
        <div className="service-icon btn-square">
          <i className="fa fa-folder fa-2x"></i>
        </div>
        <h5 className="mb-3">CMS container</h5>
        <p>
          Select the CMS container for this site where you would like to store
          the generated data. The chosen container will organize and manage the
          data within its directories and subfolders, ensuring proper structure
          and accessibility for your content.
        </p>
        <a className="btn px-3 mt-auto mx-auto">coming soon</a>
      </div>
    </div>
  );
}

export default SetCms;
