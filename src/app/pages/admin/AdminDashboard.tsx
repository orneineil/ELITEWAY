import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Users, Building2, Crown, Euro,
  TrendingUp, AlertCircle, CheckCircle, Clock,
  LogOut, ChevronRight, Bell,
} from "lucide-react";
import { LogoMark } from "../../components/LogoMark";

const NAV = [
  { id: "overview",       label: "Vue d'ensemble",     icon: LayoutDashboard, to: "/admin" },
  { id: "users",          label: "Utilisateurs",        icon: Users,           to: "/admin/users" },
  { id: "partners",       label: "Partenaires",         icon: Building2,       to: "/admin/partners" },
  { id: "subscriptions",  label: "Abonnements",         icon: Crown,           to: "/admin/subscriptions" },
  { id: "commissions",    label: "Commissions",         icon: Euro,            to: "/admin/commissions" },
];

const KPIS = [
  { label: "Utilisateurs",   value: "1 284",  trend: "+34 ce mois",  color: "text-sky-400",     icon: Users },
  { label: "Partenaires",    value: "26",      trend: "+2 en attente",color: "text-violet-400",  icon: Building2 },
  { label: "Abonnements",    value: "312",     trend: "+18 ce mois",  color: "text-primary",     icon: Crown },
  { label: "CA mensuel",     value: "24 680€", trend: "+21%",         color: "text-emerald-400", icon: Euro },
];

const PENDING_PARTNERS = [
  { id: "p1", name: "Château des Oliviers", city: "Vence",    category: "Gastronomie",  submitted: "Il y a 2j" },
  { id: "p2", name: "Côte Bleue Hôtel",    city: "Antibes",  category: "Hôtellerie",   submitted: "Il y a 4j" },
  { id: "p3", name: "Azur Diving Club",    city: "Nice",     category: "Navigation",   submitted: "Il y a 6j" },
];

const RECENT_ACTIVITY = [
  { msg: "Nouvel abonnement Élite — Isabelle Fontaine",  time: "Il y a 5 min",  type: "success" },
  { msg: "Partenaire en attente de validation — Château des Oliviers", time: "Il y a 2h", type: "warning" },
  { msg: "Remboursement traité — Sophie Martin — 85€",   time: "Il y a 3h",    type: "info" },
  { msg: "Commission versée — Azur Sailing — 42€",       time: "Hier",         type: "success" },
  { msg: "Signalement avis — Le Belvédère",              time: "Hier",         type: "error" },
];

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col">
        <div className="px-5 py-6 border-b border-border flex items-center gap-2.5">
          <LogoMark size={22} className="text-primary" />
          <div>
            <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.2em", fontSize: "0.75rem" }}>ELITEWAY</span>
            <p className="text-[10px] text-muted-foreground">Administration</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.id === "partners" && (
                  <span className="ml-auto w-4 h-4 bg-amber-500 text-black rounded-full text-[9px] flex items-center justify-center">2</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-accent rounded-lg text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Retour à l'app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {activeNav === "overview" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="mb-0.5">Dashboard Admin</h1>
                <p className="text-muted-foreground text-sm">Vue globale de la plateforme EliteWay</p>
              </div>
              <button className="relative w-9 h-9 bg-card border border-border rounded-xl flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {KPIS.map((k) => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${k.color}`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                    <p className="text-xl mb-1">{k.value}</p>
                    <p className="text-xs text-emerald-400">{k.trend}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Partenaires en attente */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3>Partenaires en attente</h3>
                  <span className="w-6 h-6 bg-amber-500/15 text-amber-400 rounded-full text-xs flex items-center justify-center">{PENDING_PARTNERS.length}</span>
                </div>
                <div className="space-y-3">
                  {PENDING_PARTNERS.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                      <div>
                        <p className="text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.city} · {p.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{p.submitted}</span>
                        <button onClick={() => setActiveNav("partners")} className="text-primary">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="mb-5">Activité récente</h3>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((a, i) => {
                    const Icon = a.type === "success" ? CheckCircle : a.type === "warning" ? AlertCircle : a.type === "error" ? AlertCircle : Clock;
                    const color = a.type === "success" ? "text-emerald-400" : a.type === "warning" ? "text-amber-400" : a.type === "error" ? "text-red-400" : "text-sky-400";
                    return (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                        <Icon className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed">{a.msg}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav !== "overview" && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p className="mb-2">Section en cours de développement</p>
              <Link to={`/admin/${activeNav}`} className="text-primary text-sm hover:underline">
                Ouvrir la page dédiée →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
