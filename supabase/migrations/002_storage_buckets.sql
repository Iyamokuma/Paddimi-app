-- Storage buckets for customer uploads and completed documents
insert into storage.buckets (id, name, public)
values ('customer-uploads', 'customer-uploads', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('completed-documents', 'completed-documents', false)
on conflict (id) do nothing;

-- Allow public uploads to customer-uploads
create policy "Anyone can upload customer files"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'customer-uploads');

-- Admins read customer uploads
create policy "Admins read customer uploads"
on storage.objects for select
to authenticated
using (
  bucket_id = 'customer-uploads'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
);

-- Admins upload completed documents
create policy "Admins upload completed docs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'completed-documents'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
);

-- Admins read completed documents
create policy "Admins read completed docs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'completed-documents'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
);

-- Admins update completed documents (replace files)
create policy "Admins update completed docs"
on storage.objects for update
to authenticated
using (
  bucket_id = 'completed-documents'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
);
