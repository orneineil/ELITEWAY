import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Heart, Sparkles, Users, Wallet, Clock, ArrowRight, MapPin, Star, Send,
} from "lucide-react";
import {
  MOODS, WHO_OPTIONS, BUDGET_OPTIONS, TIME_OPTIONS,
  composeMoment, totalsFor, MoodKey, WhoKey, BudgetKey, TimeKey, ComposedMoment, Category,
} from "../data/momentEngine";
import { parseIntent } from "../data/intentParser";

// La doctrine ONE REQUEST / ASK ELITEWAY : l'utilisateur arrive soit avec une
// phrase libre (?q=, tapée sur Home), soit avec une humeur choisie en un tap
// (?mood=). Dans les deux cas, on ne redemande jamais ce qui est déjà connu —
// seules les questions dont la réponse manque encore sont posées.
const ORDER: readonly ("mood" | "who" | "budget" | "time")[] = ["mood", "who", "budget", "time"];
type QuestionKey = typeof ORDER[number];
type StepKey = QuestionKey | "result";

interface ResolvedState {
  mood: MoodKey | null;
  who: WhoKey | null;
  budget: BudgetKey | null;
  time: TimeKey | null;
}

function firstUnresolved(state: ResolvedState): QuestionKey | null {
  for (const key of ORDER) {
    if (state[key] === null) return key;
  }
  return null;
}

const REMOVE_TRIGGERS = ["enlève", "enlever", "retire", "retirer", "supprime", "supprimer"];
const CATEGORY_WORDS: Record<string, Category> = {
  "dîner": "gastronomie", "déjeuner": "gastronomie", "restaurant": "gastronomie", "repas": "gastronomie",
  "spa": "bien-etre", "bien-être": "bien-etre", "massage": "bien-etre",
  "yacht": "navigation", "bateau": "navigation", "voile": "navigation",
  "vol": "aviation", "hélicoptère": "aviation", "jet": "aviation",
};

