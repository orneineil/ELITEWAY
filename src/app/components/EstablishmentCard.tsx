import { useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { Establishment } from "../data/establishments";
import { useFavorites } from "../contexts/FavoritesContext";
import { Link } from "react-router";

interface EstablishmentCardProps {
  establishment: Establishment;
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(establishment.id);
  // Certaines photos sources sont en basse résolution : on évite de les étirer
  // (ce qui les rend floues) en les affichant en taille native sur un fond flouté.
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const isLowRes = naturalWidth !== null && naturalWidth < 500;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(establishment.id);
  };

  return (
    <Link
      to={`/establishment/${establishment.id}`}
      className="group block relative overflow-hidden rounded-2xl border border-border/60 bg-black"
      style={{ aspectRatio: "4 / 3" }}
    >
      {isLowRes && (
        <img
          src={establishment.imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(20px) brightness(0.5)", transform: "scale(1.2)" }}
        />
      )}
      <img
        src={establishment.imageUrl}
        alt={establishment.name}
        onLoad={(e) => setNaturalWidth(e.currentTarget.naturalWidth)}
        className={`absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 ${isLowRes ? "object-contain" : "object-cover"}`}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(10,8,6,0.05) 0%, transparent 30%, rgba(10,8,6,0.55) 68%, rgba(10,8,6,0.92) 100%)" }}
      />

      {/* Price range */}
      <span
        className="absolute top-2.5 left-2.5 text-[10px] tracking-[0.1em] px-2 py-1 rounded-full backdrop-blur-sm"
        style={{ background: "oklch(0.08 0.005 60 / 0.65)", color: "oklch(0.74 0.09 80)" }}
      >
        {establishment.price}
      </span>

      {/* Favorite */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center"
        style={{ background: "oklch(0.08 0.005 60 / 0.65)" }}
      >
        <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-primary text-primary" : "text-foreground/90"}`} />
      </button>

      {/* Legend: name, rating, location */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="leading-snug truncate min-w-0 flex-1">
            {establishment.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs">{establishment.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs min-w-0">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate min-w-0">{establishment.city || establishment.location}</span>
        </div>
      </div>
    </Link>
  );
}
