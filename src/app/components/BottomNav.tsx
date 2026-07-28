import { Home, Search, Heart, MapPin, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useNotifications } from "../contexts/NotificationsContext";

const tabs = [
  { icon: Home,    label: "Accueil",   to: "/" },
  { icon: Search,  label: "Recherche", to: "/search" },
  { icon: Heart,   label: "Favoris",   to: "/favorites" },
  { icon: MapPin,  label: "Carte",     to: "/map" },
  { icon: User,    label: "Profil",    to: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 backdrop-blur-xl bg-background/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {tabs.map(({ icon: Icon, label, to }) => {
          const active = isActive(to);
          const isProfile = to === "/profile";
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors"
            >
              <div className={`relative flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${active ? "bg-primary/15" : ""}`}>
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${active ? "text-primary stroke-[1.75]" : "text-muted-foreground stroke-[1.5]"}`}
                />
                {/* Notification badge on profile */}
                {isProfile && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-wide transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
