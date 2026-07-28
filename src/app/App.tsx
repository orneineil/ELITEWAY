import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Redirect to splash on every fresh app open
    const lastSplash = sessionStorage.getItem("eliteway-splash-shown");
    if (!lastSplash) {
      sessionStorage.setItem("eliteway-splash-shown", "1");
      if (window.location.pathname === "/") {
        window.location.replace("/splash");
      }
    }
  }, []);

  return <RouterProvider router={router} />;
}