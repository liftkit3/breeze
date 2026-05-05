-- Table-level privileges for the `authenticated` role.
--
-- Background: the project was created with "Automatically expose new tables"
-- disabled (we want explicit control). That setting normally fires an event
-- trigger that grants DML on every new table to anon + authenticated. Without
-- it, RLS policies are correctly evaluated only AFTER the role passes the
-- privilege check — so we have to grant the privilege ourselves.
--
-- Privileges mirror the RLS policies in 0002:
--   companies → select + update (insert/delete only via service_role)
--   profiles  → select + insert + update (no delete)
--   pauses    → all four
-- `anon` gets nothing: every table here is auth-gated.

grant select, update                  on table public.companies to authenticated;
grant select, insert, update          on table public.profiles  to authenticated;
grant select, insert, update, delete  on table public.pauses    to authenticated;
