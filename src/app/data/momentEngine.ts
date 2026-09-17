import { establishments, Establishment } from "./establishments";

// ── EliteWay Moments — le moteur de composition ──────────────────────────────
// Doctrine (positionnement produit, voir "MVP 2.0 — Audit & Reconstruction") :
// EliteWay ne demande pas "que voulez-vous réserver ?", mais "que voulez-vous
// vivre ?". La membre décrit une envie (humeur + contexte + budget + temps),
// EliteWay compose un Moment — une séquence cohérente d'adresses réelles,
// jamais une adresse inventée ou un remplissage artificiel.
//
// Le budget n'est jamais une hiérarchie de statut ("cheap/standard/luxury") :
// c'est un curseur de personnalisation. Un Moment à 100€ et un Moment à
// 2 500€ suivent exactement le même moteur, la même exigence de sélection.
//
// Important : ce moteur reste aujourd'hui une composition déterministe par
// règles (mood → catégories → meilleure adresse disponible dans le budget),
// pas un raisonnement génératif. C'est un choix assumé pour le MVP : il donne
// déjà l'expérience et la promesse finales, le raisonnement IA viendra en V2.

export type MoodKey = "relax" | "romance" | "adventure" | "celebration" | "discovery" | "indulgence" | "connection";
export type WhoKey = "couple" | "friends" | "family" | "solo" | "business";
export type BudgetKey = "flexible" | "100" | "300" | "500" | "1000" | "2500";
export type TimeKey = "hours" | "half" | "full" | "weekend";

export const MOODS: { key: MoodKey; label: string }[] = [
  { key: "relax", label: "Se détendre" },
  { key: "romance", label: "Romance" },
  { key: "adventure", label: "Aventure" },
  { key: "celebration", label: "Célébration" },
  { key: "discovery", label: "Découverte" },
  { key: "indulgence", label: "Indulgence" },
  { key: "connection", label: "Se retrouver" },
];

export const WHO_OPTIONS: { key: WhoKey; label: string }[] = [
  { key: "couple", label: "En couple" },
  { key: "friends", label: "Entre amis" },
  { key: "family", label: "En famille" },
  { key: "solo", label: "Solo" },
  { key: "business", label: "Professionnel" },
];

// Un plafond, jamais un statut : chaque palier reste une expérience EliteWay
// à part entière, seulement plus ou moins composée.
export const BUDGET_OPTIONS: { key: BudgetKey; label: string; cap: number | null }[] = [
  { key: "flexible", label: "Flexible", cap: null },
  { key: "100", label: "100 €", cap: 100 },
  { key: "300", label: "300 €", cap: 300 },
  { key: "500", label: "500 €", cap: 500 },
  { key: "1000", label: "1 000 €", cap: 1000 },
  { key: "2500", label: "2 500 €+", cap: null },
];

export const TIME_OPTIONS: { key: TimeKey; label: string; beatCount: number }[] = [
  { key: "hours", label: "Quelques heures", beatCount: 1 },
  { key: "half", label: "Demi-journée", beatCount: 2 },
  { key: "full", label: "Journée complète", beatCount: 3 },
  { key: "weekend", label: "Week-end", beatCount: 4 },
];

export type Category = Establishment["category"];

interface MoodBeatTemplate {
  label: string;
  categories: Category[];
}

