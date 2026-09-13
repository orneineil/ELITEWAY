-- ============================================================================
-- ELITEWAY — schéma Supabase (backend sécurisé)
-- À exécuter une seule fois dans Supabase : Project > SQL Editor > New query
-- Colle tout ce fichier et clique "Run".
-- ============================================================================

-- Extension nécessaire pour générer des UUID
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILS CLIENTS (étend auth.users, géré par Supabase Auth)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  membership_tier text not null default 'essentiel'
    check (membership_tier in ('essentiel', 'prestige', 'elite')),
  role text not null default 'client'
    check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. PARTENAIRES
-- ----------------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  category text,
  establishment_id text, -- lié à l'id de l'établissement dans establishments.ts une fois validé
  status text not null default 'pending'
    check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. DISPONIBILITÉS (créneaux réels par établissement)
-- ----------------------------------------------------------------------------
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  establishment_id text not null,
  slot_date date not null,
  slot_time text not null,
  capacity int not null default 1,
  booked_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (establishment_id, slot_date, slot_time)
);

-- ----------------------------------------------------------------------------
-- 4. RÉSERVATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  establishment_id text not null,
  slot_id uuid references public.availability_slots(id),
  guests int not null default 1,
  total_amount numeric(10,2),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  confirmation_code text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. MESSAGES (client <-> partenaire)
-- ----------------------------------------------------------------------------
create table if not exists public.partner_messages (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  client_id uuid references auth.users(id) on delete set null,
  sender text not null check (sender in ('client', 'partner')),
  body text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. COMMISSIONS
-- ----------------------------------------------------------------------------
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  partner_id uuid references public.partners(id) on delete set null,
  rate numeric(5,2) not null,
  amount numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- SÉCURITÉ — Row Level Security (chaque utilisateur ne voit que ses données)
-- ============================================================================

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

create or replace function public.owns_establishment(est_id text)
returns boolean as $$
  select exists (
    select 1 from public.partners
    where id = auth.uid() and establishment_id = est_id and status = 'active'
  );
$$ language sql security definer stable set search_path = public;

alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.partner_messages enable row level security;
alter table public.commissions enable row level security;

-- Profiles : chacun voit/modifie son propre profil ; l'admin voit tout
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Partners : le partenaire voit/modifie sa propre fiche ; l'admin voit tout ;
-- personne d'autre n'a accès (les infos de contact ne sont jamais publiques)
create policy "partners_select_own_or_admin" on public.partners
  for select using (id = auth.uid() or public.is_admin());
create policy "partners_insert_self" on public.partners
  for insert with check (id = auth.uid());
create policy "partners_update_own_or_admin" on public.partners
  for update using (id = auth.uid() or public.is_admin());

-- Availability : lecture publique (nécessaire pour afficher les créneaux),
-- écriture réservée au partenaire propriétaire ou à l'admin
create policy "availability_select_all" on public.availability_slots
  for select using (true);
create policy "availability_write_owner_or_admin" on public.availability_slots
  for all using (public.owns_establishment(establishment_id) or public.is_admin())
  with check (public.owns_establishment(establishment_id) or public.is_admin());

-- Bookings : le client voit/crée ses propres réservations ; le partenaire voit
-- celles de son établissement ; l'admin voit tout
create policy "bookings_select_own_or_partner_or_admin" on public.bookings
  for select using (
    client_id = auth.uid()
    or public.owns_establishment(establishment_id)
    or public.is_admin()
  );
create policy "bookings_insert_own" on public.bookings
  for insert with check (client_id = auth.uid());
create policy "bookings_update_partner_or_admin" on public.bookings
  for update using (public.owns_establishment(establishment_id) or public.is_admin());

-- Messages : visibles par le partenaire concerné, le client concerné, ou l'admin
create policy "messages_select_participant_or_admin" on public.partner_messages
  for select using (
    client_id = auth.uid()
    or partner_id = auth.uid()
    or public.is_admin()
  );
create policy "messages_insert_participant" on public.partner_messages
  for insert with check (client_id = auth.uid() or partner_id = auth.uid());

-- Commissions : réservées à l'admin (le partenaire ne voit que via son propre
-- calcul côté dashboard si besoin, ajusté plus tard)
create policy "commissions_admin_only" on public.commissions
  for select using (public.is_admin());

-- ============================================================================
-- Fin du schéma. Prochaine étape : promouvoir ton propre compte en admin.
-- Une fois que tu t'es inscrite dans l'app (ou via Supabase Auth), exécute :
--
--   update public.profiles set role = 'admin' where email = 'TON_EMAIL_ICI';
--
-- ============================================================================
