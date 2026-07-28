import { Link } from "react-router";
import { ArrowRight, Check, Wind, Plane, Sailboat, Utensils, Sparkles, Shield, Star, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import elitewayLogo from "@/imports/eliteway-logo-1000x1000.png";

const PROBLEMS = [
  {
    number: "01",
    title: "Les meilleures adresses sont invisibles",
    text: "Un hélicoptère privatisé, un yacht pour la journée, une table étoilée avec vue mer — ces expériences existent, mais personne ne sait où les trouver facilement.",
  },
  {
    number: "02",
    title: "Chaque prestataire est un univers à part",
    text: "20 sites différents, 20 formulaires, 20 façons de payer. Sans réseau, sans temps, impossible de comparer et de réserver sereinement.",
  },
  {
    number: "03",
    title: "Les prix varient selon vos connexions",
    text: "Les meilleures offres — green fee VIP, transfert héliporté, croisière en catamaran — sont réservées à ceux qui connaissent les bonnes personnes.",
  },
];

const EXPERIENCES = [
  {
    icon: Wind,
    title: "Hélicoptère",
    subtitle: "Nice → Monaco en 7 min",
    price: "dès 220 €/siège",
    image: "https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    link: "/establishment/heli-prestige",
  },
  {
    icon: Plane,
    title: "Jet Privé",
    subtitle: "Nice – Paris en 1h15",
    price: "dès 4 500 €",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    link: "/establishment/jet-prive-azur",
  },
  {
    icon: Sailboat,
    title: "Yacht",
    subtitle: "Journée en mer privatisée",
    price: "dès 800 €/jour",
    image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    link: "/category/navigation",
  },
  {
    icon: Utensils,
    title: "Gastronomie",
    subtitle: "Tables d'exception vue mer",
    price: "dès 150 €/pers.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    link: "/category/gastronomie",
  },
  {
    icon: Sparkles,
    title: "Spa & Bien-être",
    subtitle: "Thalasso, massages, détox",
    price: "dès 180 €/soin",
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    link: "/category/bien-etre",
  },
];

const PILLARS = [
  {
    number: "1",
    title: "Sélection rigoureuse",
    text: "Chaque expérience est visitée, testée et validée par notre équipe. Aucun établissement ne paye pour figurer sur EliteWay — seule la qualité décide.",
  },
  {
    number: "2",
    title: "Tarifs négociés pour vous",
    text: "En tant que membre, vous accédez à des prix préférentiels obtenus directement auprès des prestataires. La Côte d'Azur au bon prix.",
  },
  {
    number: "3",
    title: "Réservation en 3 taps",
    text: "Hélicoptère, yacht, dîner gastronomique — tout se réserve depuis votre téléphone, sans attendre, sans intermédiaire.",
  },
  {
    number: "4",
    title: "Conciergerie & événements VIP",
    text: "Membres Prestige et Élite : accès aux soirées privées, aux événements sur invitation et à une conciergerie dédiée disponible 7j/7.",
  },
];

const STATS = [
  { value: "30+", label: "Expériences sélectionnées" },
  { value: "7", label: "Catégories d'excellence" },
  { value: "100%", label: "Prestataires audités" },
  { value: "24/7", label: "Conciergerie membres" },
];

export function AboutPage() {
  return (
    <div className="max-w-lg mx-auto pb-28 min-h-screen">

      {/* ── HERO MANIFESTE ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "90svh" }}>
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1684858504602-677ac40eadfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=90&w=1200"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,6,4,0.7) 0%, rgba(8,6,4,0.5) 40%, rgba(8,6,4,0.92) 100%)" }} />
        </div>

        {/* Gold halo */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 35%, oklch(0.74 0.09 80 / 0.10) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 flex flex-col items-center justify-end px-6 pb-12" style={{ minHeight: "90svh" }}>
          {/* Logo */}
          <ImageWithFallback
            src={elitewayLogo}
            alt="EliteWay"
            className="w-16 h-16 object-contain mb-6"
            style={{ filter: "drop-shadow(0 4px 20px rgba(201,169,110,0.5))" }}
          />

          {/* Eyebrow */}
          <p className="text-center uppercase mb-3" style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: "oklch(0.74 0.09 80)",
          }}>
            Côte d'Azur · L'exception à portée de main
          </p>

          {/* Manifeste headline */}
          <h1 className="text-center text-white mb-5" style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 9vw, 3.2rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}>
            La Riviera<br />comme vous<br />la méritez
          </h1>

          {/* Quote line */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "oklch(0.74 0.09 80 / 0.4)" }} />
            <p className="text-center text-sm text-muted-foreground shrink-0 px-2" style={{ maxWidth: "260px" }}>
              EliteWay réunit les meilleures expériences de luxe de la Côte d'Azur dans une seule application.
            </p>
            <div className="h-px flex-1" style={{ background: "oklch(0.74 0.09 80 / 0.4)" }} />
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95"
            style={{
              background: "oklch(0.74 0.09 80)",
              color: "oklch(0.08 0.005 60)",
              boxShadow: "0 4px 24px oklch(0.74 0.09 80 / 0.4)",
            }}
          >
            Découvrir les expériences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── LE PROBLÈME ────────────────────────────────────────────────────── */}
      <section className="px-5 py-12">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Le constat</p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", lineHeight: 1.2 }} className="mb-8">
          Pourquoi c'était<br />si compliqué avant ?
        </h2>

        <div className="space-y-5">
          {PROBLEMS.map((p) => (
            <div key={p.number} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/60">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.74 0.09 80 / 0.12)", border: "1px solid oklch(0.74 0.09 80 / 0.35)" }}>
                <span className="text-[10px] text-primary font-medium">{p.number}</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem" }} className="mb-1 leading-snug">{p.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LA SOLUTION — ce qu'est EliteWay ───────────────────────────────── */}
      <section className="px-5 py-8">
        <div className="relative overflow-hidden rounded-3xl p-6"
          style={{ background: "linear-gradient(135deg, oklch(0.13 0.015 75), oklch(0.10 0.010 65))" }}>
          <div className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ boxShadow: "inset 0 0 0 1px oklch(0.74 0.09 80 / 0.35)" }} />
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, oklch(0.74 0.09 80 / 0.12) 0%, transparent 70%)" }} />

          <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-3 relative z-10">La réponse</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.2 }} className="mb-4 relative z-10">
            EliteWay, c'est quoi exactement ?
          </h2>
          <div className="space-y-3 relative z-10">
            {[
              "L'application qui réunit les meilleures expériences de luxe de la Côte d'Azur",
              "Un accès direct à l'hélicoptère, au jet privé, aux yachts et aux meilleures tables",
              "Des tarifs membres négociés en exclusivité auprès de chaque prestataire",
              "Un accès VIP aux événements privés de la Riviera",
            ].map((txt, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.74 0.09 80 / 0.20)", border: "1px solid oklch(0.74 0.09 80 / 0.4)" }}>
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS EXPÉRIENCES ─────────────────────────────────────────────────── */}
      <section className="py-8">
        <div className="px-5 mb-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-1">Nos expériences</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.2 }}>
            5 univers, 1 seule app
          </h2>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-4 px-5 pb-2" style={{ width: "max-content" }}>
            {EXPERIENCES.map((exp) => {
              const Icon = exp.icon;
              return (
                <Link
                  key={exp.title}
                  to={exp.link}
                  className="shrink-0 rounded-2xl overflow-hidden relative group active:scale-95 transition-transform"
                  style={{ width: 180, height: 240 }}
                >
                  <img src={exp.image} alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ opacity: 0.65 }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(180deg, transparent 30%, rgba(6,4,2,0.92) 100%)",
                  }} />
                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.74 0.09 80 / 0.20)", border: "1px solid oklch(0.74 0.09 80 / 0.5)" }}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="leading-tight mb-0.5">
                      {exp.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">{exp.subtitle}</p>
                    <p className="text-xs text-primary font-medium">{exp.price}</p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                    <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CE QUE VOUS GAGNEZ ─────────────────────────────────────────────── */}
      <section className="px-5 py-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-1">Vos avantages</p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.2 }} className="mb-6">
          Ce que vous gagnez
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {PILLARS.map((p) => (
            <div key={p.number} className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full flex items-center justify-center mb-3"
                style={{ background: "oklch(0.74 0.09 80 / 0.12)", border: "1px solid oklch(0.74 0.09 80 / 0.35)" }}>
                <span className="text-[11px] text-primary font-semibold">{p.number}</span>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="mb-1.5 leading-snug">{p.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="px-5 py-8">
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-5 rounded-2xl bg-card border border-border/60">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "oklch(0.74 0.09 80)" }}
                className="leading-none mb-1">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMESSE ÉLITEWAY ───────────────────────────────────────────────── */}
      <section className="px-5 py-6">
        <div className="relative overflow-hidden rounded-3xl p-6 text-center"
          style={{ background: "linear-gradient(145deg, oklch(0.12 0.015 75), oklch(0.09 0.008 65))" }}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px oklch(0.74 0.09 80 / 0.3)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.74 0.09 80 / 0.08), transparent)" }} />

          <Shield className="w-8 h-8 text-primary mx-auto mb-4 relative z-10" />
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-3 relative z-10">Notre engagement</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", lineHeight: 1.2 }}
            className="mb-3 relative z-10">
            Aucun compromis<br />sur l'excellence
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
            Chaque prestataire est audité. Chaque prix est négocié. Chaque expérience est vécue avant d'être publiée. C'est la promesse EliteWay.
          </p>
          <div className="flex flex-col gap-3 relative z-10">
            <Link
              to="/membership"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-medium transition-all active:scale-95"
              style={{
                background: "oklch(0.74 0.09 80)",
                color: "oklch(0.08 0.005 60)",
                boxShadow: "0 4px 24px oklch(0.74 0.09 80 / 0.35)",
              }}
            >
              Rejoindre EliteWay <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm text-muted-foreground transition-all"
              style={{ border: "1px solid oklch(0.28 0.008 65 / 0.6)" }}
            >
              Explorer sans s'inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────────────── */}
      <section className="px-5 py-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-1">Notre histoire</p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.2 }} className="mb-6">
          De l'idée à la Riviera
        </h2>

        <div className="relative pl-6">
          <div className="absolute left-2.5 top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(180deg, oklch(0.74 0.09 80), oklch(0.74 0.09 80 / 0.15))" }} />
          <div className="space-y-6">
            {[
              { year: "2022", title: "L'idée", text: "Naissance d'EliteWay : connecter la Riviera à ceux qui exigent le meilleur." },
              { year: "2023", title: "Le lancement", text: "Première version avec 6 partenaires fondateurs. Vision : l'exception accessible." },
              { year: "2024", title: "L'essor", text: "30+ partenaires, programme Membership, espace partenaires autonome." },
              { year: "2026", title: "Aujourd'hui", text: "Hélicoptère, jet privé, yachts, gastronomie et événements VIP — tout en un." },
            ].map((m, i) => (
              <div key={m.year} className="relative flex gap-4">
                <div className="absolute -left-3.5 top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    background: i === 3 ? "oklch(0.74 0.09 80)" : "oklch(0.13 0.010 70)",
                    borderColor: "oklch(0.74 0.09 80)",
                  }} />
                <div>
                  <p className="text-[10px] text-primary tracking-wider mb-0.5">{m.year}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.0rem" }} className="mb-0.5">{m.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