// Séquence-type (matin → nuit) par humeur. Une simplification assumée pour le
// MVP : le moteur futur pondérera aussi tags, avis et disponibilité réelle.
const MOOD_SEQUENCES: Record<MoodKey, MoodBeatTemplate[]> = {
  relax: [
    { label: "Matin", categories: ["bien-etre"] },
    { label: "Midi", categories: ["gastronomie"] },
    { label: "Après-midi", categories: ["bien-etre", "navigation"] },
    { label: "Soir", categories: ["gastronomie"] },
  ],
  romance: [
    { label: "Après-midi", categories: ["navigation", "bien-etre"] },
    { label: "Coucher de soleil", categories: ["navigation", "bien-etre"] },
    { label: "Soir", categories: ["gastronomie"] },
    { label: "Nuit", categories: ["hotels"] },
  ],
  adventure: [
    { label: "Matin", categories: ["navigation", "sport-loisirs"] },
    { label: "Midi", categories: ["aviation", "sport-loisirs"] },
    { label: "Après-midi", categories: ["navigation", "sport-loisirs"] },
    { label: "Soir", categories: ["gastronomie"] },
  ],
  celebration: [
    { label: "Après-midi", categories: ["navigation", "evenements"] },
    { label: "Coucher de soleil", categories: ["gastronomie"] },
    { label: "Soir", categories: ["evenements", "gastronomie"] },
    { label: "Nuit", categories: ["offres-exclusives", "hotels"] },
  ],
  discovery: [
    { label: "Matin", categories: ["oenologie"] },
    { label: "Midi", categories: ["gastronomie"] },
    { label: "Après-midi", categories: ["oenologie", "sport-loisirs"] },
    { label: "Soir", categories: ["gastronomie"] },
  ],
  indulgence: [
    { label: "Matin", categories: ["bien-etre"] },
    { label: "Midi", categories: ["gastronomie"] },
    { label: "Après-midi", categories: ["hotels", "bien-etre"] },
    { label: "Soir", categories: ["gastronomie"] },
  ],
  connection: [
    { label: "Après-midi", categories: ["navigation", "sport-loisirs"] },
    { label: "Coucher de soleil", categories: ["gastronomie"] },
    { label: "Soir", categories: ["evenements", "gastronomie"] },
    { label: "Nuit", categories: ["hotels"] },
  ],
};

// Le nom éditorial du Moment — sa signature, pas une simple étiquette de recherche.
const MOOD_TITLES: Record<MoodKey, string> = {
  relax: "Slow Riviera Day",
  romance: "Romantic Riviera",
  adventure: "Riviera Adventure",
  celebration: "The Ultimate Celebration",
  discovery: "Riviera Discovery",
  indulgence: "The Perfect Indulgence",
  connection: "Together on the Riviera",
};

function estimatePricePerPerson(e: Establishment): number {
  if (e.priceRange) return e.priceRange.min;
  // Pas de fourchette renseignée : estimation prudente à partir du symbole de
  // tarif (jamais affichée comme un prix exact, voir isEstimate ci-dessous).
  const tier = e.price.length;
  return tier <= 2 ? 50 : tier === 3 ? 120 : 250;
}

// Au-delà de ce seuil, un tarif "à partir de" n'est plus un prix par personne
// crédible : c'est un affrètement (yacht, jet) facturé pour le groupe entier
// (voir camper-nicholsons-antibes, fraser-yachts-monaco, global-jet-monaco...
// dont priceRange.min dépasse largement ce que paierait une seule personne).
// On ne les exclut jamais du Moment — on ne les additionne simplement pas
// dans un total "par personne" qui deviendrait trompeur.
const SUR_DEVIS_THRESHOLD = 2000;

export interface MomentBeat {
  label: string;
  establishment: Establishment;
  surDevis: boolean;
}

// Un Moment composé porte toujours un "angle" — jamais présenté comme LA
// seule réponse possible. "signature" reste la composition par défaut
// (utilisée par le chat EliteWay AI, qui ne montre qu'une réponse). Les 3
// propositions de l'écran Recommendations utilisent intimate/complete/value.
export type MomentAngle = "signature" | "intimate" | "complete" | "value";

const ANGLE_LABELS: Record<MomentAngle, string> = {
  signature: "La proposition EliteWay",
  intimate: "Plus intime",
  complete: "Plus complet",
  value: "Meilleur rapport",
};

export interface ComposedMoment {
  mood: MoodKey;
  title: string;
  angle: MomentAngle;
  angleLabel: string;
  beats: MomentBeat[];
  pricePerPerson: number;
  isEstimate: boolean;
  hasSurDevis: boolean;
}

