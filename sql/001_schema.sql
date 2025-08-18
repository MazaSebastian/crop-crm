-- Idempotent schema for Crop CRM (v1)

-- CROPS
create table if not exists crops (
  id text primary key,
  name text not null,
  location text,
  start_date text,
  photo_url text,
  partners jsonb,
  status text default 'active',
  created_at timestamptz default now()
);
alter table crops enable row level security;
drop policy if exists public_read on crops;
create policy public_read on crops for select using (true);
drop policy if exists public_insert on crops;
create policy public_insert on crops for insert with check (true);
drop policy if exists public_update on crops;
create policy public_update on crops for update using (true) with check (true);

-- ANNOUNCEMENTS
create table if not exists announcements (
  id text primary key,
  message text,
  type text,
  created_by text,
  created_at timestamptz default now()
);
alter table announcements enable row level security;
drop policy if exists public_read on announcements;
create policy public_read on announcements for select using (true);
drop policy if exists public_insert on announcements;
create policy public_insert on announcements for insert with check (true);
drop policy if exists public_delete on announcements;
create policy public_delete on announcements for delete using (true);

-- DAILY RECORDS
create table if not exists daily_records (
  id text primary key,
  crop_id text,
  date text,
  params jsonb,
  notes text,
  photos jsonb,
  created_by text,
  created_at timestamptz default now()
);
alter table daily_records enable row level security;
drop policy if exists public_read on daily_records;
create policy public_read on daily_records for select using (true);
drop policy if exists public_insert on daily_records;
create policy public_insert on daily_records for insert with check (true);
drop policy if exists public_delete on daily_records;
create policy public_delete on daily_records for delete using (true);

-- PLANNED EVENTS
create table if not exists planned_events (
  id text primary key,
  crop_id text,
  date text,
  title text,
  type text,
  status text,
  created_at timestamptz default now()
);
alter table planned_events enable row level security;
drop policy if exists public_read on planned_events;
create policy public_read on planned_events for select using (true);
drop policy if exists public_insert on planned_events;
create policy public_insert on planned_events for insert with check (true);
drop policy if exists public_delete on planned_events;
create policy public_delete on planned_events for delete using (true);

-- ACTIVITIES
create table if not exists activities (
  id text primary key,
  crop_id text,
  type text,
  title text,
  details text,
  date text,
  created_at timestamptz default now()
);
alter table activities enable row level security;
drop policy if exists public_read on activities;
create policy public_read on activities for select using (true);
drop policy if exists public_insert on activities;
create policy public_insert on activities for insert with check (true);

-- TASKS
create table if not exists tasks (
  id text primary key,
  crop_id text,
  title text,
  description text,
  assigned_to text,
  status text default 'pending',
  priority text default 'medium',
  due_date text,
  created_at timestamptz default now(),
  created_by text,
  completed_at timestamptz
);
alter table tasks enable row level security;
drop policy if exists public_read on tasks;
create policy public_read on tasks for select using (true);
drop policy if exists public_insert on tasks;
create policy public_insert on tasks for insert with check (true);
drop policy if exists public_update on tasks;
create policy public_update on tasks for update using (true) with check (true);

-- CASH MOVEMENTS
create table if not exists cash_movements (
  id text primary key,
  type text,
  concept text,
  amount numeric,
  date text,
  owner text,
  created_at timestamptz default now()
);
alter table cash_movements enable row level security;
drop policy if exists public_read on cash_movements;
create policy public_read on cash_movements for select using (true);
drop policy if exists public_insert on cash_movements;
create policy public_insert on cash_movements for insert with check (true);

-- STOCK ITEMS
create table if not exists stock_items (
  id text primary key,
  name text,
  qty int,
  unit text,
  created_at timestamptz default now()
);
alter table stock_items enable row level security;
drop policy if exists public_read on stock_items;
create policy public_read on stock_items for select using (true);
drop policy if exists public_insert on stock_items;
create policy public_insert on stock_items for insert with check (true);
drop policy if exists public_update on stock_items;
create policy public_update on stock_items for update using (true) with check (true);
drop policy if exists public_delete on stock_items;
create policy public_delete on stock_items for delete using (true);

-- NOTIF LAST SEEN por usuario
create table if not exists notif_last_seen (
  user_id text not null,
  crop_id text not null,
  last_seen timestamptz not null default now(),
  primary key (user_id, crop_id)
);
alter table notif_last_seen enable row level security;
drop policy if exists public_read on notif_last_seen;
create policy public_read on notif_last_seen for select using (true);
drop policy if exists public_upsert on notif_last_seen;
create policy public_upsert on notif_last_seen for insert with check (true);
drop policy if exists public_update on notif_last_seen;
create policy public_update on notif_last_seen for update using (true) with check (true);

-- Realtime publication
do $$
begin
  perform 1 from pg_publication where pubname='supabase_realtime';
  if not found then execute 'create publication supabase_realtime for all tables'; end if;

  foreach t in array array['crops','announcements','daily_records','planned_events','activities','tasks','cash_movements','stock_items','notif_last_seen']
  loop
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and tablename=t) then
      execute format('alter publication supabase_realtime add table %I', t);
    end if;
  end loop;
end $$;


