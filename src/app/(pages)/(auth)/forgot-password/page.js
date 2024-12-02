"use client";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import "./style.css";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage("Password reset email sent!");
        setErrorMessage("");
        //  router.push('/login')
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setSuccessMessage("");
      });
  };

  const backtohome = () => {
    router.push("/login");
  };

  return (
    <div>
      <div className="reset-password-container ">
        <div className="rp_innerBox">
          <div className="back">
            <button className="btn back_btn" onClick={backtohome}>
              <i className="fa fa-angle-double-left"></i> Back
            </button>
          </div>
          <h1 className="rp_h1">Reset Password</h1>

          <form className="rp_form" onSubmit={handleSubmit}>
            <img
              className="rp_img"
              src="https://storage.googleapis.com/kreatewebsites/site101/assets/images/logo-k.jpeg"
              alt="Kreate Logo"
            />
            <label className="rp_label">
              Email:
              <input
                className="rp_input"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="enter your email"
              />
            </label>
            <button className="rp_btn" type="submit">
              Send Reset Email
            </button>
          </form>
          {successMessage && (
            <p className="rp_success-message">{successMessage}</p>
          )}
          {errorMessage && <p className="rp_error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
