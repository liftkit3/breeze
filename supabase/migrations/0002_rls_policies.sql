-- RLS for companies, profiles, pauses.
-- Three access cases tested in supabase/tests/rls.test.sql:
--   own          – user accesses their own row → allow
--   company-mate – hr_admin accesses an employee row in same company → allow
--                  regular employee accesses another employee's row → deny
--   foreign      – any user accesses a row from a different company → deny

-- ───────── helpers ─────────
-- SECURITY DEFINER so policies that filter by "the caller's company" don't
-- recurse into profiles' own RLS. Both functions read only the caller's profile.
create or replace function public.auth_user_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid();
$$;

create or replace function public.auth_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.auth_user_company_id() from public;
revoke all on function public.auth_user_role() from public;
grant execute on function public.auth_user_company_id() to authenticated;
grant execute on function public.auth_user_role() to authenticated;

-- ───────── enable RLS ─────────
alter table public.companies enable row level security;
alter table public.profiles  enable row level security;
alter table public.pauses    enable row level security;

-- ───────── companies ─────────
-- Members of a company can read their company's row.
-- Only hr_admins can update it. Insert/delete is service_role only.
create policy companies_select_own
  on public.companies for select to authenticated
  using (id = public.auth_user_company_id());

create policy companies_update_hr_admin
  on public.companies for update to authenticated
  using (id = public.auth_user_company_id() and public.auth_user_role() = 'hr_admin')
  with check (id = public.auth_user_company_id() and public.auth_user_role() = 'hr_admin');

-- ───────── profiles ─────────
-- Users see their own profile. HR admins additionally see profiles in their company.
create policy profiles_select_own_or_company_admin
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or (
      public.auth_user_role() = 'hr_admin'
      and company_id is not null
      and company_id = public.auth_user_company_id()
    )
  );

-- Users can only update their own profile.
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Insert is normally done by the on_auth_user_created trigger (SECURITY DEFINER,
-- bypasses RLS). This policy is a defensive backstop for clients that insert
-- their own profile row manually — they can only create their own.
create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

-- ───────── pauses ─────────
-- Users CRUD their own pauses. HR admins can read pauses of any employee in
-- their company (for the M3 dashboard metrics). HR admins do NOT write.
create policy pauses_select_own_or_company_admin
  on public.pauses for select to authenticated
  using (
    user_id = auth.uid()
    or (
      public.auth_user_role() = 'hr_admin'
      and exists (
        select 1 from public.profiles p
        where p.id = pauses.user_id
          and p.company_id is not null
          and p.company_id = public.auth_user_company_id()
      )
    )
  );

create policy pauses_insert_own
  on public.pauses for insert to authenticated
  with check (user_id = auth.uid());

create policy pauses_update_own
  on public.pauses for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy pauses_delete_own
  on public.pauses for delete to authenticated
  using (user_id = auth.uid());
