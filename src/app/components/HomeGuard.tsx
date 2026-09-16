import { Navigate } from "react-router";
import { Home } from "../pages/Home";

// L'accueil reste l'accueil pour tout le monde, connecté ou non — comme
// dans la plupart des applications, l'espace personnel se trouve dans
// l'onglet Profil plutôt que de remplacer la page d'accueil à la connexion.
export function HomeGuard() {
  const splashShown = sessionStorage.getItem("eliteway-splash-shown");
  if (!splashShown) {
    return <Navigate to="/splash" replace />;
  }

  return <Home />;
}
