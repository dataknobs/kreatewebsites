// src/services/websiteService.js

import { SessionContext } from "@/app/SessionContext";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";

const submitPrompt = async (formData, endpoint) => {
  try {
    const apiUrl =
      formData.get("cloud") === "AZURE"
        ? `https://bucket-next.azurewebsites.net/${endpoint}`
        : `https://test-apis-new-315740774339.us-central1.run.app/${endpoint}`;

    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Prompt submitted successfully!");
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting prompt:", error);
    toast.error(
      "Error submitting prompt: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const submitArticle = async (formData) => {
  // Determine the appropriate API endpoint based on the 'cloud' value
  const apiUrl =
    formData.get("cloud") === "AZURE"
      ? "https://bucket-next.azurewebsites.net/articles"
      : "https://test-apis-new-315740774339.us-central1.run.app/articles";

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Article submitted successfully!");
    console.log(response.data);
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting article:", error);
    toast.error(
      "Error submitting article: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const submitPromptUsingCsv = async (formData) => {
  const apiUrl =
    formData.get("cloud") === "AZURE"
      ? "https://bucket-next.azurewebsites.net/fileprompt"
      : "https://test-apis-new-315740774339.us-central1.run.app/fileprompt";

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Article submitted successfully!");
    console.log(response.data);
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting article:", error);
    toast.error(
      "Error submitting article: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const submitSlides = async (formData) => {
  const apiUrl =
    formData.get("cloud") === "AZURE"
      ? "https://bucket-next.azurewebsites.net/url_generate_theme_presentation"
      : "https://test-apis-new-315740774339.us-central1.run.app/url_generate_theme_presentation";

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Article submitted successfully!");
    console.log(response.data);
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting article:", error);
    toast.error(
      "Error submitting article: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const submitSlidesUsingCsv = async (formData) => {
  const apiUrl =
    formData.get("cloud") === "AZURE"
      ? "https://bucket-next.azurewebsites.net/file_generate_presentation"
      : "https://test-apis-new-315740774339.us-central1.run.app/file_generate_presentation";

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Article submitted successfully!");
    console.log(response.data);
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting article:", error);
    toast.error(
      "Error submitting article: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const submitPortfolio = async (formData) => {
  try {
    const response = await axios.post(
      "https://build-portfolio-vtoo6mbt4q-uc.a.run.app/resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    toast.success("Portfolio generated successfully");
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting file:", error);
    toast.error(
      "Error submitting file: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const uploadFile = async (formData) => {
  try {
    const response = await axios.post(
      "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    toast.success("File uploaded successfully!");
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting file:", error.message);
    toast.error(
      "Error uploading file: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const uploadGdrive = async (formData) => {
  try {
    const response = await axios.post(
      "https://gdrive2-api-315740774339.us-central1.run.app/gdrive",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    toast.success("Google drive link submitted");
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting file:", error);
    toast.error(
      "Error uploading file: " +
        (error.response ? error.response.data.message : error.message),
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const fetchToken = async (cloud) => {
  try {
    let url = "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/jwt";
    if (cloud === "azure") {
      url = "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/azjwt";
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    // Handle error (e.g., display a message to the user)
  }
};

const websiteService = {
  submitPrompt,
  submitArticle,
  submitPromptUsingCsv,
  submitSlides,
  submitSlidesUsingCsv,
  submitPortfolio,
  uploadFile,
  uploadGdrive,
  fetchToken,
};

export default websiteService;
