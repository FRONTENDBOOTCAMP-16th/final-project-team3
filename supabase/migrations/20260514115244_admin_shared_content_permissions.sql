create policy "admins can update admin authored posts"
on public.posts
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
  and exists (
    select 1
    from public.profiles author_profile
    where author_profile.id = posts.user_id
      and author_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
  and exists (
    select 1
    from public.profiles author_profile
    where author_profile.id = posts.user_id
      and author_profile.role = 'admin'
  )
);

create policy "admins can update admin authored competitions"
on public.competition
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
  and exists (
    select 1
    from public.profiles author_profile
    where author_profile.id = competition.user_id
      and author_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
  and exists (
    select 1
    from public.profiles author_profile
    where author_profile.id = competition.user_id
      and author_profile.role = 'admin'
  )
);
