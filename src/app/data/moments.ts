import { supabase } from "../lib/supabase";
import {
  ComposedMoment, WhoKey, BudgetKey, TimeKey,
  estimateBeatPrice, buildExperienceBrief, ExperienceBriefInput, ExperienceBrief,
} from "./momentEngine";

// ── Booking = première étape opérationnelle de l'orchestration ─────────────
// Doctrine (directive "ORCHESTRATION IS PART OF THE MVP", section 1 et 6) :
// réserver un Moment n'est jamais une simple réservation — c'est la création
// d'une "Experience Confirmation" qui couvre chaque partenaire impliqué.
// Ce module écrit dans les tables réelles (schema_v3_moments.sql, confirmé
// exécuté) et tente en best-effort les colonnes/tables de
// schema_v4_orchestration.sql (partner_status, experience_brief,
// user_learned_preferences) : si elles n'existent pas encore, ces écritures
// additionnelles échouent silencieusement plutôt que de casser la
// réservation — jamais l'inverse.

export type PartnerStatus = "pending" | "requested" | "confirmed" | "ready" | "cancelled" | "needs_attention";
export type MomentStatus = "saved" | "upcoming" | "past" | "cancelled";

function generateConfirmationCode(): string {
  return "EW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function toScheduledAt(date: string | null | undefined, time: string | null | undefined): string | null {
  if (!date) return null;
  // <input type="date"> renvoie "AAAA-MM-JJ", <input type="time"> "HH:MM".
  const iso = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export interface PersistMomentInput {
  userId: string;
  composed: ComposedMoment;
  who: WhoKey;
  budget: BudgetKey;
  time: TimeKey;
  city: string | null;
  brief: ExperienceBriefInput;
}

export interface PersistedItemResult {
  establishmentName: string;
  label: string;
  confirmationCode: string;
}

export interface PersistMomentResult {
  success: boolean;
  momentId?: string;
  items?: PersistedItemResult[];
  error?: string;
}

// Écrit le Moment + un temps fort par carte, ET crée une réservation réelle
// (table `bookings`, déjà utilisée par le parcours mono-établissement) pour
// chaque temps fort — jamais un objet "Moment" isolé qui n'apparaîtrait nulle
// part ailleurs dans l'app. Le paiement reste simulé (même doctrine que
// PaymentPage.tsx) : ce que nous devons rendre réel ici, c'est l'orchestration
// et le statut, pas un vrai encaissement (hors scope MVP).
export async function persistMoment(input: PersistMomentInput): Promise<PersistMomentResult> {
  const { userId, composed, who, budget, time, city, brief } = input;

  const { data: momentRow, error: momentError } = await supabase
    .from("moments")
    .insert({
      user_id: userId,
      title: composed.title,
      mood: composed.mood,
      who,
      budget_tier: budget,
      time_key: time,
      city,
      status: (brief.date ? "upcoming" : "saved") as MomentStatus,
      scheduled_at: toScheduledAt(brief.date, brief.time),
    })
    .select("id")
    .single();

  if (momentError || !momentRow) {
    return { success: false, error: momentError?.message ?? "Impossible d'enregistrer ce Moment." };
  }

  const momentId = momentRow.id as string;
  const results: PersistedItemResult[] = [];

  for (let index = 0; index < composed.beats.length; index++) {
    const beat = composed.beats[index];
    const priceEstimate = estimateBeatPrice(beat);

    const { data: itemRow, error: itemError } = await supabase
      .from("moment_items")
      .insert({
        moment_id: momentId,
        establishment_id: beat.establishment.id,
        label: beat.label,
        sort_order: index,
        price_estimate: priceEstimate,
        sur_devis: beat.surDevis,
      })
      .select("id")
      .single();

    if (itemError || !itemRow) {
      // On ne détruit pas ce qui a déjà été créé — on remonte une erreur
      // honnête ; le Moment reste visible (partiellement composé) plutôt que
      // d'être annulé en silence.
      return { success: false, momentId, items: results, error: itemError?.message ?? "Erreur lors de l'enregistrement d'un temps fort." };
    }

    const code = generateConfirmationCode();
    const { data: bookingRow, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        client_id: userId,
        establishment_id: beat.establishment.id,
        guests: brief.partySize,
        total_amount: priceEstimate != null ? priceEstimate * brief.partySize : null,
        status: "confirmed",
        payment_status: "paid",
        confirmation_code: code,
        reservation_date: brief.date ?? null,
        reservation_time: brief.time ?? null,
      })
      .select("id")
      .single();

    if (!bookingError && bookingRow) {
      await supabase.from("moment_items").update({ booking_id: bookingRow.id }).eq("id", itemRow.id);
    }

    // Best-effort : l'Experience Brief need-to-know (schema v4). Si la
    // colonne n'existe pas encore, cette écriture échoue seule — le reste de
    // la réservation reste valide.
    const experienceBrief: ExperienceBrief = buildExperienceBrief(composed, beat, brief);
    await supabase.from("moment_items").update({ experience_brief: experienceBrief }).eq("id", itemRow.id).then(
      () => {},
      () => {}
    );

    results.push({ establishmentName: beat.establishment.name, label: beat.label, confirmationCode: code });
  }

  return { success: true, momentId, items: results };
}

