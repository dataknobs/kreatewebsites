"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import "./pricing.css";
import Footer from "@/components/footer";
import DetailTable from "./detail";
import { db } from "@/app/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const PricingPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [cmsPlans, setCmsPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      // Fetch plans from both "websites" and "cms" concurrently
      const fetchDocumentPlans = async (documentName, setState) => {
        try {
          const docRef = doc(collection(db, "pricing-plans"), documentName);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Convert the plans object into an array of plans with plan names
            const plansArray = Object.keys(data)
              .map((key) => ({
                name: key,
                ...data[key],
                type: documentName,
              }))
              .filter((plan) => plan.active); // Include only plans where active is true

            console.log(plansArray);
            // Fetch prices for each plan using the prod_key
            const updatedPlans = await Promise.all(
              plansArray.map(async (plan) => {
                try {
                  // Fetch price using Stripe API
                  let key;
                  if (process.env.NEXT_PUBLIC_PLAN_KEY === "prod") {
                    key = plan.prod_key;
                  } else {
                    key = plan.test_key;
                  }
                  const price = await stripe.prices.retrieve(key);

                  console.log(price);

                  // Return the plan with the added combined price (price + currency)
                  return {
                    ...plan,
                    price: `${price.unit_amount / 100}`,
                    currency: ` ${price.currency.toUpperCase()}`,
                    interval: `per ${price.recurring.interval}`,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching price for prod_key ${plan.prod_key}:`,
                    error,
                  );

                  // If the price fetch fails, return the plan without the price
                  return { ...plan, price: "Price not available" };
                }
              }),
            );

            // Update the respective state with the enriched plans
            setState(updatedPlans);
          } else {
            console.log(`No such document: ${documentName}`);
          }
        } catch (error) {
          console.error(`Error fetching plans for ${documentName}:`, error);
        }
      };

      // Execute both fetch operations concurrently
      await Promise.all([
        fetchDocumentPlans("websites", setPlans),
        fetchDocumentPlans("cms", setCmsPlans),
      ]);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onSelectPlan = async (plan) => {
    localStorage.setItem("plan", plan.name);
    localStorage.setItem("planPrice", plan.price + plan.currency);
    localStorage.setItem("planType", plan.type);
    if (process.env.NEXT_PUBLIC_PLAN_KEY == "prod") {
      localStorage.setItem("planKey", plan.prod_key);
    } else {
      localStorage.setItem("planKey", plan.test_key);
    }

    router.push(`/pricing/payment`);
  };

  const renderPlan = (plan) => {
    return (
      <button
        onClick={() => onSelectPlan(plan)}
        style={{
          color: "#ffffff",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        Purchase This Plan Now
      </button>
    );
  };

  return (
    <>
      <Header />

      <div>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h4>
            We Have The Best Pre-Order <em>Prices</em> You Can Get
          </h4>
          <img
            src="https://storage.googleapis.com/kreatewebsites/site101/assets/images/heading-line-dec.png"
            alt=""
          />
          <p className="lead">
            Set up your account and share email address. We will reach out to
            you to point domain to hosting. Then you can start publish content.
          </p>
        </div>

        <div className="container" id="plans">
          <div className="row justify-content-center text-center">
            {plans.map((plan) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={plan.name}>
                <div className="card h-100 shadow-lg border-light rounded plan-card">
                  <div className="card-header bg-gradient">
                    <h4 className="my-0 font-weight-bold text-dark">
                      {plan.name}
                    </h4>
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between align-items-center">
                    <h1 className="card-title pricing-card-title">
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-currency"> {plan.currency} </span>
                      <small className="price-recurring">
                        {" "}
                        {plan.interval}
                      </small>
                    </h1>

                    <div className="icon my-3">
                      <img
                        src="https://storage.googleapis.com/kreatewebsites/site101/assets/images/pricing-table-01.png"
                        alt={plan.name}
                        className="pricing-icon"
                      />
                    </div>

                    {Array.isArray(plan.details) && plan.details.length > 0 && (
                      <ul className="list-unstyled mt-3 mb-4 d-flex flex-column align-items-start">
                        {plan.details.map((feature, index) => (
                          <li key={index} className="text-muted">
                            <i className="bi bi-check-circle text-success"></i>{" "}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    {plan.recommended && (
                      <div className="badge badge-warning badge-pill w-50">
                        Recommended
                      </div>
                    )}
                    <button className="btn btn-lg btn-block btn-gradient">
                      {renderPlan(plan)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="cms" className="mt-5">
        <div className="container pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h4>
            Take Full Control of Your <em>Content and Assets</em> with Our CMS
            Plans
          </h4>
          <img
            src="https://storage.googleapis.com/kreatewebsites/site101/assets/images/heading-line-dec.png"
            alt=""
          />
          <p className="lead">
            Manage all your assets, content, and directories effortlessly with
            our CMS subscription plans. Organize your content in containers and
            folders, streamline your workflow, and take charge of everything you
            need to publish and share your vision.
          </p>
        </div>

        <div className="container" id="plans">
          <div className="row justify-content-center text-center">
            {cmsPlans.map((plan) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={plan.name}>
                <div className="card h-100 shadow-lg border-light rounded plan-card">
                  <div className="card-header bg-gradient">
                    <h4 className="my-0 font-weight-bold text-dark">
                      {plan.name}
                    </h4>
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between align-items-center">
                    <h1 className="card-title pricing-card-title">
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-currency"> {plan.currency} </span>
                      <small className="price-recurring">
                        {" "}
                        {plan.interval}
                      </small>
                    </h1>

                    <div className="icon my-3">
                      <img
                        src="https://storage.googleapis.com/kreatewebsites/site101/assets/images/pricing-table-01.png"
                        alt={plan.name}
                        className="pricing-icon"
                      />
                    </div>

                    {Array.isArray(plan.details) && plan.details.length > 0 && (
                      <ul className="list-unstyled mt-3 mb-4 d-flex flex-column align-items-start">
                        {plan.details.map((feature, index) => (
                          <li key={index} className="text-muted">
                            <i className="bi bi-check-circle text-success"></i>{" "}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    {plan.recommended && (
                      <div className="badge badge-warning badge-pill w-50">
                        Recommended
                      </div>
                    )}
                    <button className="btn btn-lg btn-block btn-gradient">
                      {renderPlan(plan)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid bg-light mt-5 py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
              <div className="service-item btn btn-sm border rounded-pill text-primary px-3 mb-3">
                Pricing Overview
              </div>
              <h1 className="mb-4">Affordable Plans for Everyone</h1>
              <p className="mb-4">
                Choose the right plan for your needs. From individuals to
                businesses and enterprises, we offer tailored plans with a
                variety of features to empower your projects. Find the best fit
                and unlock the full potential of your digital presence.
              </p>
              <a className="btn btn-primary rounded-pill px-4" href="/pricing">
                View All Plans
              </a>
            </div>
            <div className="col-lg-7">
              <div className="row g-4">
                <div className="col-md-6 d-flex">
                  <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                    <div className="service-icon btn-square">
                      <i className="fa fa-cogs fa-2x"></i>
                    </div>
                    <h5 className="mb-3">Flexible Plans</h5>
                    <p>
                      Whether you're a small business or a large enterprise, we
                      have a plan tailored for you. Choose from various options
                      with features that suit your needs.
                    </p>
                    <a className="btn px-3 mt-auto mx-auto" href="/pricing">
                      Explore Plans
                    </a>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                    <div className="service-icon btn-square">
                      <i className="fa fa-dollar-sign fa-2x"></i>
                    </div>
                    <h5 className="mb-3">Competitive Pricing</h5>
                    <p>
                      Enjoy industry-leading prices with features that cater to
                      every budget. Our plans offer great value without
                      compromising on quality.
                    </p>
                    <a className="btn px-3 mt-auto mx-auto" href="/pricing">
                      See Pricing
                    </a>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                    <div className="service-icon btn-square">
                      <i className="fa fa-shield-alt fa-2x"></i>
                    </div>
                    <h5 className="mb-3">Security Included</h5>
                    <p>
                      All our plans come with SSL certificates and robust
                      security features to keep your data safe and secure.
                    </p>
                    <a className="btn px-3 mt-auto mx-auto" href="/security">
                      Learn More
                    </a>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="service-item d-flex flex-column justify-content-between text-center rounded">
                    <div className="service-icon btn-square">
                      <i className="fa fa-rocket fa-2x"></i>
                    </div>
                    <h5 className="mb-3">Instant Setup</h5>
                    <p>
                      Get started quickly with our easy-to-setup plans. Our
                      user-friendly interface ensures a smooth and fast setup
                      process.
                    </p>
                    <a className="btn px-3 mt-auto mx-auto" href="/setup">
                      Get Started
                    </a>
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
                Why Choose Our Pricing Plans
              </div>
              <h1 className="text-white mb-4">
                Maximize Value with Our Tailored Plans
              </h1>
              <p className="text-light mb-4">
                Discover how our pricing plans offer exceptional value and
                flexibility, tailored to meet the diverse needs of businesses
                and individuals. Each plan is designed to deliver the maximum
                benefit, ensuring that you get the best value for your
                investment.
              </p>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="fa fa-check"></i>
                </div>
                <span>Affordable Pricing for All Needs</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="fa fa-check"></i>
                </div>
                <span>Scalable Options as You Grow</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="fa fa-check"></i>
                </div>
                <span>Comprehensive Features for Every Plan</span>
              </div>
              <div className="d-flex align-items-center text-white mb-3">
                <div className="btn-sm-square bg-white text-primary rounded-circle me-3">
                  <i className="fa fa-check"></i>
                </div>
                <span>24/7 Support and Assistance</span>
              </div>
              <div className="row g-4 pt-3">
                <div className="col-sm-6">
                  <div
                    className="d-flex rounded p-3"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <i className="fa fa-users fa-3x text-white"></i>
                    <div className="ms-3">
                      <h2 className="text-white mb-0" data-toggle="counter-up">
                        Engaged
                      </h2>
                      <p className="text-white mb-0">Active Users</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div
                    className="d-flex rounded p-3"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <i className="fa fa-star fa-3x text-white"></i>
                    <div className="ms-3">
                      <h2 className="text-white mb-0" data-toggle="counter-up">
                        200+
                      </h2>
                      <p className="text-white mb-0">Early Feedbacks</p>
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

      <div id="detailed"></div>
      <DetailTable renderPlan={renderPlan} />

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
            <h1 className="mb-4">Frequently Asked Questions</h1>
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
                      What are the key benefits of each pricing plan?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionFAQ1"
                  >
                    <div className="accordion-body">
                      Our plans offer various features tailored to different
                      needs:
                      <ul>
                        <li>
                          <strong>Local Business Plan:</strong> Ideal for local
                          businesses, includes basic hosting, SSL certificate,
                          website builder access, content generation, and a
                          100-page limit.
                        </li>
                        <li>
                          <strong>Business Powerhouse:</strong> Suited for
                          growing businesses, offers advanced hosting, SSL
                          certificate, enhanced website builder, multiple
                          articles generation, and a 200-page limit.
                        </li>
                        <li>
                          <strong>Enterprise Plan:</strong> Designed for large
                          organizations, includes premium hosting, SSL
                          certificate, all features unlocked, unlimited content
                          generation, and unlimited pages.
                        </li>
                        <li>
                          <strong>For Self Employed:</strong> Perfect for
                          freelancers, features basic hosting, SSL certificate,
                          website builder access, content generation, and a
                          50-page limit.
                        </li>
                        <li>
                          <strong>Individual Website:</strong> Great for
                          personal sites, includes basic hosting, SSL
                          certificate, simple website builder, content
                          generation, and a 10-page limit.
                        </li>
                        <li>
                          <strong>Standard Hosting:</strong> Entry-level hosting
                          service, includes basic hosting, 10 GB storage, 1
                          website, limited support, and no additional features.
                        </li>
                      </ul>
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
                      How can I choose the right plan for my needs?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionFAQ1"
                  >
                    <div className="accordion-body">
                      Consider your specific requirements:
                      <ul>
                        <li>
                          For essential services, the{" "}
                          <strong>Standard Hosting</strong> or{" "}
                          <strong>Individual Website</strong> plans are
                          suitable.
                        </li>
                        <li>
                          If you need more features and capabilities, the{" "}
                          <strong>Local Business Plan</strong> or{" "}
                          <strong>For Self Employed</strong> plans are ideal.
                        </li>
                        <li>
                          For comprehensive features and extensive support, the{" "}
                          <strong>Business Powerhouse</strong> or{" "}
                          <strong>Enterprise Plan</strong> are the best choices.
                        </li>
                      </ul>
                      You can always contact our sales team for personalized
                      advice.
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
                      Can I switch plans later on?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionFAQ1"
                  >
                    <div className="accordion-body">
                      Yes, you can switch plans at any time. If your needs
                      change, you can upgrade or downgrade your plan through
                      your account settings. The transition is seamless and we
                      will assist you throughout the process.
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
                      Do you offer discounts for long-term commitments?
                    </button>
                  </h2>
                  <div
                    id="collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#accordionFAQ2"
                  >
                    <div className="accordion-body">
                      Yes, we offer discounts for annual and multi-year
                      commitments. The exact discount depends on the plan and
                      the duration of your commitment. Contact our sales team
                      for more details on available discounts and promotions.
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
                      How can I contact support for billing inquiries?
                    </button>
                  </h2>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSix"
                    data-bs-parent="#accordionFAQ2"
                  >
                    <div className="accordion-body">
                      You can contact our support team through contact page or
                      by email. We provide dedicated assistance for any
                      billing-related questions or issues to ensure a smooth
                      experience.
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
                      Can I trial your service before committing?
                    </button>
                  </h2>
                  <div
                    id="collapseSeven"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSeven"
                    data-bs-parent="#accordionFAQ2"
                  >
                    <div className="accordion-body">
                      Yes, we offer a free trial period for most of our plans.
                      You can sign up for a trial to explore our features and
                      see if our service meets your needs before making a
                      long-term commitment.
                    </div>
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
};

export default PricingPlans;
