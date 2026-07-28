import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import { ArrowLeft, CreditCard, Lock, CheckCircle, Shield } from "lucide-react";
import { establishments } from "../data/establishments";
import { LogoMark } from "../components/LogoMark";

export function PaymentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const establishment = establishments.find((e) => e.id === id);

  const total = searchParams.get("total") ?? "0";
  const guests = searchParams.get("guests") ?? "1";
  const time = searchParams.get("time") ?? "";
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";

  const [form, setForm] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [method, setMethod] = useState<"card" | "apple" | "google">("card");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-5 pb-24 pt-16 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <LogoMark size={16} className="text-primary-foreground" />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Confirmée</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", lineHeight: 1.1 }} className="mb-3">
          Réservation confirmée !
        </h1>
        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
          Votre réservation chez <strong className="text-foreground">{establishment?.name}</strong> est confirmée.
        </p>
        <p className="text-sm text-muted-foreground mb-7">
          {date && <span>{date} · </span>}{time && <span>{time} · </span>}{guests} pers.
        </p>

        {/* Points earned */}
        <div className="w-full flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 mb-7">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Points gagnés</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="text-primary">+{total} pts</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">EliteWay Rewards</p>
            <p className="text-xs text-primary">Programme fidélité</p>
          </div>
        </div>

        {/* Confirmation number */}
        <div className="w-full bg-card border border-border/60 rounded-2xl px-5 py-4 mb-8 text-center">
          <p className="text-xs text-muted-foreground mb-1">Numéro de confirmation</p>
          <p className="text-sm tracking-widest text-foreground font-mono">EW-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
        </div>

        <div className="w-full space-y-3">
          <Link to="/reservations" className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm text-center hover:bg-primary/85 transition-colors">
            Voir mes réservations
          </Link>
          <Link to="/" className="block w-full py-3 border border-border/60 rounded-2xl text-sm text-muted-foreground text-center hover:text-foreground transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link to={`/establishment/${id}/reserve`} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Paiement sécurisé</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{establishment?.name}</h2>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" /> SSL
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-card border border-border/60 rounded-2xl px-5 py-4 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">{establishment?.name}</p>
            <p className="text-xs text-muted-foreground">{date} · {time} · {guests} pers.</p>
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-primary">{total}€</p>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { id: "card",   label: "Carte" },
          { id: "apple",  label: "Apple Pay" },
          { id: "google", label: "Google Pay" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id as any)}
            className={`py-2.5 rounded-xl text-xs transition-all ${method === m.id ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === "card" ? (
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Numéro de carte</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.card}
                onChange={(e) => setForm({ ...form, card: formatCard(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-11 pr-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary tracking-widest"
                required maxLength={19}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2">Expiration</label>
              <input
                type="text"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                placeholder="MM/AA"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm mb-2">CVV</label>
              <input
                type="text"
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="•••"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required maxLength={4}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Nom sur la carte</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
              className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Paiement sécurisé par chiffrement SSL 256 bits. Vos données ne sont jamais stockées.
          </div>

          <button
            type="submit"
            disabled={loading || !form.card || !form.expiry || !form.cvv || !form.name}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary/85 transition-colors"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Traitement en cours…" : `Payer ${total}€`}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border/60 flex items-center justify-center mb-4">
            <span className="text-2xl">{method === "apple" ? "🍎" : "🔵"}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            {method === "apple" ? "Apple Pay" : "Google Pay"} sera disponible lors du déploiement sur mobile.
          </p>
          <button
            onClick={() => setMethod("card")}
            className="text-primary text-sm hover:underline"
          >
            Utiliser une carte bancaire
          </button>
        </div>
      )}
    </div>
  );
}
