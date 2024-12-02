// src/services/cmsService.js
import axios from "axios";
import { toast } from "react-toastify";

const cloud = process.env.NEXT_PUBLIC_CLOUD_VERSION;

const formatBucketName = (bucketName, cloud) => {
  console.log(bucketName);
  if (cloud === "azure") {
    console.log(bucketName.replace(/_/g, "-"));
    return bucketName.replace(/_/g, "-"); // Replace underscores with hyphens
  }
  return bucketName; // No change if it's not Azure
};

// Define the deleteItem function
const deleteItem = async (
  bucketName,
  filePath,
  currentPath,
  fetchItems,
  setShowDeleteConfirm,
) => {
  try {
    const response = await axios.delete(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/delete-item?cloud=${cloud}`,
      {
        data: {
          bucketName,
          filePath,
        },
      },
    );

    if (response.status === 200) {
      toast.info(`Deleted item: ${filePath}`);
      fetchItems(currentPath); // Refresh the list after deletion
    } else {
      toast.error(
        "Error deleting item: " + (response.data.message || "Unknown error"),
      );
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    setShowDeleteConfirm(false); // Close the confirmation modal
  }
};

//Create folder API
const createFolder = async (
  bucketName,
  folderName,
  folderPath,
  fetchItems,
  handleClose,
) => {
  if (!folderName) return;

  try {
    const response = await axios.post(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/create-folder?cloud=${cloud}`,
      {
        bucketName,
        folderName,
        folderPath,
      },
    );

    if (response.data.success) {
      toast.success("Folder created successfully");
      fetchItems(folderPath); // Refresh the list after creation
      handleClose(); // Close modal after successful creation
    } else {
      toast.error("Error creating folder: " + response.data.message);
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    toast.error("Error creating folder: " + error.message);
  }
};

// Rename Item API
const renameItem = async (
  bucketName,
  oldFilePath,
  newFilePath,
  currentPath,
  fetchItems,
  setShowRenameModal,
  isCombined = false, // Add `isCombined` with a default value of false
) => {
  try {
    // Construct the base URL with the `cloud` query parameter
    let apiUrl = `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/edit-item?cloud=${cloud}`;

    // Append `combined=true` if `isCombined` is true
    if (isCombined) {
      apiUrl += "&combined=true";
    }

    const response = await axios.post(apiUrl, {
      bucketName,
      oldFilePath,
      newFilePath,
    });

    if (response.status === 200) {
      toast.info(`File renamed to ${newFilePath}`);
      fetchItems(currentPath); // Refresh the list after renaming
    } else {
      console.error(
        "Error renaming file: " + (response.data.message || "Unknown error"),
      );
    }
  } catch (error) {
    console.error("Error renaming file:", error);
    toast.error("Error renaming file: " + error.message);
  } finally {
    setShowRenameModal(false); // Close the modal after submission
  }
};

// Define the fetchItems function
const fetchItems = async (bucketName, path, setItems, setLoading) => {
  setLoading(true);

  try {
    const response = await axios.get(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/list-folder/${bucketName}?folderPath=${path}&cloud=${cloud}`,
    );
    setItems(response.data.data);
  } catch (error) {
    console.error("Fetch items error:", error);
  } finally {
    setLoading(false);
  }
};

// Download File API
const downloadFile = async (bucketName, filePath) => {
  try {
    // Send GET request to the download API
    const response = await axios.get(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/download-file?cloud=${cloud}`,
      {
        params: {
          bucketName: bucketName,
          filePath: filePath,
        },
        responseType: "blob", // Important for handling file downloads
      },
    );

    // Generate a download URL for the blob
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link element for triggering download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filePath.split("/").pop()); // Set file name

    // Append to body, trigger download, then clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// Edit Content
const editContent = async (bucketName, filePath, newContent, setEditModal) => {
  try {
    setEditModal(false); // Close the modal

    const data = {
      bucketName: bucketName,
      filePath: filePath,
      newContent: newContent,
    };

    // Send PUT request to update the file content
    const res = await axios.put(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/edit-content?cloud=${cloud}`,
      data,
    );

    toast.success(res.data);
  } catch (error) {
    console.error("Error updating file content:", error);
    toast.error("Error updating file content: " + error.message);
  }
};

const createOrUpdateFile = async (
  bucketName,
  currentPath,
  newFile,
  fetchItems,
  handleNewFileChange,
) => {
  try {
    // Construct the file path by combining currentPath and newFile.name
    const filePath = `${currentPath}${newFile.name}`;

    // Prepare the data for the API request
    const data = {
      bucketName: bucketName,
      filePath: filePath,
      newContent: newFile.content,
    };

    // Make the PUT request to the API to create or update the file
    const response = await axios.put(
      `https://us-central1-onboarding-bot-14200.cloudfunctions.net/expressApi/cms/edit-content?cloud=${cloud}`,
      data,
    );

    // Handle success response
    if (response.status === 201) {
      toast.success(`File ${newFile.name} created successfully.`);
    } else if (response.status === 200) {
      toast.success(`File ${newFile.name} updated successfully.`);
    }

    // Fetch updated items
    await fetchItems(currentPath);

    // Return success status
    return response.status;
  } catch (error) {
    console.error("Error creating or updating file:", error);
    toast.error("Error creating or updating file: " + error.message);
    throw error; // Rethrow the error for further handling if needed
  }
};

const checkCmsAccess = (fetchedBuckets, siteBucket, setCmsPath) => {
  if (
    siteBucket !== "" &&
    fetchedBuckets.some((bucket) => bucket.name === siteBucket)
  ) {
    setCmsPath(true);
  } else {
    setCmsPath(false);
  }
};

// Export cms object with both deleteItem and fetchItems functions
const cms = {
  formatBucketName,
  deleteItem,
  fetchItems,
  createFolder,
  renameItem,
  downloadFile,
  editContent,
  createOrUpdateFile,
  checkCmsAccess,
};

export default cms;
