import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import elitewayLogo from "@/imports/eliteway-logo-1000x1000.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function SplashScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // 0=hidden 1=logo 2=elite 3=way 4=tagline 5=out

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1500);
    const t4 = setTimeout(() => setStep(4), 2000);
    const t5 = setTimeout(() => setStep(5), 3000);
    const t6 = setTimeout(() => {
      const seen = localStorage.getItem("eliteway-onboarded");
      navigate(seen ? "/" : "/onboarding", { replace: true });
    }, 3500);
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "#0d0b09",
        opacity: step === 5 ? 0 : 1,
        transition: step === 5 ? "opacity 0.5s ease" : "none",
      }}
    >
      {/* Fond image très sombre */}
      <img
        src="https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=60&w=800"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.10 }}
      />

      {/* Halo doré */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.74 0.09 80 / 0.12) 0%, transparent 70%)",
      }} />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo */}
        <div style={{
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? "scale(1)" : "scale(0.75)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          marginBottom: "32px",
        }}>
          <ImageWithFallback
            src={elitewayLogo}
            alt="EliteWay"
            className="w-24 h-24 object-contain"
            style={{ filter: "drop-shadow(0 4px 20px rgba(201,169,110,0.6))" }}
          />
        </div>

        {/* ÉLITE */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "3rem",
          fontWeight: 300,
          letterSpacing: "0.3em",
          color: "#ffffff",
          textShadow: "0 2px 30px rgba(201,169,110,0.4)",
          opacity: step >= 2 ? 1 : 0,
          transform: step >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          lineHeight: 1,
          marginBottom: "4px",
        }}>
          ÉLITE
        </p>

        {/* Ligne dorée */}
        <div style={{
          width: step >= 3 ? "80px" : "0px",
          height: "1px",
          background: "oklch(0.74 0.09 80)",
          transition: "width 0.5s ease",
          margin: "8px 0",
          boxShadow: "0 0 12px oklch(0.74 0.09 80 / 0.6)",
        }} />

        {/* WAY */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.6rem",
          fontWeight: 300,
          letterSpacing: "0.6em",
          color: "oklch(0.74 0.09 80)",
          textShadow: "0 0 20px oklch(0.74 0.09 80 / 0.5)",
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          marginBottom: "28px",
        }}>
          WAY
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.58rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          opacity: step >= 4 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          Côte d'Azur · L'exception à portée de main
        </p>
      </div>

      {/* Points de chargement */}
      <div className="absolute bottom-14 flex items-center gap-2" style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.5s ease" }}>
        {[0,1,2].map((i) => (
          <div key={i} style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "oklch(0.74 0.09 80)",
            animation: `dotPulse 1.2s ease-in-out ${i * 0.18}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
