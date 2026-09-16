import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { establishments } from "../data/establishments";
import { useFavorites } from "../contexts/FavoritesContext";
import { ScrollRow } from "../components/ScrollRow";
import {
  ArrowLeft, Heart, MapPin, Star, Gem, Clock, Users, Shirt,
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
    <div className="rounded-2xl overflow-hidden border border-border/60 relative" style={{ height: 138 }}>
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
  // Certaines photos sources sont en basse résolution (petites miniatures) — on
  // détecte leur taille réelle au chargement pour éviter de les étirer en plein
  // écran (ce qui les rend floues) : on les affiche alors en taille native sur
  // un fond flouté, plutôt qu'en "cover" agrandi.
  const [galleryNaturalWidth, setGalleryNaturalWidth] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setGalleryNaturalWidth(null);
  }, [galleryIndex, id]);

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
    hotels: "Hôtels",
    navigation: "Navigation",
    "bien-etre": "Bien-être",
    aviation: "Aviation",
    oenologie: "Œnologie",
    evenements: "Événements",
    "offres-exclusives": "Exclusif",
    "sport-loisirs": "Sport & Loisirs",
  };

  const similar = establishments
    .filter((e) => e.category === establishment.category && e.id !== establishment.id)
    .slice(0, 3);

  const reviews = establishment.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : establishment.rating;

  const description = establishment.longDescription;
  const truncateAtWord = (text: string, max: number) => {
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  };
  const shortDescription = description.length > 160 && !showFullDescription
    ? truncateAtWord(description, 160) + "…"
    : description;

  const isLowResPhoto = galleryNaturalWidth !== null && galleryNaturalWidth < 500;

  const practicalInfo = [
    establishment.hours ? { icon: Clock, label: `${establishment.hours.open} – ${establishment.hours.close}`, sub: establishment.hours.days } : null,
    establishment.capacity ? { icon: Users, label: establishment.capacity, sub: "Capacité" } : null,
    establishment.dressCode ? { icon: Shirt, label: establishment.dressCode, sub: "Tenue" } : null,
  ].filter(Boolean) as { icon: typeof Clock; label: string; sub?: string }[];

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* HERO — immersif, plus une vignette de fiche produit */}
      <div className="relative bg-black overflow-hidden" style={{ height: "56svh", minHeight: 340, maxHeight: 480 }}>
        {isLowResPhoto && (
          <img
            src={galleryImages[galleryIndex]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(28px) brightness(0.5)", transform: "scale(1.2)" }}
          />
        )}
        <img
          src={galleryImages[galleryIndex]}
          alt={establishment.name}
          onLoad={(e) => setGalleryNaturalWidth(e.currentTarget.naturalWidth)}
          className={`relative w-full h-full ${isLowResPhoto ? "object-contain" : "object-cover"}`}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.4) 0%, transparent 35%, var(--background) 96%)" }} />

        <button
          onClick={() => navigate(-1)}
          className="absolute w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: "16px" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => toggleFavorite(establishment.id)}
          className="absolute w-9 h-9 flex items-center justify-center"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", right: "8px" }}
        >
          <Heart
            className={`w-5 h-5 transition-all drop-shadow-sm ${favorited ? "fill-primary text-primary" : "text-white"}`}
          />
        </button>

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
            <div className="absolute bottom-6 right-4 flex items-center gap-1">
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

        {/* Nom et localisation portés par le hero, pas relégués en dessous */}
        <div className="absolute bottom-6 left-5 right-20">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs bg-primary text-primary-foreground">
              {categoryLabels[establishment.category]}
            </span>
            {establishment.exclusive && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-background/70 backdrop-blur-sm border border-primary/40 text-primary">
                <Gem className="w-3 h-3" /> EliteWay Selection
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem" }} className="leading-tight mb-1.5">
            {establishment.name}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-foreground/80">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{establishment.city}</span>
            <span className="text-foreground/40">·</span>
            <StarRating rating={establishment.rating} size={12} />
            <span className="text-primary">{establishment.rating}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-7 space-y-8">

        {/* POURQUOI ELITEWAY — le récit avant le prix */}
        {establishment.whyEliteWay && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
            <p className="text-[10px] uppercase tracking-[0.15em] text-primary mb-2">Pourquoi EliteWay l'a sélectionné</p>
            <p className="text-sm text-foreground/85 leading-relaxed italic" style={{ fontFamily: "var(--font-heading)" }}>
              {establishment.whyEliteWay}
            </p>
          </div>
        )}

        {/* DESCRIPTION (courte, extensible) */}
        <div>
          <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
            {shortDescription}
          </p>
          {description.length > 160 && (
            <button
              onClick={() => setShowFullDescription((v) => !v)}
              className="text-primary text-sm mt-2 hover:underline"
            >
              {showFullDescription ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>

        {/* SIGNATURE FEATURES */}
        {establishment.tags && establishment.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {establishment.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* INFORMATIONS PRATIQUES */}
        {practicalInfo.length > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-2">
            {practicalInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <div key={i} className="p-3 rounded-2xl bg-card border border-border/40 text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-xs leading-tight mb-0.5">{info.label}</p>
                  {info.sub && <p className="text-[10px] text-muted-foreground">{info.sub}</p>}
                </div>
              );
            })}
          </div>
        )}

        {/* PRIX & RÉSERVATION — vient après le récit, jamais avant */}
        <div className="pt-6 border-t border-border/30">
          <div className="flex items-center justify-between mb-5">
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

        {/* CARTE INTERACTIVE — retirée temporairement (sera réintégrée plus tard) */}

        {/* AVIS — condensé */}
        {reviews.length > 0 && (
          <div className="pt-6 border-t border-border/30">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Avis clients</p>
            <div className="flex items-center gap-3 mb-5">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }} className="text-primary leading-none">
                {avgRating.toFixed(1)}
              </p>
              <div>
                <StarRating rating={avgRating} />
                <p className="text-xs text-muted-foreground mt-0.5">{reviews.length} avis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src={reviews[0].avatar} alt={reviews[0].author} className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight mb-1">{reviews[0].author}</p>
                <StarRating rating={reviews[0].rating} size={11} />
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{reviews[0].comment}</p>
              </div>
            </div>
          </div>
        )}

        {/* ÉTABLISSEMENTS SIMILAIRES */}
        {similar.length > 0 && (
          <div className="mt-4 pt-10 border-t border-border/30">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-6">Vous aimerez aussi</p>
            <div className="-mx-5">
            <ScrollRow gap={16}>
              {similar.map((est) => (
                <Link
                  key={est.id}
                  to={`/establishment/${est.id}`}
                  className="group shrink-0 bg-card rounded-2xl overflow-hidden transition-colors"
                  style={{ width: 190 }}
                >
                  <div className="relative overflow-hidden" style={{ height: 120 }}>
                    <img
                      src={est.imageUrl}
                      alt={est.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                      <span className="text-[10px]">{est.rating}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="leading-tight mb-1">{est.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{est.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollRow>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
