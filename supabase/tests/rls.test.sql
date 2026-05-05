-- RLS test for Breeze. Run against local supabase:
--   psql "postgresql://postgres:postgres@127.0.0.1:54422/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/rls.test.sql
--
-- Seeds 2 companies (Acme, Globex) and 4 users:
--   alice  – employee  @ Acme
--   bob    – employee  @ Acme
--   hr     – hr_admin  @ Acme
--   eve    – employee  @ Globex
-- Then asserts the 3 RLS cases. Any failed assertion raises and aborts the script.

\set ON_ERROR_STOP on

begin;

-- ───────── cleanup (idempotent) ─────────
delete from public.pauses
  where user_id in (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
delete from auth.users
  where id in (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
delete from public.companies
  where id in (
    '00000000-0000-0000-0000-00000000000a',
    '00000000-0000-0000-0000-00000000000b'
  );

-- ───────── seed ─────────
insert into public.companies (id, name, domain, plan_status) values
  ('00000000-0000-0000-0000-00000000000a', 'Acme',   'acme.test',   'active'),
  ('00000000-0000-0000-0000-00000000000b', 'Globex', 'globex.test', 'active');

-- Insert into auth.users — the on_auth_user_created trigger will create matching profiles.
insert into auth.users (id, instance_id, email, aud, role, raw_user_meta_data, raw_app_meta_data, created_at, updated_at) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'alice@acme.test',   'authenticated', 'authenticated', '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'bob@acme.test',     'authenticated', 'authenticated', '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'hr@acme.test',      'authenticated', 'authenticated', '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'eve@globex.test',   'authenticated', 'authenticated', '{}'::jsonb, '{}'::jsonb, now(), now());

update public.profiles set company_id = '00000000-0000-0000-0000-00000000000a'                         where id = '00000000-0000-0000-0000-000000000001';
update public.profiles set company_id = '00000000-0000-0000-0000-00000000000a'                         where id = '00000000-0000-0000-0000-000000000002';
update public.profiles set company_id = '00000000-0000-0000-0000-00000000000a', role = 'hr_admin'      where id = '00000000-0000-0000-0000-000000000003';
update public.profiles set company_id = '00000000-0000-0000-0000-00000000000b'                         where id = '00000000-0000-0000-0000-000000000004';

insert into public.pauses (user_id, duration_minutes, trigger_type, status) values
  ('00000000-0000-0000-0000-000000000001', 5,  'manual', 'completed'),
  ('00000000-0000-0000-0000-000000000002', 10, 'manual', 'completed'),
  ('00000000-0000-0000-0000-000000000004', 5,  'manual', 'completed');

commit;

-- ───────── helper: run a single check as a given user ─────────
-- Each scenario opens a transaction so `set local` is bounded.

-- ════════ CASE 1: own ════════
-- Each user can read their own profile, their own company row, and their own pauses.

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';

  do $$
  declare n int;
  begin
    select count(*) into n from public.profiles where id = '00000000-0000-0000-0000-000000000001';
    if n <> 1 then raise exception 'OWN/profile: alice should see her own profile, saw %', n; end if;

    select count(*) into n from public.companies where id = '00000000-0000-0000-0000-00000000000a';
    if n <> 1 then raise exception 'OWN/company: alice should see her own company, saw %', n; end if;

    select count(*) into n from public.pauses where user_id = '00000000-0000-0000-0000-000000000001';
    if n <> 1 then raise exception 'OWN/pauses: alice should see her own pauses, saw %', n; end if;

    raise notice 'OWN passed (alice)';
  end $$;
commit;

-- ════════ CASE 2: company-mate ════════
-- HR admin in Acme sees Acme employees + their pauses. Regular employees do NOT see each other.

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}';

  do $$
  declare n int;
  begin
    -- positive: hr admin sees all 3 acme profiles
    select count(*) into n from public.profiles where company_id = '00000000-0000-0000-0000-00000000000a';
    if n <> 3 then raise exception 'COMPANY-MATE/hr-profiles: hr should see 3 acme profiles, saw %', n; end if;

    -- positive: hr admin sees pauses of acme employees (alice + bob = 2)
    select count(*) into n from public.pauses where user_id in ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002');
    if n <> 2 then raise exception 'COMPANY-MATE/hr-pauses: hr should see 2 acme pauses, saw %', n; end if;

    -- negative: hr admin can update acme company row
    update public.companies set name = 'Acme Corp' where id = '00000000-0000-0000-0000-00000000000a';
    get diagnostics n = row_count;
    if n <> 1 then raise exception 'COMPANY-MATE/hr-update: hr should be able to update acme, updated %', n; end if;

    raise notice 'COMPANY-MATE/hr passed';
  end $$;
commit;

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';

  do $$
  declare n int;
  begin
    -- negative: alice (employee) cannot see bob's profile
    select count(*) into n from public.profiles where id = '00000000-0000-0000-0000-000000000002';
    if n <> 0 then raise exception 'COMPANY-MATE/employee-profile: alice should NOT see bob, saw %', n; end if;

    -- negative: alice cannot see bob's pauses
    select count(*) into n from public.pauses where user_id = '00000000-0000-0000-0000-000000000002';
    if n <> 0 then raise exception 'COMPANY-MATE/employee-pauses: alice should NOT see bob pauses, saw %', n; end if;

    -- negative: alice cannot update bob's profile
    update public.profiles set hobbies = '{hacked}' where id = '00000000-0000-0000-0000-000000000002';
    get diagnostics n = row_count;
    if n <> 0 then raise exception 'COMPANY-MATE/employee-update: alice should NOT update bob, updated %', n; end if;

    -- negative: alice cannot update her own company (not hr_admin)
    update public.companies set name = 'Hacked' where id = '00000000-0000-0000-0000-00000000000a';
    get diagnostics n = row_count;
    if n <> 0 then raise exception 'COMPANY-MATE/employee-company-update: alice should NOT update company, updated %', n; end if;

    raise notice 'COMPANY-MATE/employee passed';
  end $$;
commit;

-- ════════ CASE 3: foreign ════════
-- No user (employee or hr_admin) can read data from a different company.

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';

  do $$
  declare n int;
  begin
    select count(*) into n from public.profiles where id = '00000000-0000-0000-0000-000000000004';
    if n <> 0 then raise exception 'FOREIGN/employee-profile: alice should NOT see eve, saw %', n; end if;

    select count(*) into n from public.pauses where user_id = '00000000-0000-0000-0000-000000000004';
    if n <> 0 then raise exception 'FOREIGN/employee-pauses: alice should NOT see eve pauses, saw %', n; end if;

    select count(*) into n from public.companies where id = '00000000-0000-0000-0000-00000000000b';
    if n <> 0 then raise exception 'FOREIGN/employee-company: alice should NOT see globex, saw %', n; end if;

    raise notice 'FOREIGN/employee passed';
  end $$;
commit;

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}';

  do $$
  declare n int;
  begin
    -- hr admin of acme cannot see globex
    select count(*) into n from public.profiles where company_id = '00000000-0000-0000-0000-00000000000b';
    if n <> 0 then raise exception 'FOREIGN/hr-profile: acme hr should NOT see globex profiles, saw %', n; end if;

    select count(*) into n from public.pauses where user_id = '00000000-0000-0000-0000-000000000004';
    if n <> 0 then raise exception 'FOREIGN/hr-pauses: acme hr should NOT see eve pauses, saw %', n; end if;

    select count(*) into n from public.companies where id = '00000000-0000-0000-0000-00000000000b';
    if n <> 0 then raise exception 'FOREIGN/hr-company: acme hr should NOT see globex, saw %', n; end if;

    update public.companies set name = 'Hacked' where id = '00000000-0000-0000-0000-00000000000b';
    get diagnostics n = row_count;
    if n <> 0 then raise exception 'FOREIGN/hr-update: acme hr should NOT update globex, updated %', n; end if;

    raise notice 'FOREIGN/hr passed';
  end $$;
commit;

-- ════════ Bonus: write-side checks ════════
-- A user cannot insert a pause attributed to another user (RLS check on user_id).

begin;
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}';

  do $$
  declare ok boolean := false;
  begin
    begin
      insert into public.pauses (user_id, duration_minutes, trigger_type)
      values ('00000000-0000-0000-0000-000000000002', 5, 'manual');
    exception when others then
      ok := true;
    end;
    if not ok then raise exception 'WRITE/foreign-insert: alice should NOT insert pause for bob'; end if;

    raise notice 'WRITE-side passed';
  end $$;
commit;

-- ───────── teardown ─────────
begin;
delete from public.pauses
  where user_id in (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
delete from auth.users
  where id in (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
delete from public.companies
  where id in (
    '00000000-0000-0000-0000-00000000000a',
    '00000000-0000-0000-0000-00000000000b'
  );
commit;

\echo '✓ all RLS scenarios passed'
