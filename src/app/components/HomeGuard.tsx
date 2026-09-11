import { Navigate } from "react-router";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { Home } from "../pages/Home";

export function HomeGuard() {
  const { isAuthenticated } = useClientAuth();

  const splashShown = sessionStorage.getItem("eliteway-splash-shown");
  if (!splashShown) {
    return <Navigate to="/splash" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Home />;
}
