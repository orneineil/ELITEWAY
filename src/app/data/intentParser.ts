import { MoodKey, WhoKey, BudgetKey, TimeKey } from "./momentEngine";
import { cityCoordinates } from "./establishments";

// ── Compréhension de la demande libre ("ASK ELITEWAY") ───────────────────────
// Doctrine : l'utilisateur arrive avec une envie écrite avec ses propres mots,
// pas avec un formulaire déjà rempli. Ce module extrait ce qu'il peut
// honnêtement déduire (humeur, contexte, budget, durée, ville) et laisse tout
// le reste à null plutôt que de deviner — le moteur de Moments (momentEngine)
// applique ensuite des valeurs par défaut sûres pour ce qui reste inconnu.
//
// Important : ceci reste une reconnaissance par mots-clés, pas un vrai NLU/LLM.
// C'est un choix MVP assumé (voir momentEngine.ts) — l'extraction est réelle et
// déterministe, jamais inventée, mais elle ne comprendra pas une formulation
// trop éloignée de ce vocabulaire. Le raisonnement génératif est un chantier V2.

export interface ParsedIntent {
  mood: MoodKey | null;
  who: WhoKey | null;
  budget: BudgetKey | null;
  time: TimeKey | null;
  city: string | null;
}

const MOOD_KEYWORDS: Record<MoodKey, string[]> = {
  relax: ["détente", "détendre", "relax", "reposer", "repos", "calme", "zen", "cocooning"],
  romance: ["romantique", "romance", "amoureu", "date", "tête-à-tête", "en amoureux"],
  adventure: ["aventure", "sensation", "adrénaline", "sportif", "sportive", "actif", "active"],
  celebration: ["fêter", "fête", "célébrer", "anniversaire", "surprise", "enterrement de vie"],
  discovery: ["découvrir", "découverte", "nouveau", "jamais fait", "insolite", "inédit"],
  indulgence: ["luxe", "indulgence", "gâter", "exceptionnel", "se faire plaisir", "plaisir"],
  connection: ["amis", "entre amis", "famille", "retrouvailles", "en famille", "copains"],
};

// Priorité d'évaluation : certains mots (ex. "amis") pourraient à la fois
// évoquer une humeur (connection) et un contexte (who=friends) — c'est
// volontaire, les deux dimensions peuvent légitimement partager un indice.
const WHO_KEYWORDS: Record<WhoKey, string[]> = {
  couple: ["compagnon", "compagne", "copain", "copine", "mari", "femme", "conjoint", "conjointe", "à deux", "en couple", "mon amour", "petite amie", "petit ami"],
  friends: ["amis", "entre amis", "copains", "potes"],
  family: ["famille", "enfants", "en famille"],
  solo: ["seul", "seule", "moi-même", "en solo"],
  business: ["client", "clients", "professionnel", "affaires", "collègue", "collègues"],
};

const TIME_KEYWORDS: Record<TimeKey, string[]> = {
  hours: ["ce soir", "quelques heures", "en fin de journée", "cet après-midi"],
  half: ["demi-journée", "matinée", "une matinée"],
  full: ["toute la journée", "une journée", "journée complète"],
  weekend: ["week-end", "weekend", "samedi et dimanche"],
};

const CITY_NAMES = Object.keys(cityCoordinates);

function matchFirst<K extends string>(lower: string, dict: Record<K, string[]>): K | null {
  for (const [key, words] of Object.entries(dict) as [K, string[]][]) {
    if (words.some((w) => lower.includes(w))) return key;
  }
  return null;
}

function parseBudget(lower: string): BudgetKey | null {
  const match = lower.match(/(\d{2,5})\s*(?:€|euros?)/);
  if (!match) return null;
  const amount = parseInt(match[1], 10);
  if (amount <= 150) return "100";
  if (amount <= 350) return "300";
  if (amount <= 650) return "500";
  if (amount <= 1500) return "1000";
  return "2500";
}

export function parseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase();

  const city = CITY_NAMES.find((name) => lower.includes(name.toLowerCase())) ?? null;

  return {
    mood: matchFirst(lower, MOOD_KEYWORDS),
    who: matchFirst(lower, WHO_KEYWORDS),
    budget: parseBudget(lower),
    time: matchFirst(lower, TIME_KEYWORDS),
    city,
  };
}
