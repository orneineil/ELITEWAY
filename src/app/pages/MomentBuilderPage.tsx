import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Heart, Sparkles, Users, Wallet, Clock, ArrowRight, MapPin, Star, Send, Repeat, X, Plus,
} from "lucide-react";
import {
  MOODS, WHO_OPTIONS, BUDGET_OPTIONS, TIME_OPTIONS,
  composeMomentOptions, totalsFor, replaceBeat, addNextBeat,
  MoodKey, WhoKey, BudgetKey, TimeKey, ComposedMoment, Category,
} from "../data/momentEngine";
import { parseIntent } from "../data/intentParser";

// La doctrine ONE REQUEST / ASK ELITEWAY : l'utilisateur arrive soit avec une
// phrase libre (?q=, tapée sur Home), soit avec une humeur choisie en un tap
// (?mood=). Dans les deux cas, on ne redemande jamais ce qui est déjà connu —
// seules les questions dont la réponse manque encore sont posées.
const ORDER: readonly ("mood" | "who" | "budget" | "time")[] = ["mood", "who", "budget", "time"];
type QuestionKey = typeof ORDER[number];
// Le flux est UN seul écran continu, pas une succession de pages techniques :
// LISTENING (les questions ci-dessus, seulement celles qui manquent encore)
// → UNDERSTANDING (on montre ce qu'on a compris avant d'agir, éditable)
// → CURATING (un instant perçu de soin, jamais un vrai chargement réseau)
// → RESULT (la proposition).
type StepKey = QuestionKey | "understanding" | "curating" | "result";

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
  // Jusqu'à 3 propositions réelles (voir composeMomentOptions) ; `moment` est
  // celle actuellement affichée/affinée. Changer de proposition réinitialise
  // un éventuel affinage en cours sur la précédente — c'est un choix assumé
  // de simplicité pour le MVP, pas une perte de données critique.
  const [options, setOptions] = useState<ComposedMoment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      // Tout était déjà dans la phrase libre — on montre quand même ce qu'on
      // a compris avant de composer : c'est justement là que la confirmation
      // rassure le plus (« oui, EliteWay a bien compris ma phrase »).
      setStep("understanding");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalize = (m: MoodKey, w: WhoKey, b: BudgetKey, t: TimeKey, c: string | null) => {
    const results = composeMomentOptions({ mood: m, who: w, budget: b, time: t, city: c });
    setOptions(results);
    setSelectedIndex(0);
    setMoment(results[0] ?? "empty");
    setStep("result");
  };

  const selectOption = (i: number) => {
    setSelectedIndex(i);
    setMoment(options[i]);
    setRefineError(null);
  };

  // CURATING est un instant perçu, pas une contrainte technique : le moteur
  // est local et instantané, mais laisser 900ms donne le sentiment que
  // quelqu'un — quelque chose — prend soin de la demande avant de répondre.
  useEffect(() => {
    if (step !== "curating") return;
    const timer = setTimeout(() => {
      if (mood && who && budget && time) finalize(mood, who, budget, time, city);
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

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
      setStep("understanding");
    }
  };

  const goBack = () => {
    if (step === "curating" || step === "result") { setStep("understanding"); return; }
    if (step === "understanding") { setStep(ORDER[ORDER.length - 1]); return; }
    const idx = ORDER.indexOf(step as QuestionKey);
    if (idx <= 0) navigate(-1);
    else setStep(ORDER[idx - 1]);
  };

  // Moment Builder visuel — actions directes par temps fort, sans repasser
  // par le texte libre. Le budget courant sert de plafond pour toute
  // alternative proposée : on ne dégrade jamais discrètement l'exigence.
  const budgetCap = (BUDGET_OPTIONS.find((b) => b.key === budget) ?? BUDGET_OPTIONS[0]).cap;

  const handleReplaceBeat = (idx: number) => {
    if (moment === "empty" || moment === null) return;
    const next = replaceBeat(moment.beats, idx, budgetCap, city);
    if (!next) {
      setRefineError("Pas d'autre adresse disponible dans cette catégorie pour l'instant.");
      return;
    }
    const { pricePerPerson, hasSurDevis } = totalsFor(next);
    setRefineError(null);
    setMoment({ ...moment, beats: next, pricePerPerson, hasSurDevis });
  };

  const handleRemoveBeat = (idx: number) => {
    if (moment === "empty" || moment === null) return;
    const next = moment.beats.filter((_, i) => i !== idx);
    if (next.length === 0) { setMoment("empty"); return; }
    const { pricePerPerson, hasSurDevis } = totalsFor(next);
    setRefineError(null);
    setMoment({ ...moment, beats: next, pricePerPerson, hasSurDevis });
  };

  const handleAddBeat = () => {
    if (moment === "empty" || moment === null || !mood) return;
    const next = addNextBeat(mood, moment.beats, budgetCap, city);
    if (!next) {
      setRefineError("Aucun temps fort supplémentaire disponible pour cette envie actuellement.");
      return;
    }
    const { pricePerPerson, hasSurDevis } = totalsFor(next);
    setRefineError(null);
    setMoment({ ...moment, beats: next, pricePerPerson, hasSurDevis });
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
  const isQuestionStep = (ORDER as readonly string[]).includes(step);
  const stepIndex = isQuestionStep ? ORDER.indexOf(step as QuestionKey) : ORDER.length;
  const subtitle =
    step === "understanding" ? "Je confirme votre envie"
    : step === "curating" ? "Je compose votre Moment"
    : step === "result" ? "Votre Moment"
    : "Créer un Moment";

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">EliteWay AI</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{subtitle}</h2>
        </div>
      </div>

      {isQuestionStep && (
        <div className="flex items-center gap-1.5 mb-10">
          {ORDER.map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{ background: i <= stepIndex ? "oklch(0.74 0.0792 80)" : "oklch(0.2 0.03 256)" }}
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

      {step === "understanding" && mood && who && budget && time && (
        <UnderstandingStep
          mood={mood}
          who={who}
          budget={budget}
          time={time}
          city={city}
          onEdit={(k) => setStep(k)}
          onConfirm={() => setStep("curating")}
        />
      )}

      {step === "curating" && <CuratingStep />}

      {step === "result" && (
        <MomentResult
          moment={moment}
          options={options}
          selectedIndex={selectedIndex}
          onSelectOption={selectOption}
          isCouple={isCouple}
          refineError={refineError}
          onRefine={handleRefine}
          onReplaceBeat={handleReplaceBeat}
          onRemoveBeat={handleRemoveBeat}
          onAddBeat={handleAddBeat}
          onRestart={() => {
            setMood(null); setWho(null); setBudget(null); setTime(null); setCity(null);
            setOptions([]); setSelectedIndex(0);
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

// UNDERSTANDING — la confirmation de compréhension. C'est ce qui manque le
// plus aujourd'hui à l'expérience : montrer, avant de proposer quoi que ce
// soit, qu'EliteWay a bien entendu la demande. Chaque ligne reste éditable
// en un tap (on revient à la question correspondante, valeur déjà choisie).
function UnderstandingStep({
  mood, who, budget, time, city, onEdit, onConfirm,
}: {
  mood: MoodKey;
  who: WhoKey;
  budget: BudgetKey;
  time: TimeKey;
  city: string | null;
  onEdit: (key: QuestionKey) => void;
  onConfirm: () => void;
}) {
  const rows: { key: QuestionKey; eyebrow: string; value: string }[] = [
    { key: "mood", eyebrow: "Envie", value: MOODS.find((m) => m.key === mood)?.label ?? mood },
    { key: "who", eyebrow: "Contexte", value: WHO_OPTIONS.find((w) => w.key === who)?.label ?? who },
    { key: "budget", eyebrow: "Budget", value: BUDGET_OPTIONS.find((b) => b.key === budget)?.label ?? budget },
    { key: "time", eyebrow: "Temps", value: TIME_OPTIONS.find((t) => t.key === time)?.label ?? time },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-primary">EliteWay a compris</p>
      </div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", lineHeight: 1.15 }} className="mb-6">
        Voici ce que je retiens de votre envie.
      </h1>

      <div className="flex flex-col gap-2.5 mb-3">
        {rows.map((r) => (
          <button
            key={r.key}
            onClick={() => onEdit(r.key)}
            className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3.5 text-left hover:border-primary/40 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">{r.eyebrow}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="truncate">{r.value}</p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.1em] text-primary shrink-0 ml-3">Modifier</span>
          </button>
        ))}
      </div>

      {city && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 mb-8">
          <MapPin className="w-3.5 h-3.5 text-primary" /> {city}
        </div>
      )}
      {!city && <div className="mb-5" />}

      <button
        onClick={onConfirm}
        className="w-full py-4 rounded-full text-sm text-center uppercase tracking-[0.1em] transition-transform active:scale-95"
        style={{ background: "oklch(0.74 0.0792 80)", color: "oklch(0.08 0.03 256)" }}
      >
        Composer mon Moment
      </button>
    </div>
  );
}

// CURATING — un instant assumé, pas un vrai chargement réseau (le moteur est
// local et instantané). Il sert la perception de soin : EliteWay ne recrache
// pas une réponse instantanée et générique, il "prend le temps" de composer.
function CuratingStep() {
  return (
    <div className="flex flex-col items-center text-center pt-20">
      <div className="relative w-14 h-14 mb-6">
        <div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "oklch(0.74 0.0792 80 / 0.35)", animation: "logoRing 2.2s linear infinite" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" style={{ animation: "logoPulse 1.6s ease-in-out infinite" }} />
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="mb-2">
        EliteWay compose votre Moment…
      </p>
      <p className="text-xs text-muted-foreground max-w-[220px]">
        Sélection des adresses les plus justes pour votre envie, votre budget et votre temps.
      </p>
    </div>
  );
}

function MomentResult({
  moment, options, selectedIndex, onSelectOption, isCouple, refineError, onRefine,
  onReplaceBeat, onRemoveBeat, onAddBeat, onRestart,
}: {
  moment: ComposedMoment | null | "empty";
  options: ComposedMoment[];
  selectedIndex: number;
  onSelectOption: (i: number) => void;
  isCouple: boolean;
  refineError: string | null;
  onRefine: (text: string) => void;
  onReplaceBeat: (index: number) => void;
  onRemoveBeat: (index: number) => void;
  onAddBeat: () => void;
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
      {/* Recommendations — jusqu'à 3 propositions réelles, jamais un choix
          fictif : si le moteur n'a trouvé qu'une seule combinaison honnête,
          ce sélecteur ne s'affiche simplement pas. */}
      {options.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-1 px-1">
          {options.map((o, i) => (
            <button
              key={o.angle}
              onClick={() => onSelectOption(i)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-left border transition-colors ${
                i === selectedIndex ? "border-primary bg-primary/10" : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <p className={`text-[10px] uppercase tracking-[0.12em] mb-0.5 ${i === selectedIndex ? "text-primary" : "text-muted-foreground"}`}>
                {o.angleLabel}
              </p>
              <p className="text-xs text-foreground/80">
                {o.beats.length} temps forts{o.pricePerPerson > 0 ? ` · ${o.pricePerPerson}€` : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Votre Moment EliteWay</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.1 }} className="mb-6">
        {moment.title}
      </h1>

      {/* Moment Builder visuel — une carte par temps fort, avec Remplacer /
          Retirer inline. "Ajuster ce Moment" plus bas reste disponible pour
          tout ce que ces boutons ne couvrent pas (humeur, budget, durée). */}
      <div className="flex flex-col gap-3 mb-4">
        {moment.beats.map((beat, idx) => (
          <div key={beat.establishment.id} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <Link
              to={`/establishment/${beat.establishment.id}`}
              className="flex gap-3 items-center p-3 hover:bg-accent/20 transition-colors"
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
            <div className="flex items-center border-t border-border/40">
              <button
                onClick={() => onReplaceBeat(idx)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-primary transition-colors"
              >
                <Repeat className="w-3 h-3" /> Remplacer
              </button>
              <div className="w-px self-stretch bg-border/40" />
              <button
                onClick={() => onRemoveBeat(idx)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" /> Retirer
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={onAddBeat}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 py-4 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Ajouter un temps fort
        </button>
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

      {/* La conversation continue : tout ce que Remplacer/Retirer/Ajouter ne
          couvrent pas (l'humeur générale, le budget, la durée) reste
          ajustable ici, en langage naturel — Ask EliteWay contextuel. */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Autre chose à ajuster ?</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (refineText.trim()) { onRefine(refineText.trim()); setRefineText(""); } }}
          className="flex items-center rounded-full overflow-hidden border border-border/60 bg-card"
        >
          <input
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Plus calme, budget 300€, samedi plutôt…"
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
          style={{ background: "oklch(0.74 0.0792 80)", color: "oklch(0.08 0.03 256)" }}
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
