import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import elitewayLogo from "@/imports/eliteway-logo-1000x1000.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0=hidden 1=logo 2=title 3=tagline 4=subtitle 5=buttons

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 1000);
    const t3 = setTimeout(() => setStep(3), 1500);
    const t4 = setTimeout(() => setStep(4), 2000);
    const t5 = setTimeout(() => setStep(5), 2600);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

    const goStart = () => {
    sessionStorage.setItem("eliteway-splash-shown", "1");
    const seen = localStorage.getItem("eliteway-onboarded");
    navigate(seen ? "/" : "/onboarding");
  };

  const goLogin = () => {
    sessionStorage.setItem("eliteway-splash-shown", "1");
    navigate("/client/login");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden" style={{ background: "#0d0b09" }}>

      {/* ── Fond photo nocturne ── */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
          alt=""
          className="w-full h-full object-cover"
         style={{ filter: "brightness(0.20) saturate(1.2)" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #0d0b09 0%, rgba(13,11,9,0.55) 28%, rgba(13,11,9,0.35) 55%, rgba(13,11,9,0.85) 85%, #0d0b09 100%)",
        }} />
      </div>

      {/* Halo doré */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 28%, oklch(0.74 0.09 80 / 0.14) 0%, transparent 70%)",
      }} />

      {/* ── Contenu ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8" style={{ paddingBottom: "10%" }}>

        {/* Logo */}
        <div style={{
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? "scale(1) translateY(0)" : "scale(0.7) translateY(10px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          marginBottom: "18px",
        }}>
          <ImageWithFallback
            src={elitewayLogo}
            alt="EliteWay"
            className="w-20 h-20 object-contain"
            style={{ filter: "drop-shadow(0 4px 24px rgba(201,169,110,0.6))" }}
          />
        </div>

        {/* ELITEWAY */}
                <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2.8rem, 12vw, 3.6rem)",
          fontWeight: 400,
          letterSpacing: "0.22em",
          lineHeight: 1,
          marginBottom: "10px",
          textAlign: "center",
          backgroundImage: "linear-gradient(100deg, oklch(0.86 0.07 80) 40%, #fff 50%, oklch(0.86 0.07 80) 60%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 2px 30px rgba(201,169,110,0.35))",
          clipPath: step >= 2 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          animation: step >= 2 ? "revealLetters 0.9s ease forwards, shimmerSweep 2.5s ease-in-out 1s infinite" : "none",
        }}>
          ELITEWAY
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.62rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "oklch(0.60 0.02 70)",
          opacity: step >= 3 ? 1 : 0,
          transition: "opacity 0.6s ease",
          marginBottom: "26px",
          textAlign: "center",
        }}>
          Elevating Everyday Living
        </p>

        {/* Ligne dorée */}
        <div style={{
          width: step >= 3 ? "56px" : "0px",
          height: "1px",
          background: "oklch(0.74 0.09 80)",
          transition: "width 0.6s ease",
          marginBottom: "26px",
          boxShadow: "0 0 10px oklch(0.74 0.09 80 / 0.6)",
        }} />

        {/* Sous-titre */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.4rem",
          fontWeight: 400,
          lineHeight: 1.35,
          color: "rgba(255,255,255,0.92)",
          opacity: step >= 4 ? 1 : 0,
          transform: step >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          textAlign: "center",
          textShadow: "0 2px 20px rgba(0,0,0,0.6)",
        }}>
          Un monde d'exception<br />à portée de main.
        </p>
      </div>

      {/* ── Boutons ── */}
      <div className="relative z-10 px-6" style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
        opacity: step >= 5 ? 1 : 0,
        transform: step >= 5 ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        <button
          onClick={goStart}
          className="w-full flex items-center justify-center gap-2 rounded-full mb-3 transition-transform active:scale-[0.98]"
          style={{
            height: "56px",
            background: "linear-gradient(135deg, oklch(0.80 0.09 80), oklch(0.68 0.10 78))",
            color: "oklch(0.10 0.006 60)",
            fontFamily: "var(--font-heading)",
            fontSize: "1.05rem",
            boxShadow: "0 6px 24px oklch(0.74 0.09 80 / 0.35)",
          }}
        >
          Commencer <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={goLogin}
          className="w-full flex items-center justify-center gap-2 rounded-full transition-transform active:scale-[0.98]"
          style={{
            height: "56px",
            background: "transparent",
            border: "1px solid oklch(0.74 0.09 80 / 0.5)",
            color: "oklch(0.90 0.05 80)",
            fontFamily: "var(--font-heading)",
            fontSize: "1.05rem",
          }}
        >
          Se connecter <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span style={{ width: "28px", height: "1px", background: "oklch(0.74 0.09 80 / 0.4)" }} />
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            color: "oklch(0.74 0.09 80 / 0.75)",
          }}>
            CÔTE D'AZUR
          </span>
          <span style={{ width: "28px", height: "1px", background: "oklch(0.74 0.09 80 / 0.4)" }} />
        </div>
      </div>
    </div>
  );
}
