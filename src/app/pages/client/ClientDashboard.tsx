import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { establishments } from "../../data/establishments";
import { Star, Heart, Calendar, Crown, Settings, LogOut, User, ChevronRight, Gift } from "lucide-react";
import { EstablishmentCard } from "../../components/EstablishmentCard";

const tierLabels: Record<string, { label: string; color: string; next?: string }> = {
  essentiel: { label: "Essentiel", color: "text-muted-foreground", next: "Prestige" },
  prestige: { label: "Prestige", color: "text-primary", next: "Élite" },
  elite: { label: "Élite", color: "text-amber-400" },
};

const mockBookings = [
  { id: "b1", name: "Azur Dreams — Croisière privée", date: "2026-07-12", status: "confirmed", price: "€€€€" },
  { id: "b2", name: "Spa Sérénité — Soin signature", date: "2026-06-28", status: "pending", price: "€€€" },
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

  const navItems = [
    { id: "overview", label: "Tableau de bord", icon: User },
    { id: "bookings", label: "Mes réservations", icon: Calendar },
    { id: "favorites", label: "Mes favoris", icon: Heart },
    { id: "exclusive", label: "Offres exclusives", icon: Gift },
    { id: "membership", label: "Mon abonnement", icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
          <div className="px-6 py-7 border-b border-border">
            <Link to="/">
              <span className="tracking-[0.25em] text-primary" style={{ fontSize: "0.95rem", fontWeight: 500 }}>ELITEWAY</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Espace Client</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-border">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm truncate">{client.firstName} {client.lastName}</p>
              <p className={`text-xs ${tier.color}`}>Membre {tier.label}</p>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-auto">

          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Bonjour, {client.firstName} 👋</h1>
                <p className="text-muted-foreground text-sm">Bienvenue dans votre espace personnel EliteWay</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Réservations</p>
                  <p className="text-2xl">{mockBookings.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Favoris</p>
                  <p className="text-2xl">{favorites.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Crown className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Niveau</p>
                  <p className={`text-2xl ${tier.color}`}>{tier.label}</p>
                </div>
              </div>

              {/* Upcoming bookings */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="mb-5">Prochaines réservations</h3>
                {mockBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune réservation pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {mockBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm">{b.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(b.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {b.status === "confirmed" ? "Confirmée" : "En attente"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Membership upgrade */}
              {tier.next && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1">Passez à <span className="text-primary">{tier.next}</span></p>
                    <p className="text-xs text-muted-foreground">Accédez à des offres exclusives et une conciergerie dédiée</p>
                  </div>
                  <button onClick={() => setActiveTab("membership")} className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/85 transition-colors shrink-0">
                    Découvrir
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h1 className="mb-2">Mes réservations</h1>
              <p className="text-muted-foreground text-sm mb-8">Historique et réservations en cours</p>
              {mockBookings.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground mb-4">Vous n'avez pas encore de réservation.</p>
                  <Link to="/categories" className="text-primary text-sm hover:underline">Explorer les expériences</Link>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Expérience</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Date</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Tarif</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBookings.map((b) => (
                        <tr key={b.id} className="border-b border-border/50 last:border-0">
                          <td className="p-4 text-sm">{b.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(b.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-4 text-sm text-primary">{b.price}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                              {b.status === "confirmed" ? "Confirmée" : "En attente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h1 className="mb-2">Mes favoris</h1>
              <p className="text-muted-foreground text-sm mb-8">Les expériences que vous avez sauvegardées</p>
              {favoriteEstablishments.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground mb-4">Aucun favori pour le moment.</p>
                  <Link to="/categories" className="text-primary text-sm hover:underline">Découvrir les expériences</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteEstablishments.map((e) => (
                    <EstablishmentCard key={e.id} establishment={e} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "exclusive" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Offres Exclusives</h1>
                <p className="text-muted-foreground text-sm">Expériences réservées aux membres EliteWay</p>
              </div>
              {client.membershipTier === "essentiel" ? (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-10 text-center">
                  <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="mb-2">Accès réservé aux membres Prestige et Élite</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Passez à un abonnement supérieur pour accéder à des expériences et tarifs exclusifs négociés par EliteWay.
                  </p>
                  <Link to="/membership" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/85 transition-colors">
                    Voir les abonnements
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exclusiveOffers.map((e) => (
                    <EstablishmentCard key={e.id} establishment={e} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "membership" && (
            <div>
              <h1 className="mb-2">Mon abonnement</h1>
              <p className="text-muted-foreground text-sm mb-8">Gérez votre niveau d'accès EliteWay</p>

              <div className="bg-card border border-border rounded-xl p-7 mb-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Abonnement actuel</p>
                    <p className={`text-xl ${tier.color}`}>Membre {tier.label}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
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

              <div className="bg-card border border-border rounded-xl p-7">
                <h3 className="mb-5">Informations du compte</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prénom</p>
                    <p className="text-sm">{client.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nom</p>
                    <p className="text-sm">{client.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Membre depuis</p>
                    <p className="text-sm">{new Date(client.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Settings className="w-4 h-4" />
                  Modifier mes informations
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
