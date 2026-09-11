import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  Search, ArrowRight, MapPin, Star, Lock, ChevronRight, ChevronDown,
  Clock, Calendar, SlidersHorizontal, Crown, Utensils,
  Sailboat, Sparkles, Plane, CalendarDays, Gift, Trophy, Wind,
} from "lucide-react";
import { establishments } from "../data/establishments";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { ScrollRow } from "../components/ScrollRow";

const CATEGORIES = [
  { id: "gastronomie",       name: "Gastronomie",     image: "https://images.unsplash.com/photo-1776993298456-98c71c0e177e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "navigation",        name: "Yachts",          image: "https://images.unsplash.com/photo-1535024966840-e7424dc2635b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "bien-etre",         name: "Bien-être",       image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "aviation",          name: "Aviation",        image: "https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "oenologie",         name: "Œnologie",        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "evenements",        name: "Événements",      image: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "offres-exclusives", name: "Exclusif",        image: "https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", badge: true },
];

const NEARBY_CITIES = [
  { city: "Cannes", image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    services: [
      { label: "3 tables disponibles", icon: Utensils,  q: "gastronomie Cannes" },
      { label: "2 yachts aujourd'hui",  icon: Sailboat,  q: "yacht Cannes" },
      { label: "Spa partenaire",         icon: Sparkles,  q: "spa Cannes" },
    ],
  },
  { city: "Nice", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    services: [
      { label: "5 restaurants ouverts",  icon: Utensils,  q: "gastronomie Nice" },
      { label: "Vol panoramique 20 min", icon: Plane,      q: "hélicoptère Nice" },
      { label: "Bien-être & thalasso",   icon: Sparkles,  q: "spa Nice" },
    ],
  },
  { city: "Monaco", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    services: [
      { label: "Sunset cruise ce soir", icon: Sailboat,   q: "yacht Monaco" },
      { label: "Soirée privée membres", icon: Gift,       q: "exclusif Monaco" },
      { label: "Dégustation de vins",   icon: CalendarDays, q: "oenologie Monaco" },
    ],
  },
  { city: "Saint-Tropez", image: "https://images.unsplash.com/photo-1569282066844-679ec34e3416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    services: [
      { label: "Yacht privatisé dès 1 800€", icon: Sailboat, q: "yacht Saint-Tropez" },
      { label: "Gastronomie port",       icon: Utensils,  q: "gastronomie Saint-Tropez" },
      { label: "Événement partenaire",  icon: CalendarDays, q: "événement" },
    ],
  },
];

