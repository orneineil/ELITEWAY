-- ============================================================================
-- ELITEWAY — schéma v3 : Moments (mémoire d'expérience basique du MVP)
-- Additif uniquement : ne modifie ni ne supprime aucune table existante.
-- Prérequis : schema.sql ET schema_v2_catalog.sql déjà exécutés — moment_items
-- référence public.establishments, créée dans schema_v2_catalog.sql. Si tu as
-- un doute sur ce qui est déjà en place, lance d'abord la requête d'audit
-- ci-dessous SEULE, avant le reste de ce fichier.
--
-- Voir MVP 3.0 — Experience Engine (doc Claude, désaccords n°4 et n°5) :
-- 3 tables seulement pour le MVP, tout le reste (offers, memberships,
-- eliteway_originals, ai_conversations...) reste explicitement différé.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. AUDIT — à lancer seul d'abord si tu n'es pas certaine de l'état actuel.
-- Si "establishments", "collections", "collection_items" n'apparaissent PAS
-- dans le résultat, exécute schema_v2_catalog.sql avant la suite de ce fichier.
-- ----------------------------------------------------------------------------
-- select table_name from information_schema.tables where table_schema = 'public' order by table_name;

-- ----------------------------------------------------------------------------
-- 1. MOMENTS — un Moment composé et sauvegardé par un membre (via Ask
-- EliteWay ou le Moment Builder). mood/who/budget_tier/time_key sont stockés
-- en texte libre plutôt qu'en enum strict : ce sont les mêmes clés que
-- MoodKey/WhoKey/BudgetKey/TimeKey côté app (momentEngine.ts), qui peuvent
-- évoluer sans migration de schéma.
-- ----------------------------------------------------------------------------
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  mood text,
  who text,
  budget_tier text,
  time_key text,
  city text,
  status text not null default 'saved'
    check (status in ('saved', 'upcoming', 'past', 'cancelled')),
  scheduled_at timestamptz, -- date/heure prévue du Moment, si réservé
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. MOMENT_ITEMS — les temps forts qui composent un Moment (une ligne par
-- carte du Moment Builder). "sur_devis" reprend exactement la doctrine déjà
-- en place dans momentEngine.ts (SUR_DEVIS_THRESHOLD) : jamais sommé comme
-- prix par personne, toujours affiché séparément côté UI.
-- ----------------------------------------------------------------------------
create table if not exists public.moment_items (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments(id) on delete cascade,
  establishment_id text not null references public.establishments(id) on delete restrict,
  label text not null, -- "Matin", "Coucher de soleil", "Soir"...
  sort_order int not null default 0,
  price_estimate numeric(10,2),
  sur_devis boolean not null default false,
  booking_id uuid references public.bookings(id) on delete set null, -- lien réel si réservé en ligne
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. EXPERIENCE_FEEDBACK — le retour court post-expérience (écran Feedback).
-- Volontairement minimal pour le MVP : une note + un commentaire optionnel,
-- jamais obligatoire. C'est la "mémoire d'expérience basique" du MVP — pas
-- besoin d'une table experience_memory séparée pour l'instant (voir désaccord
-- n°5 du document MVP 3.0).
-- ----------------------------------------------------------------------------
create table if not exists public.experience_feedback (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  note text,
  created_at timestamptz not null default now(),
  unique (moment_id, user_id) -- un seul feedback par membre et par Moment
);

-- ============================================================================
-- SÉCURITÉ — Row Level Security (minimisation dès la conception : chacun ne
-- voit que ses propres Moments et son propre feedback, jamais ceux d'un
-- autre membre — voir la doctrine vie privée du master build prompt).
-- ============================================================================

alter table public.moments enable row level security;
alter table public.moment_items enable row level security;
alter table public.experience_feedback enable row level security;

create policy "moments_owner_only" on public.moments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- moment_items n'a pas sa propre colonne user_id : on vérifie via le Moment
-- parent, jamais par duplication du user_id (une seule source de vérité).
create policy "moment_items_via_parent_moment" on public.moment_items
  for all using (
    exists (select 1 from public.moments m where m.id = moment_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.moments m where m.id = moment_id and m.user_id = auth.uid())
  );

create policy "experience_feedback_owner_only" on public.experience_feedback
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- Fin du schéma v3. Prérequis pour les écrans "My Moments" (Upcoming/Past/
-- Saved) et "Feedback" du roadmap Phase 6. Explicitement DIFFÉRÉ (voir MVP
-- 3.0 — désaccord n°5) : offers, user_preferences, memberships,
-- eliteway_originals, ai_conversations/ai_messages, editorial_collections,
-- destinations, availability.
-- ============================================================================
