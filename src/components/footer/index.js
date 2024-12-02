import React from "react";

const Footer = () => {
  return (
    <>
      <div className="container-fluid bg-dark text-white-50 footer pt-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.1s">
              <a href="/" className="d-inline-block mb-3">
                <h2 className="text-white">
                  KREATE<span className="text-primary">.</span>WEBSITES
                </h2>
              </a>
              <p className="mb-0">
                Empowering Your Digital Vision: Harness AI to Create, Manage,
                and Elevate Content Across Websites, Apps, Chatbots, and More.
              </p>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
              <h5 className="text-white mb-4">Contact Us</h5>
              <p>
                <i className="fa fa-map-marker-alt me-3"></i>Washington, USA
              </p>
              <p>
                <i className="fa fa-phone-alt me-3"></i>+1 425-341-1222
              </p>
              <p>
                <i className="fa fa-envelope me-3"></i>support@dataknobs.com
              </p>
              <div className="d-flex pt-2">
                <a
                  className="btn btn-outline-light btn-social"
                  href="https://x.com/dataknobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  className="btn btn-outline-light btn-social"
                  href="https://www.facebook.com/dataknobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  className="btn btn-outline-light btn-social"
                  href="https://www.youtube.com/@Dataknobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  className="btn btn-outline-light btn-social"
                  href="https://instagram.com/dataknobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  className="btn btn-outline-light btn-social"
                  href="https://www.linkedin.com/company/dataknobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
              <h5 className="text-white mb-4">Useful Links</h5>
              <a
                className="btn btn-link"
                href="https://www.kreatewebsites.com/pricing-plans"
              >
                Pricing
              </a>
              <a
                className="btn btn-link"
                href="https://www.kreatewebsites.com/login"
              >
                KREATE Tools
              </a>
              <a
                className="btn btn-link"
                href="https://www.kreatewebsites.com/ab-experiment"
              >
                AB Experiment
              </a>
              <a
                className="btn btn-link"
                href="https://www.dataknobs.com/privacypolicy.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.7s">
              <h5 className="text-white mb-4">Our Products</h5>
              <a className="btn btn-link" href="/features">
                Features
              </a>
              <a className="btn btn-link" href="/themes">
                Themes
              </a>
              <a className="btn btn-link" href="/sites">
                Prebuilt Sites
              </a>
            </div>
          </div>
        </div>

        <div className="container wow fadeIn" data-wow-delay="0.1s">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy;{" "}
                <a className="border-bottom" href="https://www.dataknobs.com">
                  Dataknobs
                </a>
                , All Rights Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="/">Home</a>
                  <a href="/setup-steps">Setup Steps</a>
                  <a href="/page-speed-seo">Page Speed</a>
                  <a href="/domain-name">Domain Name</a>
                  <a href="/on-page-seo">SEO</a>
                  <a href="/faqs">FAQs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
