import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft, Sparkles, MapPin, Loader, ChevronRight, Star, CheckCircle2, Clock3, RefreshCcw,
} from "lucide-react";
import { useClientAuth } from "../contexts/ClientAuthContext";
import {
  fetchMyMoments, computeExperienceControl, submitMomentFeedback, fetchFeedback,
  PersistedMoment, PartnerStatus,
} from "../data/moments";
import { MOODS } from "../data/momentEngine";
import { establishments } from "../data/establishments";

// ── My Moments — la mémoire des expériences EliteWay ────────────────────────
// Doctrine (directive "ORCHESTRATION IS PART OF THE MVP", section 8) : cet
// écran n'est pas une liste de réservations passées, c'est la mémoire vivante
// des Moments vécus — chaque élément montre s'il a été honoré, permet un
// retour honnête, et propose de recréer quelque chose de similaire ailleurs.

const STATUS_BADGE: Record<PartnerStatus, { label: string; className: string }> = {
  pending: { label: "En attente", className: "text-muted-foreground border-border/60" },
  requested: { label: "Transmis au partenaire", className: "text-amber-400 border-amber-400/30" },
  confirmed: { label: "Confirmé", className: "text-emerald-400 border-emerald-400/30" },
  ready: { label: "Prêt", className: "text-emerald-400 border-emerald-400/30" },
  cancelled: { label: "Annulé", className: "text-red-400 border-red-400/30" },
  needs_attention: { label: "EliteWay s'en occupe", className: "text-amber-400 border-amber-400/30" },
};

function moodLabel(mood: string | null) {
  return MOODS.find((m) => m.key === mood)?.label ?? mood ?? "Moment";
}

export function MyMomentsPage() {
  const { client, isAuthenticated } = useClientAuth();
  const [moments, setMoments] = useState<PersistedMoment[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !client) return;
    let cancelled = false;
    fetchMyMoments(client.id).then(({ moments: m, error }) => {
      if (cancelled) return;
      setMoments(m);
      if (error) setLoadError(error);
    });
    return () => { cancelled = true; };
  }, [isAuthenticated, client]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto px-5 pb-28 pt-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-3">
          Vos Moments
        </h2>
        <p className="text-muted-foreground text-sm mb-7 max-w-xs leading-relaxed">
          Connectez-vous pour retrouver la mémoire de vos expériences EliteWay.
        </p>
        <Link to="/client/login" className="w-full max-w-xs py-4 bg-primary text-primary-foreground rounded-2xl text-center text-sm">
          Se connecter
        </Link>
      </div>
    );
  }

  const selected = moments?.find((m) => m.id === selectedId) ?? null;

  if (selected) {
    return <MomentDetail moment={selected} userId={client!.id} onBack={() => setSelectedId(null)} />;
  }

  const upcoming = (moments ?? []).filter((m) => m.status === "upcoming");
  const saved = (moments ?? []).filter((m) => m.status === "saved");
  const past = (moments ?? []).filter((m) => m.status === "past");

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      <div className="flex items-center gap-3 mb-7">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">EliteWay</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>Mes Moments</h2>
        </div>
      </div>

      {moments === null ? (
        <div className="flex justify-center py-16">
          <Loader className="w-5 h-5 text-primary animate-spin" />
        </div>
      ) : moments.length === 0 ? (
        <div className="text-center pt-10">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-6">
            Aucun Moment pour l'instant — dites à EliteWay ce que vous avez envie de vivre.
          </p>
          <Link to="/moment" className="text-sm text-primary hover:underline">Créer un Moment</Link>
        </div>
      ) : (
        <>
          {loadError && (
            <p className="text-[11px] text-muted-foreground mb-4">
              Certaines informations de statut ne sont pas encore disponibles.
            </p>
          )}
          {upcoming.length > 0 && (
            <MomentGroup title="À venir" moments={upcoming} onSelect={setSelectedId} />
          )}
          {saved.length > 0 && (
            <MomentGroup title="Enregistrés" moments={saved} onSelect={setSelectedId} />
          )}
          {past.length > 0 && (
            <MomentGroup title="Vécus" moments={past} onSelect={setSelectedId} />
          )}
        </>
      )}
    </div>
  );
}

