import { Link } from "react-router";
import { ArrowRight, Gift } from "lucide-react";

const CATEGORIES = [
  {
    id: "gastronomie",
    name: "Gastronomie",
    subtitle: "Tables d'exception",
    description: "Des bistrots raffinés aux tables gastronomiques.",
    image: "/category-gastronomie.jpg",
    count: 5,
    priceFrom: "Dès 8€",
  },
  {
    id: "hotels",
    name: "Hôtels",
    subtitle: "Palaces & prestige",
    description: "Palaces mythiques, châteaux et villas Art déco.",
    image: "/category-hotels.jpg",
    count: 5,
    priceFrom: "Dès 390€",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    subtitle: "Spas & détente",
    description: "Hammams, thalassos, yoga face à la mer.",
    image: "/category-bien-etre.jpg",
    count: 5,
    priceFrom: "Dès 12€",
  },
  {
    id: "navigation",
    name: "Yachts & Bateaux",
    subtitle: "Yachting & croisières",
    description: "Charter de superyachts et sorties en mer avec les plus grandes maisons de yachting.",
    image: "/category-navigation.jpg",
    count: 4,
    priceFrom: "Dès 690€",
  },
  {
    id: "aviation",
    name: "Aviation",
    subtitle: "Hélicoptères & jets",
    description: "Vols panoramiques, navette Monaco et jets privés.",
    image: "/category-aviation.jpg",
    count: 4,
    priceFrom: "Dès 120€",
  },
  {
    id: "oenologie",
    name: "Œnologie",
    subtitle: "Vins & dégustations",
    description: "Caves, vignobles et ateliers rosé.",
    image: "/category-oenologie.jpg",
    count: 4,
    priceFrom: "Dès 4€",
  },
  {
    id: "evenements",
    name: "Événements",
    subtitle: "Galas & soirées",
    description: "Des concerts aux soirées privées.",
    image: "/category-evenements.jpg",
    count: 3,
    priceFrom: "Dès 12€",
  },
  {
    id: "offres-exclusives",
    name: "Offres Exclusives",
    subtitle: "Membres Prestige",
    description: "Tarifs négociés et accès privatifs.",
    image: "/category-offres-exclusives.jpg",
    count: 7,
    priceFrom: "Membres",
    vip: true,
  },
  {
    id: "sport-loisirs",
    name: "Sport & Loisirs",
    subtitle: "Golf, tennis & équitation",
    description: "Golf, tennis et grand domaine équestre.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: 3,
    priceFrom: "Dès 120€",
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

      <div className="mx-5 mt-16 mb-6 py-8 text-center">
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem" }} className="mb-4">
          Vous êtes un professionnel ?
        </p>
        <Link
          to="/partner/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform active:scale-95"
          style={{
            border: "1px solid oklch(0.74 0.09 80 / 0.5)",
            color: "oklch(0.85 0.09 80)",
            fontSize: "0.9rem",
          }}
        >
          Référencer mon établissement <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
