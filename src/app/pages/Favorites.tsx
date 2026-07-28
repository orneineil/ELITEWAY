import { Link } from "react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { establishments } from "../data/establishments";
import { EstablishmentCard } from "../components/EstablishmentCard";

const TABS = [
  { id: "all",               label: "Tout" },
  { id: "gastronomie",       label: "Restaurants" },
  { id: "navigation",        label: "Yachts" },
  { id: "bien-etre",         label: "Hôtels & Spa" },
  { id: "evenements",        label: "Événements" },
];

export function Favorites() {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState("all");

  const favoriteEstablishments = establishments.filter((e) => favorites.includes(e.id));

  const filtered = activeTab === "all"
    ? favoriteEstablishments
    : favoriteEstablishments.filter((e) => e.category === activeTab);

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center gap-4 px-5 mb-5">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Heart className="w-6 h-6 fill-primary" />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="leading-tight">Mes Favoris</h1>
          <p className="text-xs text-muted-foreground">
            {favoriteEstablishments.length} établissement{favoriteEstablishments.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 rounded-full bg-card border border-border mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="mb-3">
              {activeTab === "all" ? "Aucun favori pour le moment" : "Aucun favori dans cette catégorie"}
            </h2>
            <p className="text-sm text-muted-foreground mb-7 max-w-xs mx-auto">
              Explorez nos établissements et ajoutez-les à vos favoris pour les retrouver facilement.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm hover:bg-primary/90 transition-colors"
            >
              Découvrir nos services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((establishment) => (
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
