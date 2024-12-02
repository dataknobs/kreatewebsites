"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/app/SessionContext";

const Header = ({ customBg }) => {
  const { user, superAdmin } = useContext(SessionContext);
  const router = useRouter();

  const handleSignOut = (e) => {
    e.preventDefault();

    auth
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log("Sign out error:", error);
      });
  };

  return (
    <>
      <div className={`container-fluid sticky-top ${customBg}`}>
        <div className="container navbar-bg">
          <nav className="navbar navbar-bg navbar-expand-lg p-0">
            <Link href="/" className="navbar-brand">
              <h2 className="text-white">
                <img
                  alt="logo"
                  src="https://storage.googleapis.com/json_articles/dataknobs-logo.png"
                  width="45"
                  height="45"
                  className="d-inline-block"
                />
                Kreate<span className="">.</span>Websites
              </h2>
            </Link>
            <button
              type="button"
              className="navbar-toggler ms-auto me-0"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto align-items-center">
                <Link
                  className="nav-item nav-link me-4"
                  href="/websites"
                  style={{ cursor: "pointer" }}
                >
                  Websites
                </Link>
                <Link
                  className="nav-item nav-link me-4"
                  href="https://kreatebots.com/login?tool=ai-assistants"
                  style={{ cursor: "pointer" }}
                  target="_blank"
                >
                  AI Assistants
                </Link>
                <Link href="/cms-dashboard" className="nav-item nav-link me-4">
                  CMS
                </Link>
                <Link href="/features" className="nav-item nav-link me-4">
                  Features
                </Link>
                <Link href="/pricing" className="nav-item nav-link me-4">
                  Pricing
                </Link>

                {superAdmin && (
                  <Link
                    href="/admin-dashboard"
                    className="nav-item nav-link me-4"
                  >
                    Admin
                  </Link>
                )}

                <Link
                  href="https://www.dataknobs.com/about-dataknobs/contact.html"
                  className="nav-item nav-link me-4"
                  target="_blank"
                >
                  Contact
                </Link>
                {user ? (
                  <button
                    className="btn btn-primary btn-oval"
                    onClick={handleSignOut}
                  >
                    <i className={`fa fa-sign-out-alt`}></i> Sign Out
                  </button>
                ) : (
                  <Link className="btn btn-dark btn-oval" href="/login">
                    <i className={`fa fa-sign-in-alt`}></i> Sign In Now
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
