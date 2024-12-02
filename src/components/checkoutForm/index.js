"use client";
import { PaymentElement } from "@stripe/react-stripe-js";
import React, { useContext, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebase";
import { SessionContext } from "@/app/SessionContext";

export default function CheckoutForm(props) {
  const { user, fetchDomainData, fetchCmsBuckets } = useContext(SessionContext);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [type, setType] = useState("Default");

  const handleBuyCms = async (paymentIntent) => {
    const cmsCollectionRef = collection(db, "cms"); // Reference to the CMS table
    const cmsQuery = query(
      cmsCollectionRef,
      where("allotted", "==", false),
      limit(1),
    );

    const cmsSnapshot = await getDocs(cmsQuery);
    const allocatedCmsDoc = cmsSnapshot.docs[0];

    if (!cmsSnapshot.empty) {
      const allocatedCmsData = allocatedCmsDoc.data();

      await updateDoc(doc(db, "cms", allocatedCmsDoc.id), {
        allotted: true,
      });

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const subscriptionInfo = {
        start_period: new Date().toISOString(),
        end_period: endDate.toISOString(),
        transaction_id: paymentIntent.id,
        payment_method: paymentIntent.payment_method,
        plan: props.pricingPlan,
        users: [user.email],
        owner: user.email,
        type: props.type, // Assuming type is still relevant here
      };

      // Add subscriptionInfo to the CMS document
      await updateDoc(doc(db, "cms", allocatedCmsDoc.id), {
        subscriptionInfo: subscriptionInfo,
      });

      toast.info(
        `Allotted container: ${allocatedCmsData.bucketName || allocatedCmsDoc.id}`,
      );
      await fetchCmsBuckets(user.email);
      router.push("/cms-dashboard");
    } else {
      toast.error(
        "No bucket available to allot. Contact support to get a new bucket.",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success(`Successfully subscribed to plan ${props.pricingPlan}`);

      if (props.type == "websites") {
        // Allocate a URL to the user
        const domainsCollectionRef = collection(db, "domains");
        const domainsQuery = query(
          domainsCollectionRef,
          where("allotted", "==", false),
          where("type", "==", type),
          limit(1),
        );

        const domainsSnapshot = await getDocs(domainsQuery);
        const allocatedDomainDoc = domainsSnapshot.docs[0];

        if (!domainsSnapshot.empty) {
          await updateDoc(doc(db, "domains", allocatedDomainDoc.id), {
            allotted: true,
          });

          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          const subscriptionInfo = {
            start_period: new Date().toISOString(),
            end_period: endDate.toISOString(),
            transaction_id: paymentIntent.id,
            payment_method: paymentIntent.payment_method,
            plan: props.pricingPlan,
            url: allocatedDomainDoc.data().domain,
            github_repository: "",
            gdrive: "",
            holders: [user.email],
            owner: user.email,
            subscription: true,
            domain_id: allocatedDomainDoc.id,
            type: type,
            product_type: "websites", // options: websites, datasets, bots
          };

          // Add subscriptionInfo to the domain document
          await updateDoc(doc(db, "domains", allocatedDomainDoc.id), {
            subscriptionInfo: subscriptionInfo,
          });

          await toast.success(`Allotted: ${allocatedDomainDoc.data().domain}`);
          await fetchDomainData(user.email);
          router.push("/websites");
        } else {
          toast.error(
            "No available domains to allot. Please mail us and our team will get back to you with the desired domain allotted",
          );
          setMessage("No available domains to allot.");
          setIsProcessing(false);
          return;
        }
      } else if (props.type == "cms") {
        handleBuyCms(paymentIntent);
      }
    } else {
      toast.error(`An unexpected error occurred. Please try again later`);
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />

      {/*Input for selecting a site type */}
      <div className="mt-2">
        <label htmlFor="typeSelect" className="mb-1 d-block">
          Site Type
        </label>
        <select
          id="typeSelect"
          className="form-select"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="Default">Default</option>
          <option value=".Net">.Net</option>
          <option value="Node">Node</option>
          <option value="Wordpress">Wordpress</option>
        </select>
      </div>

      <div className="text-center mt-2">
        <button
          disabled={isProcessing || !stripe || !elements}
          id="submit"
          className="btn btn-primary"
        >
          <span id="button-text">
            {isProcessing ? "Processing ... " : "Pay now"}
          </span>
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="bg-danger text-white">
          {message}
        </div>
      )}
    </form>
  );
}
