import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Star, ChevronRight, Utensils, Sailboat, Sparkles, Plane, Wine, Gift } from "lucide-react";
import { establishments } from "../data/establishments";

const CATEGORY_FILTERS = [
  { id: "all",               label: "Tout",     icon: null },
  { id: "gastronomie",       label: "Tables",   icon: Utensils },
  { id: "navigation",        label: "Yachts",   icon: Sailboat },
  { id: "bien-etre",         label: "Spa",      icon: Sparkles },
  { id: "aviation",          label: "Aviation", icon: Plane },
  { id: "oenologie",         label: "Vins",     icon: Wine },
  { id: "offres-exclusives", label: "Exclusif", icon: Gift },
];

// Côte d'Azur bounding box for OpenStreetMap embed
const BBOX = "6.0,43.2,8.0,44.2";

export function MapPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = activeFilter === "all"
    ? establishments
    : establishments.filter((e) => e.category === activeFilter);

  const selected = establishments.find((e) => e.id === selectedId);

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik`;

  return (
    <div className="max-w-lg mx-auto pb-28">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-0.5">Côte d'Azur</p>
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }}>Carte interactive</h1>
          <span className="text-xs text-muted-foreground">{filtered.length} adresses</span>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
        {CATEGORY_FILTERS.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                activeFilter === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* OpenStreetMap iframe embed — no react-leaflet */}
      <div className="mx-5 mb-4 rounded-2xl overflow-hidden border border-border/60 relative" style={{ height: 280 }}>
        <iframe
          title="Carte Côte d'Azur EliteWay"
          src={mapSrc}
          width="100%"
          height="280"
          style={{ border: 0, display: "block" }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-lg border border-border/60 flex items-center gap-1.5 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs">{filtered.length} expériences</span>
        </div>
      </div>

      {/* City quick-jump */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 mb-4">
        {["Nice", "Cannes", "Monaco", "Antibes", "Saint-Tropez"].map((city) => {
          const count = filtered.filter((e) => e.city === city).length;
          return (
            <div key={city} className="shrink-0 flex flex-col items-center px-4 py-2.5 bg-card border border-border/60 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-primary mb-1" />
              <span className="text-xs">{city}</span>
              {count > 0 && <span className="text-[10px] text-muted-foreground">{count}</span>}
            </div>
          );
        })}
      </div>

      {/* Selected card */}
      {selected && (
        <div className="mx-5 mb-4">
          <Link to={`/establishment/${selected.id}`} className="block bg-card border border-primary/30 rounded-2xl overflow-hidden">
            <div className="flex">
              <div className="w-24 h-20 shrink-0">
                <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="leading-tight">{selected.name}</p>
                  <button onClick={(e) => { e.preventDefault(); setSelectedId(null); }} className="text-muted-foreground text-xs shrink-0 hover:text-foreground">✕</button>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />{selected.location}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs">{selected.rating}</span>
                  </div>
                  <span className="text-xs text-primary">{selected.price}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* List */}
      <div className="px-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">
          {activeFilter === "all" ? "Toutes les adresses" : CATEGORY_FILTERS.find(c => c.id === activeFilter)?.label}
        </p>
        <div className="space-y-3">
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id === selectedId ? null : e.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                selectedId === e.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              <div className="w-14 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem" }} className="leading-tight truncate">{e.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{e.city}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-primary">{e.price}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs">{e.rating}</span>
                </div>
              </div>
              <Link
                to={`/establishment/${e.id}`}
                onClick={(ev) => ev.stopPropagation()}
                className="ml-1 shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </Link>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
