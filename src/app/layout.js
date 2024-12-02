import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "./SessionContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kreate Websites - AI-Powered Website Builder",
  description:
    "Kreate Websites revolutionizes website creation with no-code and low-code solutions powered by AI. Build, design, and manage your websites effortlessly. From content generation to deployment, experience an all-in-one platform for professional, scalable, and user-friendly digital experiences.",
  keywords:
    "AI website builder, no-code website creation, low-code platforms, Kreate Websites, AI-powered web design, content management, website generation, all-in-one website platform, digital solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta
          name="google-site-verification"
          content="ODSpfX1caJ4awwyHyDH_5dRT9Dhk3RZR-rXIT4LPsGQ"
        />
        <link
          rel="icon"
          href="https://storage.googleapis.com/json_articles/dataknobs-logo-2.jpg"
        />

        <link rel="preconnect" href="https://fonts.apis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/animate/animate.min.css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/owlcarousel/assets/owl.carousel.min.css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/kreatewebsites/sites/site103/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/kreatewebsites/sites/site103/css/style.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/wow/wow.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/easing/easing.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/waypoints/waypoints.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/counterup/counterup.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/lib/owlcarousel/owl.carousel.min.js"></script>
        <script src="https://storage.googleapis.com/kreatewebsites/sites/site103/js/main.js"></script>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
