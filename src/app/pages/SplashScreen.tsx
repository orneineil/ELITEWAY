import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import elitewayLogo from "@/imports/eliteway-logo-1000x1000.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0=hidden 1=logo 2=écriture ELITEWAY 3=slogan 4=boutons

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1100);
    const t3 = setTimeout(() => setStep(3), 3000);
    const t4 = setTimeout(() => setStep(4), 3700);
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

      {/* Halo doré */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 28%, oklch(0.74 0.09 80 / 0.14) 0%, transparent 70%)",
      }} />

      {/* ── Contenu ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8" style={{ paddingBottom: "10%" }}>

               {/* Logo — effet pièce lancée */}
        <div style={{ perspective: "800px", marginBottom: "18px" }}>
          <div style={{
            animation: step >= 1 ? "coinFlip 1.4s cubic-bezier(0.25, 0.8, 0.4, 1) forwards" : "none",
            opacity: step >= 1 ? undefined : 0,
            transformStyle: "preserve-3d",
          }}>
            <ImageWithFallback
              src={elitewayLogo}
              alt="EliteWay"
              className="w-20 h-20 object-contain"
              style={{ filter: "drop-shadow(0 4px 24px rgba(201,169,110,0.6))" }}
            />
          </div>
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
          animation: step >= 2 ? "revealLetters 1.8s ease forwards, shimmerSweep 2.5s ease-in-out 2s infinite" : "none",
        }}>
          ELITEWAY
        </p>

        {/* Tagline / slogan — apparaît après l'écriture */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.62rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "oklch(0.60 0.02 70)",
          opacity: step >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease",
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
          marginTop: "20px",
          boxShadow: "0 0 10px oklch(0.74 0.09 80 / 0.6)",
        }} />
      </div>

      {/* ── Boutons ── */}
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
