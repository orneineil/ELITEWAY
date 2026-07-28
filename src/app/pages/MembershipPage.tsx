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
    color: "border-border",
    badge: null,
    features: [
      "Accès au catalogue complet",
      "Mise en favoris",
      "Recherche avancée",
      "Assistant IA de base",
      "Newsletter mensuelle",
    ],
    excluded: [
      "Offres membres exclusives",
      "Conciergerie dédiée",
      "Accès événements privés",
      "Tarifs préférentiels",
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    icon: Crown,
    price: { monthly: 29, yearly: 260 },
    tagline: "L'accès privilégié",
    color: "border-primary/60",
    badge: "Le plus populaire",
    features: [
      "Tout Essentiel inclus",
      "Offres exclusives membres (-15%)",
      "Priorité de réservation",
      "Conciergerie par email",
      "Invitations événements partenaires",
      "Accès ventes privées",
      "Bulletin d'offres hebdomadaire",
    ],
    excluded: [
      "Conciergerie 24/7 dédiée",
      "Accès événements ultra-privés",
    ],
  },
  {
    id: "elite",
    name: "Élite",
    icon: Gem,
    price: { monthly: 99, yearly: 890 },
    tagline: "L'excellence absolue",
    color: "border-border/60",
    badge: "Exclusif",
    features: [
      "Tout Prestige inclus",
      "Remises jusqu'à -30%",
      "Conciergerie personnelle 24/7",
      "Accès événements ultra-privés",
      "Expériences sur mesure",
      "Gestionnaire de compte dédié",
      "Carte membre physique gravée",
      "Partenariats hôtels 5 étoiles",
    ],
    excluded: [],
  },
];

const testimonials = [
  {
    name: "Isabelle Fontaine",
    role: "Membre Élite depuis 2 ans",
    text: "Mon conciergerie EliteWay m'a organisé un week-end à Monaco en moins de 24h. Un service incomparable.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
  },
  {
    name: "Henri Beaumont",
    role: "Membre Prestige",
    text: "Les offres exclusives me permettent d'accéder à des expériences que je n'aurais jamais trouvées ailleurs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
  },
  {
    name: "Clara Tissot",
    role: "Membre Élite",
    text: "La carte membre m'a ouvert des portes incroyables. Le rapport qualité-prix est exceptionnel.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
  },
];

export function MembershipPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen py-16">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Membership</p>
          <h1 className="mb-5">Rejoignez le Club EliteWay</h1>
          <p className="text-muted-foreground leading-relaxed">
            Accédez à un monde de privilèges exclusifs, d'offres sur mesure et
            d'une conciergerie d'exception. Choisissez le niveau qui correspond
            à vos ambitions.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-lg text-sm transition-colors ${
              billing === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 rounded-lg text-sm transition-colors ${
              billing === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annuel
            <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              -2 mois offerts
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.price[billing];
            const isPopular = plan.id === "prestige";

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border ${plan.color} bg-card p-8 flex flex-col ${
                  isPopular ? "ring-1 ring-primary/30 scale-[1.02]" : ""
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs tracking-wide whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.tagline}</p>
                </div>

                <div className="mb-8">
                  {price === 0 ? (
                    <div>
                      <span className="text-4xl">Gratuit</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl">€{billing === "yearly" ? Math.round(plan.price.yearly / 12) : price}</span>
                      <span className="text-muted-foreground text-sm mb-1">/mois</span>
                    </div>
                  )}
                  {billing === "yearly" && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Facturé €{plan.price.yearly}/an
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.excluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/50 line-through">
                      <span className="w-4 h-4 mt-0.5 shrink-0 text-center">—</span>
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

        {/* What members get */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Avantages</p>
            <h2>Ce que les membres reçoivent</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Offres exclusives",
                desc: "Accédez à des offres et tarifs négociés que vous ne trouverez nulle part ailleurs.",
                img: "https://images.unsplash.com/photo-1776993298422-3e8c397d0235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400&h=300&fit=crop",
              },
              {
                title: "Conciergerie dédiée",
                desc: "Un conseiller personnel disponible pour organiser chaque aspect de votre expérience.",
                img: "https://images.unsplash.com/photo-1518860308377-800f02d5498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400&h=300&fit=crop",
              },
              {
                title: "Événements privés",
                desc: "Invitations à des dîners, dégustations et événements réservés aux membres.",
                img: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400&h=300&fit=crop",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl overflow-hidden border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="p-6">
                  <h4 className="mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Témoignages</p>
            <h2>Ils sont membres EliteWay</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                  « {t.text} »
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover bg-muted"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Vous êtes un établissement ?{" "}
            <Link to="/partner/login" className="text-primary hover:underline">
              Rejoindre en tant que partenaire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
