import { Check, Crown, Star, Gem } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const plans = [
  {
    id: "essentiel",
    name: "Essentiel",
    icon: Star,
    price: { monthly: 0, yearly: 0 },
    tagline: "Découvrez EliteWay",
    badge: null as string | null,
    features: [
      "Accès au catalogue complet",
      "Mise en favoris",
      "Recherche avancée",
      "Assistant IA de base",
      "Newsletter mensuelle",
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    icon: Crown,
    price: { monthly: 29, yearly: 260 },
    tagline: "L'accès privilégié",
    badge: "Le plus populaire" as string | null,
    features: [
      "Tout Essentiel inclus",
      "Offres exclusives membres (-15%)",
      "Priorité de réservation",
      "Conciergerie par email",
      "Invitations événements partenaires",
      "Accès ventes privées",
    ],
  },
  {
    id: "elite",
    name: "Élite",
    icon: Gem,
    price: { monthly: 99, yearly: 890 },
    tagline: "L'excellence absolue",
    badge: "Exclusif" as string | null,
    features: [
      "Tout Prestige inclus",
      "Remises jusqu'à -30%",
      "Conciergerie personnelle 24/7",
      "Accès événements ultra-privés",
      "Gestionnaire de compte dédié",
      "Carte membre physique gravée",
    ],
  },
];

const advantages = [
  { icon: Star, title: "Offres exclusives", desc: "Des tarifs négociés introuvables ailleurs." },
  { icon: Crown, title: "Conciergerie dédiée", desc: "Un conseiller disponible pour organiser chaque détail." },
  { icon: Gem, title: "Événements privés", desc: "Invitations aux dîners, dégustations et ventes réservées aux membres." },
];

export function MembershipPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="max-w-lg mx-auto px-5 pb-28 pt-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Membership</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-3">
          Rejoignez le Club EliteWay
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Offres exclusives, conciergerie et accès privilégié — choisissez le
          niveau qui vous correspond.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-1 bg-card rounded-full p-1 mb-8 max-w-xs mx-auto">
        <button
          onClick={() => setBilling("monthly")}
          className={`flex-1 px-4 py-2 rounded-full text-xs transition-colors ${
            billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Mensuel
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`flex-1 px-4 py-2 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 ${
            billing === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Annuel
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              billing === "yearly" ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
            }`}
          >
            -2 mois
          </span>
        </button>
      </div>

      {/* Plans */}
      <div className="flex flex-col gap-4 mb-10">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = plan.price[billing];
          const isPopular = plan.id === "prestige";

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-card p-6 ${isPopular ? "ring-1 ring-primary/40" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] tracking-wide whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>{plan.name}</h3>
                  <p className="text-muted-foreground text-xs">{plan.tagline}</p>
                </div>
              </div>

              <div className="mb-5">
                {price === 0 ? (
                  <span className="text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                    Gratuit
                  </span>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className="text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                      €{billing === "yearly" ? Math.round(plan.price.yearly / 12) : price}
                    </span>
                    <span className="text-muted-foreground text-xs mb-1">/mois</span>
                  </div>
                )}
                {billing === "yearly" && price > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Facturé €{plan.price.yearly}/an</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg transition-colors text-sm ${
                  isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/85"
                    : "border border-border hover:border-primary/50 text-foreground"
                }`}
              >
                {price === 0 ? "Commencer gratuitement" : `Choisir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Avantages */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-1">Avantages membres</p>
        <div className="divide-y divide-border/30">
          {advantages.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm mb-0.5">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Vous êtes un établissement ?{" "}
        <Link to="/partner/login" className="text-primary hover:underline">
          Rejoindre en tant que partenaire
        </Link>
      </p>
    </div>
  );
}
