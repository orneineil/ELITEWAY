import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { LogoMark } from "../components/LogoMark";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    eyebrow: "Bienvenue sur",
    title: "EliteWay",
    subtitle: "La plateforme des expériences haut de gamme sur la Côte d'Azur.",
    accent: "Gastronomie · Yachts · Aviation · Bien-être",
  },
  {
    image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    eyebrow: "Explorez",
    title: "Des expériences uniques",
    subtitle: "Dîners gastronomiques, sorties en yacht, vols panoramiques, spas vue mer…",
    accent: "Dès 12€ · Accessible à tous",
  },
  {
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
    eyebrow: "Rejoignez",
    title: "Le Club EliteWay",
    subtitle: "Programme de fidélité, offres exclusives membres et conciergerie dédiée.",
    accent: "Prestige ✦ · Élite ★",
  },
];

export function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      localStorage.setItem("eliteway-onboarded", "1");
      navigate("/client/register");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const skip = () => {
    localStorage.setItem("eliteway-onboarded", "1");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background max-w-sm mx-auto flex flex-col overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover opacity-30" />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.5) 0%, oklch(0.08 0.005 60) 60%)" }} />
      </div>

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-4">
        {current > 0 ? (
          <button onClick={() => setCurrent(c => c - 1)} className="w-9 h-9 rounded-xl bg-card/80 flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <LogoMark size={24} className="text-primary" />
            <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.2em", fontSize: "0.8rem" }}>ELITEWAY</span>
          </div>
        )}
        <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Passer
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-12">
        {/* Slide indicator */}
        <div className="flex gap-1.5 mb-10">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === current ? "24px" : "6px", background: i === current ? "var(--primary)" : "var(--border)" }}
            />
          ))}
        </div>

        {/* Text */}
        <div key={current} style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.eyebrow}</p>
          <h1
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 8vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
            className="mb-4"
          >
            {slide.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">{slide.subtitle}</p>
          <p className="text-xs text-primary/80 tracking-wide">{slide.accent}</p>
        </div>

        {/* CTA */}
        <div className="mt-10 space-y-3">
          <button
            onClick={next}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/85 transition-colors"
          >
            <span>{isLast ? "Commencer" : "Suivant"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {isLast && (
            <button
              onClick={() => { localStorage.setItem("eliteway-onboarded", "1"); navigate("/client/login"); }}
              className="w-full py-3.5 border border-border/60 rounded-2xl text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              J'ai déjà un compte
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