export function MomentBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<StepKey>("mood");
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [who, setWho] = useState<WhoKey | null>(null);
  const [budget, setBudget] = useState<BudgetKey | null>(null);
  const [time, setTime] = useState<TimeKey | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [moment, setMoment] = useState<ComposedMoment | null | "empty">(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  // Comprendre ce qui a été fourni dès l'arrivée sur la page — depuis "Ask
  // EliteWay" (texte libre) ou depuis une puce d'humeur sur Home.
  useEffect(() => {
    const q = searchParams.get("q");
    const moodParam = searchParams.get("mood");

    let initial: ResolvedState = { mood: null, who: null, budget: null, time: null };
    let initialCity: string | null = null;

    if (q) {
      const parsed = parseIntent(q);
      initial = { mood: parsed.mood, who: parsed.who, budget: parsed.budget, time: parsed.time };
      initialCity = parsed.city;
    } else if (moodParam === "surprise") {
      initial.mood = MOODS[Math.floor(Math.random() * MOODS.length)].key;
    } else if (moodParam && MOODS.some((m) => m.key === moodParam)) {
      initial.mood = moodParam as MoodKey;
    }

    setMood(initial.mood);
    setWho(initial.who);
    setBudget(initial.budget);
    setTime(initial.time);
    setCity(initialCity);

    const next = firstUnresolved(initial);
    if (next) {
      setStep(next);
    } else if (initial.mood && initial.who && initial.budget && initial.time) {
      finalize(initial.mood, initial.who, initial.budget, initial.time, initialCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalize = (m: MoodKey, w: WhoKey, b: BudgetKey, t: TimeKey, c: string | null) => {
    const result = composeMoment({ mood: m, who: w, budget: b, time: t, city: c });
    setMoment(result ?? "empty");
    setStep("result");
  };

  const answer = (key: QuestionKey, value: string) => {
    const updated: ResolvedState = {
      mood: key === "mood" ? (value as MoodKey) : mood,
      who: key === "who" ? (value as WhoKey) : who,
      budget: key === "budget" ? (value as BudgetKey) : budget,
      time: key === "time" ? (value as TimeKey) : time,
    };
    setMood(updated.mood);
    setWho(updated.who);
    setBudget(updated.budget);
    setTime(updated.time);

    const next = firstUnresolved(updated);
    if (next) setStep(next);
    else if (updated.mood && updated.who && updated.budget && updated.time) {
      finalize(updated.mood, updated.who, updated.budget, updated.time, city);
    }
  };

  const goBack = () => {
    const idx = step === "result" ? ORDER.length - 1 : ORDER.indexOf(step as QuestionKey);
    if (idx <= 0) navigate(-1);
    else setStep(ORDER[idx - 1]);
  };

  // La conversation continue après la proposition — l'utilisateur peut
  // affiner ("plus calme", "enlève le dîner", "budget finalement 300€")
  // plutôt que de tout recommencer.
  const handleRefine = (text: string) => {
    if (moment === "empty" || moment === null) return;
    const lower = text.toLowerCase();
    setRefineError(null);

    if (REMOVE_TRIGGERS.some((t) => lower.includes(t))) {
      const catWord = Object.keys(CATEGORY_WORDS).find((w) => lower.includes(w));
      if (catWord) {
        const cat = CATEGORY_WORDS[catWord];
        const filtered = moment.beats.filter((b) => b.establishment.category !== cat);
        if (filtered.length === moment.beats.length) {
          setRefineError("Cet élément ne fait pas partie de votre Moment actuel.");
          return;
        }
        if (filtered.length === 0) {
          setMoment("empty");
          return;
        }
        const { pricePerPerson, hasSurDevis } = totalsFor(filtered);
        setMoment({ ...moment, beats: filtered, pricePerPerson, hasSurDevis });
        return;
      }
    }

    const parsed = parseIntent(text);
    if (!parsed.mood && !parsed.who && !parsed.budget && !parsed.time && !parsed.city) {
      setRefineError("Je n'ai pas encore compris cette demande — essayez par exemple « plus calme » ou « budget 300€ ».");
      return;
    }

    const nextMood = parsed.mood ?? mood!;
    const nextWho = parsed.who ?? who!;
    const nextBudget = parsed.budget ?? budget!;
    const nextTime = parsed.time ?? time!;
    const nextCity = parsed.city ?? city;
    setMood(nextMood); setWho(nextWho); setBudget(nextBudget); setTime(nextTime); setCity(nextCity);
    const result = composeMoment({ mood: nextMood, who: nextWho, budget: nextBudget, time: nextTime, city: nextCity });
    setMoment(result ?? "empty");
  };

  const isCouple = who === "couple";
  const stepIndex = step === "result" ? ORDER.length : ORDER.indexOf(step as QuestionKey);

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">EliteWay AI</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>Créer un Moment</h2>
        </div>
      </div>

      {step !== "result" && (
        <div className="flex items-center gap-1.5 mb-10">
          {ORDER.map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{ background: i <= stepIndex ? "oklch(0.74 0.09 80)" : "oklch(0.2 0.006 60)" }}
            />
          ))}
        </div>
      )}

      {step === "mood" && (
        <QuestionStep
          eyebrow="01 · Envie"
          question="Qu'avez-vous envie de vivre ?"
          options={MOODS.map((m) => ({ key: m.key, label: m.label }))}
          selected={mood}
          onSelect={(k) => answer("mood", k)}
        />
      )}

      {step === "who" && (
        <QuestionStep
          eyebrow="02 · Contexte"
          question="Pour qui ?"
          icon={Users}
          options={WHO_OPTIONS.map((w) => ({ key: w.key, label: w.label }))}
          selected={who}
          onSelect={(k) => answer("who", k)}
        />
      )}

      {step === "budget" && (
        <QuestionStep
          eyebrow="03 · Budget"
          question="Quel budget par personne ?"
          hint="Le budget personnalise votre Moment — jamais son niveau d'exigence."
          icon={Wallet}
          options={BUDGET_OPTIONS.map((b) => ({ key: b.key, label: b.label }))}
          selected={budget}
          onSelect={(k) => answer("budget", k)}
        />
      )}

      {step === "time" && (
        <QuestionStep
          eyebrow="04 · Temps"
          question="Combien de temps avez-vous ?"
          icon={Clock}
          options={TIME_OPTIONS.map((t) => ({ key: t.key, label: t.label }))}
          selected={time}
          onSelect={(k) => answer("time", k)}
        />
      )}

      {step === "result" && (
        <MomentResult
          moment={moment}
          isCouple={isCouple}
          refineError={refineError}
          onRefine={handleRefine}
          onRestart={() => {
            setMood(null); setWho(null); setBudget(null); setTime(null); setCity(null);
            setMoment(null); setRefineError(null); setStep("mood");
          }}
        />
      )}
    </div>
  );
}

