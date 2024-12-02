import React from "react";
import Themes from ".";

export async function generateMetadata({ params }) {
  try {
    const response = await fetch(
      "https://us-central1-kreate-stripe-api.cloudfunctions.net/api/meta-content",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const fetchedData = await response.json();

    return {
      title: fetchedData.themes.title,
      keywords: fetchedData.themes.keywords,
      description: fetchedData.themes.description,
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      title: "Kreate-Websites",
      keywords: "",
      description: "",
    };
  }
}

const ThemeLayout = () => {
  return (
    <>
      <Themes />
    </>
  );
};

export default ThemeLayout;
