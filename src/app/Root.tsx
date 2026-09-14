import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Mail, Phone } from "lucide-react";
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

            {/* ── Footer léger : identité + contact ─────────────────────── */}
            <footer className="border-t border-border/30 pt-10 pb-10 mt-16">
              <div className="max-w-lg mx-auto px-5">
                <div className="flex flex-col items-center text-center mb-8">
                  <LogoFull markSize={32} className="mb-2.5" />
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    La plateforme des expériences haut de gamme — gastronomie, navigation,
                    bien-être, aviation et bien plus.
                  </p>
                </div>

                <div className="pt-8 border-t border-border/30 text-center">
                  <p className="text-sm mb-1">Vous souhaitez nous contacter ?</p>
                  <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto leading-relaxed">
                    Notre équipe est à votre écoute pour toute question sur vos expériences
                    ou votre compte.
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <a href="mailto:support@eliteway.fr" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Mail className="w-3.5 h-3.5" /> support@eliteway.fr
                    </a>
                    <a href="tel:+33100000000" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Phone className="w-3.5 h-3.5" /> +33 1 00 00 00 00
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-center gap-5 flex-wrap">
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