function MomentGroup({ title, moments, onSelect }: { title: string; moments: PersistedMoment[]; onSelect: (id: string) => void }) {
  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{title}</p>
      <div className="space-y-3">
        {moments.map((m) => {
          const control = computeExperienceControl(m.items.map((i) => ({ partnerStatus: i.partnerStatus })));
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3.5 text-left hover:border-primary/40 border border-transparent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="truncate mb-0.5">{m.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{moodLabel(m.mood)}</span>
                  {m.city && (<><span>·</span><MapPin className="w-3 h-3" /><span>{m.city}</span></>)}
                  <span>· {m.items.length} temps forts</span>
                </div>
              </div>
              <span className={`text-[9px] uppercase tracking-[0.08em] border rounded-full px-2 py-1 shrink-0 ${
                control.ready ? "text-emerald-400 border-emerald-400/30" : control.needsAttention ? "text-amber-400 border-amber-400/30" : "text-muted-foreground border-border/60"
              }`}>
                {control.ready ? "Prêt" : control.needsAttention ? "EliteWay s'en occupe" : "En cours"}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MomentDetail({ moment, userId, onBack }: { moment: PersistedMoment; userId: string; onBack: () => void }) {
  const navigate = useNavigate();
  const control = computeExperienceControl(moment.items.map((i) => ({ partnerStatus: i.partnerStatus })));
  const isPast = moment.status === "past";

  const [similarCity, setSimilarCity] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<{ rating: number | null; note: string | null } | null>(null);
  const [rating, setRating] = useState(5);
  const [liked, setLiked] = useState("");
  const [disliked, setDisliked] = useState("");
  const [wellAnticipated, setWellAnticipated] = useState("");
  const [missing, setMissing] = useState("");
  const [learnOptIn, setLearnOptIn] = useState(false);
  const [learnTag, setLearnTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchFeedback(moment.id, userId).then((f) => setExistingFeedback(f));
  }, [moment.id, userId]);

  const handleCreateSimilar = () => {
    const params = new URLSearchParams();
    if (moment.mood) params.set("mood", moment.mood);
    if (similarCity.trim()) params.set("city", similarCity.trim());
    navigate(`/moment?${params.toString()}`);
  };

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    const result = await submitMomentFeedback({
      momentId: moment.id,
      userId,
      rating,
      liked: liked.trim() || undefined,
      disliked: disliked.trim() || undefined,
      wellAnticipated: wellAnticipated.trim() || undefined,
      missing: missing.trim() || undefined,
      learnTag: learnOptIn && learnTag.trim() ? learnTag.trim() : undefined,
    });
    setSubmitting(false);
    if (result.success) setSubmitted(true);
  };

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      <div className="flex items-center gap-3 mb-7">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{moodLabel(moment.mood)}</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="truncate">{moment.title}</h2>
        </div>
      </div>

      {/* Experience Control — jamais optimiste : "prêt" seulement si tout
          est réellement confirmé côté partenaires. */}
      <div className={`rounded-2xl border p-4 mb-6 ${control.ready ? "border-emerald-400/30 bg-emerald-400/5" : "border-border/60 bg-card"}`}>
        <div className="flex items-center gap-2 mb-1">
          {control.ready ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock3 className="w-4 h-4 text-muted-foreground" />}
          <p className={`text-xs uppercase tracking-[0.1em] ${control.ready ? "text-emerald-400" : "text-muted-foreground"}`}>
            {control.label}
          </p>
        </div>
        {!control.ready && !control.needsAttention && (
          <p className="text-[11px] text-muted-foreground">
            EliteWay confirme actuellement chaque élément avec les partenaires concernés.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5 mb-7">
        {moment.items.map((item) => {
          const badge = STATUS_BADGE[item.partnerStatus];
          const establishment = establishments.find((e) => e.id === item.establishmentId);
          return (
            <div key={item.id} className="flex items-center justify-between bg-card rounded-xl px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.1em] text-primary mb-0.5">{item.label}</p>
                <p className="text-sm truncate flex items-center gap-1.5">
                  {isPast && <Star className="w-3 h-3 fill-primary text-primary shrink-0" />}
                  {establishment?.name ?? item.establishmentId}
                </p>
              </div>
              <span className={`text-[9px] uppercase tracking-[0.08em] border rounded-full px-2 py-1 shrink-0 ml-2 ${badge.className}`}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* "Fais-moi quelque chose de similaire, mais à Monaco" */}
      <div className="rounded-2xl border border-dashed border-border/60 p-4 mb-7">
        <p className="text-xs text-muted-foreground mb-3">Créer quelque chose de similaire</p>
        <div className="flex items-center gap-2">
          <input
            value={similarCity}
            onChange={(e) => setSimilarCity(e.target.value)}
            placeholder="mais à Monaco… (optionnel)"
            className="flex-1 min-w-0 px-3 py-2.5 bg-input-background border border-border/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleCreateSimilar}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs shrink-0"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Recréer
          </button>
        </div>
      </div>

      {/* Feedback — uniquement pour un Moment vécu */}
      {isPast && (
        <div>
          {existingFeedback ? (
            <div className="rounded-2xl bg-card p-4">
              <p className="text-xs uppercase tracking-[0.1em] text-primary mb-2">Votre retour</p>
              <p className="text-sm mb-1">Note : {existingFeedback.rating ?? "—"}/5</p>
              {existingFeedback.note && <p className="text-xs text-muted-foreground whitespace-pre-line">{existingFeedback.note}</p>}
            </div>
          ) : submitted ? (
            <div className="rounded-2xl bg-emerald-400/5 border border-emerald-400/20 p-4 text-sm text-emerald-400">
              Merci — votre retour aide EliteWay à mieux composer vos prochains Moments.
            </div>
          ) : !feedbackOpen ? (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="w-full py-4 rounded-full text-sm text-center uppercase tracking-[0.1em] border border-primary/40 text-primary"
            >
              Donner mon retour
            </button>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-primary mb-3">Comment était ce Moment ?</p>
              <div className="flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className="p-1">
                    <Star className={`w-6 h-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <div className="space-y-3 mb-4">
                <FeedbackField label="Ce que vous avez aimé" value={liked} onChange={setLiked} />
                <FeedbackField label="Ce qui pourrait être amélioré" value={disliked} onChange={setDisliked} />
                <FeedbackField label="Ce qu'EliteWay a bien anticipé" value={wellAnticipated} onChange={setWellAnticipated} />
                <FeedbackField label="Ce qui a manqué" value={missing} onChange={setMissing} />
              </div>
              <label className="flex items-start gap-2.5 mb-2 cursor-pointer">
                <input type="checkbox" checked={learnOptIn} onChange={(e) => setLearnOptIn(e.target.checked)} className="mt-0.5" />
                <span className="text-xs text-muted-foreground">
                  Aider EliteWay à mieux me connaître pour mes prochains Moments (préférence durable, jamais un profil complet).
                </span>
              </label>
              {learnOptIn && (
                <input
                  value={learnTag}
                  onChange={(e) => setLearnTag(e.target.value)}
                  placeholder="ex. vue mer, ambiance calme…"
                  className="w-full px-3 py-2.5 mb-4 bg-input-background border border-border/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
              <button
                onClick={handleSubmitFeedback}
                disabled={submitting}
                className="w-full py-4 rounded-full text-sm text-center uppercase tracking-[0.1em] disabled:opacity-40"
                style={{ background: "oklch(0.74 0.0792 80)", color: "oklch(0.08 0.03 256)" }}
              >
                {submitting ? "Envoi…" : "Envoyer mon retour"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeedbackField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] text-muted-foreground mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
