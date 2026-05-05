-- Breeze initial schema: companies, profiles, pauses.
-- Each user has one profile (1:1 with auth.users). Profiles optionally belong to a company.
-- Pauses are owned by a profile. RLS lives in 0002.

create extension if not exists pgcrypto with schema extensions;

-- ───────── companies ─────────
create table public.companies (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  domain            text not null unique,
  plan_status       text not null default 'trial'
    check (plan_status in ('trial', 'active', 'cap_full', 'inactive')),
  hr_admin_email    text,
  employee_count    integer not null default 0,
  employee_cap      integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index companies_domain_idx on public.companies (domain);

-- ───────── profiles ─────────
create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  email               text not null,
  company_id          uuid references public.companies (id) on delete set null,
  role                text not null default 'employee'
    check (role in ('employee', 'hr_admin')),
  hobbies             text[] not null default '{}',
  default_context     text,
  push_token          text,
  calendar_token      bytea,
  streak_count        integer not null default 0,
  last_pause_at       timestamptz,
  trial_ends_at       timestamptz,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired', 'company')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index profiles_company_id_idx on public.profiles (company_id);

-- ───────── pauses ─────────
create table public.pauses (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  duration_minutes    integer not null check (duration_minutes in (5, 10, 15)),
  trigger_type        text not null
    check (trigger_type in ('calendar_gap', 'pomodoro', 'manual', 'surprise_monthly')),
  mechanism_variant   text
    check (mechanism_variant in ('mystery', 'challenge', 'micro_skill', 'reflection', 'energy')),
  activity_emoji      text,
  activity_title      text,
  activity_motivation text,
  status              text not null default 'pending'
    check (status in ('pending', 'started', 'completed', 'skipped')),
  feeling_rating      smallint check (feeling_rating between 1 and 3),
  started_at          timestamptz,
  completed_at        timestamptz,
  created_at          timestamptz not null default now()
);

create index pauses_user_id_created_at_idx on public.pauses (user_id, created_at desc);
create index pauses_user_id_completed_at_idx on public.pauses (user_id, completed_at desc)
  where completed_at is not null;

-- ───────── updated_at triggers ─────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ───────── auto-create profile on auth signup ─────────
-- Runs on every new auth.users row. Domain match against companies happens
-- separately in the domain-router Edge Function (story #4); here we just mirror.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
