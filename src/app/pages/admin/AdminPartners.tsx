import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check, X, Eye, Search, Building2 } from "lucide-react";
import { establishments } from "../../data/establishments";

type Status = "all" | "active" | "pending" | "suspended";

const statusLabel: Record<string, { label: string; color: string }> = {
  active:    { label: "Actif",          color: "bg-emerald-500/10 text-emerald-400" },
  pending:   { label: "En attente",     color: "bg-amber-500/10 text-amber-400" },
  suspended: { label: "Suspendu",       color: "bg-red-500/10 text-red-400" },
};

const mockPartners = establishments.map((e, i) => ({
  id: e.id,
  name: e.name,
  category: e.category,
  location: e.location,
  status: i < 3 ? "pending" : i === 5 ? "suspended" : "active",
  revenue: `${(Math.random() * 3000 + 500).toFixed(0)}€`,
  commission: `${(Math.random() * 300 + 50).toFixed(0)}€`,
  joinedDate: "2026-0" + ((i % 6) + 1) + "-15",
}));

export function AdminPartners() {
  const [filter, setFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");

  const filtered = mockPartners.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 pt-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard Admin
      </Link>

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="mb-1">Gestion des Partenaires</h1>
          <p className="text-muted-foreground text-sm">{mockPartners.length} partenaires · {mockPartners.filter(p => p.status === "pending").length} en attente de validation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {(["all", "active", "pending", "suspended"] as Status[]).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "Tous" : statusLabel[s].label}
            <span className="ml-1.5 opacity-60">{s === "all" ? mockPartners.length : mockPartners.filter(p => p.status === s).length}</span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…"
            className="pl-9 pr-4 py-1.5 bg-card border border-border/60 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              {["Établissement", "Catégorie", "Localisation", "Statut", "CA", "Commission", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs text-muted-foreground font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.joinedDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{p.category}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{p.location}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusLabel[p.status].color}`}>
                    {statusLabel[p.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{p.revenue}</td>
                <td className="px-4 py-3 text-sm text-primary">{p.commission}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link to={`/establishment/${p.id}`} className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                    {p.status === "pending" && (
                      <>
                        <button className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                        <button className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
