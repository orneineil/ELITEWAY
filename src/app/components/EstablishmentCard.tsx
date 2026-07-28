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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(establishment.id);
  };

  return (
    <Link
      to={`/establishment/${establishment.id}`}
      className="group block relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            favorited ? "fill-primary text-primary" : "text-foreground"
          }`}
        />
      </button>

      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={establishment.imageUrl}
          alt={establishment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-primary">
            {establishment.price}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm">{establishment.rating}</span>
          </div>
        </div>

        <h3 className="mb-2">{establishment.name}</h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {establishment.description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{establishment.city || establishment.location}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {establishment.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
