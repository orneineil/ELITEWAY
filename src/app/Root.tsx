import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { LogoFull } from "./components/LogoMark";
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

            {/* ── Footer léger : identité + liens ────────────────────────── */}
            <footer className="border-t border-border/30 pt-8 pb-8 mt-12">
              <div className="max-w-lg mx-auto px-5">
                <div className="flex flex-col items-center text-center mb-6">
                  <LogoFull markSize={28} className="mb-2" />
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    La plateforme des expériences haut de gamme — gastronomie, navigation,
                    bien-être, aviation et bien plus.
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <Link to="/contact" className="text-xs text-primary hover:underline">
                    Nous contacter →
                  </Link>
                </div>

                <div className="pt-5 border-t border-border/30 flex items-center justify-center gap-5 flex-wrap">
                  <Link to="/mentions-legales" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                    Mentions légales
                  </Link>
                  <Link to="/confidentialite" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                    Confidentialité
                  </Link>
                  <Link to="/cgu" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                    CGU
                  </Link>
                </div>
                <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
                  © 2026 EliteWay SAS · Paris, France
                </p>
              </div>
            </footer>

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
