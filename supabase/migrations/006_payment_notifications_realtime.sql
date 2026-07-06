-- Payment tracking, pending orders, realtime, secure download RPC metadata

alter table public.service_requests
  add column if not exists payment_reference text unique,
  add column if not exists payment_status text not null default 'paid'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  add column if not exists paid_at timestamptz;

alter table public.service_requests
  drop constraint if exists service_requests_status_check;

alter table public.service_requests
  add constraint service_requests_status_check
  check (status in (
    'pending_payment', 'submitted', 'processing', 'approved',
    'ready', 'published', 'cancelled'
  ));

-- Enable realtime for admin dashboard (idempotent)
do $$ begin
  alter publication supabase_realtime add table public.service_requests;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.notification_logs;
exception when duplicate_object then null; end $$;

-- Only expose paid, non-cancelled requests to public tracking
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
    'downloadAvailable', r.download_available and r.payment_status = 'paid',
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
  where upper(r.redemption_code) = upper(p_code)
    and r.payment_status = 'paid'
    and r.status not in ('pending_payment', 'cancelled');

  return result;
end;
$$;

-- Metadata lookup for secure download edge function (service role only via RPC grant)
create or replace function public.get_download_request(p_code text)
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
    'documentUrl', r.document_url,
    'downloadAvailable', r.download_available,
    'paymentStatus', r.payment_status,
    'status', r.status,
    'expiresAt', r.expires_at
  ) into result
  from public.service_requests r
  where upper(r.redemption_code) = upper(p_code)
    and r.payment_status = 'paid'
    and r.status in ('approved', 'published', 'ready');

  return result;
end;
$$;

revoke all on function public.get_download_request(text) from public;
grant execute on function public.get_download_request(text) to service_role;
