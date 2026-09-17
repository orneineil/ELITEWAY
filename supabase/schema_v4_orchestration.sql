-- ============================================================================
-- ELITEWAY — schéma v4 : Orchestration, Experience Brief, Assurance, Memory
-- Additif uniquement : ne modifie ni ne supprime aucune table existante.
--
-- ⚠️ NE PAS EXÉCUTER TANT QUE TU N'AS PAS CONFIRMÉ QUE schema_v2_catalog.sql
-- ET schema_v3_moments.sql SONT DÉJÀ EN PLACE. Ce fichier ajoute des colonnes
-- à `moments` et `moment_items` — s'ils n'existent pas encore, lance d'abord
-- schema_v2_catalog.sql puis schema_v3_moments.sql.
--
-- Lance d'abord seule cette requête d'audit si tu as un doute :
-- select table_name from information_schema.tables where table_schema = 'public' order by table_name;
--
-- Voir MVP 4.0 — Orchestration, Anticipation, Assurance, Mémoire (doc Claude)
-- pour le raisonnement complet derrière chaque choix ci-dessous.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MOMENTS — vérification d'Experience Assurance. Volontairement hybride :
-- une vérification automatique existe déjà côté app (assuranceStatus, pure,
-- pas de colonne nécessaire) ; ces deux colonnes ne servent qu'au CHECK
-- MANUEL possible par l'équipe EliteWay au lancement (section 8 de la
-- directive) — jamais un statut "prêt" inventé automatiquement.
-- ----------------------------------------------------------------------------
alter table public.moments add column if not exists assurance_checked_by uuid references auth.users(id);
alter table public.moments add column if not exists assurance_checked_at timestamptz;

-- ----------------------------------------------------------------------------
-- 2. MOMENT_ITEMS — statut de confirmation partenaire + Experience Brief.
-- 'manual' = aucun partner_id identifiable sur l'établissement : l'équipe
-- EliteWay traite à la main (orchestration hybride assumée, pas une lacune).
-- experience_brief (jsonb) est généré par buildExperienceBrief() côté app à
-- la création du Moment — need-to-know réel, jamais le profil complet.
-- ----------------------------------------------------------------------------
alter table public.moment_items add column if not exists partner_status text not null default 'pending'
  check (partner_status in ('pending', 'manual', 'confirmed'));
alter table public.moment_items add column if not exists experience_brief jsonb;

-- ----------------------------------------------------------------------------
-- 3. USER_LEARNED_PREFERENCES — Experience Memory, opt-in explicite
-- uniquement (case à cocher côté app "Aider EliteWay à mieux me connaître",
-- jamais cochée par défaut). Des tags simples, jamais un profil comportemental
-- opaque — voir désaccord n°3 (MVP 4.0) : pas de table experience_memory
-- séparée, celle-ci suffit avec experience_feedback.
-- ----------------------------------------------------------------------------
create table if not exists public.user_learned_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tag text not null, -- ex: "ambiance-calme", "vue-mer", "evite-bruyant"
  weight numeric(3,2) not null default 1.0,
  updated_at timestamptz not null default now(),
  unique (user_id, tag)
);

alter table public.user_learned_preferences enable row level security;

create policy "user_learned_preferences_owner_only" on public.user_learned_preferences
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- Fin du schéma v4. Explicitement toujours DIFFÉRÉ (inchangé depuis MVP 3.0
-- et confirmé par la directive "ne pas sur-engineer") : offers, memberships,
-- eliteway_originals, ai_conversations/ai_messages, editorial_collections,
-- destinations, availability, toute messagerie automatisée partenaire.
-- ============================================================================
