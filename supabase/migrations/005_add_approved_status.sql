-- Add 'approved' status and migrate existing 'ready' rows

alter table public.service_requests
  drop constraint if exists service_requests_status_check;

alter table public.service_requests
  add constraint service_requests_status_check
  check (status in ('submitted', 'processing', 'approved', 'ready', 'published', 'cancelled'));

update public.service_requests
set status = 'approved'
where status = 'ready';

update public.request_timeline
set status = 'approved', label = 'Approved — Ready for Download'
where status = 'ready';