export interface MomentInput {
  mood: MoodKey;
  who: WhoKey;
  budget: BudgetKey;
  time: TimeKey;
  city?: string | null;
}

// Recalcule le total à partir d'une liste de temps forts — réutilisé quand
// l'utilisateur retire un élément du Moment (voir la doctrine "l'utilisateur
// doit pouvoir modifier le Moment" : la conversation continue après la
// première proposition, ce n'est jamais un résultat figé).
export function totalsFor(beats: MomentBeat[]): { pricePerPerson: number; hasSurDevis: boolean } {
  const pricePerPerson = beats
    .filter((b) => !b.surDevis)
    .reduce((sum, b) => sum + estimatePricePerPerson(b.establishment), 0);
  const hasSurDevis = beats.some((b) => b.surDevis);
  return { pricePerPerson, hasSurDevis };
}

type PickStrategy = "rating" | "value";

function findCandidate(
  categories: Category[],
  usedIds: Set<string>,
  cap: number | null,
  city: string | null | undefined,
  strategy: PickStrategy = "rating"
): Establishment | undefined {
  for (const cat of categories) {
    let pool = establishments
      .filter((e) => e.category === cat && !usedIds.has(e.id))
      .filter((e) => !city || e.city === city)
      .filter((e) => cap == null || estimatePricePerPerson(e) <= cap);

    if (strategy === "value") {
      // Un rapport qualité-prix réel, jamais "moins cher donc moins bien" :
      // on exige un plancher de qualité avant de trier par prix. Si rien ne
      // l'atteint, on retombe sur l'ensemble plutôt que de ne rien proposer.
      const qualityFloor = pool.filter((e) => e.rating >= 4.3);
      pool = (qualityFloor.length > 0 ? qualityFloor : pool)
        .sort((a, b) => estimatePricePerPerson(a) - estimatePricePerPerson(b) || b.rating - a.rating);
    } else {
      pool = pool.sort((a, b) => b.rating - a.rating);
    }
    if (pool.length > 0) return pool[0];
  }
  return undefined;
}

// Le cœur du moteur, factorisé pour servir aussi bien la composition par
// défaut (composeMoment, utilisée par le chat) que les 3 propositions
// (composeMomentOptions). Ne renvoie jamais une adresse inventée : si rien
// ne correspond pour un temps fort, ce temps fort est simplement omis
// plutôt que rempli artificiellement.
function buildMoment(
  input: MomentInput,
  angle: MomentAngle,
  opts: { beatCountDelta?: number; strategy?: PickStrategy } = {}
): ComposedMoment | null {
  const sequence = MOOD_SEQUENCES[input.mood];
  const timeConf = TIME_OPTIONS.find((t) => t.key === input.time) ?? TIME_OPTIONS[0];
  const budgetConf = BUDGET_OPTIONS.find((b) => b.key === input.budget) ?? BUDGET_OPTIONS[0];
  const beatCount = Math.max(1, timeConf.beatCount + (opts.beatCountDelta ?? 0));
  const wanted = sequence.slice(0, beatCount);
  const strategy = opts.strategy ?? "rating";

  const usedIds = new Set<string>();
  const beats: MomentBeat[] = [];
  let isEstimate = false;

  for (const beat of wanted) {
    // On respecte toujours le budget annoncé ; on élargit seulement la
    // contrainte de ville si rien n'est trouvé localement.
    let candidate = findCandidate(beat.categories, usedIds, budgetConf.cap, input.city, strategy);
    if (!candidate && input.city) {
      candidate = findCandidate(beat.categories, usedIds, budgetConf.cap, null, strategy);
    }
    if (candidate) {
      usedIds.add(candidate.id);
      const surDevis = estimatePricePerPerson(candidate) > SUR_DEVIS_THRESHOLD;
      beats.push({ label: beat.label, establishment: candidate, surDevis });
      if (!candidate.priceRange) isEstimate = true;
    }
  }

  if (beats.length === 0) return null;

  const { pricePerPerson, hasSurDevis } = totalsFor(beats);

  return {
    mood: input.mood,
    title: MOOD_TITLES[input.mood],
    angle,
    angleLabel: ANGLE_LABELS[angle],
    beats,
    pricePerPerson,
    isEstimate,
    hasSurDevis,
  };
}

