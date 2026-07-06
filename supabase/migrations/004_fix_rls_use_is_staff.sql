-- Replace recursive profiles subqueries in RLS with is_staff()

drop policy if exists "Admins can view all requests" on public.service_requests;
create policy "Admins can view all requests"
  on public.service_requests for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can update requests" on public.service_requests;
create policy "Admins can update requests"
  on public.service_requests for update
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can view timeline" on public.request_timeline;
create policy "Admins can view timeline"
  on public.request_timeline for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can manage timeline" on public.request_timeline;
create policy "Admins can manage timeline"
  on public.request_timeline for all
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can view documents" on public.request_documents;
create policy "Admins can view documents"
  on public.request_documents for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can view notifications" on public.notification_logs;
create policy "Admins can view notifications"
  on public.notification_logs for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Admins can insert notifications" on public.notification_logs;
create policy "Admins can insert notifications"
  on public.notification_logs for insert
  to authenticated
  with check (public.is_staff());
