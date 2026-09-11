import { Link } from "react-router";
import { ArrowRight, Gift } from "lucide-react";

const CATEGORIES = [
  {
    id: "gastronomie",
    name: "Gastronomie",
    subtitle: "Tables d'exception",
    description: "Des bistrots raffinés aux tables gastronomiques.",
    image: "https://images.unsplash.com/photo-1776993298456-98c71c0e177e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 5,
    priceFrom: "Dès 8€",
  },
  {
    id: "navigation",
    name: "Yachts & Navigation",
    subtitle: "Mer & croisières",
    description: "Sorties en voilier, catamaran ou yacht privatisé.",
    image: "https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 4,
    priceFrom: "Dès 45€",
  },
  {
    id: "bien-etre",
    name: "Bien-être & Hôtels",
    subtitle: "Spas & détente",
    description: "Hammams, thalassos, yoga face à la mer.",
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 4,
    priceFrom: "Dès 12€",
  },
  {
    id: "aviation",
    name: "Aviation",
    subtitle: "Hélicoptères & jets",
    description: "Vols panoramiques et transferts VIP.",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 3,
    priceFrom: "Dès 79€",
  },
  {
    id: "oenologie",
    name: "Œnologie",
    subtitle: "Vins & dégustations",
    description: "Caves, vignobles et ateliers rosé.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 4,
    priceFrom: "Dès 4€",
  },
  {
    id: "evenements",
    name: "Événements",
    subtitle: "Galas & soirées",
    description: "Des concerts aux soirées privées.",
    image: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 3,
    priceFrom: "Dès 12€",
  },
  {
    id: "offres-exclusives",
    name: "Offres Exclusives",
    subtitle: "Membres Prestige",
    description: "Tarifs négociés et accès privatifs.",
    image: "https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 3,
    priceFrom: "Membres",
    vip: true,
  },
];

export function AllCategories() {
  return (
    <div className="max-w-lg mx-auto pb-28 pt-4 overflow-x-hidden">
      <div className="px-5 mb-7">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Explorer</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", lineHeight: 1.1 }} className="mb-2">
          Toutes les catégories
        </h1>
        <p className="text-muted-foreground text-sm">
          {CATEGORIES.length} univers · Côte d'Azur
        </p>
      </div>

      <div className="px-5 grid grid-cols-2 gap-4 min-w-0">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="group block relative overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all min-w-0"
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                style={{ minWidth: "100%", minHeight: "100%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />
              {cat.vip && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Gift className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 overflow-hidden">
                <p className="text-[9px] uppercase tracking-[0.15em] text-primary mb-1">{cat.subtitle}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem" }} className="leading-tight mb-1">
                  {cat.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{cat.count} exp.</span>
                  <span className="text-[10px] text-primary whitespace-nowrap">{cat.priceFrom}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-5 mt-14 p-5 bg-card border border-border/50 rounded-2xl">
        <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-2">Vous êtes un professionnel ?</p>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem" }} className="mb-2">
          Référencez votre établissement
        </p>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Rejoignez notre réseau de partenaires et bénéficiez d'une visibilité premium auprès d'une clientèle exigeante.
        </p>
        <Link
          to="/partner/register"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          Devenir partenaire <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
