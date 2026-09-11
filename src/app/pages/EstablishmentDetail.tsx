import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { establishments } from "../data/establishments";
import { useFavorites } from "../contexts/FavoritesContext";
import {
  ArrowLeft, Heart, MapPin, Star,
  ChevronLeft, ChevronRight,
} from "lucide-react";

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

function EstablishmentMap({
  coords,
  name,
  address,
}: {
  coords: [number, number];
  name: string;
  address?: string;
}) {
  const [lat, lng] = coords;
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 relative" style={{ height: 160 }}>
      <iframe
        title={`Carte ${name}`}
        src={src}
        width="100%"
        height="160"
        style={{ border: 0, display: "block" }}
        loading="lazy"
      />
      {address && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-background/80 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground truncate">📍 {address}</p>
        </div>
      )}
    </div>
  );
}

export function EstablishmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const establishment = establishments.find((e) => e.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4" style={{ fontFamily: "var(--font-heading)" }}>Établissement non trouvé</h2>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(establishment.id);
  const galleryImages = establishment.gallery?.length
    ? establishment.gallery
    : [establishment.imageUrl];

  const categoryLabels: Record<string, string> = {
    gastronomie: "Gastronomie",
    navigation: "Navigation",
    "bien-etre": "Bien-être",
    aviation: "Aviation",
    oenologie: "Œnologie",
    evenements: "Événements",
    "offres-exclusives": "Exclusif",
  };

  const similar = establishments
    .filter((e) => e.category === establishment.category && e.id !== establishment.id)
    .slice(0, 3);

  const reviews = establishment.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : establishment.rating;

  const description = establishment.longDescription;
  const shortDescription = description.length > 160 && !showFullDescription
    ? description.slice(0, 160).trim() + "…"
    : description;

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* GALLERY */}
      <div className="relative" style={{ height: 300 }}>
        <img
          src={galleryImages[galleryIndex]}
          alt={establishment.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-background/70 backdrop-blur-md flex items-center justify-center border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => toggleFavorite(establishment.id)}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-background/70 backdrop-blur-md flex items-center justify-center border border-white/10"
        >
          <Heart
            className={`w-5 h-5 transition-all ${favorited ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs bg-primary text-primary-foreground">
            {categoryLabels[establishment.category]}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs bg-background/70 backdrop-blur-sm border border-white/10">
            {establishment.price}
          </span>
        </div>

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGalleryIndex((i) => (i + 1) % galleryImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 right-4 flex items-center gap-1">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === galleryIndex ? "bg-primary w-4" : "bg-white/50 w-1.5"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-5 pt-5 space-y-6">

        {/* INFOS PRINCIPALES */}
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }} className="leading-tight mb-2">
            {establishment.name}
          </h1>
          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={establishment.rating} />
            <span className="text-sm text-primary">{establishment.rating}</span>
            {reviews.length > 0 && (
              <span className="text-xs text-muted-foreground">({reviews.length} avis)</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{establishment.city}</span>
          </div>
          {establishment.tags && (
            <div className="flex flex-wrap gap-2">
              {establishment.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DESCRIPTION (courte, extensible) */}
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {shortDescription}
            {description.length > 160 && (
              <button
                onClick={() => setShowFullDescription((v) => !v)}
                className="text-primary ml-1 hover:underline"
              >
                {showFullDescription ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </p>
        </div>

        {/* PRIX & RÉSERVATION */}
        <div className="bg-card border border-border/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Tarifs</p>
              {establishment.priceRange ? (
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-primary">
                  {establishment.priceRange.min} € – {establishment.priceRange.max} €
                </p>
              ) : (
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-primary">
                  {establishment.price}
                </p>
              )}
            </div>
          </div>
          <Link
            to={`/establishment/${establishment.id}/reserve`}
            className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm text-center font-medium hover:bg-primary/90 transition-colors"
          >
            Réserver maintenant
          </Link>
        </div>

        {/* CARTE INTERACTIVE */}
        {establishment.mapCoords && (
          <EstablishmentMap
            coords={establishment.mapCoords}
            name={establishment.name}
            address={establishment.address}
          />
        )}

        {/* AVIS — condensé */}
        {reviews.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }} className="text-primary leading-none">
                {avgRating.toFixed(1)}
              </p>
              <div>
                <StarRating rating={avgRating} />
                <p className="text-xs text-muted-foreground mt-0.5">{reviews.length} avis</p>
              </div>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-2">
                <img src={reviews[0].avatar} alt={reviews[0].author} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{reviews[0].author}</p>
                  <StarRating rating={reviews[0].rating} size={11} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{reviews[0].comment}</p>
            </div>
          </div>
        )}

        {/* ÉTABLISSEMENTS SIMILAIRES */}
        {similar.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Vous aimerez aussi</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {similar.map((est) => (
                <Link
                  key={est.id}
                  to={`/establishment/${est.id}`}
                  className="group shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
                  style={{ width: 160 }}
                >
                  <div className="relative overflow-hidden" style={{ height: 100 }}>
                    <img
                      src={est.imageUrl}
                      alt={est.name}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                      <span className="text-[10px]">{est.rating}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem" }} className="leading-tight mb-1">{est.name}</p>
                    <p className="text-[10px] text-primary">{est.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
