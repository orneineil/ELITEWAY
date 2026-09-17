import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import {
  ArrowLeft, Calendar, Clock, Users, MessageSquare, CheckCircle, ShieldCheck, Loader,
} from "lucide-react";
import { ComposedMoment, WhoKey, BudgetKey, TimeKey, ExperienceBriefInput } from "../data/momentEngine";
import { persistMoment, PersistedItemResult } from "../data/moments";
import { useClientAuth } from "../contexts/ClientAuthContext";

// ── Experience Confirmation ──────────────────────────────────────────────
// Doctrine (directive "ORCHESTRATION IS PART OF THE MVP", section 6) : ceci
// n'est pas un "récapitulatif de réservation" mais la première étape réelle
// de l'orchestration EliteWay — un seul geste du membre déclenche la demande
// vers chaque partenaire impliqué dans le Moment, jamais une réservation
// isolée par établissement.
interface BookingLocationState {
  composed: ComposedMoment;
  who: WhoKey;
  budget: BudgetKey;
  time: TimeKey;
  city: string | null;
}

function todayIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function MomentBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { client, isAuthenticated, login } = useClientAuth();
  const state = location.state as BookingLocationState | null;

  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState("20h00");
  const [partySize, setPartySize] = useState(state?.who === "couple" ? 2 : state?.who === "solo" ? 1 : 2);
  const [occasion, setOccasion] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [dietaryNote, setDietaryNote] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedItems, setConfirmedItems] = useState<PersistedItemResult[] | null>(null);

  if (!state) {
    return (
      <div className="max-w-sm mx-auto px-5 pt-20 text-center">
        <p className="text-sm text-muted-foreground mb-4">Aucun Moment à confirmer pour l'instant.</p>
        <Link to="/moment" className="text-primary hover:underline text-sm">Créer un Moment avec EliteWay AI</Link>
      </div>
    );
  }

  const { composed, city } = state;
  const hasGastronomie = composed.beats.some((b) => b.establishment.category === "gastronomie");
  const total = composed.pricePerPerson > 0 ? composed.pricePerPerson * partySize : null;

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    setLoginLoading(false);
    if (!result.success) setLoginError(result.error || "Une erreur est survenue.");
    // Ne pas naviguer : rester sur cette page pour ne jamais perdre le Moment
    // composé, qui ne vit qu'en mémoire (state de navigation).
  };

  const handleConfirm = async () => {
    if (!client) return;
    setSubmitting(true);
    setError(null);

    const brief: ExperienceBriefInput = {
      partySize,
      date,
      time,
      occasion: occasion.trim() || undefined,
      specialRequest: specialRequest.trim() || undefined,
      dietaryNote: dietaryNote.trim() || undefined,
    };

    const result = await persistMoment({
      userId: client.id,
      composed,
      who: state.who,
      budget: state.budget,
      time: state.time,
      city,
      brief,
    });

    setSubmitting(false);
    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue, réessayez dans un instant.");
      return;
    }
    setConfirmedItems(result.items ?? []);
  };

  if (confirmedItems) {
    return (
      <div className="max-w-sm mx-auto px-5 pb-24 pt-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Expérience confirmée</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.1 }} className="mb-3">
          {composed.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
          EliteWay prend le relais : chaque partenaire de ce Moment reçoit maintenant les informations nécessaires
          pour vous accueillir. Vous serez notifié à chaque confirmation.
        </p>

        <div className="w-full flex flex-col gap-2.5 mb-7">
          {confirmedItems.map((it, i) => (
            <div key={i} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 text-left">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-primary mb-0.5">{it.label}</p>
                <p className="text-sm truncate">{it.establishmentName}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.08em] text-amber-400 border border-amber-400/30 rounded-full px-2 py-1 shrink-0 ml-2">
                En cours de confirmation
              </span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3">
          <Link to="/my-moments" className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm text-center hover:bg-primary/85 transition-colors">
            Voir mes Moments
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
      <div className="flex items-center gap-3 mb-7">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Expérience Confirmation</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{composed.title}</h2>
        </div>
      </div>

      {/* Récapitulatif des temps forts concernés */}
      <div className="flex flex-col gap-2 mb-7">
        {composed.beats.map((beat) => (
          <div key={beat.establishment.id} className="flex items-center gap-3 bg-card rounded-xl px-3.5 py-2.5">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
              <img src={beat.establishment.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.1em] text-primary">{beat.label}</p>
              <p className="text-xs truncate">{beat.establishment.name}</p>
            </div>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Connectez-vous pour confirmer ce Moment — il reste prêt tel quel pendant que vous vous connectez.
          </p>
          <form onSubmit={handleInlineLogin} className="space-y-3 mb-4">
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm disabled:opacity-40"
            >
              {loginLoading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Pas encore de compte ?{" "}
            <Link to="/client/register" className="text-primary hover:underline">S'inscrire</Link>
            {" "}— vous devrez recomposer votre Moment après inscription.
          </p>
        </div>
      ) : (
        <div>
          <div className="space-y-5 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm mb-2"><Calendar className="w-4 h-4 text-primary" /> Date</label>
              <input
                type="date"
                value={date}
                min={todayIso()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm mb-2"><Clock className="w-4 h-4 text-primary" /> Heure de départ</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="20h00"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm mb-2"><Users className="w-4 h-4 text-primary" /> Nombre de personnes</label>
              <div className="flex items-center justify-between bg-card border border-border/60 rounded-2xl px-6 py-4">
                <button onClick={() => setPartySize((p) => Math.max(1, p - 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg">—</button>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>{partySize} pers.</span>
                <button onClick={() => setPartySize((p) => Math.min(12, p + 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg">+</button>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm mb-2"><MessageSquare className="w-4 h-4 text-primary" /> Occasion (optionnel)</label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Anniversaire, demande, retrouvailles…"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {hasGastronomie && (
              <div>
                <label className="block text-sm mb-2">Restrictions alimentaires (optionnel)</label>
                <input
                  type="text"
                  value={dietaryNote}
                  onChange={(e) => setDietaryNote(e.target.value)}
                  placeholder="Allergies, régime particulier…"
                  className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Demande particulière (optionnel)</label>
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                rows={3}
                placeholder="Une attention précise pour ce Moment…"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mb-5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            Chaque partenaire ne recevra que ce qui le concerne pour ce Moment précis — jamais votre profil complet.
          </div>

          {total != null && (
            <div className="flex items-center justify-between text-sm mb-5 px-1">
              <span className="text-muted-foreground">Budget estimé</span>
              <span className="text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                {composed.isEstimate ? "≈ " : ""}{total} €
              </span>
            </div>
          )}

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={submitting || !date || !time}
            className="w-full py-4 rounded-full text-sm text-center uppercase tracking-[0.1em] transition-transform active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: "oklch(0.74 0.0792 80)", color: "oklch(0.08 0.03 256)" }}
          >
            {submitting && <Loader className="w-4 h-4 animate-spin" />}
            {submitting ? "Confirmation en cours…" : "Confirmer ce Moment"}
          </button>
        </div>
      )}
    </div>
  );
}
