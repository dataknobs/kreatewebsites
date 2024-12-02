import Header from "@/components/header";
import "./features.css";
import Footer from "@/components/footer";

const Features = () => {
  return (
    <>
      <Header customBg="light-blue" />
      <div className="container-fluid bg-light mt-5 py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div
              className="col-lg-12 wow fadeIn text-center"
              data-wow-delay="0.1s"
            >
              <div className="service-item btn btn-sm border rounded-pill text-primary px-3 mb-3">
                Our Solutions
              </div>
              <h1 className="mb-4">Transform Your Digital Journey</h1>
              <p className="mb-4">
                Explore our diverse range of powerful tools designed to elevate
                your digital experiences. Whether you're crafting virtual
                assistants, dynamic websites, or insightful data products, our
                solutions streamline the process, enabling you to focus on what
                truly matters—creating impactful content and engaging
                experiences for your users.
              </p>
              <a className="btn btn-primary rounded-pill px-4" href="/websites">
                Explore More
              </a>
            </div>
            <div className="col-lg-12">
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="row g-4">
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-person fs-2"></i>
                        </div>
                        <h5 className="mb-3">Generate Resume Site</h5>
                        <p>
                          Create and manage professional resume sites with ease.
                          Customize templates, showcase your skills, and build a
                          strong online presence to impress potential employers.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/websites"
                        >
                          Try it out now
                        </a>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-file-earmark-ppt-fill fs-2"></i>
                        </div>
                        <h5 className="mb-3">Generate Slides</h5>
                        <p>
                          Easily generate and customize slide decks for your
                          presentations. Use various templates and design
                          options to create visually appealing and professional
                          slides.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/websites"
                        >
                          Try it out now
                        </a>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-markdown fs-2"></i>
                        </div>
                        <h5 className="mb-3">Markdown to HTML Converter</h5>
                        <p className="text-success fw-bold">
                          <span className="badge bg-success">
                            No login required
                          </span>
                          <span className="badge bg-success ms-2">Free</span>
                        </p>
                        <p>
                          Convert Markdown files into HTML format effortlessly.
                          Customize and style the output to fit your needs and
                          integrate it into your web projects seamlessly.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/markdown-to-html"
                        >
                          Try it now
                        </a>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-upload fs-2"></i>
                        </div>
                        <h5 className="mb-3">Upload Slides</h5>
                        <p className="text-success fw-bold">
                          <span className="badge bg-warning">Free</span>
                        </p>
                        <p>
                          Upload and manage your slide presentations with our
                          user-friendly interface. Easily access, edit, and
                          share your slides from a centralized platform.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/websites"
                        >
                          Try it out now
                        </a>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                        <div className="service-icon btn-square">
                          <i className="bi bi-person-check fs-2"></i>
                        </div>
                        <h5 className="mb-3">
                          Create and Manage AI Assistants
                        </h5>
                        <p>
                          Design and manage AI assistants tailored to your
                          needs. From configuration to deployment, create
                          intelligent assistants that enhance user interaction
                          and automate tasks effectively.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/websites"
                        >
                          Try it out now
                        </a>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="service-item d-flex flex-column justify-content-between text-center rounded border-primary border-3">
                        <div className="service-icon btn-square">
                          <i className="bi bi-globe fs-2"></i>
                        </div>
                        <h5 className="mb-3">Build Web Pages with No Code</h5>
                        <p className="text-success fw-bold">
                          <span className="badge bg-secondary">Free</span>
                        </p>
                        <p>
                          Create stunning web pages without any coding
                          knowledge. Use our intuitive templates to design and
                          publish web pages tailored to your content and needs
                          effortlessly.
                        </p>
                        <a
                          className="btn px-3 mt-auto mx-auto"
                          href="/websites"
                        >
                          Try it out now
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

      <div className="container-fluid py-5 mt-4 mb-4">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img">
                <img
                  className="img-fluid"
                  src="https://storage.googleapis.com/kreatewebsites/sites/site103/img/about-img.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">
                Our Features
              </div>
              <h1 className="mb-4">Explore the Versatility of KreatePro</h1>
              <p className="mb-4">
                KreatePro offers a suite of powerful tools designed to meet
                diverse digital needs. Whether you are generating professional
                web pages, crafting engaging resumes, or building advanced AI
                assistants, our features empower you to create and manage with
                ease:
                <br />
                <br />
                From seamless website creation and dynamic slide generation to
                converting markdown to HTML and managing your AI assistants,
                KreatePro simplifies and enhances your digital projects.
                Experience our all-in-one platform for efficient, high-quality
                content creation.
                <br />
                Discover how each feature integrates to streamline your workflow
                and boost your digital productivity.
              </p>
              <p className="mb-4">
                Take advantage of our innovative tools and start transforming
                your digital projects today.
              </p>
              <div className="d-flex align-items-center mt-4">
                <a
                  className="btn btn-primary rounded-pill px-4 me-3"
                  href="/features"
                >
                  Learn More
                </a>
                <a
                  className="btn btn-outline-primary btn-square me-3"
                  href="https://www.facebook.com/dataknobs"
                  target="_blank"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  className="btn btn-outline-primary btn-square me-3"
                  href="https://twitter.com/dataknobs"
                  target="_blank"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  className="btn btn-outline-primary btn-square me-3"
                  href="https://instagram.com/dataknobs"
                  target="_blank"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  className="btn btn-outline-primary btn-square"
                  href="https://www.linkedin.com/company/dataknobs"
                  target="_blank"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
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
                Why Choose Our Features
              </div>
              <h1 className="text-white mb-4">
                Discover the Benefits of Our Comprehensive Tools
              </h1>
              <p className="text-light mb-4">
                Our features are designed to provide unparalleled value and
                flexibility, catering to a wide range of needs. Each tool within
                our platform is crafted to enhance your workflow and maximize
                productivity. Explore how our innovative features can help you
                achieve your digital goals effortlessly.
              </p>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="bi bi-check-lg"></i>
                </div>
                <span>Efficient Data Management and Utilization</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="bi bi-check-lg"></i>
                </div>
                <span>Customizable Templates for Every Need</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="bi bi-check-lg"></i>
                </div>
                <span>Seamless Integration with Existing Tools</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="bi bi-check-lg"></i>
                </div>
                <span>Real-Time Collaboration and Feedback</span>
              </div>
              <div className="row g-4 pt-3">
                <div className="col-sm-6">
                  <div
                    className="d-flex rounded p-3"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <i className="bi bi-file-earmark-code text-white fs-3"></i>
                    <div className="ms-3">
                      <h2 className="text-white mb-0" data-toggle="counter-up">
                        150+
                      </h2>
                      <p className="text-white mb-0">Features Implemented</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div
                    className="d-flex rounded p-3"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <i className="bi bi-star text-white fs-3"></i>
                    <div className="ms-3">
                      <h2 className="text-white mb-0" data-toggle="counter-up">
                        1000+
                      </h2>
                      <p className="text-white mb-0">Satisfied Users</p>
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
                src="https://storage.googleapis.com/bot_config_files/kreatepro/flagship-images/genai-robot.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Features;
