"use client";
import React, { useState, useEffect, useContext, Suspense } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Button, Modal, Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPlus,
  FaTrash,
  FaUserPlus,
  FaToggleOn,
  FaToggleOff,
  FaEye,
} from "react-icons/fa";
import "./admin-dashboard.css"; // Custom CSS for enhanced styling
import Header from "@/components/header";
import { toast } from "react-toastify";
import Footer from "@/components/footer";
import { SessionContext } from "@/app/SessionContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

const AdminDashboard = () => {
  const { superAdmin, loader } = useContext(SessionContext);
  const router = useRouter();
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [newBucketName, setNewBucketName] = useState("");
  const [newBucketCloud, setNewBucketCloud] = useState("gcp");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const cmsCollectionRef = collection(db, "cms");

  useEffect(() => {
    if (!loader && superAdmin) {
      fetchBuckets();
    } else if (!loader && !superAdmin) {
      router.push("/error-page");
    }
  }, [loader, superAdmin]);

  // Fetch all buckets from Firestore
  const fetchBuckets = async () => {
    const q = query(cmsCollectionRef);
    const querySnapshot = await getDocs(q);
    const fetchedBuckets = querySnapshot.docs.map((doc) => ({
      name: doc.id, // Assuming document ID is the bucket name
      ...doc.data(),
    }));
    setBuckets(fetchedBuckets);
  };

  useEffect(() => {
    fetchBuckets(); // Fetch buckets on component load
  }, []);

  // Open modal for adding new bucket
  const handleAddBucket = () => {
    setShowModal(true);
  };

  // Create new bucket
  const handleCreateBucket = async () => {
    if (!newBucketName.trim()) return; // Prevent creating a bucket with an empty name

    try {
      const newBucketRef = doc(db, "cms", newBucketName);
      await setDoc(newBucketRef, {
        allotted: false,
        cloud: newBucketCloud,
      });
      setShowModal(false);
      setNewBucketName("");
      fetchBuckets();
      toast.success("Bucket created successfully!"); // Show success message
    } catch (error) {
      console.error("Error creating bucket: ", error);
      toast.error("Failed to create bucket. Please try again."); // Show error message
    }
  };

  // Add user to a bucket
  const handleAddUser = async () => {
    if (!newUserEmail.trim()) return; // Prevent adding an empty user email
    const bucketRef = doc(db, "cms", selectedBucket);

    try {
      // Find the bucket data from the local state
      const bucketData = buckets.find(
        (bucket) => bucket.name === selectedBucket,
      );
      const subscriptionInfo = bucketData.subscriptionInfo || {}; // Handle missing subscriptionInfo gracefully
      const updatedUsers = [...(subscriptionInfo.users || []), newUserEmail]; // Update the users array

      // Update the Firestore document's subscriptionInfo field
      await updateDoc(bucketRef, {
        "subscriptionInfo.users": updatedUsers,
      });

      setNewUserEmail(""); // Clear the input field
      fetchBuckets(); // Refresh after updating
      setSelectedUsers(updatedUsers); // Update the modal users list immediately
      toast.success("User added successfully!"); // Show success message
    } catch (error) {
      console.error("Error adding user: ", error);
      toast.error("Failed to add user. Please try again."); // Show error message
    }
  };

  // Delete a user from the bucket
  const handleDeleteUser = async (bucketName, userEmail) => {
    const bucketRef = doc(db, "cms", bucketName);

    try {
      // Find the bucket data from the local state
      const bucketData = buckets.find((bucket) => bucket.name === bucketName);
      const subscriptionInfo = bucketData.subscriptionInfo || {}; // Handle missing subscriptionInfo gracefully

      // Filter out the user to be deleted
      const updatedUsers = (subscriptionInfo.users || []).filter(
        (user) => user !== userEmail,
      );

      // Update the Firestore document's subscriptionInfo field
      await updateDoc(bucketRef, {
        "subscriptionInfo.users": updatedUsers,
      });

      fetchBuckets(); // Refresh after updating
      setSelectedUsers(updatedUsers); // Update the modal users list immediately
      toast.success("User deleted successfully!"); // Show success message
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Failed to delete user. Please try again."); // Show error message
    }
  };

  // Toggle the allotted field for a bucket
  const handleToggleAllotted = async (bucketName, currentAllotted) => {
    const bucketRef = doc(db, "cms", bucketName);

    try {
      await updateDoc(bucketRef, { allotted: !currentAllotted });
      fetchBuckets(); // Refresh after updating
      toast.success("Bucket status updated successfully!"); // Show success message
    } catch (error) {
      console.error("Error toggling allotted status: ", error);
      toast.error("Failed to update bucket status. Please try again."); // Show error message
    }
  };

  // Delete a bucket
  const handleDeleteBucket = async (bucketName) => {
    const bucketRef = doc(db, "cms", bucketName);

    try {
      await deleteDoc(bucketRef);
      fetchBuckets(); // Refresh after deleting
      toast.success("Bucket deleted successfully!"); // Show success message
    } catch (error) {
      console.error("Error deleting bucket: ", error);
      toast.error("Failed to delete bucket. Please try again."); // Show error message
    }
  };

  // View users in a modal
  const handleViewUsers = (bucketName, users) => {
    setSelectedBucket(bucketName);
    setSelectedUsers(users);
    setShowUsersModal(true);
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <Header customBg="light-blue" />
      <div
        className="admin-dashboard-container container mt-5"
        style={{ minHeight: "90vh" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div className="d-flex">
            <h4 className="text-uppercase font-weight-bold text-dark">
              Admin Dashboard
            </h4>
          </div>
        </div>
        {superAdmin && (
          <>
            {" "}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="success"
                onClick={handleAddBucket}
                className="btn-md"
              >
                <FaPlus className="me-2" /> Add New Bucket
              </Button>
            </div>
            {/* Card-based layout for buckets */}
            <Row>
              {buckets.map((bucket) => (
                <Col lg={6} key={bucket.name}>
                  <Card
                    className="mb-4 shadow-lg"
                    style={{ borderRadius: "12px", borderColor: "#f0f0f5" }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title className="display-8">
                          {bucket.name}
                        </Card.Title>
                        <Button
                          variant={bucket.allotted ? "primary" : "secondary"}
                          onClick={() =>
                            handleToggleAllotted(bucket.name, bucket.allotted)
                          }
                        >
                          {bucket.allotted ? (
                            <FaToggleOn className="me-1" />
                          ) : (
                            <FaToggleOff className="me-1" />
                          )}
                          {bucket.allotted ? "Allotted" : "Not Allotted"}
                        </Button>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        {/* View Users Button */}
                        <Button
                          variant="info"
                          onClick={() =>
                            handleViewUsers(
                              bucket.name,
                              bucket.subscriptionInfo?.users || [],
                            )
                          }
                        >
                          <FaEye className="me-2" /> View Users
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDeleteBucket(bucket.name)}
                        >
                          <FaTrash className="me-2" /> Delete Bucket
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Modal for Adding a New Bucket */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add New Bucket</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Enter Bucket ID"
                      value={newBucketName}
                      onChange={(e) => setNewBucketName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Select Cloud</Form.Label>
                    <Form.Select
                      value={newBucketCloud} // Variable to track the selected cloud
                      onChange={(e) => setNewBucketCloud(e.target.value)} // Update state on change
                    >
                      <option value="gcp">gcp</option>
                      <option value="azure">azure</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleCreateBucket}>
                  Create Bucket
                </Button>
              </Modal.Footer>
            </Modal>
            {/* Modal for Viewing Users */}
            <Modal
              show={showUsersModal}
              onHide={() => setShowUsersModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Users List</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Form.Group className="mb-3">
                  <Form.Label>Add User</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter user email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                  <Button
                    className="mt-2"
                    variant="success"
                    onClick={handleAddUser}
                  >
                    <FaUserPlus className="me-2" /> Add User
                  </Button>
                </Form.Group>
                <hr />
                {selectedUsers.length > 0 ? (
                  <ul className="list-group">
                    {selectedUsers.map((user, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {user}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(selectedBucket, user)}
                        >
                          <FaTrash />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No users found.</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowUsersModal(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}
