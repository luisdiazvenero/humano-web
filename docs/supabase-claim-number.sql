-- Correlativo del libro de reclamaciones (exigido por Indecopi).
-- Ejecutar una vez en Supabase → SQL Editor, después de crear form_submissions.

create sequence if not exists public.claim_number_seq;

alter table public.form_submissions
  add column if not exists claim_number integer;

-- Un número no puede repetirse; el resto de formularios lo dejan en null
create unique index if not exists form_submissions_claim_number_idx
  on public.form_submissions (claim_number)
  where claim_number is not null;

-- El número lo asigna la base de datos, no la aplicación: así no puede
-- duplicarse aunque lleguen dos reclamaciones a la vez.
create or replace function public.set_claim_number()
returns trigger
language plpgsql
as $$
begin
  if new.form = 'reclamaciones' and new.claim_number is null then
    new.claim_number := nextval('public.claim_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists set_claim_number_trigger on public.form_submissions;
create trigger set_claim_number_trigger
  before insert on public.form_submissions
  for each row execute function public.set_claim_number();
