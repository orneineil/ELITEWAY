import { Home, Compass, CalendarCheck, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router";

// Architecture de navigation MVP 2.0 : 4 destinations seulement.
// Favoris n'est plus un onglet à part — il vit désormais dans "My EliteWay"
// (voir doc EliteWay, onglet "MVP 2.0 — Audit & Reconstruction", section 3).
// EliteWay AI n'est pas un onglet non plus : c'est un accès permanent flottant
// (AIAssistant), présent sur chaque écran indépendamment de cette barre.
const tabs = [
  { icon: Home,          label: "Accueil",     to: "/" },
  { icon: Compass,       label: "Discover",    to: "/categories" },
  { icon: CalendarCheck, label: "Réservations", to: "/reservations" },
  { icon: Sparkles,      label: "My EliteWay", to: "/profile" },
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
