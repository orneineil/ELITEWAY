import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { PartnerAuthProvider } from "./contexts/PartnerAuthContext";
import { ClientAuthProvider } from "./contexts/ClientAuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AIAssistant } from "./components/AIAssistant";

export function Root() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <ClientAuthProvider>
      <PartnerAuthProvider>
        <NotificationsProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className={isHome ? "pt-0" : "pt-14"}>
              <Outlet />
            </main>

            <AIAssistant />
            <BottomNav />
            <ScrollRestoration />
          </div>
        </FavoritesProvider>
        </NotificationsProvider>
      </PartnerAuthProvider>
    </ClientAuthProvider>
  );
}
