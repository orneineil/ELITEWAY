import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Crown, Users, UserCheck, UserX } from "lucide-react";

const MOCK_USERS = [
  { id: "u1", name: "Sophie Martin",   email: "sophie.martin@email.com", tier: "elite",     bookings: 7,  joined: "2025-09-12", status: "active" },
  { id: "u2", name: "Marc Dubois",      email: "marc.dubois@email.com",   tier: "essentiel", bookings: 1,  joined: "2026-05-03", status: "active" },
  { id: "u3", name: "Laura Bernard",    email: "laura.b@email.com",       tier: "prestige",  bookings: 4,  joined: "2026-01-20", status: "active" },
  { id: "u4", name: "Antoine Moreau",   email: "a.moreau@email.com",      tier: "prestige",  bookings: 3,  joined: "2025-11-08", status: "active" },
  { id: "u5", name: "Émilie Rousseau",  email: "e.rousseau@email.com",    tier: "elite",     bookings: 9,  joined: "2025-08-30", status: "active" },
  { id: "u6", name: "Jean Dupont",      email: "j.dupont@email.com",      tier: "essentiel", bookings: 0,  joined: "2026-06-10", status: "inactive" },
  { id: "u7", name: "Marie Laurent",    email: "m.laurent@email.com",     tier: "prestige",  bookings: 5,  joined: "2025-12-15", status: "active" },
  { id: "u8", name: "Paul Girard",      email: "p.girard@email.com",      tier: "essentiel", bookings: 1,  joined: "2026-04-22", status: "active" },
];

const tierColors: Record<string, string> = {
  essentiel: "text-muted-foreground bg-muted/50",
  prestige:  "text-primary bg-primary/10",
  elite:     "text-amber-400 bg-amber-500/10",
};
const tierLabels: Record<string, string> = {
  essentiel: "Essentiel", prestige: "Prestige ✦", elite: "Élite ★",
};

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const stats = {
    total: MOCK_USERS.length,
    elite: MOCK_USERS.filter(u => u.tier === "elite").length,
    prestige: MOCK_USERS.filter(u => u.tier === "prestige").length,
    essentiel: MOCK_USERS.filter(u => u.tier === "essentiel").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 pt-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard Admin
      </Link>

      <div className="mb-7">
        <h1 className="mb-1">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground text-sm">{stats.total} membres inscrits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total",    value: stats.total,     icon: Users,     color: "text-sky-400" },
          { label: "Élite",    value: stats.elite,     icon: Crown,     color: "text-amber-400" },
          { label: "Prestige", value: stats.prestige,  icon: Crown,     color: "text-primary" },
          { label: "Essentiel",value: stats.essentiel, icon: UserCheck, color: "text-muted-foreground" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {["all", "elite", "prestige", "essentiel"].map((t) => (
          <button key={t} onClick={() => setTierFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors capitalize ${tierFilter === t ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"}`}>
            {t === "all" ? "Tous" : tierLabels[t]}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, email…"
            className="pl-9 pr-4 py-1.5 bg-card border border-border/60 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Utilisateur", "Email", "Abonnement", "Réservations", "Inscrit le", "Statut", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span style={{ fontFamily: "var(--font-heading)" }} className="text-primary text-sm">{u.name[0]}</span>
                    </div>
                    <span className="text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${tierColors[u.tier]}`}>{tierLabels[u.tier]}</span>
                </td>
                <td className="px-4 py-3 text-sm">{u.bookings}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.joined).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {u.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                    <UserX className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
