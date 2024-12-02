"use client";
import Header from "@/components/header";
import React, { useContext, useEffect } from "react";
import "./home-page.css";
import Footer from "@/components/footer";
import { SessionContext } from "@/app/SessionContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useContext(SessionContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/websites");
    }
  }, [user, router]);

  return (
    <>
      <div>
        <Header />
        <div className="container-fluid pt-5 hero-header feature mb-5">
          <div className="container pt-5">
            <div className="row g-5 pt-5">
              <div className="col-lg-5 align-self-center text-center text-lg-start mb-lg-5">
                <div className="btn btn-sm border rounded-pill text-white px-3 mb-3 animated slideInRight">
                  Kreatewebsites
                </div>
                <h1 className="display-5 text-white mb-4 animated slideInRight">
                  Build Websites Beyond Boundaries
                </h1>
                <p className="text-white mb-4 animated slideInRight">
                  Transform your ideas into fully interactive websites with
                  powerful tools and AI-driven innovation.
                </p>

                <a
                  href="/login"
                  className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight"
                >
                  Start Exploring
                </a>
                <a
                  href="/pricing"
                  className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight"
                >
                  Buy Subscription
                </a>

                <br />
              </div>

              <div className="col-lg-7 align-self-starttext-lg-end animated slideInRight">
                <img
                  src="https://storage.googleapis.com/bot_config_files/kreatepro/hero-trial-1.png"
                  style={{ width: "100%", marginBottom: "30%" }}
                  alt="hero"
                ></img>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bg-light mt-5 py-5">
          <div className="container py-5">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                <div className="service-item btn btn-sm border rounded-pill text-primary px-3 mb-3">
                  Our Differentiation
                </div>
                <h1 className="mb-4">Empower Your Projects</h1>
                <p className="mb-4">
                  Kreatewebsites transforms your content (text, images, video,
                  slides, code samples) into a powerful data product, unlocking
                  endless possibilities for your projects. Whether building
                  websites, mobile apps, or chatbots, your content remains
                  central. Unlike traditional methods where content is adjusted
                  to fit UI, with KreatePro, meaningful content creation drives
                  your digital projects forward.
                </p>
                <a
                  className="btn btn-primary rounded-pill px-4"
                  href="/differentiation"
                >
                  Read More
                </a>
              </div>
              <div className="col-lg-7">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="row g-4">
                      <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                          <div className="service-icon btn-square">
                            <i className="fa fa-robot fa-2x"></i>
                          </div>
                          <h5 className="mb-3">Robotic Automation</h5>
                          <p>
                            Utilize automation and generative AI to create web
                            templates with precision. With KreatePro, you can
                            effortlessly generate multiple variations of landing
                            pages, saving time and effort.
                          </p>
                          <a
                            className="btn px-3 mt-auto mx-auto"
                            href="/robotic-automation"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                      <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                          <div className="service-icon btn-square">
                            <i className="fa fa-power-off fa-2x"></i>
                          </div>
                          <h5 className="mb-3">Machine Learning</h5>
                          <p>
                            Leverage advanced machine learning techniques for
                            content classification, keyword generation, and
                            metadata creation. With KreatePro, focus on content
                            creation and user engagement while leaving SEO tasks
                            to the AI.
                          </p>
                          <a
                            className="btn px-3 mt-auto mx-auto"
                            href="/machine-learning"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row g-4">
                      <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                          <div className="service-icon btn-square">
                            <i className="fa fa-graduation-cap fa-2x"></i>
                          </div>
                          <h5 className="mb-3">Search Engine Success</h5>
                          <p>
                            Websites built with Kreatewebsites excel in organic
                            search results as they are built from content. Adapt
                            to search engine algorithm effortlessly, ensuring
                            consistent visibility and traffic.
                          </p>
                          <a
                            className="btn px-3 mt-auto mx-auto"
                            href="/search-engine-success"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                      <div className="col-12 wow fadeIn" data-wow-delay="0.7s">
                        <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                          <div className="service-icon btn-square">
                            <i className="fa fa-brain fa-2x"></i>
                          </div>
                          <h5 className="mb-3">Predictive Analysis</h5>
                          <p>
                            Utilize predictive analysis with Kreatewebsites to
                            make informed decisions about content publishing.
                            KreatePro recommends and suggests which pages or
                            media elements should be combined, ensuring
                            optimized user engagement.
                          </p>
                          <a
                            className="btn px-3 mt-auto mx-auto"
                            href="/predictive-analysis"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid feature bg-primary pt-5">
          <div className="container pt-5">
            <div className="row g-5">
              <div
                className="col-lg-6 align-self-center mb-md-5 pb-md-5 wow fadeIn"
                data-wow-delay="0.3s"
              >
                <div className="btn btn-sm border rounded-pill text-white px-3 mb-3">
                  Why Choose Kreatewebsites
                </div>
                <h1 className="text-white mb-4">
                  Build Stunning Websites with Kreatewebsites
                </h1>
                <p className="text-light mb-4">
                  Kreatewebsites offers cutting-edge tools and design options to
                  help you create beautiful, functional websites without the
                  hassle.
                </p>
                <div className="d-flex align-items-center text-white mb-3">
                  <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                    <i className="fa fa-check"></i>
                  </div>
                  <span>Easy-to-Use Website Builder</span>
                </div>
                <div className="d-flex align-items-center text-white mb-3">
                  <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                    <i className="fa fa-check"></i>
                  </div>
                  <span>Professional Design Templates</span>
                </div>
                <div className="d-flex align-items-center text-white mb-3">
                  <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                    <i className="fa fa-check"></i>
                  </div>
                  <span>Responsive and SEO-Friendly</span>
                </div>
                <div className="row g-4 pt-3">
                  <div className="col-sm-6">
                    <div
                      className="d-flex rounded p-3"
                      style={{ background: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <i className="fa fa-users fa-3x text-white"></i>
                      <div className="ms-3">
                        <h2
                          className="text-white mb-0"
                          data-toggle="counter-up"
                        >
                          500+
                        </h2>
                        <p className="text-white mb-0">Happy Clients</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div
                      className="d-flex rounded p-3"
                      style={{ background: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <i className="fa fa-check fa-3x text-white"></i>
                      <div className="ms-3">
                        <h2
                          className="text-white mb-0"
                          data-toggle="counter-up"
                        >
                          200+
                        </h2>
                        <p className="text-white mb-0">Websites Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-6 align-self-end text-center text-md-end wow fadeIn"
                data-wow-delay="0.5s"
              >
                <img
                  className="img-fluid"
                  src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/feature.png"
                  alt="Kreatewebsites Feature"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-5 mt-5">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <div className="about-img">
                  <img
                    className="img-fluid"
                    src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/about-img.jpg"
                    alt="KreateWebsites"
                  />
                </div>
              </div>
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                  How Kreatewebsites Works
                </div>
                <h1 className="mb-4">
                  Build Stunning Digital Experiences with Kreatewebsites
                </h1>
                <p className="mb-4">
                  KreateWebsites empowers users with innovative tools to design,
                  manage, and optimize websites effortlessly:
                  <br />
                  <br />
                  With intuitive no-code options, dynamic templates, and
                  AI-powered assistants, Kreatewebsites makes creating a
                  professional online presence accessible for everyone. From
                  businesses to individual creators, this platform ensures
                  smooth workflows and impactful results.
                </p>
                <p className="mb-4">
                  Explore the power of Kreatewebsites to elevate your digital
                  journey and unlock your potential for online success.
                </p>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <h6 className="mb-3">
                      <i className="fa fa-check text-primary me-2"></i>No-Code
                      Website Building
                    </h6>
                    <h6 className="mb-0">
                      <i className="fa fa-check text-primary me-2"></i>Dynamic
                      Templates
                    </h6>
                  </div>
                  <div className="col-sm-6">
                    <h6 className="mb-3">
                      <i className="fa fa-check text-primary me-2"></i>AI-Driven
                      Insights
                    </h6>
                    <h6 className="mb-0">
                      <i className="fa fa-check text-primary me-2"></i>Optimized
                      SEO Tools
                    </h6>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-4">
                  <a
                    className="btn btn-primary rounded-pill px-4 me-3"
                    href="https://www.kreatewebsites.com/how-it-works"
                    target="_blank"
                  >
                    Learn More
                  </a>
                  <a
                    className="btn btn-outline-primary btn-square me-3"
                    href="https://www.facebook.com/dataknobs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-outline-primary btn-square me-3"
                    href="https://twitter.com/dataknobs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="btn btn-outline-primary btn-square me-3"
                    href="https://instagram.com/dataknobs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    className="btn btn-outline-primary btn-square"
                    href="https://www.linkedin.com/company/dataknobs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bg-light py-5">
          <div className="container py-5">
            <div
              className="mx-auto text-center wow fadeIn"
              data-wow-delay="0.1s"
              style={{ maxWidth: "500px" }}
            >
              <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                Case Study
              </div>
              <h1 className="mb-4">Explore Our Recent AI Case Studies</h1>
            </div>
            <div className="row g-4">
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                <div className="case-item position-relative overflow-hidden rounded mb-2">
                  <img
                    className="img-fluid"
                    src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/project-1.jpg"
                    alt="project"
                  />
                  <a className="case-overlay text-decoration-none" href="">
                    <small>USA City Trip</small>
                    <h5 className="lh-base text-white mb-3">
                      Website for travel
                    </h5>
                    <span className="btn btn-square btn-primary">
                      <i className="fa fa-arrow-right"></i>
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.5s">
                <div className="case-item position-relative overflow-hidden rounded mb-2">
                  <img
                    className="img-fluid"
                    src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/project-2.jpg"
                    alt="project"
                  />
                  <a className="case-overlay text-decoration-none" href="">
                    <small>AB Experiment</small>
                    <h5 className="lh-base text-white mb-3">
                      Online blog and book for A/B testing
                    </h5>
                    <span className="btn btn-square btn-primary">
                      <i className="fa fa-arrow-right"></i>
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.7s">
                <div className="case-item position-relative overflow-hidden rounded mb-2">
                  <img
                    className="img-fluid"
                    src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/project-3.jpg"
                    alt="project"
                  />
                  <a className="case-overlay text-decoration-none" href="">
                    <small>Sports Website</small>
                    <h5 className="lh-base text-white mb-3">
                      A sports website to show daily score
                    </h5>
                    <span className="btn btn-square btn-primary">
                      <i className="fa fa-arrow-right"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-5">
          <div className="container py-5">
            <div
              className="mx-auto text-center wow fadeIn"
              data-wow-delay="0.1s"
              style={{ maxWidth: "500px" }}
            >
              <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                Popular FAQs
              </div>
              <h1 className="mb-4">Kreatewebsites QnA</h1>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="accordion" id="accordionFAQ1">
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.1s"
                  >
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        How to build a website?
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionFAQ1"
                    >
                      <div className="accordion-body">
                        Use www.kreatewebsites.com and buy package. Set up your
                        domain and start publishing.
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.2s"
                  >
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        How long will it take to get a new website?
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionFAQ1"
                    >
                      <div className="accordion-body">
                        KREATE will immediately create website in few seconds
                        and get hosting ready. If we have access to dyour
                        domain, it will be set up too or you will have to point
                        to us. After first time set up web pages will be
                        generated and deployment will happen in less than {"<"}{" "}
                        5 min.{" "}
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.3s"
                  >
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Do you only create HTML websites?
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionFAQ1"
                    >
                      <div className="accordion-body">
                        We can create HTML, React/Node js, ASPX , PHP website.
                        For blog publishing HTML is portable and efficient.
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.4s"
                  >
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="true"
                        aria-controls="collapseFour"
                      >
                        Will my website be mobile-friendly?
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionFAQ1"
                    >
                      <div className="accordion-body">
                        Yes. Absolutely. One of advantage of generation is as
                        new form factor and devices come, we can adapt KREATE
                        engine. Accordingly your website pages will get
                        generated without any development effort.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="accordion" id="accordionFAQ2">
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.5s"
                  >
                    <h2 className="accordion-header" id="headingFive">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                        aria-expanded="false"
                        aria-controls="collapseFive"
                      >
                        Will you maintain my site for me?
                      </button>
                    </h2>
                    <div
                      id="collapseFive"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFive"
                      data-bs-parent="#accordionFAQ2"
                    >
                      <div className="accordion-body">
                        Yes we will support. If there is issue or downtime we
                        will support. If you need custom fucntionality or
                        development we can support that too.
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.6s"
                  >
                    <h2 className="accordion-header" id="headingSix">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSix"
                        aria-expanded="false"
                        aria-controls="collapseSix"
                      >
                        I’m on a strict budget. Do you have any low cost
                        options?
                      </button>
                    </h2>
                    <div
                      id="collapseSix"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingSix"
                      data-bs-parent="#accordionFAQ2"
                    >
                      <div className="accordion-body">
                        yes, our solution is design for low cost.
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.7s"
                  >
                    <h2 className="accordion-header" id="headingSeven">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSeven"
                        aria-expanded="false"
                        aria-controls="collapseSeven"
                      >
                        Will you maintain my site for me?
                      </button>
                    </h2>
                    <div
                      id="collapseSeven"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingSeven"
                      data-bs-parent="#accordionFAQ2"
                    >
                      <div className="accordion-body">
                        Yes we will maintain site and ensure it is available
                        99%+ time.
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item wow fadeIn"
                    data-wow-delay="0.8s"
                  >
                    <h2 className="accordion-header" id="headingEight">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseEight"
                        aria-expanded="false"
                        aria-controls="collapseEight"
                      >
                        Can you buy domain for my website
                      </button>
                    </h2>
                    <div
                      id="collapseEight"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingEight"
                      data-bs-parent="#accordionFAQ2"
                    >
                      <div className="accordion-body">
                        Yes we can buy domain and point it your website. If you
                        sign up for one year
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container py-5">
            <div className="row g-5">
              <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                  Testimonial
                </div>
                <h1 className="mb-4">See Sites running on KREATE!</h1>
                <p className="mb-4">
                  Travel, Sports, Real-Estate, Technology blogs and more
                </p>
                <a
                  className="btn btn-primary rounded-pill px-4"
                  href="https://blog.kreatewebsites.com/"
                >
                  Read More
                </a>
              </div>
              <div className="col-lg-7 wow fadeIn" data-wow-delay="0.5s">
                <div className="owl-carousel testimonial-carousel border-start border-primary">
                  <div className="testimonial-item ps-5">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p className="fs-4">
                      USA City Trip and Europe City Trip is site that is helping
                      people create vacation memories{" "}
                    </p>
                  </div>
                  <div className="testimonial-item ps-5">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p className="fs-4">
                      Day night cricket show cricket summary to sports fan on
                      web and on phone app
                    </p>
                  </div>
                  <div className="testimonial-item ps-5">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p className="fs-4">
                      Apartment Sale enable people to browse rental and sale
                      properties
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
