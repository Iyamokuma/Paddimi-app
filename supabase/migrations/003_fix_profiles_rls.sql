-- Fix infinite recursion: "Admins can read all profiles" queried profiles inside a profiles policy

drop policy if exists "Admins can read all profiles" on public.profiles;

-- Security definer helper avoids RLS recursion for admin checks on other tables
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

grant execute on function public.is_staff() to authenticated;

-- Ensure profile exists for users created before trigger or if trigger missed
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'role', 'admin')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;
