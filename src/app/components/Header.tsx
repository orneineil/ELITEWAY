import {
  Menu, Bell, X,
  UtensilsCrossed, BedDouble, Sailboat, Flower2, Plane, Wine, CalendarDays, Gem, Trophy,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { LogoMark } from "./LogoMark";
import { useNotifications } from "../contexts/NotificationsContext";

const MENU_CATEGORIES = [
  { id: "gastronomie",       name: "Gastronomie",       icon: UtensilsCrossed },
  { id: "hotels",            name: "Hôtels",            icon: BedDouble },
  { id: "navigation",        name: "Navigation",        icon: Sailboat },
  { id: "bien-etre",         name: "Bien-être",         icon: Flower2 },
  { id: "aviation",          name: "Aviation",          icon: Plane },
  { id: "oenologie",         name: "Œnologie",          icon: Wine },
  { id: "evenements",        name: "Événements",        icon: CalendarDays },
  { id: "offres-exclusives", name: "Offres Exclusives", icon: Gem },
  { id: "sport-loisirs",     name: "Sport & Loisirs",   icon: Trophy },
];

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/categories":    "Catégories",
    "/favorites":     "Mes Favoris",
    "/search":        "Recherche",
    "/membership":    "Membership",
    "/about":         "Notre Histoire",
    "/reservations":  "Réservations",
    "/profile":       "Mon Profil",
  };

  const isHome = pathname === "/";
  const title = pageTitles[pathname] ?? (pathname.startsWith("/category/") ? "Catégorie" : null);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${isHome ? "" : "backdrop-blur-xl bg-background/92 border-b border-border/30"}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className={`max-w-lg mx-auto px-5 flex items-center justify-between ${isHome ? "h-16" : "h-14"}`}
        style={isHome ? { filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.55))" } : undefined}
      >
        {isHome ? (
          <>
            {/* Hamburger — ouvre le menu latéral */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-foreground/95"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* Centered wordmark + subtitle */}
            <Link to="/" className="flex flex-col items-center">
              <span
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.24em", fontSize: "1.05rem", lineHeight: 1 }}
                className="text-foreground"
              >
                ELITEWAY
              </span>
              <span className="text-[9px] uppercase tracking-[0.32em] text-primary mt-1">
                A World Beyond
              </span>
            </Link>

            {/* Notifications */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative w-9 h-9 flex items-center justify-center text-foreground/95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" strokeWidth={1.75} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </>
        ) : (
          <>
            {/* Back arrow */}
            <Link to="/" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>

            {/* Page title with small mark */}
            <div className="flex items-center gap-2">
              <LogoMark size={20} className="text-primary opacity-70" />
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem" }} className="font-medium">
                {title ?? "EliteWay"}
              </span>
            </div>

            <div className="w-9" />
          </>
        )}
      </div>

      {/* MENU LATÉRAL */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-background overflow-y-auto"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-6">
              <div className="flex items-center gap-2">
                <LogoMark size={26} className="text-primary" />
                <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.16em", fontSize: "1rem" }}>
                  ELITEWAY
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pb-4 border-b border-border/30">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm hover:text-primary transition-colors"
              >
                Qui sommes-nous
              </Link>
              <Link
                to="/membership"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm hover:text-primary transition-colors"
              >
                Membership
              </Link>
            </div>

            <div className="px-5 pt-5 pb-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Catégories</p>
              <div className="divide-y divide-border/30">
                {MENU_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-3 text-sm hover:text-primary transition-colors"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
