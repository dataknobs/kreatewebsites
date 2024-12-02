import React from "react";

function Configuration({ domainData }) {
  return (
    <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
      <div className="service-item d-flex flex-column justify-content-center text-center rounded">
        <div className="service-icon btn-square">
          <i className="fa fa-cogs fa-2x"></i>
        </div>
        <h5 className="">Domain Configuration</h5>
        <p>
          Domain ID: {domainData.domain_id}
          <br />
          Plan: {domainData.plan}
          <br />
          Product Type: {domainData.product_type}
          <br />
          Type: {domainData.type}
          <br />
          Start Period: <br />
          {new Date(domainData.start_period).toLocaleDateString()}
          <br />
          Owner: {domainData.owner}
          <br />
        </p>
      </div>
    </div>
  );
}

export default Configuration;
