-- seed.sql
-- Database schema and seed data for subscription cancellation flow

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- SUBSCRIPTIONS
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  monthly_price integer not null check (monthly_price > 0),
  status text not null check (status in ('active','canceled')) default 'active',
  pending_cancellation boolean not null default false,
  created_at timestamptz default now()
);

-- CANCELLATIONS
create table if not exists cancellations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  downsell_variant text not null check (downsell_variant in ('A','B')),
  reason text,
  accepted_downsell boolean,
  status text not null check (status in ('pending','confirmed')) default 'pending',
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table subscriptions enable row level security;
alter table cancellations enable row level security;

-- RLS: Users can only see/manipulate their own rows
drop policy if exists users_self on users;
create policy users_self on users
  using (id = auth.uid());

drop policy if exists subs_select on subscriptions;
create policy subs_select on subscriptions
  for select using (user_id = auth.uid());

drop policy if exists subs_update on subscriptions;
create policy subs_update on subscriptions
  for update using (user_id = auth.uid());

drop policy if exists cancellations_rw on cancellations;
create policy cancellations_rw on cancellations
  for select using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Seeds
insert into users (id, email) values
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com')
on conflict (email) do nothing;

-- $25 and $29 active subscriptions
insert into subscriptions (user_id, monthly_price, status) values
  ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')
on conflict do nothing;
