-- ============================================================================
-- SplitBite — Database Schema (PostgreSQL 15+)
-- "Collaborative food ordering for every gathering"
-- ============================================================================
-- Derived from the frontend's type definitions (src/types/*.ts), zustand
-- stores (src/store/*.ts) and AI-scoring logic (src/lib/ai-scoring.ts).
-- The app is currently mock-data-only; this is the real relational schema
-- to back it. Design notes and rationale are in SCHEMA.md.
-- ============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "citext";         -- case-insensitive email/upi

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

create type participant_status as enum
  ('invited', 'browsing', 'ordered', 'auto-selected', 'left');

create type event_status as enum
  ('draft', 'collecting', 'reviewing', 'ordered', 'delivered', 'completed', 'cancelled');

create type activity_type as enum
  ('joined', 'ordered', 'changed-restaurant', 'timer-updated', 'ai-selected', 'left');

create type notification_kind as enum
  ('invite', 'reminder', 'order', 'system');

create type card_kind as enum
  ('credit-card', 'debit-card');

create type card_brand as enum
  ('visa', 'mastercard', 'rupay', 'amex');

create type wallet_provider as enum
  ('PhonePe', 'Amazon Pay', 'Paytm');

create type payment_method_kind as enum
  ('card', 'upi', 'wallet');

create type payment_status as enum
  ('pending', 'processing', 'success', 'failed', 'refunded');

-- ============================================================================
-- USERS
-- ============================================================================

create table users (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  email              citext not null unique,
  password_hash      text not null,                 -- never store plaintext; mock app has no auth backend yet
  avatar_url         text,
  phone              text,
  member_since       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Favourite cuisines: normalized (not a text[]) so we can aggregate/filter
-- efficiently ("find users who like Chinese food") and reuse the same
-- lookup pattern as restaurant_cuisines below.
create table user_cuisine_preferences (
  user_id   uuid not null references users(id) on delete cascade,
  cuisine   text not null,
  rank      smallint not null default 0,             -- optional ordering, 0 = strongest
  primary key (user_id, cuisine)
);

-- One row per user. Maps directly to AIPreferences in src/types/index.ts.
create table user_ai_preferences (
  user_id             uuid primary key references users(id) on delete cascade,
  auto_order_enabled  boolean not null default true,
  veg_only            boolean not null default false,
  updated_at          timestamptz not null default now()
);

-- ============================================================================
-- RESTAURANTS & MENU
-- ============================================================================

create table restaurants (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  rating              numeric(2,1) not null default 0 check (rating between 0 and 5),
  rating_count        integer not null default 0,
  delivery_time_mins  integer not null,
  price_for_two       numeric(10,2) not null,
  offer_text          text,                            -- e.g. "20% OFF up to ₹150"
  offer_discount_pct  numeric(5,2),                     -- structured version, used to compute user_savings
  image_url           text,
  banner_image_url    text,
  is_promoted         boolean not null default false,
  latitude            numeric(9,6),                     -- distance is computed at query time from the
  longitude           numeric(9,6),                     -- event's delivery coordinates — see SCHEMA.md
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table restaurant_cuisines (
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  cuisine        text not null,
  primary key (restaurant_id, cuisine)
);
create index idx_restaurant_cuisines_cuisine on restaurant_cuisines (cuisine);

-- "Highest Rated" / "Fastest Delivery" / "Most Popular" / "Best Offers" in
-- the mock data are display badges, not owned facts about a restaurant —
-- they're recomputed from rating/delivery_time/order volume. Exposed as a
-- view rather than a stored column so they can never go stale.
create view restaurant_tags as
select
  r.id as restaurant_id,
  array_remove(array[
    case when r.rating >= 4.5 then 'Highest Rated' end,
    case when r.delivery_time_mins <= 25 then 'Fastest Delivery' end,
    case when r.rating_count >= 1000 then 'Most Popular' end,
    case when r.offer_discount_pct >= 20 then 'Best Offers' end
  ], null) as tags
from restaurants r;

create table menu_items (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  name           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  is_veg         boolean not null default true,
  category       text not null,                     -- e.g. "Starters", "Main Course"
  image_url      text,
  is_bestseller  boolean not null default false,
  spice_level    smallint check (spice_level between 0 and 3),
  is_available   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_menu_items_restaurant on menu_items (restaurant_id);
create index idx_menu_items_restaurant_veg on menu_items (restaurant_id, is_veg);

-- ============================================================================
-- EVENTS
-- ============================================================================

create table events (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  description           text,
  address               text not null,
  latitude              numeric(9,6),
  longitude             numeric(9,6),
  event_date            date not null,
  event_time            time not null,
  budget_per_person     numeric(10,2) not null check (budget_per_person > 0),
  host_id               uuid not null references users(id) on delete restrict,
  invite_code           text not null unique,
  invite_expiry_mins    integer not null,
  deadline_at           timestamptz not null,
  status                event_status not null default 'draft',
  cover_gradient_from   text not null default '#F0552B',
  cover_gradient_to     text not null default '#D8A13C',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index idx_events_host on events (host_id);
create index idx_events_status on events (status);
create index idx_events_invite_code on events (invite_code);

-- Restaurants the host picked/AI-ranked to suggest to guests for this event.
create table event_suggested_restaurants (
  event_id       uuid not null references events(id) on delete cascade,
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  rank           smallint not null default 0,        -- display order from rankRestaurantsForEvent()
  primary key (event_id, restaurant_id)
);

-- ============================================================================
-- PARTICIPANTS
-- ============================================================================

create table event_participants (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references events(id) on delete cascade,
  user_id             uuid not null references users(id) on delete restrict,
  display_name        text,                        -- per-event override (guest joining with a different name)
  is_host             boolean not null default false,
  status              participant_status not null default 'invited',
  restaurant_id       uuid references restaurants(id),
  auto_selected       boolean not null default false,
  auto_select_reason  text,
  eta_mins            integer,
  joined_at           timestamptz not null default now(),
  left_at             timestamptz,
  unique (event_id, user_id)
);
create index idx_participants_event on event_participants (event_id);
create index idx_participants_user on event_participants (user_id);

-- Cart contents. Doubles as the final order line once status moves to
-- 'ordered'/'auto-selected' — price/name/is_veg/image are SNAPSHOTTED at
-- add-time so a later menu price change never rewrites a past order.
-- menu_item_id is nullable because AI auto-order can fall back to a
-- synthetic "Chef's Recommended Combo" with no real menu row behind it.
create table participant_order_items (
  id               uuid primary key default gen_random_uuid(),
  participant_id   uuid not null references event_participants(id) on delete cascade,
  menu_item_id     uuid references menu_items(id) on delete set null,
  name_snapshot    text not null,
  price_snapshot   numeric(10,2) not null check (price_snapshot >= 0),
  quantity         integer not null default 1 check (quantity > 0),
  is_veg_snapshot  boolean not null default true,
  image_snapshot   text,
  created_at       timestamptz not null default now()
);
create index idx_order_items_participant on participant_order_items (participant_id);

-- ============================================================================
-- ACTIVITY FEED & NOTIFICATIONS
-- ============================================================================

create table activity_items (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references events(id) on delete cascade,
  type         activity_type not null,
  actor_id     uuid references users(id) on delete set null,   -- null = system-generated
  message      text not null,
  created_at   timestamptz not null default now()
);
create index idx_activity_event on activity_items (event_id, created_at desc);

create table notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  event_id     uuid references events(id) on delete cascade,
  kind         notification_kind not null,
  title        text not null,
  body         text not null,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);
create index idx_notifications_user on notifications (user_id, read, created_at desc);

-- ============================================================================
-- PAYMENT METHODS
-- ============================================================================
-- Three tables (mirrors SavedCard / SavedUpi / SavedWallet) rather than one
-- polymorphic table, since each has genuinely different required fields.
-- "is_default" is NOT duplicated here — user_default_payment_method below is
-- the single source of truth, so there's no multi-table consistency to keep
-- in sync (the mock app's is_default-per-table approach can silently drift).

create table payment_cards (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  kind             card_kind not null,
  brand            card_brand not null,
  holder_name      text not null,
  last4            char(4) not null,
  expiry_month     char(2) not null,
  expiry_year      char(4) not null,
  gateway_token    text not null,          -- opaque token from the payment processor (Razorpay/Stripe) — never raw PAN/CVV
  created_at       timestamptz not null default now()
);
create index idx_payment_cards_user on payment_cards (user_id);

create table payment_upi (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  upi_id       citext not null,
  created_at   timestamptz not null default now(),
  unique (user_id, upi_id)
);

create table payment_wallets (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users(id) on delete cascade,
  provider       wallet_provider not null,
  linked_phone   text not null,
  created_at     timestamptz not null default now()
);

-- One row per user. (method_kind, method_id) is validated at the app layer
-- (or via a trigger) against whichever of the three tables above it points to.
create table user_default_payment_method (
  user_id      uuid primary key references users(id) on delete cascade,
  method_kind  payment_method_kind not null,
  method_id    uuid not null,
  updated_at   timestamptz not null default now()
);

-- ============================================================================
-- PAYMENTS (host pays the full event bill in one transaction)
-- ============================================================================

create table event_payments (
  id                    uuid primary key default gen_random_uuid(),
  event_id              uuid not null references events(id) on delete restrict,
  payer_id              uuid not null references users(id) on delete restrict,   -- always the host today
  method_kind           payment_method_kind not null,
  method_id             uuid not null,
  amount                numeric(10,2) not null check (amount >= 0),
  status                payment_status not null default 'pending',
  gateway_transaction_id text,
  created_at            timestamptz not null default now(),
  completed_at          timestamptz
);
create index idx_event_payments_event on event_payments (event_id);
-- allow retries after a failed attempt, but only one non-failed payment per event
create unique index uq_event_payments_active on event_payments (event_id)
  where status in ('pending', 'processing', 'success');

-- Tracks *why* a user saved money (offer applied on their order line), so
-- profile.moneySaved is a real running total instead of a seeded constant.
create table user_savings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  event_id         uuid not null references events(id) on delete cascade,
  participant_id   uuid not null references event_participants(id) on delete cascade,
  amount_saved     numeric(10,2) not null check (amount_saved >= 0),
  reason           text not null,                 -- e.g. "20% OFF at Punjab Grill Express"
  created_at       timestamptz not null default now()
);
create index idx_user_savings_user on user_savings (user_id);

-- ============================================================================
-- DERIVED / STATS VIEWS
-- ============================================================================
-- Everything on the profile & dashboard stat tiles except money_saved is
-- honestly derivable from the tables above — no need to store it and risk
-- it drifting out of sync.

create view user_event_stats as
select
  u.id as user_id,
  count(*) filter (where e.host_id = u.id) as hosted_count,
  count(*) filter (where e.host_id <> u.id) as joined_count,
  count(*) filter (where e.host_id = u.id and e.event_date >= current_date) as upcoming_hosted,
  count(*) filter (where e.event_date < current_date) as past_count
from users u
join event_participants ep on ep.user_id = u.id
join events e on e.id = ep.event_id
group by u.id;

create view user_order_stats as
select
  ep.user_id,
  avg(order_totals.total) as average_order_value,
  mode() within group (order by r.name) as favourite_restaurant,
  mode() within group (order by rc.cuisine) as favourite_cuisine
from event_participants ep
join restaurants r on r.id = ep.restaurant_id
left join restaurant_cuisines rc on rc.restaurant_id = r.id
join lateral (
  select coalesce(sum(price_snapshot * quantity), 0) as total
  from participant_order_items poi
  where poi.participant_id = ep.id
) order_totals on true
where ep.status in ('ordered', 'auto-selected')
group by ep.user_id;

-- ============================================================================
-- housekeeping: keep updated_at fresh
-- ============================================================================
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();
create trigger trg_restaurants_updated_at before update on restaurants
  for each row execute function set_updated_at();
create trigger trg_menu_items_updated_at before update on menu_items
  for each row execute function set_updated_at();
create trigger trg_events_updated_at before update on events
  for each row execute function set_updated_at();
