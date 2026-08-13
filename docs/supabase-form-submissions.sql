-- Histórico de los formularios de la web (eventos, contacto, reclamaciones).
-- Ejecutar una sola vez en Supabase → SQL Editor.

create table if not exists public.form_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  form        text not null,           -- eventos | contacto | reclamaciones
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  lang        text,
  email_sent  boolean not null default false,
  meta        jsonb not null default '{}'::jsonb
);

-- Consultas habituales: últimas solicitudes y filtro por formulario
create index if not exists form_submissions_created_at_idx
  on public.form_submissions (created_at desc);
create index if not exists form_submissions_form_idx
  on public.form_submissions (form);

-- Sin políticas: nadie puede leer ni escribir con la clave publishable.
-- El servidor usa la secret key (sb_secret_…), que se salta RLS.
alter table public.form_submissions enable row level security;
