import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0=hidden 1=piece tourne 2=écriture + séparation 3=slogan 4=boutons

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 3300);
    const t4 = setTimeout(() => setStep(4), 4000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
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

      {/* Photo de fond — Côte d'Azur de nuit (à déposer dans /public/splash-background.jpg) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/splash-background.jpg')" }}
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0d0b09 0%, rgba(13,11,9,0.55) 30%, rgba(13,11,9,0.35) 55%, rgba(13,11,9,0.75) 80%, #0d0b09 100%)",
      }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 40%, oklch(0.74 0.09 80 / 0.14) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 flex-1 flex flex-col items-center px-8" style={{ justifyContent: "flex-start", paddingTop: "9%" }}>
        {/* Logo — grand monogramme "E", mis en valeur */}
        <div className="relative flex items-center justify-center" style={{ height: "150px", marginBottom: "0px" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', var(--font-heading), Georgia, serif",
              fontWeight: 900,
              fontSize: step >= 2 ? "150px" : "70px",
              lineHeight: 1,
              opacity: step >= 1 ? 1 : 0,
              backgroundImage: "linear-gradient(155deg, oklch(0.52 0.08 75) 0%, oklch(0.76 0.09 80) 35%, oklch(0.48 0.09 72) 60%, oklch(0.70 0.09 78) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 6px 22px rgba(120,90,40,0.5))",
              transition: "font-size 0.7s cubic-bezier(0.2,0.8,0.3,1), opacity 0.4s ease",
            }}
          >
            E
          </span>
        </div>

        {/* ELITEWAY */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2.4rem, 10vw, 3rem)",
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
          animation: step >= 2 ? "revealLetters 1.8s ease forwards, shimmerSweep 2.5s ease-in-out 2s infinite" : "none",
        }}>
          ELITEWAY
        </p>

        {/* Slogan */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "oklch(0.86 0.07 80)",
          textShadow: "0 2px 14px rgba(0,0,0,0.6)",
          opacity: step >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease",
          textAlign: "center",
        }}>
          Elevating Everyday Living
        </p>

        <div style={{
          width: step >= 3 ? "56px" : "0px",
          height: "1px",
          background: "oklch(0.74 0.09 80)",
          transition: "width 0.6s ease",
          marginTop: "20px",
          boxShadow: "0 0 10px oklch(0.74 0.09 80 / 0.6)",
        }} />

        {/* Sous-titre */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.15rem",
          lineHeight: 1.4,
          color: "oklch(0.93 0.012 80 / 0.92)",
          opacity: step >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease 0.15s",
          textAlign: "center",
          marginTop: "20px",
        }}>
          Un monde d'exception<br />à portée de main.
        </p>
      </div>

      <div className="relative z-10 px-6" style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
        opacity: step >= 4 ? 1 : 0,
        transform: step >= 4 ? "translateY(0)" : "translateY(16px)",
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
