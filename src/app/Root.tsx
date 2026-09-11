import { Link, Outlet, ScrollRestoration } from "react-router";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { LogoFull } from "./components/LogoMark";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { PartnerAuthProvider } from "./contexts/PartnerAuthContext";
import { ClientAuthProvider } from "./contexts/ClientAuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AIAssistant } from "./components/AIAssistant";

export function Root() {
  return (
    <ClientAuthProvider>
      <PartnerAuthProvider>
        <NotificationsProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-14">
              <Outlet />
            </main>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="border-t border-border/40 pt-12 pb-32 mt-24">
              <div className="max-w-lg mx-auto px-5">

                {/* Logo + tagline */}
                <div className="flex flex-col items-center text-center mb-16">
                  <LogoFull markSize={40} className="mb-3" />
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    La plateforme des expériences haut de gamme — gastronomie, navigation,
                    bien-être, aviation et bien plus.
                  </p>
                </div>

                {/* Links grid */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Catégories</p>
                    <ul className="space-y-2.5 text-sm">
                      {[
                        ["Gastronomie",       "/category/gastronomie"],
                        ["Navigation",        "/category/navigation"],
                        ["Bien-être",         "/category/bien-etre"],
                        ["Aviation",          "/category/aviation"],
                        ["Œnologie",          "/category/oenologie"],
                        ["Offres Exclusives", "/category/offres-exclusives"],
                      ].map(([label, href]) => (
                        <li key={label}>
                          <Link to={href} className="text-muted-foreground hover:text-primary transition-colors">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">EliteWay</p>
                    <ul className="space-y-2.5 text-sm">
                      {[
                        ["Notre Histoire",    "/about"],
                        ["Membership",        "/membership"],
                        ["Mon compte",        "/profile"],
                        ["Espace Partenaire", "/partner/login"],
                        ["Événements",        "/category/evenements"],
                        ["Contact",           "mailto:contact@eliteway.fr"],
                      ].map(([label, href]) => (
                        <li key={label}>
                          {href.startsWith("mailto:") ? (
                            <a href={href} className="text-muted-foreground hover:text-primary transition-colors">
                              {label}
                            </a>
                          ) : (
                            <Link to={href} className="text-muted-foreground hover:text-primary transition-colors">
                              {label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/40 pt-6">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    © 2026 EliteWay SAS · Paris, France
                  </p>
                  {/* Legal links */}
                  <div className="flex items-center justify-center gap-5 flex-wrap">
                    {[
                      ["Mentions légales",       "/mentions-legales"],
                      ["Confidentialité",         "/confidentialite"],
                      ["CGU",                     "/cgu"],
                    ].map(([label, href]) => (
                      <Link
                        key={label}
                        to={href}
                        className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

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
