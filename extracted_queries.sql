-- ============================================================================
-- SplitBite — Supabase / PostgreSQL Schema
-- ============================================================================
-- Target: Supabase Postgres (15+). Run top-to-bottom in the SQL Editor, or
-- save as a migration: supabase migration new splitbite_init  →  paste this
-- in → supabase db push.
--
-- AUTH NOTE: per your choice, `users` is STANDALONE — it is NOT linked to
-- Supabase's built-in auth.users, and keeps its own password_hash. That
-- means:
--   • You are responsible for hashing passwords and issuing sessions
--     yourself (Supabase Auth plays no role here).
--   • Because there's no Supabase Auth session, there is no auth.uid() to
--     write meaningful "user can only see their own row" RLS policies with.
--     RLS is still enabled below (Supabase's linter flags public tables
--     without it, and it's good hygiene), but the default policies are
--     DENY-ALL to anon/authenticated — i.e. treat these tables as
--     backend-only, accessed exclusively with your service_role key
--     (service_role bypasses RLS entirely, so nothing below blocks it).
--     If you later expose any of this straight to the browser with the
--     anon key, you'll need to replace the deny-all policies with real
--     ones — flagged with TODOs where that's most likely.
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
-- Supabase convention: install extensions into the dedicated `extensions`
-- schema rather than `public`. Supabase already puts `extensions` on every
-- role's search_path, so these functions work unqualified below.

create extension if not exists pgcrypto with schema extensions;

-- gen_random_uuid()
create extension if not exists citext   with schema extensions;

-- case-insensitive email/upi


-- ============================================================================
-- 2. ENUM TYPES
-- ============================================================================

create type public.participant_status as enum
  ('invited', 'browsing', 'ordered', 'auto-selected', 'left');

create type public.event_status as enum
  ('draft', 'collecting', 'reviewing', 'ordered', 'delivered', 'completed', 'cancelled');

create type public.activity_type as enum
  ('joined', 'ordered', 'changed-restaurant', 'timer-updated', 'ai-selected', 'left');

create type public.notification_kind as enum
  ('invite', 'reminder', 'order', 'system');

create type public.card_kind as enum
  ('credit-card', 'debit-card');

create type public.card_brand as enum
  ('visa', 'mastercard', 'rupay', 'amex');

create type public.wallet_provider as enum
  ('PhonePe', 'Amazon Pay', 'Paytm');

create type public.payment_method_kind as enum
  ('card', 'upi', 'wallet');

create type public.payment_status as enum
  ('pending', 'processing', 'success', 'failed', 'refunded');

-- ============================================================================
-- 3. USERS
-- ============================================================================

create table public.users (
  id                 uuid primary key default extensions.gen_random_uuid(),
  name               text not null,
  email              extensions.citext not null unique,
  password_hash      text not null,
  avatar_url         text,
  phone              text,
  member_since       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.users is 'Standalone app users — NOT linked to Supabase auth.users. App is responsible for hashing password_hash and issuing its own sessions.';

create table public.user_cuisine_preferences (
  user_id   uuid not null references public.users(id) on delete cascade,
  cuisine   text not null,
  rank      smallint not null default 0,
  primary key (user_id, cuisine)
);

create table public.user_ai_preferences (
  user_id             uuid primary key references public.users(id) on delete cascade,
  auto_order_enabled  boolean not null default true,
  veg_only            boolean not null default false,
  updated_at          timestamptz not null default now()
);

-- ============================================================================
-- 4. RESTAURANTS & MENU — INTENTIONALLY NOT IN THE DB
-- ============================================================================
-- No restaurants / restaurant_cuisines / menu_items tables. Restaurant and
-- menu data is served from frontend mock data for now, and will come from
-- the Swiggy MCP server once that access is granted — at which point it's
-- almost certainly fetched/cached live rather than owned in our own tables,
-- so there was no point standing up a copy here just to throw it away later.
--
-- Practical effect: everywhere below that would normally FK to restaurants
-- or menu_items instead stores that provider's raw ID as plain text with NO
-- foreign key — we can't reference a table we don't have, and Swiggy's IDs
-- aren't guaranteed to be uuids. All restaurant/menu-item *names, prices,
-- images* etc. must be snapshotted at write time (see
-- participant_order_items below) since there's nothing locally to join back
-- to and re-look-up later.


-- ============================================================================
-- 5. EVENTS
-- ============================================================================

create table public.events (
  id                    uuid primary key default extensions.gen_random_uuid(),
  name                  text not null,
  description           text,
  address               text not null,
  latitude              numeric(9,6),
  longitude             numeric(9,6),
  event_date            date not null,
  event_time            time not null,
  budget_per_person     numeric(10,2) not null check (budget_per_person > 0),
  host_id               uuid not null references public.users(id) on delete restrict,
  invite_code           text not null unique,
  invite_expiry_mins    integer not null,
  deadline_at           timestamptz not null,
  status                public.event_status not null default 'draft',
  cover_gradient_from   text not null default '#F0552B',
  cover_gradient_to     text not null default '#D8A13C',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_events_host on public.events (host_id);

create index idx_events_status on public.events (status);

create index idx_events_invite_code on public.events (invite_code);

create table public.event_suggested_restaurants (
  event_id       uuid not null references public.events(id) on delete cascade,
  restaurant_id  text not null,      -- Swiggy/mock restaurant ID — no FK, see section 4
  rank           smallint not null default 0,
  primary key (event_id, restaurant_id)
);

-- ============================================================================
-- 6. PARTICIPANTS & ORDERS
-- ============================================================================

create table public.event_participants (
  id                  uuid primary key default extensions.gen_random_uuid(),
  event_id            uuid not null references public.events(id) on delete cascade,
  user_id             uuid not null references public.users(id) on delete restrict,
  display_name        text,
  is_host             boolean not null default false,
  status              public.participant_status not null default 'invited',
  restaurant_id       text,      -- Swiggy/mock restaurant ID — no FK, see section 4
  auto_selected       boolean not null default false,
  auto_select_reason  text,
  eta_mins            integer,
  joined_at           timestamptz not null default now(),
  left_at             timestamptz,
  unique (event_id, user_id)
);

create index idx_participants_event on public.event_participants (event_id);

create index idx_participants_user on public.event_participants (user_id);

create table public.participant_order_items (
  id               uuid primary key default extensions.gen_random_uuid(),
  participant_id   uuid not null references public.event_participants(id) on delete cascade,
  menu_item_id     text,      -- Swiggy/mock menu item ID — no FK, see section 4
  name_snapshot    text not null,
  price_snapshot   numeric(10,2) not null check (price_snapshot >= 0),
  quantity         integer not null default 1 check (quantity > 0),
  is_veg_snapshot  boolean not null default true,
  image_snapshot   text,
  created_at       timestamptz not null default now()
);

create index idx_order_items_participant on public.participant_order_items (participant_id);

-- ============================================================================
-- 7. ACTIVITY FEED & NOTIFICATIONS
-- ============================================================================

create table public.activity_items (
  id           uuid primary key default extensions.gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  type         public.activity_type not null,
  actor_id     uuid references public.users(id) on delete set null,
  message      text not null,
  created_at   timestamptz not null default now()
);

create index idx_activity_event on public.activity_items (event_id, created_at desc);

create table public.notifications (
  id           uuid primary key default extensions.gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  event_id     uuid references public.events(id) on delete cascade,
  kind         public.notification_kind not null,
  title        text not null,
  body         text not null,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

create index idx_notifications_user on public.notifications (user_id, read, created_at desc);

-- ============================================================================
-- 8. PAYMENT METHODS
-- ============================================================================

create table public.payment_cards (
  id               uuid primary key default extensions.gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  kind             public.card_kind not null,
  brand            public.card_brand not null,
  holder_name      text not null,
  last4            char(4) not null,
  expiry_month     char(2) not null,
  expiry_year      char(4) not null,
  gateway_token    text not null,
  created_at       timestamptz not null default now()
);

create index idx_payment_cards_user on public.payment_cards (user_id);

create table public.payment_upi (
  id           uuid primary key default extensions.gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  upi_id       extensions.citext not null,
  created_at   timestamptz not null default now(),
  unique (user_id, upi_id)
);

create table public.payment_wallets (
  id             uuid primary key default extensions.gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  provider       public.wallet_provider not null,
  linked_phone   text not null,
  created_at     timestamptz not null default now()
);

create table public.user_default_payment_method (
  user_id      uuid primary key references public.users(id) on delete cascade,
  method_kind  public.payment_method_kind not null,
  method_id    uuid not null,
  updated_at   timestamptz not null default now()
);

-- ============================================================================
-- 9. PAYMENTS
-- ============================================================================

create table public.event_payments (
  id                     uuid primary key default extensions.gen_random_uuid(),
  event_id               uuid not null references public.events(id) on delete restrict,
  payer_id               uuid not null references public.users(id) on delete restrict,
  method_kind            public.payment_method_kind not null,
  method_id              uuid not null,
  amount                 numeric(10,2) not null check (amount >= 0),
  status                 public.payment_status not null default 'pending',
  gateway_transaction_id text,
  created_at             timestamptz not null default now(),
  completed_at           timestamptz
);

create index idx_event_payments_event on public.event_payments (event_id);

create unique index uq_event_payments_active on public.event_payments (event_id)
  where status in ('pending', 'processing', 'success');

create table public.user_savings (
  id               uuid primary key default extensions.gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  event_id         uuid not null references public.events(id) on delete cascade,
  participant_id   uuid not null references public.event_participants(id) on delete cascade,
  amount_saved     numeric(10,2) not null check (amount_saved >= 0),
  reason           text not null,
  created_at       timestamptz not null default now()
);

create index idx_user_savings_user on public.user_savings (user_id);

-- ============================================================================
-- 10. DERIVED / STATS VIEWS
-- ============================================================================

create view public.user_event_stats as
select
  u.id as user_id,
  count(*) filter (where e.host_id = u.id) as hosted_count,
  count(*) filter (where e.host_id <> u.id) as joined_count,
  count(*) filter (where e.host_id = u.id and e.event_date >= current_date) as upcoming_hosted,
  count(*) filter (where e.event_date < current_date) as past_count
from public.users u
join public.event_participants ep on ep.user_id = u.id
join public.events e on e.id = ep.event_id
group by u.id;

-- NOTE: favourite_restaurant / favourite_cuisine are gone from this view.
-- Both need the restaurant's *name* and *cuisine list* to be meaningful,
-- and neither lives in this DB anymore (see section 4) — only the raw
-- external restaurant_id does. Once the Swiggy MCP integration lands,
-- either (a) enrich favourite_restaurant_id client-side by looking it up
-- against Swiggy/mock data, or (b) add a thin restaurants_cache table here
-- and join against that instead.
create view public.user_order_stats as
select
  ep.user_id,
  avg(order_totals.total) as average_order_value,
  mode() within group (order by ep.restaurant_id) as favourite_restaurant_id
from public.event_participants ep
join lateral (
  select coalesce(sum(price_snapshot * quantity), 0) as total
  from public.participant_order_items poi
  where poi.participant_id = ep.id
) order_totals on true
where ep.status in ('ordered', 'auto-selected')
group by ep.user_id;

-- ============================================================================
-- 11. updated_at HOUSEKEEPING TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();

return new;

end;

$$ language plpgsql security definer set search_path = '';

create trigger trg_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 12. ROW LEVEL SECURITY
-- ============================================================================
-- RLS is ON for every table (Supabase flags public tables without it, and
-- your service_role key bypasses RLS regardless, so this costs you nothing
-- if you only ever hit the DB from a trusted backend). The policies below
-- are DENY-ALL for anon/authenticated — i.e. "nobody using the public API
-- keys can read or write anything." That's correct for a backend-only app.
--
-- TODO: If you later call Supabase directly from the browser/app with the
-- anon key for any of these tables, replace its deny-all policy with a real
-- one — everything here touches users, events, participants, or payments,
-- so that needs a real Supabase Auth session (see the auth-integration note
-- at the top of this file) before "row belongs to auth.uid()" policies make
-- sense.

do $$
declare
  t text;

begin
  for t in
    select unnest(array[
      'users','user_cuisine_preferences','user_ai_preferences',
      'events','event_suggested_restaurants',
      'event_participants','participant_order_items',
      'activity_items','notifications',
      'payment_cards','payment_upi','payment_wallets','user_default_payment_method',
      'event_payments','user_savings'
    ])
  loop
    execute format('alter table public.%I enable row level security;

', t);

execute format(
      'create policy "deny all to anon/authenticated" on public.%I for all to anon, authenticated using (false) with check (false);

',
      t
    );

end loop;

end $$;

-- Views inherit the RLS of their underlying tables automatically in
-- Postgres when queried through PostgREST as the invoking role, so no
-- separate policies are needed for user_event_stats / user_order_stats.;