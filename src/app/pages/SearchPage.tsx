import { useSearchParams, Link } from "react-router";
import { Search, SlidersHorizontal, X, Check, ChevronDown, Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { establishments } from "../data/establishments";
import { EstablishmentCard } from "../components/EstablishmentCard";

const SUGGESTIONS = ["Yacht Nice", "Spa Cannes", "Gastronomie", "Hélico Monaco", "Rosé Provence", "Événements", "Cap-Ferrat"];

const CATEGORY_FILTERS = [
  { id: "",                  label: "Tout" },
  { id: "gastronomie",       label: "Gastronomie" },
  { id: "navigation",        label: "Yachts" },
  { id: "bien-etre",         label: "Bien-être" },
  { id: "aviation",          label: "Aviation" },
  { id: "oenologie",         label: "Œnologie" },
  { id: "evenements",        label: "Événements" },
  { id: "offres-exclusives", label: "Exclusif" },
];

const BUDGET_OPTIONS = [
  { id: "",    label: "Tous les budgets", max: Infinity },
  { id: "€",   label: "€ — Dès 4€",         max: 1 },
  { id: "€€",  label: "€€ — Accessible",     max: 2 },
  { id: "€€€", label: "€€€ — Premium",       max: 3 },
  { id: "€€€€",label: "€€€€ — Haut de gamme",max: 4 },
];

const PREFERENCE_OPTIONS = [
  { id: "vue-mer",      label: "Vue mer",         emoji: "🌊" },
  { id: "terrasse",     label: "Terrasse",         emoji: "☀️" },
  { id: "accessible",   label: "Prix accessible",  emoji: "💚" },
  { id: "exclusif",     label: "Offres exclusives",emoji: "✦" },
  { id: "disponible",   label: "Disponible aujourd'hui", emoji: "⚡" },
  { id: "bien-note",    label: "Très bien noté",   emoji: "⭐" },
  { id: "cannes",       label: "Cannes",            emoji: "📍" },
  { id: "nice",         label: "Nice",              emoji: "📍" },
  { id: "monaco",       label: "Monaco",            emoji: "📍" },
  { id: "saint-tropez", label: "Saint-Tropez",      emoji: "📍" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Recommandés" },
  { id: "rating",  label: "Mieux notés" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
];

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBudget, setActiveBudget] = useState("");
  const [activePrefs, setActivePrefs] = useState<string[]>([]);
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const q = (searchParams.get("q") || "").toLowerCase();

  const totalActiveFilters = (activeCategory ? 1 : 0) + (activeBudget ? 1 : 0) + activePrefs.length;

  const togglePref = (id: string) =>
    setActivePrefs((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const clearAll = () => {
    setActiveCategory("");
    setActiveBudget("");
    setActivePrefs([]);
    setSort("default");
  };

  // Filter logic
  let results = establishments.filter((e) => {
    // Text search
    const matchesQuery = !q || (
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.features.some((f) => f.toLowerCase().includes(q))
    );
    // Category
    const matchesCategory = !activeCategory || e.category === activeCategory;
    // Budget (compare € count)
    const matchesBudget = !activeBudget || e.price === activeBudget || e.price.length <= activeBudget.length;
    // Preferences
    const matchesPrefs = activePrefs.every((pref) => {
      if (pref === "bien-note")    return e.rating >= 4.8;
      if (pref === "accessible")   return e.price.length <= 2;
      if (pref === "exclusif")     return e.exclusive || e.category === "offres-exclusives";
      if (pref === "vue-mer")      return e.features.some(f => f.toLowerCase().includes("mer") || f.toLowerCase().includes("vue"));
      if (pref === "terrasse")     return e.features.some(f => f.toLowerCase().includes("terrasse"));
      if (pref === "cannes")       return e.city === "Cannes";
      if (pref === "nice")         return e.city === "Nice";
      if (pref === "monaco")       return e.city === "Monaco";
      if (pref === "saint-tropez") return e.city === "Saint-Tropez";
      if (pref === "disponible")   return true; // mock
      return true;
    });
    return matchesQuery && matchesCategory && matchesBudget && matchesPrefs;
  });

  // Sort
  if (sort === "rating")     results = [...results].sort((a, b) => b.rating - a.rating);
  if (sort === "price-asc")  results = [...results].sort((a, b) => a.price.length - b.price.length);
  if (sort === "price-desc") results = [...results].sort((a, b) => b.price.length - a.price.length);

  const hasSearch = q || activeCategory || activeBudget || activePrefs.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: "240px" }}>
        <img
          src="https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
          alt="Recherche"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.6) 0%, var(--background) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.74 0.09 80 / 0.12) 0%, transparent 70%)" }} />

        <div className="relative z-10 px-5 pt-5 pb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Recherche</p>
          <h1 className="mb-5" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", lineHeight: 1.05 }}>
            Trouvez votre<br />expérience idéale
          </h1>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch}>
            <div className="relative" style={{ width: "90%", margin: "0 auto" }}>
              <div className="absolute -inset-[2px] rounded-[18px] pointer-events-none"
                style={{ background: "linear-gradient(135deg, oklch(0.74 0.09 80 / 0.45), oklch(0.74 0.09 80 / 0.08))", borderRadius: "18px" }} />
              <div className="relative flex items-center bg-card rounded-2xl overflow-hidden shadow-lg">
                <Search className="absolute left-4 w-5 h-5 text-primary pointer-events-none" />
                <input
                  type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Expérience, ville, catégorie…" autoFocus
                  style={{ minHeight: "54px", fontFamily: "var(--font-body)" }}
                  className="w-full pl-12 pr-20 py-3 bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {query && (
                    <button type="button" onClick={() => { setQuery(""); navigate("/search"); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button type="submit" className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/85">
                    <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── CATÉGORIES (scroll horizontal) ──────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pt-3 pb-2">
        {CATEGORY_FILTERS.map((cat) => (
          <button key={cat.id}
            onClick={() => setActiveCategory(cat.id === activeCategory ? "" : cat.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-colors ${
              activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── BARRE FILTRES + TRI ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
        {/* Bouton filtres */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs transition-colors relative ${
            showFilters || totalActiveFilters > 0
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-card border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtres
          {totalActiveFilters > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
              {totalActiveFilters}
            </span>
          )}
        </button>

        {/* Résumé filtres actifs */}
        {activePrefs.slice(0, 2).map((p) => {
          const pref = PREFERENCE_OPTIONS.find(o => o.id === p);
          return pref ? (
            <button key={p} onClick={() => togglePref(p)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full text-[10px] shrink-0">
              {pref.emoji} {pref.label} <X className="w-2.5 h-2.5 ml-0.5" />
            </button>
          ) : null;
        })}
        {activePrefs.length > 2 && (
          <span className="text-xs text-primary shrink-0">+{activePrefs.length - 2}</span>
        )}

        {/* Clear */}
        {totalActiveFilters > 0 && (
          <button onClick={clearAll} className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors shrink-0">
            Tout effacer
          </button>
        )}

        {/* Tri */}
        <div className="relative ml-auto">
          <button onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {SORT_OPTIONS.find(s => s.id === sort)?.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
          </button>
          {showSort && (
            <div className="absolute right-0 top-7 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-20 w-44">
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => { setSort(opt.id); setShowSort(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 ${sort === opt.id ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}>
                  {sort === opt.id && <Check className="w-3 h-3 shrink-0" />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PANNEAU FILTRES ÉTENDU ───────────────────────────────────────── */}
      {showFilters && (
        <div className="mx-5 my-3 bg-card border border-border/60 rounded-2xl overflow-hidden">
          {/* Budget */}
          <div className="px-4 pt-4 pb-3 border-b border-border/40">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Budget</p>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_OPTIONS.map((opt) => (
                <button key={opt.id}
                  onClick={() => setActiveBudget(activeBudget === opt.id ? "" : opt.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all text-left ${
                    activeBudget === opt.id
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  {activeBudget === opt.id && <Check className="w-3 h-3 shrink-0 text-primary" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note minimale */}
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Note minimale</p>
            <div className="flex gap-2">
              {[4.0, 4.5, 4.8].map((note) => {
                const prefId = note === 4.8 ? "bien-note" : "";
                return (
                  <button key={note}
                    onClick={() => prefId && togglePref(prefId)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                      (note === 4.8 && activePrefs.includes("bien-note"))
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-muted/30 border-border/40 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    {note}+
                  </button>
                );
              })}
            </div>
          </div>

          {/* Préférences */}
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Préférences</p>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.filter(p => !["cannes","nice","monaco","saint-tropez"].includes(p.id)).map((pref) => (
                <button key={pref.id} onClick={() => togglePref(pref.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                    activePrefs.includes(pref.id)
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  <span>{pref.emoji}</span>
                  <span>{pref.label}</span>
                  {activePrefs.includes(pref.id) && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Villes */}
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3">Ville</p>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.filter(p => ["cannes","nice","monaco","saint-tropez"].includes(p.id)).map((pref) => (
                <button key={pref.id} onClick={() => togglePref(pref.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                    activePrefs.includes(pref.id)
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {pref.label}
                  {activePrefs.includes(pref.id) && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <div className="px-4 py-3 flex gap-2">
            <button onClick={() => setShowFilters(false)}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs hover:bg-primary/85 transition-colors">
              Appliquer les filtres{totalActiveFilters > 0 ? ` (${totalActiveFilters})` : ""}
            </button>
            {totalActiveFilters > 0 && (
              <button onClick={() => { clearAll(); }}
                className="px-4 py-2.5 border border-border/60 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors">
                Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── RÉSULTATS ────────────────────────────────────────────────────── */}
      <div className="px-5 pt-4">
        {hasSearch ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground">{results.length}</span> résultat{results.length > 1 ? "s" : ""}
                {q ? ` pour « ${searchParams.get("q")} »` : ""}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {results.map((e) => <EstablishmentCard key={e.id} establishment={e} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-sm mb-2">Aucun résultat avec ces filtres.</p>
                <button onClick={clearAll} className="text-primary text-sm hover:underline mb-5">Effacer les filtres</button>
                <Link to="/categories" className="px-6 py-3 border border-border/60 rounded-xl text-sm hover:border-primary/50 transition-colors">
                  Parcourir les catégories
                </Link>
              </div>
            )}
          </>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">Suggestions populaires</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                  className="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">Sélection du moment</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {establishments.slice(0, 4).map((e) => <EstablishmentCard key={e.id} establishment={e} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
