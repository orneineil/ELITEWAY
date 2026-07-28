import { Link } from "react-router";
import { ArrowLeft, Euro, TrendingUp, CheckCircle, Clock } from "lucide-react";

const COMMISSION_RATE = 0.12; // 12%

const TRANSACTIONS = [
  { partner: "Azur Sailing",         booking: "Sophie Martin",   amount: 55,  commission: 6.6,   status: "paid",    date: "14 juin 2026" },
  { partner: "Le Belvédère",         booking: "Henri Beaumont",  amount: 44,  commission: 5.28,  status: "paid",    date: "13 juin 2026" },
  { partner: "Spa Azuréen",          booking: "Clara Tissot",    amount: 90,  commission: 10.8,  status: "pending", date: "12 juin 2026" },
  { partner: "Monaco Sunset Cruise", booking: "Marc Leblanc",    amount: 135, commission: 16.2,  status: "paid",    date: "11 juin 2026" },
  { partner: "Azur Hélicoptères",    booking: "Sophie Renard",   amount: 79,  commission: 9.48,  status: "pending", date: "10 juin 2026" },
  { partner: "Ateliers du Rosé",     booking: "Paul Girard",     amount: 44,  commission: 5.28,  status: "paid",    date: "9 juin 2026" },
  { partner: "Hammam des Anges",     booking: "Émilie Rousseau", amount: 70,  commission: 8.4,   status: "paid",    date: "8 juin 2026" },
];

const totalCommissions = TRANSACTIONS.reduce((s, t) => s + t.commission, 0);
const paidCommissions = TRANSACTIONS.filter(t => t.status === "paid").reduce((s, t) => s + t.commission, 0);
const pendingCommissions = TRANSACTIONS.filter(t => t.status === "pending").reduce((s, t) => s + t.commission, 0);

export function AdminCommissions() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 pt-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard Admin
      </Link>

      <div className="mb-7">
        <h1 className="mb-1">Gestion des Commissions</h1>
        <p className="text-muted-foreground text-sm">Taux de commission EliteWay : {(COMMISSION_RATE * 100).toFixed(0)}% sur chaque réservation</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total commissions",  value: `${totalCommissions.toFixed(2)}€`,   icon: Euro,        color: "text-primary",     sub: "Ce mois" },
          { label: "Commissions versées",value: `${paidCommissions.toFixed(2)}€`,    icon: CheckCircle, color: "text-emerald-400", sub: "Traitées" },
          { label: "En attente",         value: `${pendingCommissions.toFixed(2)}€`, icon: Clock,       color: "text-amber-400",   sub: "À verser" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${k.color}`} />
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl mb-0.5">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Commission rules */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
        <h3 className="mb-3">Règles de commission</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { tier: "Essentiel",  rate: "12%",   note: "Taux standard" },
            { tier: "Prestige",   rate: "10%",   note: "Partenaire silver" },
            { tier: "Élite",      rate: "8%",    note: "Partenaire gold" },
          ].map((r) => (
            <div key={r.tier} className="bg-card/60 rounded-xl p-3 text-center">
              <p className="text-lg text-primary mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>{r.rate}</p>
              <p className="text-xs text-muted-foreground mb-0.5">{r.tier}</p>
              <p className="text-[10px] text-muted-foreground/60">{r.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3>Transactions récentes</h3>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs hover:bg-primary/85 transition-colors">
            Exporter CSV
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Partenaire", "Client", "Montant rés.", "Commission", "Statut", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-sm">{t.partner}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{t.booking}</td>
                <td className="px-4 py-3 text-sm">{t.amount}€</td>
                <td className="px-4 py-3 text-sm text-primary">{t.commission.toFixed(2)}€</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${t.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {t.status === "paid" ? "Versée" : "En attente"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
