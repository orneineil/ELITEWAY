import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Search, SlidersHorizontal, ArrowRight, ChevronRight,
  UtensilsCrossed, BedDouble, Sailboat, Flower2, Plane, Wine, CalendarDays, Gem, Trophy, Check, Sparkles,
} from "lucide-react";
import { establishments } from "../data/establishments";
import { ScrollRow } from "../components/ScrollRow";
import { useFavorites } from "../contexts/FavoritesContext";

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

export function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  // Une sélection diversifiée : le mieux noté de chaque univers, pas seulement la gastronomie.
  const featured = CATEGORIES
    .filter((c) => c.id !== "offres-exclusives")
    .map((c) => {
      const list = establishments.filter((e) => e.category === c.id);
      return list.sort((a, b) => b.rating - a.rating)[0];
    })
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  // Recommandé pour vous : à partir des catégories déjà mises en favori,
  // on propose d'autres adresses bien notées de ces mêmes univers.
  const favoriteEstablishments = establishments.filter((e) => favorites.includes(e.id));
  const favoriteCategories = Array.from(new Set(favoriteEstablishments.map((e) => e.category)));
  const recommended = favoriteCategories.length > 0
    ? establishments
        .filter((e) => favoriteCategories.includes(e.category) && !favorites.includes(e.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    : [];

  // Événements exclusifs à venir, réservés à la communauté EliteWay.
  const exclusiveEvents = establishments.filter((e) => e.category === "evenements");
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(JOINED_EVENTS_KEY);
      if (saved) setJoinedEvents(JSON.parse(saved));
    } catch {
      // stockage indisponible — l'inscription reste fonctionnelle pour la session en cours
    }
  }, []);

  const toggleJoin = (id: string) => {
    setJoinedEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id];
      try {
        localStorage.setItem(JOINED_EVENTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* ── Hero (header floats transparently on top) ──────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "56svh", minHeight: "400px", maxHeight: "560px" }}>

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1580422666359-7160890d8c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200')",
            filter: "brightness(1.05) saturate(1.08)",
          }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(10,8,6,0.62) 0%, rgba(10,8,6,0.05) 26%, rgba(10,8,6,0.1) 52%, rgba(10,8,6,0.78) 86%, var(--background) 100%)",
        }} />

        {/* Search bar */}
        <form onSubmit={handleSearch} className="absolute inset-x-0 px-6" style={{ bottom: "30px" }}>
          <div
            className="relative flex items-center rounded-full overflow-hidden"
            style={{
              border: "1px solid oklch(0.74 0.09 80 / 0.55)",
              background: "oklch(0.08 0.005 60 / 0.82)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Search className="w-4 h-4 text-primary ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un lieu, une expérience…"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem" }}
              className="flex-1 min-w-0 bg-transparent pl-3 pr-2 py-3.5 focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full mr-1.5 flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.74 0.09 80)" }}
            >
              <SlidersHorizontal className="w-4 h-4" style={{ color: "oklch(0.08 0.005 60)" }} />
            </button>
          </div>
        </form>
      </div>

      {/* ── Nos catégories (grille 4x2) ──────────────────────────────── */}
      <section className="px-5 pt-8 mb-12">
        <div className="grid grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex flex-col items-center justify-center gap-2.5 py-5 px-1.5 rounded-2xl text-center transition-colors hover:bg-accent/40"
                style={{
                  background: "oklch(0.12 0.006 60)",
                }}
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

      {/* ── Recommandé pour vous (basé sur vos favoris) ─────────────────── */}
      {recommended.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 px-5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <p
              style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", letterSpacing: "0.14em" }}
              className="uppercase text-foreground"
            >
              Recommandé pour vous
            </p>
          </div>
          <ScrollRow>
            {recommended.map((e) => (
              <Link
                key={e.id}
                to={`/establishment/${e.id}`}
                className="shrink-0 rounded-2xl overflow-hidden relative"
                style={{ width: 140, height: 140 }}
              >
                <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white leading-tight truncate">{e.name}</p>
                </div>
              </Link>
            ))}
          </ScrollRow>
        </section>
      )}

      {/* ── Bannière expériences ─────────────────────────────────────── */}
      <section className="px-5 mb-12">
        <Link
          to="/categories"
          className="relative block overflow-hidden rounded-2xl"
          style={{ aspectRatio: "16 / 7.4" }}
        >
          <img
            src="/banner-experiences.jpg"
            alt="Des expériences uniques sur la Côte d'Azur"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, oklch(0.08 0.005 60 / 0.94) 0%, oklch(0.08 0.005 60 / 0.62) 42%, transparent 72%)" }}
          />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-5" style={{ maxWidth: "64%" }}>
            <p
              style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", lineHeight: 1.3, letterSpacing: "0.05em" }}
              className="uppercase text-foreground mb-3"
            >
              Des expériences<br />uniques<br />sur la Côte d'Azur
            </p>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </Link>
      </section>

      {/* ── Sélection du moment ──────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-end justify-between px-5 mb-4">
          <p
            style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", letterSpacing: "0.14em" }}
            className="uppercase text-foreground"
          >
            Sélection du moment
          </p>
          <Link to="/categories" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Voir tout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <ScrollRow>
          {featured.map((e) => (
            <Link
              key={e.id}
              to={`/establishment/${e.id}`}
              className="shrink-0 rounded-2xl overflow-hidden relative"
              style={{ width: 140, height: 140 }}
            >
              <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white leading-tight truncate">{e.name}</p>
              </div>
            </Link>
          ))}
        </ScrollRow>
      </section>

      {/* ── Événements exclusifs ─────────────────────────────────────── */}
      {exclusiveEvents.length > 0 && (
        <section className="mb-4">
          <div className="flex items-end justify-between px-5 mb-4">
            <p
              style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", letterSpacing: "0.14em" }}
              className="uppercase text-foreground"
            >
              Événements exclusifs
            </p>
            <Link to="/category/evenements" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ScrollRow>
            {exclusiveEvents.map((event) => {
              const joined = joinedEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="shrink-0 bg-card rounded-2xl overflow-hidden flex flex-col"
                  style={{ width: 220 }}
                >
                  <Link to={`/establishment/${event.id}`} className="relative block" style={{ height: 110 }}>
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px]">
                      Membres
                    </div>
                  </Link>
                  <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-sm leading-tight mb-1 line-clamp-1">{event.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">{event.city}</p>
                    <button
                      onClick={() => toggleJoin(event.id)}
                      className={`mt-auto w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
                        joined
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-primary text-primary-foreground hover:bg-primary/85"
                      }`}
                    >
                      {joined ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Vous participez
                        </>
                      ) : (
                        "Je participe"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </ScrollRow>
        </section>
      )}

    </div>
  );
}
