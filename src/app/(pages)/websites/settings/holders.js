import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "@/app/firebase";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";

function Holders({ user, domainData, holders, setHolders }) {
  const [loading, setLoading] = useState(false);
  const [newHolderEmail, setNewHolderEmail] = useState("");

  // Add new holder
  const handleAddHolder = async () => {
    if (user.email !== domainData.owner) {
      return toast.error("Only the owner can add sub-holders.");
    }

    if (!newHolderEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return toast.warn("Invalid email format.");
    }

    if (holders.includes(newHolderEmail)) {
      return toast.info("Email already exists in sub-holders.");
    }

    setLoading(true);
    try {
      const domainsRef = collection(db, "domains");
      const domainQuery = query(
        domainsRef,
        where("subscriptionInfo.url", "==", domainData.url),
      );
      const snapshot = await getDocs(domainQuery);

      if (!snapshot.empty) {
        const domainDoc = snapshot.docs[0];
        const updatedHolders = [...holders, newHolderEmail];

        await updateDoc(doc(db, "domains", domainDoc.id), {
          "subscriptionInfo.holders": updatedHolders,
        });

        setHolders(updatedHolders);
        setNewHolderEmail("");
        toast.success("Holder added successfully!");
      } else {
        toast.error("Domain not found.");
      }
    } catch (error) {
      console.error("Error adding holder:", error);
      toast.error("Failed to add holder. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Remove holder
  const handleRemoveHolder = async (holderToRemove) => {
    if (user.email !== domainData.owner) {
      return toast.error("Only the owner can remove sub-holders.");
    }

    setLoading(true);
    try {
      const domainsRef = collection(db, "domains");
      const domainQuery = query(
        domainsRef,
        where("subscriptionInfo.url", "==", domainData.url),
      );
      const snapshot = await getDocs(domainQuery);

      if (!snapshot.empty) {
        const domainDoc = snapshot.docs[0];
        const updatedHolders = holders.filter(
          (holder) => holder !== holderToRemove,
        );

        await updateDoc(doc(db, "domains", domainDoc.id), {
          "subscriptionInfo.holders": updatedHolders,
        });

        setHolders(updatedHolders);
        toast.success(`Holder removed: ${holderToRemove}`);
      } else {
        toast.error("Domain not found.");
      }
    } catch (error) {
      console.error("Error removing holder:", error);
      toast.error("Failed to remove holder. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
      <div className="service-item d-flex flex-column justify-content-center  align-items-center text-center rounded">
        <div className="service-icon btn-square">
          <i className="fa fa-users fa-2x"></i>
        </div>
        <h5 className="mb-3">Team Members</h5>
        <ul className="list-group list-group-flush">
          {holders.map((holder, index) => (
            <li
              key={index}
              className="d-flex align-items-center justify-content-between"
            >
              <p>{holder}</p>
              {user.email === domainData.owner && (
                <a
                  className="btn mb-3 ms-1"
                  onClick={() => handleRemoveHolder(holder)}
                >
                  <i className="bi bi-trash-fill fs-9"></i>
                </a>
              )}
            </li>
          ))}
        </ul>

        {user.email === domainData.owner && (
          <div className="d-flex flex-column justify-content-center =align-items-center">
            <input
              type="email"
              placeholder="Add new holder email"
              value={newHolderEmail}
              onChange={(e) => setNewHolderEmail(e.target.value)}
              className="form-control mb-3"
            />
            <a
              className="btn px-3 mt-auto mx-auto"
              onClick={handleAddHolder}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Holder"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Holders;
