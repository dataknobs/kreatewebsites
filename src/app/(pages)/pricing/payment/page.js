"use client";
import { useContext, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/checkoutForm";
import { SessionContext } from "@/app/SessionContext";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

function StripePayment() {
  const [clientSecret, setClientSecret] = useState("");
  const { user, loader } = useContext(SessionContext);
  const router = useRouter();

  useEffect(() => {
    if (loader) {
      return;
    } else if (!loader && !user) {
      router.push("/login?page=pricing/payment");
    }
  }, [user, loader]);

  let pricingPlan;
  let amount;
  let key;
  let type;
  if (typeof window !== "undefined") {
    pricingPlan = localStorage.getItem("plan");
    amount = localStorage.getItem("planPrice");
    key = localStorage.getItem("planKey");
    type = localStorage.getItem("planType");
  }

  useEffect(() => {
    fetch(
      "https://us-central1-kreate-stripe-api.cloudfunctions.net/api/stripe/create-payment-intent",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: key,
          secretKey: `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`,
        }),
      },
    )
      .then(async (result) => {
        if (!result.ok) {
          console.log("assistant payment plan failed");
          const errorText = await result.text(); // Get the response text
          throw new Error(`API call failed: ${errorText}`);
        }
        var { clientSecret } = await result.json();
        setClientSecret(clientSecret);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      {user && (
        <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
          <h4>
            Selected price plan : {pricingPlan} ({type})
          </h4>
          <h4>Amount : {amount}</h4>
          {clientSecret && (
            <Elements
              stripe={loadStripe(
                `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
              )}
              options={{ clientSecret }}
            >
              <CheckoutForm pricingPlan={pricingPlan} type={type} />
            </Elements>
          )}
        </div>
      )}
    </>
  );
}

export default StripePayment;
