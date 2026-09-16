import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { establishments } from "../../data/establishments";
import { Heart, Calendar, Crown, Settings, LogOut, ChevronRight, Gift } from "lucide-react";
import { EstablishmentCard } from "../../components/EstablishmentCard";
import { ScrollRow } from "../../components/ScrollRow";

const tierLabels: Record<string, { label: string; color: string; next?: string }> = {
  essentiel: { label: "Essentiel", color: "text-muted-foreground", next: "Prestige" },
  prestige: { label: "Prestige", color: "text-primary", next: "Élite" },
  elite: { label: "Élite", color: "text-amber-400" },
};

const mockBookings = [
  { id: "b1", name: "Azur Dreams — Croisière privée", date: "2026-07-12", status: "confirmed", price: "€€€€" },
  { id: "b2", name: "Spa Sérénité — Soin signature", date: "2026-06-28", status: "pending", price: "€€€" },
];

const navItems = [
  { id: "overview",   label: "Tableau de bord" },
  { id: "bookings",   label: "Réservations" },
  { id: "favorites",  label: "Favoris" },
  { id: "exclusive",  label: "Offres exclusives" },
  { id: "membership", label: "Abonnement" },
];

export function ClientDashboard() {
  const { client, logout, isAuthenticated } = useClientAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) navigate("/client/login");
  }, [isAuthenticated, navigate]);

  if (!client) return null;

  const tier = tierLabels[client.membershipTier];
  const favoriteEstablishments = establishments.filter((e) => favorites.includes(e.id));
  const exclusiveOffers = establishments.filter((e) => e.category === "offres-exclusives");

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4">

      <div className="px-5 mb-6">
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-1">
          Bonjour, {client.firstName}
        </h1>
        <p className="text-muted-foreground text-sm">Votre espace personnel EliteWay</p>
      </div>

      {/* Sélecteur d'onglets — défilement horizontal, façon filtres de catégorie */}
      <div className="mb-7">
        <ScrollRow gap={8}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="shrink-0 px-4 py-2 rounded-full text-xs transition-colors whitespace-nowrap"
              style={{
                background: activeTab === item.id ? "oklch(0.74 0.09 80)" : "oklch(0.14 0.006 60)",
                color: activeTab === item.id ? "oklch(0.08 0.005 60)" : "oklch(0.70 0.01 60)",
                border: activeTab === item.id ? "none" : "1px solid oklch(0.22 0.007 65)",
                fontWeight: activeTab === item.id ? 600 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </ScrollRow>
      </div>

      {activeTab === "overview" && (
        <div className="px-5 space-y-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl p-3 text-center">
              <Calendar className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-primary">{mockBookings.length}</p>
              <p className="text-xs text-muted-foreground">Réservations</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <Heart className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-primary">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favoris</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <Crown className={`w-4 h-4 mx-auto mb-1.5 ${tier.color}`} />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className={tier.color}>{tier.label}</p>
              <p className="text-xs text-muted-foreground">Niveau</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3 px-1">Prochaines réservations</p>
            {mockBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm px-1">Aucune réservation pour le moment.</p>
            ) : (
              <div className="divide-y divide-border/30">
                {mockBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm truncate">{b.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(b.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {b.status === "confirmed" ? "Confirmée" : "En attente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {tier.next && (
            <Link to="/membership" className="block bg-primary/8 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm mb-0.5">Passez à <span className="text-primary">{tier.next}</span></p>
                  <p className="text-xs text-muted-foreground">Offres exclusives & conciergerie dédiée</p>
                </div>
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
              </div>
            </Link>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="px-5">
          {mockBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore de réservation.</p>
              <Link to="/categories" className="text-primary text-sm hover:underline">Explorer les expériences</Link>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {mockBookings.map((b) => (
                <div key={b.id} className="py-4">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm">{b.name}</p>
                    <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {b.status === "confirmed" ? "Confirmée" : "En attente"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(b.date).toLocaleDateString("fr-FR")}</span>
                    <span className="text-primary">{b.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="px-5">
          {favoriteEstablishments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Aucun favori pour le moment.</p>
              <Link to="/categories" className="text-primary text-sm hover:underline">Découvrir les expériences</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favoriteEstablishments.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "exclusive" && (
        <div className="px-5">
          {client.membershipTier === "essentiel" ? (
            <div className="bg-primary/5 rounded-2xl p-8 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="mb-2">
                Réservé aux membres Prestige et Élite
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Passez à un abonnement supérieur pour accéder à des expériences et tarifs exclusifs négociés par EliteWay.
              </p>
              <Link to="/membership" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/85 transition-colors">
                Voir les abonnements
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {exclusiveOffers.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "membership" && (
        <div className="px-5 space-y-8">
          <div>
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-border/30">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Abonnement actuel</p>
                <p className={tier.color} style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>Membre {tier.label}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              {client.membershipTier === "essentiel" && "Vous bénéficiez de l'accès gratuit à la plateforme. Passez à Prestige ou Élite pour débloquer des avantages exclusifs."}
              {client.membershipTier === "prestige" && "Vous profitez des offres exclusives membres, de remises jusqu'à -15% et d'une conciergerie par email."}
              {client.membershipTier === "elite" && "Vous bénéficiez de tous les avantages EliteWay : remises -30%, conciergerie 24/7, accès événements privés et gestionnaire dédié."}
            </p>
            {tier.next && (
              <Link to="/membership" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/85 transition-colors">
                Passer à {tier.next}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="pt-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">Informations du compte</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Prénom</p>
                <p className="text-sm">{client.firstName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nom</p>
                <p className="text-sm">{client.lastName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm truncate">{client.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Membre depuis</p>
                <p className="text-sm">
                  {new Date(client.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <Link to="/settings" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Settings className="w-4 h-4" />
              Modifier mes informations
            </Link>
          </div>

          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 border border-border/60 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      )}

    </div>
  );
}
