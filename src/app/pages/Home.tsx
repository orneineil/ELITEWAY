import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Search, ChevronRight, MapPin, Locate, Loader, Crown, Check, Sparkles, ArrowRight,
  UtensilsCrossed, BedDouble, Sailboat, Flower2, Plane, Wine, CalendarDays, Gem, Trophy,
} from "lucide-react";
import { establishments, cityCoordinates, Establishment } from "../data/establishments";
import { ScrollRow } from "../components/ScrollRow";
import { EstablishmentCard } from "../components/EstablishmentCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { MOODS } from "../data/momentEngine";

// Ask EliteWay — LE point d'entrée du produit, pas une fonctionnalité parmi
// d'autres. Une phrase libre OU une humeur en un tap : les deux mènent au
// même moteur de composition (/moment). Deux habillages : "hero" — posé en
// transparence sur l'image d'accueil, sans encadré, c'est la première chose
// que l'on touche — et "boxed" — encadré, réutilisable ailleurs (Explorer…).
function AskEliteWay({ variant = "boxed" }: { variant?: "hero" | "boxed" }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(text.trim() ? `/moment?q=${encodeURIComponent(text.trim())}` : "/moment");
  };

  const isHero = variant === "hero";

  return (
    <div className={isHero ? "" : "rounded-2xl border p-5"} style={isHero ? undefined : { borderColor: "oklch(0.74 0.0792 80 / 0.35)", background: "oklch(0.13 0.03 256)" }}>
      <div className={`flex items-center gap-2 ${isHero ? "mb-3 justify-center" : "mb-3.5"}`}>
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Ask EliteWay</p>
      </div>
      {isHero ? (
        <p
          style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}
          className="leading-snug mb-4 text-center text-foreground"
        >
          Dites-nous ce que vous voulez vivre.
        </p>
      ) : (
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem" }} className="leading-snug mb-4">
          Dites-nous ce que vous voulez vivre.
        </p>
      )}
      <form onSubmit={handleAsk} className="mb-4">
        <div
          className="flex items-center rounded-full overflow-hidden"
          style={
            isHero
              ? { border: "1px solid oklch(0.74 0.0792 80 / 0.45)", background: "oklch(0.08 0.03 256 / 0.6)", backdropFilter: "blur(10px)" }
              : { border: "1px solid var(--border)", background: "oklch(0.22 0.03 252 / 0.5)" }
          }
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Une soirée romantique à Cannes, samedi…"
            style={{ fontSize: "0.85rem" }}
            className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-3.5 focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
          />
          <button
            type="submit"
            className="w-9 h-9 mr-1.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-transform active:scale-90"
            aria-label="Envoyer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
      <div className={`flex flex-wrap gap-2 ${isHero ? "justify-center" : ""}`}>
        {MOODS.map((m) => (
          <Link
            key={m.key}
            to={`/moment?mood=${m.key}`}
            className="px-3 py-1.5 rounded-full text-xs border transition-colors"
            style={
              isHero
                ? { borderColor: "oklch(1 0 0 / 0.22)", color: "oklch(0.96 0.011 85 / 0.85)", background: "oklch(0.08 0.03 256 / 0.35)" }
                : undefined
            }
          >
            {m.label}
          </Link>
        ))}
        <Link
          to="/moment?mood=surprise"
          className="px-3 py-1.5 rounded-full text-xs border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
        >
          Surprenez-moi
        </Link>
      </div>
    </div>
  );
}

const JOINED_EVENTS_KEY = "eliteway-events-joined";

const CATEGORIES = [
  { id: "gastronomie",       name: "Gastronomie",       icon: UtensilsCrossed },
  { id: "hotels",            name: "Hôtels",            icon: BedDouble },
  { id: "navigation",        name: "Navigation",        icon: Sailboat },
  { id: "bien-etre",         name: "Bien-être",         icon: Flower2 },
  { id: "aviation",          name: "Aviation",          icon: Plane },
  { id: "oenologie",         name: "Œnologie",          icon: Wine },
  { id: "evenements",        name: "Événements",        icon: CalendarDays },
  { id: "offres-exclusives", name: "Offres Exclusives", icon: Gem },
  { id: "sport-loisirs",     name: "Sport & Loisirs",   icon: Trophy },
];

