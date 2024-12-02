"use client";
import React, { useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import "./style.css";
import Link from "next/link";
import InputControl from "@/components/inputController";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/app/firebase";
import { Suspense } from "react";

const Login = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") || "websites";

  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const [errormsg, setErrormsg] = useState("");

  const handleSuccess = () => {
    router.push(page);
  };

  const handlesubmission = () => {
    if (!value.email || !value.password) {
      setErrormsg("Fill in all fields");
    } else {
      signInWithEmailAndPassword(auth, value.email, value.password)
        .then((res) => {
          setValue({
            email: "",
            password: "",
          });
          handleSuccess();
        })
        .catch((error) => {
          setErrormsg(error.message);
          if (error.code === "auth/user-not-found") {
            setErrormsg("User not found. Please sign up.");
          }
        });
    }
  };

  // Google Sign-In
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Facebook Sign-In
  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setErrormsg(
            "An account with this email already exists. Sign in using the same provider you used during sign-up.",
          );
        } else {
          console.log(error);
        }
      });
  };

  // Microsoft Sign-In
  const signInWithMicrosoft = () => {
    const provider = new OAuthProvider("microsoft.com");
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSuccess();
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setErrormsg(
            "An account with this email already exists. Sign in using the same provider you used during sign-up.",
          );
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="login_container">
      <div className="login_innerBox">
        <div className="back">
          <button
            className="btn back_btn"
            onClick={() => {
              router.push("/");
            }}
          >
            <i className="fa fa-angle-double-left"></i> Back
          </button>
        </div>
        <h1 className="login_heading">Login</h1>
        <InputControl
          type="email"
          label="Email:"
          placeholder="Enter email"
          onChange={(e) =>
            setValue((prev) => ({ ...prev, email: e.target.value }))
          }
          value={value.email}
        />
        <InputControl
          type="password"
          label="Password:"
          placeholder="Enter Password"
          onChange={(e) =>
            setValue((prev) => ({ ...prev, password: e.target.value }))
          }
          value={value.password}
        />
        <p>
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>

        <div className="login_method">
          <button
            className="btn btn-block btn-social btn-microsoft"
            onClick={signInWithMicrosoft}
          >
            <i className="fab fa-microsoft"></i>{" "}
            <span className="icon">Sign In with Microsoft</span>
          </button>
          <button
            className="btn btn-block btn-social btn-google"
            onClick={signInWithGoogle}
          >
            <i className="fab fa-google"></i>{" "}
            <span className="icon">Sign In with Google</span>
          </button>
        </div>

        <div className="login_footer">
          <b className="login_error">{errormsg}</b>
          <button onClick={handlesubmission}>Login</button>
          <p className="login_p">
            Create an account?{" "}
            <span>
              <Link href="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