function QuestionStep({
  eyebrow, question, hint, icon: Icon, options, selected, onSelect,
}: {
  eyebrow: string;
  question: string;
  hint?: string;
  icon?: typeof Sparkles;
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
        <p className="text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      </div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.15 }} className="mb-2">
        {question}
      </h1>
      {hint && <p className="text-xs text-muted-foreground mb-6">{hint}</p>}
      <div className={`grid grid-cols-2 gap-2.5 ${hint ? "mt-2" : "mt-6"}`}>
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onSelect(o.key)}
            className={`px-4 py-4 rounded-2xl text-sm text-left transition-colors border ${
              selected === o.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 bg-card hover:border-primary/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MomentResult({
  moment, isCouple, refineError, onRefine, onRestart,
}: {
  moment: ComposedMoment | null | "empty";
  isCouple: boolean;
  refineError: string | null;
  onRefine: (text: string) => void;
  onRestart: () => void;
}) {
  const [refineText, setRefineText] = useState("");

  if (moment === "empty" || moment === null) {
    return (
      <div className="text-center pt-10">
        <Sparkles className="w-6 h-6 text-primary mx-auto mb-4" />
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="mb-2">
          Pas encore le bon Moment
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Nous n'avons pas d'adresse correspondant exactement à cette envie sur la Côte d'Azur pour l'instant.
          Essayez un autre budget ou une autre envie — nous préférons ne rien vous proposer plutôt qu'une adresse qui ne mérite pas EliteWay.
        </p>
        <button onClick={onRestart} className="text-sm text-primary hover:underline">
          Recommencer
        </button>
      </div>
    );
  }

  const total = isCouple ? moment.pricePerPerson * 2 : moment.pricePerPerson;
  const hasPriced = moment.pricePerPerson > 0;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Votre Moment EliteWay</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.1 }} className="mb-6">
        {moment.title}
      </h1>

      <div className="flex flex-col gap-4 mb-6">
        {moment.beats.map((beat) => (
          <Link
            key={beat.establishment.id}
            to={`/establishment/${beat.establishment.id}`}
            className="flex gap-3 items-center rounded-2xl bg-card border border-border/50 p-3 hover:border-primary/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
              <img src={beat.establishment.imageUrl} alt={beat.establishment.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-primary">{beat.label}</p>
                {beat.surDevis && (
                  <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground border border-border/60 rounded-full px-1.5 py-0.5">
                    Sur devis
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="leading-tight truncate mb-0.5">
                {beat.establishment.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{beat.establishment.city}</span>
                <Star className="w-3 h-3 fill-primary text-primary shrink-0 ml-1" />
                <span>{beat.establishment.rating}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Budget estimé</span>
          <span className="text-sm text-primary">
            {hasPriced ? `${moment.isEstimate ? "≈ " : ""}${total} € ${isCouple ? "pour deux" : "/ personne"}` : "Sur devis"}
          </span>
        </div>
        {(moment.isEstimate || moment.hasSurDevis) && (
          <p className="text-[10px] text-muted-foreground">
            {moment.hasSurDevis
              ? "Hors éléments sur devis (yacht, jet privé...) — tarif communiqué à la réservation."
              : "Estimation à titre indicatif — le tarif exact dépend de vos choix lors de la réservation."}
          </p>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground mb-6">
        Recommandation EliteWay — disponibilité à confirmer à la réservation.
      </p>

      {/* La conversation continue : affiner plutôt que recommencer. */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Ajuster ce Moment</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (refineText.trim()) { onRefine(refineText.trim()); setRefineText(""); } }}
          className="flex items-center rounded-full overflow-hidden border border-border/60 bg-card"
        >
          <input
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Plus calme, enlève le dîner, budget 300€…"
            style={{ fontSize: "0.8rem" }}
            className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-3 focus:outline-none placeholder:text-muted-foreground/60"
          />
          <button type="submit" className="w-9 h-9 mr-1 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0" aria-label="Envoyer">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        {refineError && <p className="text-[11px] text-muted-foreground mt-2">{refineError}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to={`/establishment/${moment.beats[0].establishment.id}/reserve`}
          className="w-full py-4 rounded-full text-sm text-center uppercase tracking-[0.1em] transition-transform active:scale-95"
          style={{ background: "oklch(0.74 0.09 80)", color: "oklch(0.08 0.005 60)" }}
        >
          Réserver ce Moment
        </Link>
        <button onClick={onRestart} className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground py-2">
          <Heart className="w-3.5 h-3.5" /> Essayer une autre envie
        </button>
      </div>
    </div>
  );
}
