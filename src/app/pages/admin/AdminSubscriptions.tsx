import { Link } from "react-router";
import { ArrowLeft, Crown, TrendingUp, Euro } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Jan", essentiel: 220, prestige: 58, elite: 12 },
  { month: "Fév", essentiel: 235, prestige: 63, elite: 14 },
  { month: "Mar", essentiel: 248, prestige: 71, elite: 17 },
  { month: "Avr", essentiel: 261, prestige: 78, elite: 19 },
  { month: "Mai", essentiel: 275, prestige: 84, elite: 21 },
  { month: "Jun", essentiel: 289, prestige: 89, elite: 23 },
];

const RECENT_SUBS = [
  { user: "Isabelle Fontaine", tier: "elite",    amount: "99€/mois",  date: "14 juin 2026" },
  { user: "Henri Beaumont",    tier: "prestige", amount: "29€/mois",  date: "13 juin 2026" },
  { user: "Clara Tissot",      tier: "prestige", amount: "260€/an",   date: "12 juin 2026" },
  { user: "Marc Leblanc",      tier: "elite",    amount: "890€/an",   date: "11 juin 2026" },
  { user: "Sophie Renard",     tier: "prestige", amount: "29€/mois",  date: "10 juin 2026" },
];

const tierColors: Record<string, string> = {
  essentiel: "text-muted-foreground bg-muted/50",
  prestige:  "text-primary bg-primary/10",
  elite:     "text-amber-400 bg-amber-500/10",
};

export function AdminSubscriptions() {
  const current = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prev = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const mrrPrestige = current.prestige * 29;
  const mrrElite = current.elite * 99;
  const mrr = mrrPrestige + mrrElite;
  const prevMrr = prev.prestige * 29 + prev.elite * 99;
  const growth = (((mrr - prevMrr) / prevMrr) * 100).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 pt-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard Admin
      </Link>

      <div className="mb-7">
        <h1 className="mb-1">Gestion des Abonnements</h1>
        <p className="text-muted-foreground text-sm">Suivi des abonnements Membership EliteWay</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "MRR",          value: `${mrr.toLocaleString("fr-FR")}€`, icon: Euro,       trend: `+${growth}%` },
          { label: "Total membres payants", value: current.prestige + current.elite, icon: Crown, trend: "+2 ce mois" },
          { label: "Prestige ✦",   value: current.prestige, icon: Crown,      trend: `+${current.prestige - prev.prestige}` },
          { label: "Élite ★",      value: current.elite,    icon: TrendingUp, trend: `+${current.elite - prev.elite}` },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-xl p-5">
              <Icon className="w-5 h-5 text-primary mb-3" />
              <p className="text-xl mb-0.5">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xs text-emerald-400 mt-1">{k.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Growth chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="mb-5">Croissance des abonnements</h3>
        <div className="space-y-3">
          {MONTHLY_DATA.map((row) => {
            const total = row.essentiel + row.prestige + row.elite;
            return (
              <div key={row.month} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-8 shrink-0">{row.month}</span>
                <div className="flex-1 flex h-6 gap-0.5 rounded-lg overflow-hidden bg-muted/30">
                  <div style={{ width: `${(row.essentiel / total) * 100}%` }} className="bg-border/60" />
                  <div style={{ width: `${(row.prestige / total) * 100}%` }} className="bg-primary/60" />
                  <div style={{ width: `${(row.elite / total) * 100}%` }} className="bg-amber-400/60" />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{total}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-border/60 inline-block" />Essentiel</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/60 inline-block" />Prestige</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400/60 inline-block" />Élite</span>
        </div>
      </div>

      {/* Recent subscriptions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-5">Abonnements récents</h3>
        <div className="space-y-3">
          {RECENT_SUBS.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span style={{ fontFamily: "var(--font-heading)" }} className="text-primary text-sm">{s.user[0]}</span>
                </div>
                <div>
                  <p className="text-sm">{s.user}</p>
                  <p className="text-xs text-muted-foreground">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${tierColors[s.tier]}`}>
                  {s.tier === "elite" ? "Élite ★" : "Prestige ✦"}
                </span>
                <span className="text-sm text-primary">{s.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
