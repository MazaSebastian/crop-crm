-- Hardening v2: defaults UUID, created_at, NOT NULLs e índices
-- Seguro de re-ejecutar (idempotente donde es posible)

-- 1) Extensión para UUIDs
create extension if not exists pgcrypto;

-- 2) Defaults y not null en tablas clave
do $$
declare t text; begin
  -- Tablas con id text -> mantener, pero si faltan defaults de created_at los agregamos
  -- (si migrás a uuid en el futuro, hacé un 003 separado)
  -- created_at default now()
  for t in select unnest(array['crops','announcements','daily_records','planned_events','activities','tasks','cash_movements','stock_items']) loop
    execute format('alter table %I alter column created_at set default now()', t);
  end loop;

  -- owner_id not null (si ya estás usando RLS por usuario)
  for t in select unnest(array['crops','announcements','daily_records','planned_events','activities','tasks','cash_movements','stock_items']) loop
    begin
      execute format('update %I set owner_id = auth.uid() where owner_id is null', t);
      execute format('alter table %I alter column owner_id set not null', t);
    exception when others then
      -- si no hay auth.uid() disponible en este contexto, ignorar; la política seguirá protegiendo
      null;
    end;
  end loop;
end $$;

-- 3) Índices recomendados
create index if not exists idx_daily_records_crop_created on daily_records(crop_id, created_at desc);
create index if not exists idx_planned_events_crop_created on planned_events(crop_id, created_at desc);
create index if not exists idx_activities_owner_created on activities(owner_id, created_at desc);
create index if not exists idx_tasks_crop_created on tasks(crop_id, created_at desc);
create index if not exists idx_cash_owner_created on cash_movements(owner_id, created_at desc);
create index if not exists idx_stock_owner_created on stock_items(owner_id, created_at desc);


