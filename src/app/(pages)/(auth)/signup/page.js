"use client";
import React, { useContext, useState } from "react";
import { Suspense } from "react";
import "./style.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import Link from "next/link";
import InputControl from "@/components/inputController";
import { SessionContext } from "@/app/SessionContext";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const { loginredirect } = useContext(SessionContext);
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errormsg, setErrormsg] = useState("");
  const searchParam = useSearchParams();
  const user_id = searchParam.get("user_id");

  const handlesubmission = async () => {
    if (!value.name || !value.email || !value.password) {
      setErrormsg("Fill in all fields");
    } else {
      try {
        // Create a new user with email and password
        const res = await createUserWithEmailAndPassword(
          auth,
          value.email,
          value.password,
        );
        const user = res.user;

        // Update user profile with the display name
        await updateProfile(user, {
          displayName: value.name,
        });

        // Create a user data object to store in Firestore
        const userData = {
          uid: user.uid, // Firebase UID
          name: value.name,
          email: value.email,
          credits: 0,
        };

        // If user_id exists in the URL, add it to the userData object
        if (user_id) {
          userData.user_id = user_id;
        }

        // Save the user details to the 'userdata' collection
        await addDoc(collection(db, "userdata"), userData);

        // Approve the user account if user_id exists
        if (user_id) {
          const response = await fetch(
            "https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/approve-account",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_id }),
            },
          );

          const data = await response.json();

          if (response.ok) {
            // Show the response in an alert if the request was successful
            console.log("Signup approved");
          } else {
            // Show the error message if the request failed
            console.log(
              "Failed to approve account. Error: " +
                (data.message || response.statusText),
            );
          }
        }

        // Clear the form
        setValue({
          name: "",
          email: "",
          password: "",
        });

        // Redirect to the desired page
        router.push(loginredirect || "/");
      } catch (error) {
        setErrormsg(error.message);

        if (error.code === "auth/email-already-in-use") {
          setErrormsg(
            "An account with this email already exists. Please log in instead.",
          );
        }
      }
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Reference to the 'userdata' collection
      const userdataRef = collection(db, "userdata");

      // Query to check if the user already exists in the 'userdata' collection by email
      const userQuery = query(userdataRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(userQuery);

      // If an entry exists
      if (!querySnapshot.empty) {
        // Get the existing document
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();

        // If user_id is already present, no further action needed
        if (existingData.user_id) {
          router.push(loginredirect || "/");
          return;
        }

        // If user_id is missing, update the document with the user_id
        if (user_id) {
          await updateDoc(doc(db, "userdata", existingDoc.id), { user_id });
        }
      } else {
        // Create a new user data object
        const userData = {
          uid: user.uid, // Firebase UID
          name: user.displayName || "Anonymous", // Use displayName or fallback to "Anonymous"
          email: user.email,
          credits: 0, // Initial credits or any other initial data you want
          ...(user_id && { user_id }), // Conditionally add user_id if it exists
        };

        // Save the new user details to the 'userdata' collection
        await addDoc(userdataRef, userData);
      }

      // Redirect to the desired page
      router.push(loginredirect || "/");
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setErrormsg("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <Suspense>
      <div className="signup_container">
        <div className="signup_innerBox">
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
          <h3 className="signup_heading">Sign Up</h3>
          <InputControl
            type="text"
            label="Name:"
            placeholder="Enter your Name"
            onChange={(e) =>
              setValue((prev) => ({ ...prev, name: e.target.value }))
            }
            value={value.name}
          />
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

          <div className="signup_footer">
            <b className="signup_error">{errormsg}</b>
            <button onClick={handlesubmission} className="signup_button">
              Sign Up
            </button>
            <div className="signup_divider">or</div>
            <button onClick={signInWithGoogle} className="signup_google_button">
              <i className="fab fa-google"></i> Sign Up with Google
            </button>
            <p className="signup_p">
              Already have an account?{" "}
              <span>
                <Link href="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

// export default Signup;

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Signup />
    </Suspense>
  );
}
