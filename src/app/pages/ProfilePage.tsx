import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { supabase } from "../lib/supabase";
import { establishments } from "../data/establishments";
import {
  Crown, Calendar, ChevronRight, LogOut, Settings, Bell, Shield,
  HelpCircle, Gift, Star, Sparkles, MessageCircle,
} from "lucide-react";
import { LogoMark } from "../components/LogoMark";
import { EstablishmentCard } from "../components/EstablishmentCard";

const tierInfo = {
  essentiel: { label: "Essentiel", color: "text-muted-foreground", bg: "bg-muted/50" },
  prestige:  { label: "Prestige",  color: "text-primary",          bg: "bg-primary/10" },
  elite:     { label: "Élite",     color: "text-amber-400",        bg: "bg-amber-500/10" },
};

const categoryLabels: Record<string, string> = {
  gastronomie: "Gastronomie", hotels: "Hôtels", navigation: "Navigation",
  "bien-etre": "Bien-être", aviation: "Aviation", oenologie: "Œnologie",
  evenements: "Événements", "offres-exclusives": "Exclusif", "sport-loisirs": "Sport & Loisirs",
};

interface UpcomingBooking {
  establishment_id: string;
  reservation_date: string | null;
  reservation_time: string | null;
}

export function ProfilePage() {
  const { client, isAuthenticated, logout } = useClientAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [bookingsCount, setBookingsCount] = useState<number | null>(null);
  const [nextBooking, setNextBooking] = useState<UpcomingBooking | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !client) return;
    let cancelled = false;
    supabase
      .from("bookings")
      .select("establishment_id, reservation_date, reservation_time", { count: "exact" })
      .eq("client_id", client.id)
      .neq("status", "cancelled")
      .order("reservation_date", { ascending: true })
      .then(({ data, count }) => {
        if (cancelled) return;
        setBookingsCount(count ?? data?.length ?? 0);
        const today = new Date().setHours(0, 0, 0, 0);
        const upcoming = (data ?? []).find((b) => !b.reservation_date || new Date(b.reservation_date).getTime() >= today);
        setNextBooking(upcoming ?? null);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, client]);

  if (!isAuthenticated || !client) {
    return (
      <div className="max-w-lg mx-auto px-5 pb-28 pt-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-card flex items-center justify-center mb-6">
          <LogoMark size={34} className="text-primary" />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-2">My EliteWay</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs">
          Créez un compte pour accéder à vos favoris, réservations et offres exclusives.
        </p>
        <div className="w-full max-w-xs space-y-3">
          <Link to="/client/register" className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-center text-sm">
            Créer un compte
          </Link>
          <Link to="/client/login" className="block w-full py-4 border border-border rounded-2xl text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Se connecter
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 w-full max-w-xs">
          <Link to="/partner/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Espace partenaire →
          </Link>
        </div>
      </div>
    );
  }

  const tier = tierInfo[client.membershipTier];
  const favoriteEstablishments = establishments.filter((e) => favorites.includes(e.id));
  const nextBookingEstablishment = nextBooking ? establishments.find((e) => e.id === nextBooking.establishment_id) : null;

  // "Vos goûts EliteWay" — signal réel basé sur les favoris, jamais un texte
  // générique : la section n'apparaît que si un vrai signal existe.
  const categoryCounts: Record<string, number> = {};
  favoriteEstablishments.forEach((e) => { categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1; });
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);

  const menuSections = [
    {
      title: "Découverte",
      items: [
        { icon: Star,     label: "EliteWay Rewards",  to: "/rewards" },
        { icon: Gift,     label: "Offres exclusives", to: "/category/offres-exclusives" },
        { icon: Sparkles, label: "EliteWay Selection", to: "/elite-selection" },
        { icon: MessageCircle, label: "Messagerie concierge", to: "/messages" },
        { icon: Bell,     label: "Notifications",      to: "/notifications" },
      ],
    },
    {
      title: "Paramètres",
      items: [
        { icon: Shield,     label: "Confidentialité",  to: "/confidentialite" },
        { icon: Settings,   label: "Paramètres",       to: "/settings" },
        { icon: HelpCircle, label: "Aide & support",   to: "/contact" },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4">

      <div className="px-5 mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-1">My EliteWay</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }} className="leading-tight">
          Bonjour, {client.firstName}
        </h1>
      </div>

      {/* Profile card */}
      <div className="mx-5 mb-6 bg-card rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="text-primary">
            {client.firstName[0]}{client.lastName[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="leading-tight">
            {client.firstName} {client.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs ${tier.bg} ${tier.color}`}>
            <Crown className="w-3 h-3" />
            Membre {tier.label}
          </div>
        </div>
      </div>

      {/* Stats réelles (aucun chiffre inventé) */}
      <div className="grid grid-cols-2 gap-3 mx-5 mb-6">
        <Link to="/reservations" className="bg-card rounded-xl p-3 text-center hover:bg-accent/40 transition-colors">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="text-primary">
            {bookingsCount === null ? "—" : bookingsCount}
          </p>
          <p className="text-xs text-muted-foreground">Réservations</p>
        </Link>
        <Link to="/favorites" className="bg-card rounded-xl p-3 text-center hover:bg-accent/40 transition-colors">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="text-primary">{favorites.length}</p>
          <p className="text-xs text-muted-foreground">Favoris</p>
        </Link>
      </div>

      {/* Votre prochaine expérience */}
      {nextBookingEstablishment && (
        <Link to={`/establishment/${nextBookingEstablishment.id}`} className="block mx-5 mb-6">
          <div className="bg-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Votre prochaine expérience</p>
              <p className="text-sm truncate">{nextBookingEstablishment.name}</p>
              {nextBooking?.reservation_date && (
                <p className="text-xs text-primary">
                  {new Date(nextBooking.reservation_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  {nextBooking.reservation_time && ` · ${nextBooking.reservation_time}`}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        </Link>
      )}

      {/* Vos goûts EliteWay — n'apparaît que si un vrai signal existe */}
      {topCategories.length > 0 && (
        <div className="mx-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-1">Vos goûts EliteWay</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {topCategories.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary">
                {categoryLabels[c] ?? c}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 px-1">Basé sur vos favoris</p>
        </div>
      )}

      {/* Mes favoris — aperçu */}
      {favoriteEstablishments.length > 0 && (
        <div className="mx-5 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Mes favoris</p>
            <Link to="/favorites" className="text-xs text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favoriteEstablishments.slice(0, 2).map((e) => (
              <div key={e.id} style={{ aspectRatio: "1 / 1.05" }}>
                <EstablishmentCard establishment={e} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Benefits — abonnement, sans page de vente agressive */}
      <div className="mx-5 mb-6 bg-card rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${client.membershipTier === "elite" ? "bg-amber-500/15" : "bg-primary/10"}`}>
            <Crown className={`w-5 h-5 ${client.membershipTier === "elite" ? "text-amber-400" : "text-primary"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">Membre depuis {new Date(client.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
            <p className={`text-xs ${tier.color}`}>Niveau {tier.label}</p>
          </div>
        </div>
        {client.membershipTier === "essentiel" ? (
          <Link to="/membership" className="flex items-center justify-between gap-3 pt-3 border-t border-border/30">
            <p className="text-sm">Passez à Prestige — offres exclusives & conciergerie</p>
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          </Link>
        ) : (
          <Link to="/membership" className="flex items-center justify-between gap-3 pt-3 border-t border-border/30">
            <p className="text-sm">Voir mes avantages {tier.label}</p>
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          </Link>
        )}
      </div>

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mx-5 mb-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">{section.title}</p>
          <div className="divide-y divide-border/30">
            {section.items.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 px-1 py-3.5 hover:opacity-70 transition-opacity"
              >
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="mx-5">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-border/60 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>

    </div>
  );
}
