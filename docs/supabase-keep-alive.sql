-- Latido diario para que Supabase no pause el proyecto (plan gratuito).
-- La tarea /api/cron/keep-alive escribe aquí una vez al día: una escritura
-- cuenta como actividad de base de datos con más claridad que una lectura.
-- Ejecutar una sola vez en Supabase → SQL Editor.

create table if not exists public.keep_alive (
  id         integer primary key,
  pinged_at  timestamptz not null default now()
);

-- Sin políticas: solo el servidor (secret key) puede leer o escribir.
alter table public.keep_alive enable row level security;
