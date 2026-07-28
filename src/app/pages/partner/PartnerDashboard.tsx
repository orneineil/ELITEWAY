import { useNavigate } from "react-router";
import { usePartnerAuth } from "../../contexts/PartnerAuthContext";
import { establishments } from "../../data/establishments";
import {
  LayoutDashboard,
  Calendar,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
  Heart,
  User,
  ChevronRight,
  Euro,
  Image,
  BarChart3,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";

const clientsData = [
  {
    id: "c1",
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
    totalBookings: 4,
    lastVisit: "2026-06-10",
    status: "VIP",
    review: { rating: 5, text: "Expérience absolument parfaite. Le service était impeccable.", date: "2026-05-20" },
  },
  {
    id: "c2",
    name: "Marc Dubois",
    email: "marc.dubois@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
    totalBookings: 1,
    lastVisit: "2026-06-18",
    status: "Nouveau",
    review: null,
  },
  {
    id: "c3",
    name: "Laura Bernard",
    email: "laura.bernard@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
    totalBookings: 7,
    lastVisit: "2026-06-20",
    status: "Fidèle",
    review: { rating: 5, text: "Un lieu d'exception, j'y reviens chaque saison avec grand plaisir.", date: "2026-04-15" },
  },
  {
    id: "c4",
    name: "Antoine Moreau",
    email: "a.moreau@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
    totalBookings: 2,
    lastVisit: "2026-05-30",
    status: "Régulier",
    review: { rating: 4, text: "Très belle expérience, je recommande vivement.", date: "2026-05-30" },
  },
  {
    id: "c5",
    name: "Émilie Rousseau",
    email: "e.rousseau@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=80&h=80&fit=crop",
    totalBookings: 3,
    lastVisit: "2026-06-02",
    status: "Fidèle",
    review: { rating: 5, text: "Cadre magnifique, personnel aux petits soins. Un sans faute.", date: "2026-06-02" },
  },
];

const statusColors: Record<string, string> = {
  VIP: "bg-primary/15 text-primary",
  Fidèle: "bg-emerald-500/10 text-emerald-400",
  Régulier: "bg-sky-500/10 text-sky-400",
  Nouveau: "bg-border text-muted-foreground",
};

export function PartnerDashboard() {
  const { partner, logout, isAuthenticated } = usePartnerAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClient, setSelectedClient] = useState<typeof clientsData[0] | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/partner/login");
    }
  }, [isAuthenticated, navigate]);

  if (!partner) return null;

  const establishment = establishments.find((e) => e.id === partner.establishmentId);
  if (!establishment) return null;

  const handleLogout = () => {
    logout();
    navigate("/partner/login");
  };

  const stats = {
    views: 1247,
    viewsTrend: "+12%",
    favorites: 89,
    favoritesTrend: "+8%",
    bookings: 23,
    bookingsTrend: "+15%",
    revenue: 4680,
    revenueTrend: "+21%",
    clicks: 342,
    clicksTrend: "+9%",
    rating: establishment.rating,
    reviewsCount: 156,
    conversionRate: "6.7%",
  };

  const recentBookings = [
    { id: "1", customerName: "Sophie Martin", date: "2026-06-15", time: "19:30", guests: 4, status: "confirmed" },
    { id: "2", customerName: "Marc Dubois", date: "2026-06-18", time: "20:00", guests: 2, status: "pending" },
    { id: "3", customerName: "Laura Bernard", date: "2026-06-20", time: "12:30", guests: 6, status: "confirmed" },
    { id: "4", customerName: "Antoine Moreau", date: "2026-06-22", time: "20:30", guests: 3, status: "pending" },
    { id: "5", customerName: "Émilie Rousseau", date: "2026-06-25", time: "13:00", guests: 2, status: "confirmed" },
  ];

  const messages = [
    { id: "1", from: "Jean Dupont", message: "Bonjour, est-il possible de réserver pour 8 personnes ?", time: "Il y a 2h", unread: true },
    { id: "2", from: "Marie Laurent", message: "Merci pour cette magnifique expérience !", time: "Hier", unread: false },
    { id: "3", from: "Paul Girard", message: "Avez-vous des disponibilités le 15 juillet pour un anniversaire ?", time: "Il y a 3j", unread: false },
  ];

  const navItems = [
    { id: "overview",  label: "Vue d'ensemble",   icon: LayoutDashboard },
    { id: "stats",     label: "Statistiques",      icon: BarChart3 },
    { id: "bookings",  label: "Réservations",      icon: Calendar },
    { id: "clients",   label: "Clients",            icon: Users },
    { id: "messages",  label: "Messages",           icon: MessageSquare, badge: messages.filter(m => m.unread).length },
    { id: "media",     label: "Photos & Médias",    icon: Image },
    { id: "profile",   label: "Mon établissement", icon: Settings },
  ];

  // External links in sidebar
  const sidebarLinks = [
    { label: "Gérer mes offres", to: "/partner/offers" },
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
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Espace Partenaire</p>
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
                  {item.badge ? (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-border">
            {/* Quick links */}
            {sidebarLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-sm mb-1">
                <Plus className="w-4 h-4 shrink-0" />
                <span>{l.label}</span>
              </Link>
            ))}
            <div className="px-3 py-2 mt-2 mb-2 border-t border-border/50">
              <p className="text-sm truncate">{partner.name}</p>
              <p className="text-xs text-muted-foreground truncate">{partner.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">

          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">{establishment.name}</h1>
                <p className="text-muted-foreground text-sm">Voici votre activité du mois</p>
              </div>

              {/* KPI row — 5 cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Vues fiche",      value: stats.views,    icon: Eye,        trend: stats.viewsTrend,      color: "text-sky-400" },
                  { label: "Clics CTA",       value: stats.clicks,   icon: TrendingUp, trend: stats.clicksTrend,     color: "text-violet-400" },
                  { label: "Réservations",    value: stats.bookings, icon: Calendar,   trend: stats.bookingsTrend,   color: "text-emerald-400" },
                  { label: "Favoris",         value: stats.favorites,icon: Heart,      trend: stats.favoritesTrend,  color: "text-rose-400" },
                  { label: "CA ce mois",      value: `${stats.revenue}€`, icon: Euro,     trend: stats.revenueTrend, color: "text-primary" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                        <span className="text-xs text-emerald-400">{s.trend}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                      <p className="text-xl">{s.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="mb-5">Réservations récentes</h3>
                  <div className="space-y-3">
                    {recentBookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm">{b.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(b.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} · {b.time}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {b.status === "confirmed" ? "Confirmée" : "En attente"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab("bookings")} className="text-xs text-primary hover:underline mt-4">
                    Voir toutes les réservations
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="mb-5">Derniers messages</h3>
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`py-3 border-b border-border/50 last:border-0 ${msg.unread ? "opacity-100" : "opacity-70"}`}>
                        <div className="flex items-start justify-between mb-1">
                          <p className={`text-sm ${msg.unread ? "font-medium" : ""}`}>{msg.from}</p>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab("messages")} className="text-xs text-primary hover:underline mt-4">
                    Voir tous les messages
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === "bookings" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Réservations</h1>
                <p className="text-muted-foreground text-sm">Gérez vos réservations en cours</p>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Client</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Date</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Heure</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Pers.</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Statut</th>
                        <th className="text-left p-4 text-sm text-muted-foreground font-normal">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4 text-sm">{b.customerName}</td>
                          <td className="p-4 text-sm">{new Date(b.date).toLocaleDateString("fr-FR")}</td>
                          <td className="p-4 text-sm">{b.time}</td>
                          <td className="p-4 text-sm">{b.guests}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                              {b.status === "confirmed" ? "Confirmée" : "En attente"}
                            </span>
                          </td>
                          <td className="p-4">
                            {b.status === "pending" && (
                              <button className="text-xs text-primary hover:underline">Confirmer</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Clients */}
          {activeTab === "clients" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Mes Clients</h1>
                <p className="text-muted-foreground text-sm">Visualisez les profils et avis de vos clients</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Client list */}
                <div className="lg:col-span-1 space-y-3">
                  {clientsData.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
                        selectedClient?.id === client.id
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card hover:border-border/80 hover:bg-accent/30"
                      }`}
                    >
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover bg-muted shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm truncate">{client.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[client.status] || "bg-border text-muted-foreground"}`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{client.totalBookings} réservation{client.totalBookings > 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Client detail */}
                <div className="lg:col-span-2">
                  {selectedClient ? (
                    <div className="bg-card border border-border rounded-xl p-7">
                      <div className="flex items-start gap-5 mb-8 pb-8 border-b border-border">
                        <img
                          src={selectedClient.avatar}
                          alt={selectedClient.name}
                          className="w-16 h-16 rounded-full object-cover bg-muted"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3>{selectedClient.name}</h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[selectedClient.status] || ""}`}>
                              {selectedClient.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        {[
                          { label: "Réservations", value: selectedClient.totalBookings },
                          { label: "Dernière visite", value: new Date(selectedClient.lastVisit).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
                          { label: "Avis", value: selectedClient.review ? `${selectedClient.review.rating}/5 ★` : "—" },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-muted/40 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-sm">{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      {selectedClient.review ? (
                        <div>
                          <h4 className="mb-3">Avis laissé</h4>
                          <div className="bg-muted/30 rounded-xl p-5">
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < selectedClient.review!.rating ? "text-primary fill-primary" : "text-border"}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(selectedClient.review.date).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground italic">
                              « {selectedClient.review.text} »
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          Ce client n'a pas encore laissé d'avis.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Sélectionnez un client pour voir son profil
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Messages</h1>
                <p className="text-muted-foreground text-sm">Communiquez avec vos clients</p>
              </div>
              <div className="bg-card border border-border rounded-xl divide-y divide-border">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm">{msg.from[0]}</span>
                        </div>
                        <div>
                          <p className={`text-sm ${msg.unread ? "font-medium" : ""}`}>{msg.from}</p>
                          <p className="text-xs text-muted-foreground">{msg.time}</p>
                        </div>
                      </div>
                      {msg.unread && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">Nouveau</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{msg.message}</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/85 transition-colors text-sm">
                        Répondre
                      </button>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                        Archiver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats détaillées */}
          {activeTab === "stats" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Statistiques</h1>
                <p className="text-muted-foreground text-sm">Performance de votre fiche ce mois-ci</p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Taux de conversion", value: stats.conversionRate, desc: "Vues → réservations" },
                  { label: "Valeur moy. résa", value: "203€", desc: "Par réservation" },
                  { label: "Durée moy. visite", value: "2m 14s", desc: "Sur votre fiche" },
                  { label: "Vues profil", value: stats.views.toString(), desc: "Ce mois" },
                  { label: "Clics téléphone", value: "38", desc: "Appels générés" },
                  { label: "Partages fiche", value: "17", desc: "Via l'app" },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                    <p className="text-2xl mb-1 text-primary">{s.value}</p>
                    <p className="text-sm mb-0.5">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Monthly trend */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="mb-5">Évolution mensuelle</h3>
                <div className="space-y-3">
                  {[
                    { month: "Janvier", bookings: 11, revenue: 1890 },
                    { month: "Février", bookings: 14, revenue: 2340 },
                    { month: "Mars",    bookings: 18, revenue: 3120 },
                    { month: "Avril",   bookings: 20, revenue: 3680 },
                    { month: "Mai",     bookings: 22, revenue: 4210 },
                    { month: "Juin",    bookings: 23, revenue: 4680 },
                  ].map((row) => (
                    <div key={row.month} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-16 shrink-0">{row.month}</span>
                      <div className="flex-1 h-6 bg-muted/40 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-lg transition-all"
                          style={{ width: `${(row.bookings / 25) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm w-12 text-right shrink-0">{row.bookings}</span>
                      <span className="text-sm text-primary w-16 text-right shrink-0">{row.revenue}€</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">Réservations | Chiffre d'affaires</p>
              </div>

              {/* Top performing days */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="mb-4">Jours les plus performants</h3>
                <div className="flex gap-3 flex-wrap">
                  {["Vendredi", "Samedi", "Dimanche", "Jeudi"].map((d, i) => (
                    <span key={d} className={`px-3 py-1.5 rounded-lg text-sm ${i === 0 ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"}`}>
                      {d} {i === 0 ? "★" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media */}
          {activeTab === "media" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Photos & Médias</h1>
                <p className="text-muted-foreground text-sm">Gérez les visuels de votre fiche</p>
              </div>

              {/* Upload zone */}
              <div className="border-2 border-dashed border-border/60 rounded-2xl p-8 text-center mb-8 hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Déposer vos photos ici</p>
                <p className="text-xs text-muted-foreground mb-4">JPG, PNG ou WEBP — Max 10 Mo par photo</p>
                <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/85 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter des photos
                </button>
              </div>

              {/* Current photos */}
              <h3 className="mb-4">Photos actuelles</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { url: establishment.imageUrl, label: "Photo principale", main: true },
                  ...(establishment.gallery || []).map((url, i) => ({
                    url,
                    label: `Photo ${i + 2}`,
                    main: false,
                  })),
                ].map((photo, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-border/60 aspect-[4/3]">
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs">
                        Remplacer
                      </button>
                      {!photo.main && (
                        <button className="p-1.5 bg-red-500/80 text-white rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {photo.main && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-md text-[10px]">
                        Principale
                      </div>
                    )}
                  </div>
                ))}
                {/* Add slot */}
                <div className="rounded-xl border-2 border-dashed border-border/40 aspect-[4/3] flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors">
                  <div className="text-center">
                    <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">Ajouter</span>
                  </div>
                </div>
              </div>

              {/* Description rapide */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="mb-4">Légendes & alt text</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Ajoutez des descriptions à vos photos pour améliorer votre référencement sur EliteWay.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={establishment.imageUrl} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="Description de la photo…"
                      defaultValue={`Photo principale — ${establishment.name}`}
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/85 transition-colors">
                  Enregistrer les légendes
                </button>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <div className="mb-8">
                <h1 className="mb-1">Mon établissement</h1>
                <p className="text-muted-foreground text-sm">Modifiez vos informations publiques</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3]">
                      <img
                        src={establishment.imageUrl}
                        alt={establishment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground mb-1">Photo principale</p>
                      <button className="w-full py-2.5 border border-border rounded-lg text-sm hover:border-primary/50 transition-colors">
                        Changer la photo
                      </button>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Link
                          to={`/establishment/${establishment.id}`}
                          target="_blank"
                          className="text-xs text-primary hover:underline"
                        >
                          Voir la page publique →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-xl p-7">
                    <h3 className="mb-6">Informations générales</h3>
                    <form className="space-y-5">
                      <div>
                        <label className="block text-sm mb-2">Nom de l'établissement</label>
                        <input
                          type="text"
                          defaultValue={establishment.name}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Description courte</label>
                        <textarea
                          defaultValue={establishment.description}
                          rows={2}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Description détaillée</label>
                        <textarea
                          defaultValue={establishment.longDescription}
                          rows={5}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Localisation</label>
                          <input
                            type="text"
                            defaultValue={establishment.location}
                            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">Capacité</label>
                          <input
                            type="text"
                            defaultValue={establishment.capacity}
                            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/85 transition-colors text-sm"
                      >
                        Enregistrer les modifications
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
