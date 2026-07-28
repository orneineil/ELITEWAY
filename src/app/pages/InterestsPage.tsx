import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, Utensils, Sailboat, Sparkles, Plane, Wine, CalendarDays, Gift, Hotel } from "lucide-react";
import { LogoMark } from "../components/LogoMark";

const INTERESTS = [
  { id: "gastronomie",       label: "Gastronomie",  icon: Utensils,    image: "https://images.unsplash.com/photo-1776993298456-98c71c0e177e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "navigation",        label: "Yachts",        icon: Sailboat,    image: "https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "bien-etre",         label: "Bien-être",     icon: Sparkles,    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "aviation",          label: "Aviation",      icon: Plane,       image: "https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "oenologie",         label: "Œnologie",      icon: Wine,        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "evenements",        label: "Événements",    icon: CalendarDays,image: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "hotels",            label: "Hôtels & Spa",  icon: Hotel,       image: "https://images.unsplash.com/photo-1718942899965-4fc10607d805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
  { id: "offres-exclusives", label: "Exclusif",      icon: Gift,        image: "https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300" },
];

export function InterestsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const handleContinue = () => {
    localStorage.setItem("eliteway-interests", JSON.stringify(selected));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background max-w-sm mx-auto px-5 pb-10 pt-14">

      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <LogoMark size={24} className="text-primary" />
        <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.2em", fontSize: "0.8rem" }}>ELITEWAY</span>
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Personnalisation</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.1 }} className="mb-2">
        Vos centres<br />d'intérêt
      </h1>
      <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
        Sélectionnez au moins 2 univers pour personnaliser vos recommandations.
      </p>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-7">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? "bg-primary" : "bg-border/50"}`} />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {INTERESTS.map((item) => {
          const isSelected = selected.includes(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="relative overflow-hidden rounded-2xl aspect-square text-left transition-all duration-200"
              style={{
                boxShadow: isSelected ? "0 0 0 2px var(--primary)" : "0 0 0 1px var(--border)",
              }}
            >
              <img src={item.image} alt={item.label} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }}>{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={handleContinue}
        disabled={selected.length < 2}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm disabled:opacity-40 hover:bg-primary/85 transition-colors"
      >
        {selected.length < 2
          ? `Sélectionnez encore ${2 - selected.length} univers`
          : `Continuer avec ${selected.length} univers`}
      </button>

      <button onClick={handleContinue} className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        Passer cette étape
      </button>
    </div>
  );
}