// La sélection éditoriale mise en avant en grand sur l'accueil — un univers par ligne.
const SELECTION = [
  { category: "gastronomie", label: "Gastronomie" },
  { category: "navigation",  label: "Yachts & Navigation" },
  { category: "bien-etre",   label: "Bien-être & Spas" },
  { category: "hotels",      label: "Hôtels d'exception" },
  { category: "aviation",    label: "Aviation privée" },
  { category: "oenologie",   label: "Œnologie" },
] as const;

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestCityName(userLat: number, userLng: number): string {
  let nearest = "";
  let minDist = Infinity;
  for (const [city, [lat, lng]] of Object.entries(cityCoordinates)) {
    const d = getDistanceKm(userLat, userLng, lat, lng);
    if (d < minDist) { minDist = d; nearest = city; }
  }
  return nearest;
}

type GeoStatus = "idle" | "loading" | "success" | "denied" | "error";

export function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  // ── La sélection EliteWay : le meilleur de chaque univers phare ──────────
  const selectionItems = SELECTION
    .map((s) => {
      const list = establishments.filter((e) => e.category === s.category);
      const best = list.sort((a, b) => b.rating - a.rating)[0];
      return best ? { ...s, establishment: best } : null;
    })
    .filter((s): s is { category: string; label: string; establishment: Establishment } => Boolean(s));

  const selectionIds = new Set(selectionItems.map((s) => s.establishment.id));

  // ── Pour vous : recommandations basées sur les favoris ───────────────────
  const favoriteEstablishments = establishments.filter((e) => favorites.includes(e.id));
  const favoriteCategories = Array.from(new Set(favoriteEstablishments.map((e) => e.category)));
  const recommended = favoriteCategories.length > 0
    ? establishments
        .filter((e) => favoriteCategories.includes(e.category) && !favorites.includes(e.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    : [];

  // ── Les expériences du moment : le reste des mieux notées, en variété ────
  const moment = establishments
    .filter((e) => e.category !== "offres-exclusives" && e.category !== "evenements" && !selectionIds.has(e.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // ── Événements exclusifs à venir ──────────────────────────────────────────
  const exclusiveEvents = establishments.filter((e) => e.category === "evenements");
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(JOINED_EVENTS_KEY);
      if (saved) setJoinedEvents(JSON.parse(saved));
    } catch {
      // stockage indisponible
    }
  }, []);

  const toggleJoin = (id: string) => {
    setJoinedEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id];
      try { localStorage.setItem(JOINED_EVENTS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  // ── EliteWay Exclusive : offres réservées aux membres éligibles ──────────
  const exclusiveOffers = establishments.filter((e) => e.category === "offres-exclusives");

  // ── À proximité ────────────────────────────────────────────────────────
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [nearby, setNearby] = useState<Establishment[]>([]);
  const [nearestCity, setNearestCity] = useState("");

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const found = establishments
          .filter((e) => {
            const coords = cityCoordinates[e.city];
            return coords ? getDistanceKm(latitude, longitude, coords[0], coords[1]) <= 300 : false;
          })
          .slice(0, 8);
        setNearestCity(getNearestCityName(latitude, longitude));
        setNearby(found);
        setGeoStatus("success");
      },
      () => setGeoStatus("denied"),
      { timeout: 8000 }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* ── Hero immersif — Ask EliteWay EST le hero ─────────────────────
          Doctrine produit : on ne demande pas "que voulez-vous réserver ?"
          mais "que voulez-vous vivre ?". Ce n'est plus un module posé sous
          l'image d'accueil : c'est la première chose que l'on touche, en
          transparence sur l'image, avant même le catalogue. La recherche
          classique et la grille de catégories restent accessibles juste
          en dessous, comme chemin secondaire pour qui préfère parcourir. */}
      <div className="relative overflow-hidden" style={{ height: "88svh", minHeight: "620px", maxHeight: "840px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1580422666359-7160890d8c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400')",
            filter: "brightness(1.02) saturate(1.1)",
            animation: "heroZoom1 22s ease-out forwards",
          }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.05) 22%, rgba(10,8,6,0.1) 40%, rgba(10,8,6,0.9) 90%, var(--background) 100%)",
        }} />

        {/* Statement éditorial — signature de marque, discrète */}
        <div className="absolute inset-x-0 flex flex-col items-center text-center px-8" style={{ top: "calc(env(safe-area-inset-top, 0px) + 64px)" }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Côte d'Azur</p>
          <h1
            style={{ fontFamily: "var(--font-heading)", fontSize: "2.1rem", lineHeight: 1.1, letterSpacing: "0.01em" }}
            className="text-foreground mb-2"
          >
            L'art des expériences<br />d'exception
          </h1>
        </div>

        {/* Ask EliteWay — l'entrée principale, en bas du hero */}
        <div className="absolute inset-x-0 px-6" style={{ bottom: "6%" }}>
          <AskEliteWay variant="hero" />
          <a
            href="#univers"
            className="mt-5 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground/90 transition-colors"
          >
            Parcourir les univers
            <ChevronRight className="w-3 h-3 rotate-90" />
          </a>
        </div>
      </div>

      {/* ── Recherche directe + accès rapide aux univers ────────────────
          Chemin secondaire assumé pour qui sait déjà ce qu'il cherche. */}
      <section id="univers" className="px-5 pt-8 mb-14">
        <form onSubmit={handleSearch} className="mb-5">
          <div className="relative flex items-center rounded-full overflow-hidden border border-border/60 bg-card">
            <Search className="w-3.5 h-3.5 text-primary ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ou cherchez directement un lieu, une ville…"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}
              className="flex-1 min-w-0 bg-transparent pl-2.5 pr-3 py-2.5 focus:outline-none placeholder:text-muted-foreground/70 text-foreground"
            />
          </div>
        </form>
        <div className="grid grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex flex-col items-center justify-center gap-2.5 py-5 px-1.5 rounded-2xl text-center transition-colors hover:bg-accent/40"
                style={{ background: "oklch(0.12 0.03 256)" }}
              >
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                <span className="text-[9.5px] uppercase tracking-[0.06em] leading-tight text-foreground">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── La sélection EliteWay — grandes cartes éditoriales ──────────── */}
      <section className="mb-14">
        <div className="px-5 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Curation</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>La sélection EliteWay</h2>
        </div>
        <div className="px-5 space-y-8">
          {selectionItems.map(({ category, label, establishment }) => (
            <div key={category}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2.5">{label}</p>
              <div style={{ aspectRatio: "4 / 3.2" }}>
                <EstablishmentCard establishment={establishment} showPrice />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pour vous ────────────────────────────────────────────────── */}
      {recommended.length > 0 && (
        <section className="mb-14">
          <div className="px-5 mb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Personnalisé</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>Pour vous</h2>
          </div>
          <ScrollRow>
            {recommended.map((e) => (
              <div key={e.id} className="shrink-0" style={{ width: 250, aspectRatio: "4 / 3.2" }}>
                <EstablishmentCard establishment={e} showPrice />
              </div>
            ))}
          </ScrollRow>
        </section>
      )}

      {/* ── À proximité ──────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="px-5 mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Localisation</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>À proximité</h2>
        </div>

        {geoStatus === "idle" && (
          <div className="px-5">
            <button
              onClick={handleLocate}
              className="w-full flex items-center justify-center gap-2 py-4 border border-border/60 rounded-2xl hover:border-primary/50 hover:text-primary transition-colors text-sm"
            >
              <Locate className="w-4 h-4" />
              Activer la localisation
            </button>
          </div>
        )}

        {geoStatus === "loading" && (
          <div className="px-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            Localisation en cours…
          </div>
        )}

        {geoStatus === "denied" && (
          <p className="px-5 text-sm text-muted-foreground">
            Localisation refusée — autorisez l'accès dans les paramètres de votre navigateur pour voir les expériences autour de vous.
          </p>
        )}

        {geoStatus === "error" && (
          <p className="px-5 text-sm text-muted-foreground">
            La géolocalisation n'est pas disponible sur cet appareil.
          </p>
        )}

        {geoStatus === "success" && (
          <>
            <div className="flex items-center gap-1.5 px-5 mb-4 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {nearby.length > 0
                ? `${nearby.length} expérience${nearby.length > 1 ? "s" : ""} près de ${nearestCity}`
                : `Aucune expérience trouvée près de ${nearestCity}.`}
            </div>
            {nearby.length > 0 && (
              <ScrollRow>
                {nearby.map((e) => (
                  <div key={e.id} className="shrink-0" style={{ width: 250, aspectRatio: "4 / 3.2" }}>
                    <EstablishmentCard establishment={e} showPrice />
                  </div>
                ))}
              </ScrollRow>
            )}
          </>
        )}
      </section>

      {/* ── Les expériences du moment ────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-end justify-between px-5 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Éditorial</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>Les expériences du moment</h2>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
            Voir tout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <ScrollRow>
          {moment.map((e) => (
            <div key={e.id} className="shrink-0" style={{ width: 250, aspectRatio: "4 / 3.2" }}>
              <EstablishmentCard establishment={e} showPrice />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ── Événements exclusifs ─────────────────────────────────────── */}
      {exclusiveEvents.length > 0 && (
        <section className="mb-14">
          <div className="flex items-end justify-between px-5 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Agenda</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>Événements exclusifs</h2>
            </div>
            <Link to="/category/evenements" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ScrollRow>
            {exclusiveEvents.map((event) => {
              const joined = joinedEvents.includes(event.id);
              return (
                <div key={event.id} className="shrink-0 bg-card rounded-2xl overflow-hidden flex flex-col" style={{ width: 230 }}>
                  <Link to={`/establishment/${event.id}`} className="relative block" style={{ height: 120 }}>
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px]">
                      Membres
                    </div>
                  </Link>
                  <div className="p-3.5 flex flex-col flex-1">
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="leading-tight mb-1 line-clamp-1">{event.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">{event.city}</p>
                    <button
                      onClick={() => toggleJoin(event.id)}
                      className={`mt-auto w-full py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
                        joined ? "bg-emerald-500/10 text-emerald-400" : "bg-primary text-primary-foreground hover:bg-primary/85"
                      }`}
                    >
                      {joined ? (<><Check className="w-3.5 h-3.5" /> Vous participez</>) : "Je participe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </ScrollRow>
        </section>
      )}

      {/* ── EliteWay Exclusive ───────────────────────────────────────── */}
      {exclusiveOffers.length > 0 && (
        <section className="mb-4">
          <div className="px-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs uppercase tracking-[0.2em] text-primary">EliteWay Exclusive</p>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="mb-1.5">Réservé à nos membres</h2>
            <p className="text-xs text-muted-foreground">Accès Prestige & Élite requis pour réserver ces expériences.</p>
          </div>
          <ScrollRow>
            {exclusiveOffers.map((e) => (
              <div key={e.id} className="shrink-0" style={{ width: 250, aspectRatio: "4 / 3.2" }}>
                <EstablishmentCard establishment={e} showPrice />
              </div>
            ))}
          </ScrollRow>
          <div className="px-5 mt-4">
            <Link to="/membership" className="text-xs text-primary hover:underline">
              Découvrir les avantages Prestige & Élite →
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