// ── My Moments — lecture ────────────────────────────────────────────────────
export interface PersistedMomentItem {
  id: string;
  establishmentId: string;
  label: string;
  sortOrder: number;
  priceEstimate: number | null;
  surDevis: boolean;
  bookingId: string | null;
  partnerStatus: PartnerStatus;
  experienceBrief: Record<string, unknown> | null;
}

export interface PersistedMoment {
  id: string;
  title: string;
  mood: string | null;
  who: string | null;
  city: string | null;
  status: MomentStatus;
  scheduledAt: string | null;
  createdAt: string;
  items: PersistedMomentItem[];
}

const BASE_ITEM_COLUMNS = "id, establishment_id, label, sort_order, price_estimate, sur_devis, booking_id";
const V4_ITEM_COLUMNS = `${BASE_ITEM_COLUMNS}, partner_status, experience_brief`;
const MOMENT_COLUMNS = "id, title, mood, who, city, status, scheduled_at, created_at";

function mapMomentRow(row: any): PersistedMoment {
  const items: PersistedMomentItem[] = ((row.moment_items ?? []) as any[])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((it) => ({
      id: it.id,
      establishmentId: it.establishment_id,
      label: it.label,
      sortOrder: it.sort_order ?? 0,
      priceEstimate: it.price_estimate ?? null,
      surDevis: !!it.sur_devis,
      bookingId: it.booking_id ?? null,
      // Tant que schema_v4_orchestration.sql n'est pas exécuté, ces colonnes
      // n'existent pas encore : on retombe honnêtement sur "pending" plutôt
      // que d'inventer un statut de confirmation.
      partnerStatus: (it.partner_status as PartnerStatus) ?? "pending",
      experienceBrief: it.experience_brief ?? null,
    }));

  return {
    id: row.id,
    title: row.title,
    mood: row.mood ?? null,
    who: row.who ?? null,
    city: row.city ?? null,
    status: row.status,
    scheduledAt: row.scheduled_at ?? null,
    createdAt: row.created_at,
    items,
  };
}

