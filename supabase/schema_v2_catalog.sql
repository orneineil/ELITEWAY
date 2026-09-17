-- ============================================================================
-- ELITEWAY — schéma v2 : catalogue, favoris, collections, avis, notifications
-- Additif uniquement : ne modifie ni ne supprime aucune table de schema.sql.
-- À exécuter une seule fois dans Supabase : Project > SQL Editor > New query.
-- Colle tout ce fichier et clique "Run" (après avoir déjà exécuté schema.sql).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. COMPLÉMENT À `bookings` (schema.sql) — date et heure du créneau réservé.
-- `bookings` référence déjà `slot_id` (public.availability_slots) mais tant que
-- les disponibilités réelles ne sont pas branchées, on stocke la date/heure
-- choisie directement ici. Ajout additif de colonnes nullables : aucune ligne
-- existante n'est affectée (l'audit confirme que la table est vide à ce jour).
-- ----------------------------------------------------------------------------
alter table public.bookings add column if not exists reservation_date date;
alter table public.bookings add column if not exists reservation_time text;

-- ----------------------------------------------------------------------------
-- ⚠️ CONSTAT (17/09), élargi après plusieurs échecs d'exécution réels : cette
-- base contient déjà tout un ensemble de tables créées séparément (probable
-- échafaudage initial Figma Make) — establishments (id uuid), favorites
-- (client_id, establishment_id uuid), establishment_reviews (id uuid, pas de
-- client_id du tout, author_name en texte libre), notifications (client_id,
-- seulement id/message/read/created_at), reservations (client_id,
-- establishment_id uuid). Aucun rapport avec le catalogue éditorial statique
-- (src/app/data/establishments.ts, identifiants texte comme "chevre-dor")
-- qu'utilise réellement l'app cliente aujourd'hui — sauf `bookings`, qui lui
-- a bien été conçu pour ce catalogue (establishment_id text, client_id) et
-- qu'on continue donc d'utiliser tel quel.
--
-- Décision (pour ne rien casser ni dupliquer silencieusement) : les tables
-- ci-dessous portent des noms DISTINCTS de l'existant plutôt que de réutiliser
-- favorites/establishment_reviews/notifications — `create table if not
-- exists` sur ces noms ne ferait rien et laisserait des RLS policies
-- incompatibles s'appliquer à la mauvaise table. On ne touche donc JAMAIS aux
-- tables déjà là ; establishment_id reste ici du texte LIBRE (le slug du
-- catalogue statique), jamais une clé étrangère vers `establishments`.
-- ----------------------------------------------------------------------------
-- 2. FAVORIS (remplace le localStorage actuel, par compte plutôt que par appareil)
-- ----------------------------------------------------------------------------
create table if not exists public.catalog_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  establishment_id text not null, -- slug du catalogue statique — pas de FK, voir constat plus haut
  created_at timestamptz not null default now(),
  unique (user_id, establishment_id)
);

-- ----------------------------------------------------------------------------
-- 3. AVIS CLIENTS SUR LE CATALOGUE STATIQUE (distinct de establishment_reviews,
-- qui existe déjà pour un autre usage — voir constat plus haut)
-- ----------------------------------------------------------------------------
create table if not exists public.catalog_reviews (
  id uuid primary key default gen_random_uuid(),
  establishment_id text not null, -- slug du catalogue statique — pas de FK, voir constat plus haut
  user_id uuid not null references auth.users(id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  comment text,
  photos text[],
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. COLLECTIONS ÉDITORIALES (The Riviera Collection, After Dark, etc.)
-- ----------------------------------------------------------------------------
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  intent_text text, -- la phrase éditoriale qui justifie la collection
  cover_image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  establishment_id text not null, -- slug du catalogue statique — pas de FK, voir constat plus haut
  sort_order int not null default 0,
  primary key (collection_id, establishment_id)
);

-- ----------------------------------------------------------------------------
-- 5. SIGNAUX D'USAGE (nourrit EliteWay Intelligence — vue, favori, recherche)
-- ----------------------------------------------------------------------------
create table if not exists public.usage_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  establishment_id text, -- slug du catalogue statique — pas de FK, voir constat plus haut
  category text,
  signal_type text not null check (signal_type in ('view', 'favorite', 'search', 'booking')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. NOTIFICATIONS RÉELLES (remplace la liste codée en dur). Distinct de
-- `notifications`, qui existe déjà avec seulement id/client_id/message/read
-- (pas de title/type/link) — voir constat plus haut.
-- ----------------------------------------------------------------------------
create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('offer', 'table', 'event', 'loyalty', 'booking')),
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Notification automatique à la confirmation d'une réservation
create or replace function public.notify_booking_confirmed()
returns trigger as $$
begin
  if new.status = 'confirmed' and (old.status is null or old.status <> 'confirmed') then
    insert into public.app_notifications (user_id, title, message, type, link)
    values (
      new.client_id,
      'Réservation confirmée',
      'Votre réservation a bien été confirmée. Code : ' || coalesce(new.confirmation_code, ''),
      'booking',
      '/reservations'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_booking_confirmed on public.bookings;
create trigger on_booking_confirmed
  after insert or update on public.bookings
  for each row execute procedure public.notify_booking_confirmed();

-- ============================================================================
-- SÉCURITÉ — Row Level Security
-- ============================================================================

-- public.establishments/favorites/establishment_reviews/notifications
-- existent déjà avec leurs propres politiques RLS — on n'y touche pas, voir
-- le constat plus haut. Seules les tables NOUVELLES (noms distincts) créées
-- ci-dessus sont sécurisées ici.
alter table public.catalog_favorites enable row level security;
alter table public.catalog_reviews enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.usage_signals enable row level security;
alter table public.app_notifications enable row level security;

-- Favoris : strictement privés à chaque membre
create policy "catalog_favorites_owner_only" on public.catalog_favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Avis : lecture publique, écriture par l'auteur uniquement
create policy "catalog_reviews_select_all" on public.catalog_reviews
  for select using (true);
create policy "catalog_reviews_insert_own" on public.catalog_reviews
  for insert with check (user_id = auth.uid());
create policy "catalog_reviews_update_delete_own_or_admin" on public.catalog_reviews
  for update using (user_id = auth.uid() or public.is_admin());

-- Collections : lecture publique, écriture réservée à l'admin (curation
-- éditoriale EliteWay, jamais les partenaires)
create policy "collections_select_all" on public.collections
  for select using (true);
create policy "collections_write_admin_only" on public.collections
  for all using (public.is_admin()) with check (public.is_admin());
create policy "collection_items_select_all" on public.collection_items
  for select using (true);
create policy "collection_items_write_admin_only" on public.collection_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Signaux d'usage : chacun écrit et lit uniquement les siens (donnée de
-- comportement sensible) ; l'admin peut les lire pour calibrer Intelligence
create policy "signals_insert_own" on public.usage_signals
  for insert with check (user_id = auth.uid());
create policy "signals_select_own_or_admin" on public.usage_signals
  for select using (user_id = auth.uid() or public.is_admin());

-- Notifications : chacun ne voit que les siennes
create policy "app_notifications_owner_only" on public.app_notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- Fin du schéma v2. Le catalogue reste servi par src/app/data/establishments.ts
-- (voir constat du 17/09) — pas d'import vers public.establishments pour
-- l'instant. Prochaine étape : brancher favoris/avis/collections/signaux sur
-- ces tables (identifiés par le slug texte), sans dépendre de la table
-- `establishments` réelle tant qu'une vraie migration du catalogue n'est pas
-- explicitement décidée.
-- ============================================================================
