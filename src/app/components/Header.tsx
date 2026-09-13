import { Menu, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { LogoMark } from "./LogoMark";
import { useNotifications } from "../contexts/NotificationsContext";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

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
            {/* Hamburger — opens the menu (temporarily routes to Explorer) */}
            <button
              onClick={() => navigate("/categories")}
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
    </header>
  );
}
