-- ============================================================================
-- ELITEWAY — schéma v2 : catalogue, favoris, collections, avis, notifications
-- Additif uniquement : ne modifie ni ne supprime aucune table de schema.sql.
-- À exécuter une seule fois dans Supabase : Project > SQL Editor > New query.
-- Colle tout ce fichier et clique "Run" (après avoir déjà exécuté schema.sql).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ÉTABLISSEMENTS (sort le catalogue de establishments.ts vers une vraie table)
-- ----------------------------------------------------------------------------
create table if not exists public.establishments (
  id text primary key, -- garde les mêmes identifiants que establishments.ts (ex: "chevre-dor")
  name text not null,
  category text not null
    check (category in ('gastronomie','hotels','evenements','navigation','bien-etre','oenologie','aviation','offres-exclusives','sport-loisirs')),
  description text,
  long_description text,
  image_url text,
  gallery text[],
  location text,
  city text,
  price text,
  price_min numeric(10,2),
  price_max numeric(10,2),
  rating numeric(2,1),
  features text[],
  tags text[],
  capacity text,
  exclusive boolean not null default false,
  why_eliteway text,
  map_lat numeric(9,6),
  map_lng numeric(9,6),
  partner_id uuid references public.partners(id) on delete set null,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. FAVORIS (remplace le localStorage actuel, par compte plutôt que par appareil)
-- ----------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  establishment_id text not null references public.establishments(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, establishment_id)
);

-- ----------------------------------------------------------------------------
-- 3. AVIS CLIENTS (référencé en commentaire dans establishments.ts, jamais créé)
-- ----------------------------------------------------------------------------
create table if not exists public.establishment_reviews (
  id uuid primary key default gen_random_uuid(),
  establishment_id text not null references public.establishments(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
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
  establishment_id text not null references public.establishments(id) on delete cascade,
  sort_order int not null default 0,
  primary key (collection_id, establishment_id)
);

-- ----------------------------------------------------------------------------
-- 5. SIGNAUX D'USAGE (nourrit EliteWay Intelligence — vue, favori, recherche)
-- ----------------------------------------------------------------------------
create table if not exists public.usage_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  establishment_id text references public.establishments(id) on delete set null,
  category text,
  signal_type text not null check (signal_type in ('view', 'favorite', 'search', 'booking')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. NOTIFICATIONS RÉELLES (remplace la liste codée en dur)
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
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
    insert into public.notifications (user_id, title, message, type, link)
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

alter table public.establishments enable row level security;
alter table public.favorites enable row level security;
alter table public.establishment_reviews enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.usage_signals enable row level security;
alter table public.notifications enable row level security;

-- Établissements : lecture publique des fiches publiées ; écriture réservée
-- au partenaire propriétaire ou à l'admin (réutilise public.is_admin() et
-- public.owns_establishment() déjà définies dans schema.sql)
create policy "establishments_select_published_or_owner_or_admin" on public.establishments
  for select using (
    status = 'published'
    or public.owns_establishment(id)
    or public.is_admin()
  );
create policy "establishments_write_owner_or_admin" on public.establishments
  for all using (public.owns_establishment(id) or public.is_admin())
  with check (public.owns_establishment(id) or public.is_admin());

-- Favoris : strictement privés à chaque membre
create policy "favorites_owner_only" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Avis : lecture publique, écriture par l'auteur uniquement
create policy "reviews_select_all" on public.establishment_reviews
  for select using (true);
create policy "reviews_insert_own" on public.establishment_reviews
  for insert with check (client_id = auth.uid());
create policy "reviews_update_delete_own_or_admin" on public.establishment_reviews
  for update using (client_id = auth.uid() or public.is_admin());

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
create policy "notifications_owner_only" on public.notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- Fin du schéma v2. Prochaine étape : importer establishments.ts dans la
-- table `establishments` (script d'import fourni séparément), puis brancher
-- les écrans un par un sur ces tables plutôt que sur les données statiques.
-- ============================================================================
