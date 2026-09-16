import { Navigate } from "react-router";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { Home } from "../pages/Home";

export function HomeGuard() {
  const { isAuthenticated, isLoading } = useClientAuth();

  const splashShown = sessionStorage.getItem("eliteway-splash-shown");
  if (!splashShown) {
    return <Navigate to="/splash" replace />;
  }

  // Le temps que Supabase confirme si une session est déjà ouverte, on
  // affiche l'accueil tel quel plutôt qu'un aller-retour visible vers le
  // tableau de bord.
  if (isLoading) {
    return <Home />;
  }

  if (isAuthenticated) {
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Home />;
}
