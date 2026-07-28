import { Link } from "react-router";
import { Star, MapPin } from "lucide-react";
import { establishments } from "../data/establishments";

const PRIVATE_BEACHES = [
  {
    id: "plage-pampelonne",
    name: "Pampelonne Plage",
    description: "La plage mythique de Saint-Tropez, accès privatisé au lever du soleil.",
    price: "Dès 35€/pers.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    city: "Saint-Tropez",
  },
  {
    id: "plage-villa-kerylos",
    name: "Villa Kérylos — Plage privée",
    description: "Accès exclusif à la plage privée de la Villa Kérylos, Beaulieu-sur-Mer.",
    price: "Dès 28€/pers.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    city: "Beaulieu-sur-Mer",
  },
  {
    id: "plage-cap-antibes",
    name: "Cap d'Antibes — Crique secrète",
    description: "Crique calanque privée accessible uniquement par bateau, eaux cristallines.",
    price: "Dès 55€ (transport inclus)",
    image: "https://images.unsplash.com/photo-1600577916048-3835bd7b3080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    city: "Antibes",
  },
];

const SECTION_HEADERS = [
  {
    id: "tables",
    label: "Gastronomie",
    title: "Meilleures tables",
    establishments: establishments.filter((e) => e.category === "gastronomie").slice(0, 3),
  },
  {
    id: "rooftops",
    label: "Bars & Nuits",
    title: "Meilleurs rooftops & bars",
    establishments: establishments.filter((e) => e.category === "offres-exclusives").slice(0, 2),
  },
  {
    id: "spas",
    label: "Bien-être",
    title: "Meilleurs spas",
    establishments: establishments.filter((e) => e.category === "bien-etre").slice(0, 3),
  },
];

export function EliteSelectionPage() {
  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* Header with bg image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src="https://images.unsplash.com/photo-1518860308377-800f02d5498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
          alt="EliteWay Selection"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5">Choix de l'équipe éditoriale</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem" }} className="leading-tight">
            EliteWay Selection
          </h1>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-8">

        {/* Dynamic sections from establishments */}
        {SECTION_HEADERS.map((section) => (
          <section key={section.id}>
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-primary mb-1">{section.label}</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.establishments.map((est) => (
                <Link
                  key={est.id}
                  to={`/establishment/${est.id}`}
                  className="group block bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
                >
                  <div className="relative overflow-hidden" style={{ height: 140 }}>
                    <img
                      src={est.imageUrl}
                      alt={est.name}
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    {/* EliteWay Choice badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-primary-foreground" />
                      EliteWay Choice
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                      <span className="text-xs">{est.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="leading-tight mb-1">{est.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{est.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {est.city}
                      </div>
                      <span className="text-xs text-primary">{est.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Private beaches — mock data */}
        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-primary mb-1">Mer & Soleil</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>Meilleures plages privées</h2>
          </div>
          <div className="space-y-4">
            {PRIVATE_BEACHES.map((beach) => (
              <div key={beach.id} className="bg-card border border-border/60 rounded-2xl overflow-hidden">
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px]">
                    <Star className="w-2.5 h-2.5 fill-primary-foreground" />
                    EliteWay Choice
                  </div>
                </div>
                <div className="p-4">
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="leading-tight mb-1">{beach.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{beach.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {beach.city}
                    </div>
                    <span className="text-xs text-primary">{beach.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
