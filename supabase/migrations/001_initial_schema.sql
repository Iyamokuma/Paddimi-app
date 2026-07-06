-- Paddimi Multi Concepts — initial schema
-- Run this in Supabase Dashboard → SQL Editor

-- ─── Extensions ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Profiles (admin / staff) ─────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Service requests ─────────────────────────────────────────
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  redemption_code text not null unique,
  category text not null check (category in ('affidavit', 'newspaper')),
  service_id text not null,
  service_name text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'processing', 'ready', 'published', 'cancelled')),
  contact_phone text not null,
  contact_email text,
  referral_code text,
  form_data jsonb not null default '{}',
  payment_method text,
  amount_paid integer not null default 0,
  document_url text,
  download_available boolean not null default false,
  expires_at timestamptz not null,
  submitted_at timestamptz not null default now(),
  estimated_ready_at timestamptz,
  ready_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_requests_code on public.service_requests (upper(redemption_code));
create index if not exists idx_service_requests_status on public.service_requests (status);
create index if not exists idx_service_requests_category on public.service_requests (category);
create index if not exists idx_service_requests_submitted on public.service_requests (submitted_at desc);

alter table public.service_requests enable row level security;

-- Public can submit new requests
create policy "Anyone can create requests"
  on public.service_requests for insert
  to anon, authenticated
  with check (true);

-- Admins/staff full access
create policy "Admins can view all requests"
  on public.service_requests for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

create policy "Admins can update requests"
  on public.service_requests for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

-- ─── Timeline ─────────────────────────────────────────────────
create table if not exists public.request_timeline (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  status text not null,
  label text not null,
  event_date timestamptz not null default now(),
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_timeline_request on public.request_timeline (request_id);

alter table public.request_timeline enable row level security;

create policy "Anyone can insert timeline on create"
  on public.request_timeline for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view timeline"
  on public.request_timeline for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

create policy "Admins can manage timeline"
  on public.request_timeline for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

-- ─── Customer uploads metadata ────────────────────────────────
create table if not exists public.request_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  field_id text not null,
  field_label text,
  storage_path text not null,
  file_name text,
  mime_type text,
  created_at timestamptz not null default now()
);

alter table public.request_documents enable row level security;

create policy "Anyone can insert document records"
  on public.request_documents for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view documents"
  on public.request_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

-- ─── Notification log ─────────────────────────────────────────
create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id) on delete set null,
  channel text not null check (channel in ('sms', 'email')),
  recipient text not null,
  notification_type text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.notification_logs enable row level security;

create policy "Admins can view notifications"
  on public.notification_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

create policy "Admins can insert notifications"
  on public.notification_logs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

-- ─── Public RPC: track by redemption code ─────────────────────
create or replace function public.get_request_by_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'id', r.id,
    'code', r.redemption_code,
    'serviceName', r.service_name,
    'category', r.category,
    'status', r.status,
    'submittedAt', r.submitted_at,
    'estimatedReady', coalesce(r.estimated_ready_at, r.submitted_at),
    'expiresAt', r.expires_at,
    'downloadAvailable', r.download_available,
    'customerName', coalesce(
      r.form_data->>'firstName', ''
    ) || case when r.form_data->>'middleName' is not null then ' ' || (r.form_data->>'middleName') else '' end
    || case when r.form_data->>'lastName' is not null then ' ' || (r.form_data->>'lastName') else '' end,
    'timeline', (
      select coalesce(json_agg(
        json_build_object(
          'status', t.status,
          'label', t.label,
          'date', to_char(t.event_date at time zone 'UTC', 'Mon DD, YYYY · HH12:MI AM'),
          'completed', t.completed
        ) order by t.created_at
      ), '[]'::json)
      from public.request_timeline t
      where t.request_id = r.id
    )
  ) into result
  from public.service_requests r
  where upper(r.redemption_code) = upper(p_code);

  return result;
end;
$$;

grant execute on function public.get_request_by_code(text) to anon, authenticated;

-- ─── Updated_at trigger ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_requests_updated_at on public.service_requests;
create trigger service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

-- ─── Storage buckets (run in Storage UI or via SQL) ─────────────
-- insert into storage.buckets (id, name, public) values ('customer-uploads', 'customer-uploads', false);
-- insert into storage.buckets (id, name, public) values ('completed-documents', 'completed-documents', false);
