import { Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { LogoHorizontal, LogoMark } from "./LogoMark";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { client } = useClientAuth();
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
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/92 border-b border-border/30"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
        {isHome ? (
          <>
            {/* Logo horizontal lockup */}
            <Link to="/">
              <LogoHorizontal markSize={26} />
            </Link>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button
                onClick={() => navigate("/notifications")}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full bg-primary flex items-center justify-center px-0.5">
                    <span className="text-[9px] text-primary-foreground font-bold leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Avatar */}
              <Link to="/profile">
                {client ? (
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                      {client.firstName[0]}
                    </span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-muted border border-border/50 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">?</span>
                  </div>
                )}
              </Link>
            </div>
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
