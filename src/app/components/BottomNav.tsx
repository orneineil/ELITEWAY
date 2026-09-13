import { Home, Search, Heart, CalendarCheck, User } from "lucide-react";
import { Link, useLocation } from "react-router";

const tabs = [
  { icon: Home,           label: "Accueil",      to: "/" },
  { icon: Search,         label: "Explorer",     to: "/categories" },
  { icon: Heart,          label: "Favoris",      to: "/favorites" },
  { icon: CalendarCheck,  label: "Réservations", to: "/reservations" },
  { icon: User,           label: "Profil",       to: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();

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
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors"
            >
              <div className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${active ? "bg-primary/15" : ""}`}>
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${active ? "text-primary stroke-[1.75]" : "text-muted-foreground stroke-[1.5]"}`}
                />
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