export async function fetchMyMoments(userId: string): Promise<{ moments: PersistedMoment[]; error?: string }> {
  const { data, error } = await supabase
    .from("moments")
    .select(`${MOMENT_COLUMNS}, moment_items(${V4_ITEM_COLUMNS})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    // Repli honnête : v4 (partner_status/experience_brief) pas encore
    // exécuté — on retente sans ces colonnes plutôt que d'afficher une page
    // cassée à la personne.
    const { data: fallback, error: fallbackError } = await supabase
      .from("moments")
      .select(`${MOMENT_COLUMNS}, moment_items(${BASE_ITEM_COLUMNS})`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (fallbackError || !fallback) {
      return { moments: [], error: fallbackError?.message ?? error.message };
    }
    return { moments: fallback.map(mapMomentRow) };
  }

  return { moments: (data ?? []).map(mapMomentRow) };
}

// ── Experience Control ──────────────────────────────────────────────────────
// Doctrine (directive section 4) : jamais un statut optimiste inventé. "READY"
// n'apparaît que si CHAQUE temps fort est réellement confirmé ou prêt. Si un
// partenaire a un souci, l'utilisateur voit qu'EliteWay s'en occupe — jamais
// le détail brut du problème partenaire (Experience Control, pas exposition).
export interface ExperienceControlResult {
  ready: boolean;
  needsAttention: boolean;
  label: string;
  pendingCount: number;
}

export function computeExperienceControl(items: { partnerStatus: PartnerStatus }[]): ExperienceControlResult {
  if (items.length === 0) {
    return { ready: false, needsAttention: false, label: "Aucun élément à vérifier.", pendingCount: 0 };
  }
  const needsAttention = items.some((i) => i.partnerStatus === "needs_attention" || i.partnerStatus === "cancelled");
  const allReady = items.every((i) => i.partnerStatus === "confirmed" || i.partnerStatus === "ready");
  const pendingCount = items.filter((i) => i.partnerStatus === "pending" || i.partnerStatus === "requested").length;

  if (needsAttention) {
    return { ready: false, needsAttention: true, label: "EliteWay s'en occupe", pendingCount };
  }
  if (allReady) {
    return { ready: true, needsAttention: false, label: "ELITEWAY STATUS — READY", pendingCount: 0 };
  }
  return { ready: false, needsAttention: false, label: "Confirmation en cours avec chaque partenaire", pendingCount };
}

// ── Feedback ────────────────────────────────────────────────────────────────
// Table minimale (rating + note libre, voir schema_v3_moments.sql désaccord
// n°5) : les rubriques structurées de la directive (aimé / à changer / bien
// anticipé / manquant) sont composées dans un seul texte plutôt que d'ajouter
// des colonnes non nécessaires — l'un des refus explicites de sur-ingénierie.
export interface FeedbackInput {
  momentId: string;
  userId: string;
  rating: number;
  liked?: string;
  disliked?: string;
  wellAnticipated?: string;
  missing?: string;
  learnTag?: string; // opt-in explicite uniquement — jamais coché par défaut côté UI
}

function composeFeedbackNote(input: FeedbackInput): string | null {
  const parts: string[] = [];
  if (input.liked) parts.push(`Aimé : ${input.liked}`);
  if (input.disliked) parts.push(`À améliorer : ${input.disliked}`);
  if (input.wellAnticipated) parts.push(`Bien anticipé : ${input.wellAnticipated}`);
  if (input.missing) parts.push(`Ce qui a manqué : ${input.missing}`);
  return parts.length > 0 ? parts.join("\n") : null;
}

export async function submitMomentFeedback(input: FeedbackInput): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("experience_feedback").upsert(
    {
      moment_id: input.momentId,
      user_id: input.userId,
      rating: input.rating,
      note: composeFeedbackNote(input),
    },
    { onConflict: "moment_id,user_id" }
  );

  if (error) return { success: false, error: error.message };

  // Mémoire d'expérience — uniquement si le membre a explicitement autorisé
  // EliteWay à retenir cette préférence (case à cocher, jamais activée par
  // défaut). Best-effort : la table n'existe que depuis schema_v4.
  if (input.learnTag) {
    await supabase
      .from("user_learned_preferences")
      .upsert({ user_id: input.userId, tag: input.learnTag, weight: 1.0 }, { onConflict: "user_id,tag" })
      .then(
        () => {},
        () => {}
      );
  }

  return { success: true };
}

export async function fetchFeedback(momentId: string, userId: string) {
  const { data } = await supabase
    .from("experience_feedback")
    .select("id, rating, note")
    .eq("moment_id", momentId)
    .eq("user_id", userId)
    .maybeSingle();
  return data ?? null;
}