// Composition par défaut — un seul résultat, utilisé là où une seule réponse
// a du sens (le fil de chat EliteWay AI). Comportement inchangé depuis avant
// l'introduction des 3 propositions.
export function composeMoment(input: MomentInput): ComposedMoment | null {
  return buildMoment(input, "signature");
}

function sameBeats(a: ComposedMoment, b: ComposedMoment): boolean {
  if (a.beats.length !== b.beats.length) return false;
  const idsA = a.beats.map((x) => x.establishment.id).sort().join("|");
  const idsB = b.beats.map((x) => x.establishment.id).sort().join("|");
  return idsA === idsB;
}

// ── Moment Builder — actions par temps fort ─────────────────────────────────
// Le Moment composé n'est jamais figé : ces trois fonctions portent les
// actions "Remplacer / Retirer / Ajouter" du Moment Builder visuel. Chacune
// ne renvoie jamais une adresse inventée : si aucune alternative réelle
// n'existe, elle renvoie null et l'appelant affiche un état honnête.

// Remplace le temps fort à `index` par une autre adresse de la même
// catégorie, jamais déjà utilisée ailleurs dans le Moment.
export function replaceBeat(
  beats: MomentBeat[],
  index: number,
  budgetCap: number | null,
  city?: string | null
): MomentBeat[] | null {
  const current = beats[index];
  if (!current) return null;
  const usedIds = new Set(beats.map((b) => b.establishment.id));
  let alt = findCandidate([current.establishment.category], usedIds, budgetCap, city);
  if (!alt && city) alt = findCandidate([current.establishment.category], usedIds, budgetCap, null);
  if (!alt) return null;
  const surDevis = estimatePricePerPerson(alt) > SUR_DEVIS_THRESHOLD;
  const next = [...beats];
  next[index] = { label: current.label, establishment: alt, surDevis };
  return next;
}

// Ajoute le prochain temps fort de la séquence de l'humeur (celui qui suit
// le dernier déjà présent) — jamais au-delà de ce que la séquence prévoit.
export function addNextBeat(
  mood: MoodKey,
  beats: MomentBeat[],
  budgetCap: number | null,
  city?: string | null
): MomentBeat[] | null {
  const sequence = MOOD_SEQUENCES[mood];
  if (beats.length >= sequence.length) return null;
  const nextTemplate = sequence[beats.length];
  const usedIds = new Set(beats.map((b) => b.establishment.id));
  let candidate = findCandidate(nextTemplate.categories, usedIds, budgetCap, city);
  if (!candidate && city) candidate = findCandidate(nextTemplate.categories, usedIds, budgetCap, null);
  if (!candidate) return null;
  const surDevis = estimatePricePerPerson(candidate) > SUR_DEVIS_THRESHOLD;
  return [...beats, { label: nextTemplate.label, establishment: candidate, surDevis }];
}

// L'écran Recommendations : jusqu'à 3 propositions réellement distinctes
// (plus intime / plus complet / meilleur rapport), jamais un faux choix —
// si le catalogue ne permet réellement qu'une ou deux combinaisons
// différentes pour cette envie, on en renvoie une ou deux. Mieux vaut une
// honnêteté à 1 proposition qu'un triplet avec des doublons déguisés.
export function composeMomentOptions(input: MomentInput): ComposedMoment[] {
  const candidates = [
    buildMoment(input, "intimate", { beatCountDelta: -1 }),
    buildMoment(input, "complete", { beatCountDelta: 1 }),
    buildMoment(input, "value", { strategy: "value" }),
  ];

  const results: ComposedMoment[] = [];
  for (const c of candidates) {
    if (!c) continue;
    if (results.some((r) => sameBeats(r, c))) continue;
    results.push(c);
  }
  return results;
}