const EXCLUSIVE_OFFERS = [
  { id: "eo-1", title: "Dîner gastronomique", subtitle: "Table d'exception", price: "Dès 180 €/pers.", tag: "Gastronomique",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", link: "/category/gastronomie" },
  { id: "eo-2", title: "Week-end hôtel & spa", subtitle: "Côte d'Azur", price: "Dès 180 €/soin", tag: "Populaire",
    image: "https://images.unsplash.com/photo-1718942899965-4fc10607d805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", link: "/category/bien-etre" },
  { id: "eo-3", title: "Journée Yacht", subtitle: "Îles d'Or incluses", price: "Dès 800 €/demi-journée", tag: "Best-seller",
    image: "https://images.unsplash.com/photo-1597609049381-decc1957efe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", link: "/category/navigation" },
  { id: "eo-4", title: "Accès VIP Événements", subtitle: "Soirées & galas privés", price: "Membres Prestige", tag: "Exclusif",
    image: "https://images.unsplash.com/photo-1564736676781-d0f57b29f67a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", link: "/category/offres-exclusives", locked: true },
];

const UPCOMING_EVENTS = [
  { id: "ev-1", title: "Dîner Secret — Chef", location: "Nice, Côte d'Azur", date: "28 Juin 2026", time: "20h00", price: "€€", spots: 8,
    image: "https://images.unsplash.com/photo-1776993298456-98c71c0e177e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Gastronomie" },
  { id: "ev-2", title: "Soirée Rooftop Éclat", location: "Nice, Côte d'Azur", date: "5 Juil. 2026", time: "21h30", price: "€€", spots: 40,
    image: "https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Membres", exclusive: true },
  { id: "ev-3", title: "Croisière Champagne", location: "Cannes, Côte d'Azur", date: "12 Juil. 2026", time: "17h00", price: "€€", spots: 12,
    image: "https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Navigation" },
  { id: "ev-4", title: "Nuits de l'Èze", location: "Èze, Côte d'Azur", date: "19 Juil. 2026", time: "21h00", price: "€", spots: 80,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Événements" },
  { id: "ev-rg", title: "Roland Garros — Loge VIP", location: "Paris — vol depuis Nice", date: "26 Mai 2026", time: "11h00", price: "€€€€", spots: 4,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Exclusif", exclusive: true },
  { id: "ev-5", title: "Monaco Yacht Show", location: "Port Hercule, Monaco", date: "24 Sep. 2026", time: "10h00", price: "€€€", spots: 20,
    image: "https://images.unsplash.com/photo-1563642421748-5047b6585a4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Exclusif", exclusive: true },
  { id: "ev-6", title: "Gala de la Riviera", location: "Palais des Festivals, Cannes", date: "15 Nov. 2026", time: "19h30", price: "€€€", spots: 12,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Gala Prestige", exclusive: true },
];

function SectionHeader({ label, title, linkTo }: { label: string; title: string; linkTo?: string }) {
  return (
    <div className="flex items-end justify-between px-5 mb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-0.5">{label}</p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", lineHeight: 1.2 }}>{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
          Tout voir <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

export function Home() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Nice");
  const navigate = useNavigate();
  const { client } = useClientAuth();
  const featured = establishments.filter((e) => e.category !== "offres-exclusives").slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-lg mx-auto pb-28">

      <div className="relative overflow-hidden mb-1" style={{ height: "100svh", minHeight: "640px", maxHeight: "900px" }}>

        <div className="absolute inset-0" style={{ zIndex: 0, overflow: "hidden" }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/ChatGPT%20Image%2011%20sept.%202026%2C%2003_27_42.png')",
              animation: "heroZoom1 22s ease-in-out infinite alternate",
              filter: "brightness(1.35) contrast(1.05) saturate(1.1)",
            }}
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end px-5" style={{ paddingBottom: "60px", zIndex: 2 }}>

          <div className="absolute inset-x-0" style={{
            bottom: "60px",
            height: "290px",
            background: "linear-gradient(180deg, transparent 0%, rgba(10,8,6,0.35) 20%, rgba(10,8,6,0.7) 60%, rgba(10,8,6,0.85) 100%)",
            backdropFilter: "blur(2px)",
          }} />

          <div className="relative">
            <button
              onClick={() => {
                const cities = ["Nice", "Cannes", "Monaco", "Saint-Tropez"];
                const idx = cities.indexOf(selectedCity);
                setSelectedCity(cities[(idx + 1) % cities.length]);
              }}
              className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full transition-colors"
              style={{
                border: "1px solid oklch(0.74 0.09 80 / 0.55)",
                background: "oklch(0.09 0.006 60 / 0.85)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              <MapPin className="w-3 h-3 text-primary" />
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "oklch(0.90 0.09 80)" }}>
                {selectedCity}
              </span>
              <ChevronDown className="w-3 h-3 text-primary" />
            </button>
          </div>

          <p className="text-center uppercase mb-3" style={{
            fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.28em",
            color: "oklch(0.92 0.09 80)", textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
            fontWeight: 600,
          }}>
            La mer · Le luxe · La liberté
          </p>

          <p className="text-center mb-5" style={{
            fontSize: "0.85rem", letterSpacing: "0.06em", color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
            fontWeight: 500,
          }}>
            {client ? `Bonjour ${client.firstName} · ` : ""}Gastronomie · Yachts · Bien-être · Aviation
          </p>

          <form onSubmit={handleSearch} style={{ width: "90%", maxWidth: "440px" }}>
            <div className="relative">
              <div className="absolute -inset-[2px] rounded-[18px] pointer-events-none" style={{
                background: "linear-gradient(135deg, oklch(0.74 0.09 80 / 0.9), oklch(0.74 0.09 80 / 0.25))",
                boxShadow: "0 0 30px oklch(0.74 0.09 80 / 0.35)", borderRadius: "18px",
              }} />
              <div className="relative flex items-center rounded-2xl overflow-hidden" style={{
                background: "oklch(0.08 0.005 60 / 0.97)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Expérience, ville, catégorie…"
                  style={{ minHeight: "58px", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}
                  className="w-full pl-12 pr-14 py-3 bg-transparent focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                />
                <button type="submit" className="absolute right-2.5 w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                  style={{ background: "oklch(0.74 0.09 80)", boxShadow: "0 2px 16px oklch(0.74 0.09 80 / 0.5)" }}>
                  <SlidersHorizontal className="w-4 h-4" style={{ color: "oklch(0.08 0.005 60)" }} />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>

      <section className="px-5 mb-8">
        <div className="relative overflow-hidden rounded-2xl" style={{ height: "170px" }}>
          <img
            src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
            alt="Découvrir EliteWay"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.55)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 70%, transparent 100%)" }} />
          <div className="relative z-10 h-full flex flex-col justify-center px-6" style={{ maxWidth: "70%" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", lineHeight: 1.25, color: "#ffffff", marginBottom: "14px", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
              Des expériences d'exception à portée de main
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="self-start px-5 py-2 rounded-full transition-transform active:scale-95"
              style={{ background: "oklch(0.74 0.09 80)", color: "oklch(0.10 0.006 60)", fontFamily: "var(--font-heading)", fontSize: "0.85rem", boxShadow: "0 2px 16px oklch(0.74 0.09 80 / 0.35)" }}
            >
              Découvrir
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 mb-8">
        <Link to="/membership">
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, oklch(0.12 0.015 75) 0%, oklch(0.10 0.010 65) 100%)" }}>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px oklch(0.74 0.09 80 / 0.4), 0 0 28px oklch(0.74 0.09 80 / 0.08)" }} />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "linear-gradient(115deg, transparent 40%, oklch(0.74 0.09 80 / 0.3) 50%, transparent 60%)" }} />
            <div className="relative px-5 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "oklch(0.74 0.09 80 / 0.15)", border: "1px solid oklch(0.74 0.09 80 / 0.35)" }}>
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-medium">Accès exclusif</p>
                  <div className="flex gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Prestige</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Élite</span>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", lineHeight: 1.2 }}>Réservé aux membres</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Offres exclusives, conciergerie & événements privés</p>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-primary">
                <Lock className="w-3.5 h-3.5" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="mb-8">
        <SectionHeader label="Disponible" title="Expériences du moment" />
        <ScrollRow gap={16}>
          {[
            { id: "exp-1", title: "Dîner Gastronomique", subtitle: "Ce soir · Nice", price: "dès 180€/pers.", link: "/establishment/restaurant-le-grand",
              image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
            { id: "exp-2", title: "Spa Vue Mer", subtitle: "Disponible aujourd'hui · Nice", price: "dès 180€/soin", link: "/establishment/spa-serenite",
              image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
            { id: "exp-3", title: "Sortie Yacht Cannes", subtitle: "Demain · Cannes", price: "dès 800€/demi-journée", link: "/establishment/yacht-azur",
              image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
          ].map((exp) => (
            <Link key={exp.id} to={exp.link} className="group shrink-0 rounded-2xl overflow-hidden bg-card border border-border/60 relative" style={{ width: 280 }}>
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Disponible</span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="leading-tight mb-1">{exp.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{exp.subtitle}</p>
                <p className="text-xs text-primary">{exp.price}</p>
              </div>
            </Link>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Agenda" title="Événements emblématiques" />
        <ScrollRow gap={12}>
          {[
            { id: "ev-1", title: "Grand Prix de Monaco", date: "25-28 Mai 2027", badge: "Sport & Prestige", badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
              image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
            { id: "ev-2", title: "Festival de Cannes", date: "13-24 Mai 2027", badge: "Culture & Glamour", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
              image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
            { id: "ev-3", title: "Nice Jazz Festival", date: "9-15 Juil. 2026", badge: "Musique & Art", badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
              image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
            { id: "ev-4", title: "Fête du Citron Menton", date: "Fév. 2027", badge: "Tradition", badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              image: "https://images.unsplash.com/photo-1711014778280-4d3a7f58a032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
          ].map((ev) => (
            <div key={ev.id} className="shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden" style={{ width: 220 }}>
              <div className="relative overflow-hidden" style={{ height: 110 }}>
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover opacity-65" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="p-3">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="leading-tight mb-1">{ev.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{ev.date}</p>
                <div className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] border ${ev.badgeColor}`}>{ev.badge}</div>
                <p className="text-xs text-primary mt-2 hover:underline cursor-pointer">Voir l'événement →</p>
              </div>
            </div>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Explorer" title="Nos catégories" linkTo="/categories" />
        <ScrollRow gap={18}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="group shrink-0 flex flex-col items-center gap-2" style={{ width: "84px" }}>
              <div className="relative rounded-full overflow-hidden" style={{ width: "76px", height: "76px", border: "2px solid oklch(0.74 0.09 80 / 0.45)", boxShadow: "0 2px 16px oklch(0.74 0.09 80 / 0.15)" }}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                {cat.badge && (
                  <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="text-center leading-tight" style={{ fontFamily: "var(--font-heading)", fontSize: "0.78rem" }}>{cat.name}</p>
            </Link>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Disponible maintenant" title="Près de vous" />
        <ScrollRow gap={16}>
          {NEARBY_CITIES.map((city) => (
            <div key={city.city} className="shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden" style={{ width: "230px" }}>
              <div className="relative overflow-hidden" style={{ height: "100px" }}>
                <img src={city.image} alt={city.city} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Disponible</span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>{city.city}</p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-3 space-y-2">
                {city.services.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <button key={svc.label} onClick={() => navigate(`/search?q=${encodeURIComponent(svc.q)}`)} className="w-full flex items-center gap-2.5 py-1.5 hover:opacity-80 transition-opacity text-left">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">{svc.label}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground/40 ml-auto shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Sélection" title="Offres à saisir" linkTo="/category/offres-exclusives" />
        <ScrollRow gap={16}>
          {EXCLUSIVE_OFFERS.map((offer) => (
            <Link key={offer.id} to={offer.link} className="group shrink-0 relative overflow-hidden rounded-2xl bg-card border border-border/60" style={{ width: "200px" }}>
              <div className="relative overflow-hidden" style={{ height: "120px" }}>
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                {offer.locked && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm">
                  <span className="text-[10px] text-primary tracking-wide">{offer.tag}</span>
                </div>
              </div>
              <div className="p-3">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="mb-0.5">{offer.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{offer.subtitle}</p>
                <p className="text-xs text-primary">{offer.price}</p>
              </div>
            </Link>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Agenda" title="Événements à venir" />
        <ScrollRow gap={16}>
          {UPCOMING_EVENTS.map((event) => (
            <div key={event.id} className="shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden" style={{ width: "240px" }}>
              <div className="relative overflow-hidden" style={{ height: "130px" }}>
                <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm ${event.exclusive ? "bg-primary text-primary-foreground" : "bg-background/70 text-foreground"}`}>
                  {event.category}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="leading-tight">{event.title}</p>
                </div>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 shrink-0" />{event.location}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-xs text-primary">{event.price}</span>
                  <span className="text-xs text-muted-foreground">{event.spots} places</span>
                </div>
              </div>
            </div>
          ))}
        </ScrollRow>
      </section>

      <section className="mb-8">
        <SectionHeader label="Recommandés" title="Nos coups de cœur" linkTo="/categories" />
        <ScrollRow gap={16}>
          {featured.map((e) => (
            <Link key={e.id} to={`/establishment/${e.id}`} className="group shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden" style={{ width: "220px" }}>
              <div className="relative overflow-hidden" style={{ height: "140px" }}>
                <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs">{e.rating}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-primary mb-0.5 tracking-wider">{e.price}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="mb-1 leading-tight">{e.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />{e.location}
                </div>
              </div>
            </Link>
          ))}
        </ScrollRow>
      </section>

      <section className="px-5 mt-2">
        <Link to="/membership" className="block relative overflow-hidden rounded-2xl bg-card border border-primary/20 p-6">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">Accès exclusif</p>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="mb-2">Rejoindre le Club EliteWay</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Offres membres, conciergerie dédiée et événements privés sur la Côte d'Azur.</p>
            <div className="inline-flex items-center gap-2 text-sm text-primary">
              Découvrir les abonnements <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </section>

    </div>
  );
}
