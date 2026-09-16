import { useParams, Link } from "react-router";
import { useState, useMemo } from "react";
import { establishments } from "../data/establishments";
import { EstablishmentCard } from "../components/EstablishmentCard";
import { ScrollRow } from "../components/ScrollRow";
import { ArrowLeft, Gift } from "lucide-react";

const CATEGORY_CONFIG: Record<string, {
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  partnerNote?: string;
  vip?: boolean;
  highlights?: string[];
}> = {
  gastronomie: {
    name: "Gastronomie",
    subtitle: "Tables d'exception",
    tagline: "Where every table tells a story.",
    description: "Des bistrots avec vue mer aux adresses gastronomiques confidentielles — toutes soigneusement sélectionnées sur la Côte d'Azur.",
    image: "/category-gastronomie.jpg",
  },
  hotels: {
    name: "Hôtels",
    subtitle: "Palaces & adresses de prestige",
    tagline: "Sleep where legends have stayed.",
    description: "Palaces mythiques, châteaux perchés et villas Art déco — les plus belles adresses où séjourner sur la Côte d'Azur.",
    image: "/category-hotels.jpg",
  },
  navigation: {
    name: "Yachts & Bateaux",
    subtitle: "Yachting & croisières",
    tagline: "Explore the Mediterranean differently.",
    description: "Charter de superyachts et sorties en mer avec les plus grandes maisons de yachting de la Côte d'Azur.",
    image: "/category-navigation.jpg",
  },
  "bien-etre": {
    name: "Bien-être",
    subtitle: "Spas, soins & détente",
    tagline: "Slow down, in style.",
    description: "Hammams, thalassos, yoga en plein air ou massages vue mer — prenez soin de vous sur la Riviera.",
    image: "/category-bien-etre.jpg",
  },
  aviation: {
    name: "Aviation",
    subtitle: "Hélicoptères & jets privés",
    tagline: "The sky, without compromise.",
    description: "Rejoignez Monaco en 7 minutes en hélicoptère, survolez la Riviera ou voyagez en jet privé vers toute l'Europe.",
    image: "/category-aviation.jpg",
  },
  oenologie: {
    name: "Œnologie",
    subtitle: "Vins, rosés & dégustations",
    tagline: "The art of Provençal wine.",
    description: "Caves historiques, vignobles de l'AOC Bellet, ateliers rosé et bars à vins — l'art du vin provençal accessible à tous.",
    image: "/category-oenologie.jpg",
    highlights: [
      "/category-oenologie-highlight-1.jpg",
      "/category-oenologie-highlight-2.jpg",
      "/category-oenologie-highlight-3.jpg",
      "/category-oenologie-highlight-4.jpg",
    ],
  },
  evenements: {
    name: "Événements",
    subtitle: "Galas & soirées partenaires",
    tagline: "Nights worth remembering.",
    description: "EliteWay ne crée pas d'événements. Nous mettons en lumière les meilleures propositions d'entreprises partenaires qui souhaitent les faire connaître à notre communauté.",
    image: "/category-evenements.jpg",
    partnerNote: "Ces événements sont organisés par des entreprises partenaires indépendantes.",
  },
  "offres-exclusives": {
    name: "Offres Exclusives",
    subtitle: "Réservé aux membres Prestige & Élite",
    tagline: "Access, reserved.",
    description: "Tarifs négociés par EliteWay, accès privatifs et expériences sur mesure introuvables ailleurs — uniquement pour nos membres.",
    image: "/category-offres-exclusives.jpg",
    vip: true,
  },
  "sport-loisirs": {
    name: "Sport & Loisirs",
    subtitle: "Golf, tennis & équitation",
    tagline: "Play, elevated.",
    description: "Golfs panoramiques, clubs de tennis historiques et grand domaine équestre — le sport dans son écrin le plus premium sur la Côte d'Azur.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
};

const KEYWORD_GROUPS: { label: string; match: RegExp }[] = [
  { label: "Vue mer",       match: /vue (mer|baie|promenade|croisette|monaco)/i },
  { label: "Terrasse",      match: /terrasse/i },
  { label: "Menu Prestige", match: /prestige/i },
  { label: "Vin & Cave",    match: /(vin|cuvée|cave|champagne)/i },
  { label: "Privatisation", match: /priv(é|atis)/i },
];

export function CategoryPage() {
  const { categoryId } = useParams();
  const [activeFilter, setActiveFilter] = useState("Tous");

  const config = categoryId ? CATEGORY_CONFIG[categoryId] : null;
  const baseList = establishments.filter((e) => e.category === categoryId);

  const filterPills = useMemo(() => {
    const counts: Record<string, number> = {};
    baseList.forEach((e) => {
      const combined = [...(e.tags || []), ...(e.features || [])].join(" | ");
      KEYWORD_GROUPS.forEach(({ label, match }) => {
        if (match.test(combined)) {
          counts[label] = (counts[label] || 0) + 1;
        }
      });
    });
    const top = Object.entries(counts)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([t]) => t);
    return ["Tous", ...top];
  }, [baseList]);

  const matchesKeyword = (e: typeof baseList[number], label: string) => {
    const group = KEYWORD_GROUPS.find((g) => g.label === label);
    if (!group) return false;
    const combined = [...(e.tags || []), ...(e.features || [])].join(" | ");
    return group.match.test(combined);
  };

  const list = activeFilter === "Tous"
    ? baseList
    : baseList.filter((e) => matchesKeyword(e, activeFilter));

  if (!categoryId || !config) {
    return (
      <div className="max-w-sm mx-auto px-5 pt-20 text-center">
        <p className="text-muted-foreground mb-4">Catégorie introuvable.</p>
        <Link to="/categories" className="text-primary hover:underline">Voir toutes les catégories</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-28">

      <div className="relative overflow-hidden" style={{ height: "48svh", minHeight: "300px", maxHeight: "420px" }}>
        <img
          src={config.image}
          alt={config.name}
          className="w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.35) 0%, transparent 40%, var(--background) 98%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 30%, oklch(0.74 0.09 80 / 0.08) 0%, transparent 70%)" }} />

        <Link
          to="/categories"
          className="absolute w-9 h-9 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-border/40"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: "20px" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {config.vip && (
          <div
            className="absolute flex items-center gap-1.5 bg-primary/20 border border-primary/40 backdrop-blur-sm rounded-full px-3 py-1"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", right: "20px" }}
          >
            <Gift className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary">Membres</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{config.subtitle}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.1rem", lineHeight: 1.05 }} className="mb-2">
            {config.name}
          </h1>
          <p className="text-sm text-foreground/70 italic" style={{ fontFamily: "var(--font-heading)" }}>
            {config.tagline}
          </p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 border-b border-border/40">
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed">{config.description}</p>
        {config.partnerNote && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-primary/5 border border-primary/15 rounded-xl">
            <span className="text-primary mt-0.5">ℹ</span>
            <p className="text-xs text-muted-foreground">{config.partnerNote}</p>
          </div>
        )}
        {config.vip && (
          <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-xl">
            <p className="text-xs text-muted-foreground">
              Accès réservé aux membres <span className="text-primary">Prestige</span> et <span className="text-primary">Élite</span>.{" "}
              <Link to="/membership" className="text-primary hover:underline">Découvrir les abonnements →</Link>
            </p>
          </div>
        )}
      </div>

      {config.highlights && config.highlights.length > 0 && (
        <div className="pt-4 pb-1">
          <p className="px-5 mb-3 text-xs uppercase tracking-[0.15em] text-primary">En images</p>
          <ScrollRow>
            {config.highlights.map((src, i) => (
              <div
                key={i}
                className="shrink-0 overflow-hidden rounded-2xl"
                style={{ width: "110px", height: "110px" }}
              >
                <img src={src} alt={`${config.name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </ScrollRow>
        </div>
      )}

      <div className="py-4">
      <ScrollRow gap={8}>
        {filterPills.map((pill) => (
          <button
            key={pill}
            onClick={() => setActiveFilter(pill)}
            className="shrink-0 px-4 py-2 rounded-full text-xs transition-colors whitespace-nowrap"
            style={{
              background: activeFilter === pill ? "oklch(0.74 0.09 80)" : "oklch(0.14 0.006 60)",
              color: activeFilter === pill ? "oklch(0.08 0.005 60)" : "oklch(0.70 0.01 60)",
              border: activeFilter === pill ? "none" : "1px solid oklch(0.22 0.007 65)",
              fontWeight: activeFilter === pill ? 600 : 400,
            }}
          >
            {pill}
          </button>
        ))}
      </ScrollRow>
      </div>

      <div className="flex items-center justify-between px-5 pb-3">
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground">{list.length}</span> expérience{list.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Aucune expérience avec ce filtre.</p>
            <button onClick={() => setActiveFilter("Tous")} className="text-primary text-sm hover:underline">
              Voir toutes les expériences
            </button>
          </div>
        ) : (
          list.map((e) => (
            <div key={e.id} style={{ aspectRatio: "4 / 3.2" }}>
              <EstablishmentCard establishment={e} showPrice />
            </div>
          ))
        )}
      </div>

    </div>
  );
}
