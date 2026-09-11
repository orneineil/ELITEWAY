import { useParams, Link } from "react-router";
import { useState, useMemo } from "react";
import { establishments } from "../data/establishments";
import { EstablishmentCard } from "../components/EstablishmentCard";
import { ArrowLeft, Gift } from "lucide-react";

const CATEGORY_CONFIG: Record<string, {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  partnerNote?: string;
  vip?: boolean;
}> = {
  gastronomie: {
    name: "Gastronomie",
    subtitle: "Tables d'exception",
    description: "Des bistrots avec vue mer aux adresses gastronomiques confidentielles — toutes soigneusement sélectionnées sur la Côte d'Azur.",
    image: "https://images.unsplash.com/photo-1776993298456-98c71c0e177e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  navigation: {
    name: "Yachts & Bateaux",
    subtitle: "Mer & croisières",
    description: "Voiliers, catamarans et yachts privatisés pour explorer les calanques et les îles de la Méditerranée.",
    image: "https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  "bien-etre": {
    name: "Bien-être & Hôtels",
    subtitle: "Spas, soins & détente",
    description: "Hammams, thalassos, yoga en plein air ou massages vue mer — prenez soin de vous sur la Riviera.",
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  aviation: {
    name: "Aviation",
    subtitle: "Hélicoptères & vols panoramiques",
    description: "Survolez la Côte d'Azur en hélicoptère, tentez l'initiation au pilotage ou rejoignez Monaco en 7 minutes.",
    image: "https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  oenologie: {
    name: "Œnologie",
    subtitle: "Vins, rosés & dégustations",
    description: "Caves historiques, vignobles de l'AOC Bellet, ateliers rosé et bars à vins — l'art du vin provençal accessible à tous.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  evenements: {
    name: "Événements",
    subtitle: "Galas & soirées partenaires",
    description: "EliteWay ne crée pas d'événements. Nous mettons en lumière les meilleures propositions d'entreprises partenaires qui souhaitent les faire connaître à notre communauté.",
    image: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    partnerNote: "Ces événements sont organisés par des entreprises partenaires indépendantes.",
  },
  "offres-exclusives": {
    name: "Offres Exclusives",
    subtitle: "Réservé aux membres Prestige & Élite",
    description: "Tarifs négociés par EliteWay, accès privatifs et expériences sur mesure introuvables ailleurs — uniquement pour nos membres.",
    image: "https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    vip: true,
  },
};

export function CategoryPage() {
  const { categoryId } = useParams();
  const [activeFilter, setActiveFilter] = useState("Tous");

  const config = categoryId ? CATEGORY_CONFIG[categoryId] : null;
  const baseList = establishments.filter((e) => e.category === categoryId);

  // ── Construit des pilules de filtre à partir des tags/features réels ──
  const filterPills = useMemo(() => {
    const counts: Record<string, number> = {};
    baseList.forEach((e) => {
      (e.tags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    });
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([t]) => t);
    return ["Tous", ...top];
  }, [baseList]);

  const list = activeFilter === "Tous"
    ? baseList
    : baseList.filter((e) => (e.tags || []).includes(activeFilter));

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

      <div className="relative overflow-hidden" style={{ height: "260px" }}>
        <img
          src={config.image}
          alt={config.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.3) 0%, var(--background) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 30%, oklch(0.74 0.09 80 / 0.08) 0%, transparent 70%)" }} />

        <Link to="/categories" className="absolute top-4 left-5 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-border/40">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {config.vip && (
          <div className="absolute top-4 right-5 flex items-center gap-1.5 bg-primary/20 border border-primary/40 backdrop-blur-sm rounded-full px-3 py-1">
            <Gift className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary">Membres</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-1">{config.subtitle}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.05 }}>
            {config.name}
          </h1>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 border-b border-border/40">
        <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>
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

      {/* ── Filtres en pilules ────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-4">
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
      </div>

      <div className="flex items-center justify-between px-5 pb-3">
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground">{list.length}</span> expérience{list.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <p className="text-muted-foreground mb-4">Aucune expérience avec ce filtre.</p>
            <button onClick={() => setActiveFilter("Tous")} className="text-primary text-sm hover:underline">
              Voir toutes les expériences
            </button>
          </div>
        ) : (
          list.map((e) => <EstablishmentCard key={e.id} establishment={e} />)
        )}
      </div>

    </div>
  );
}
