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


CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'::user_role
  );
$$;

CREATE OR REPLACE FUNCTION prevent_non_admin_comment_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'You cannot change comment owner';
    END IF;
    IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
      RAISE EXCEPTION 'You cannot move comment to another post';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_non_admin_dojang_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.dojang_status IS DISTINCT FROM OLD.dojang_status THEN
      RAISE EXCEPTION 'You cannot change dojang status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_non_admin_post_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'You cannot change post status';
    END IF;
    IF NEW.report_count IS DISTINCT FROM OLD.report_count THEN
      RAISE EXCEPTION 'You cannot change report count';
    END IF;
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
      IF auth.uid() != OLD.user_id THEN
        RAISE EXCEPTION 'You cannot delete posts directly';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_non_admin_profile_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'You cannot change your role';
    END IF;
    IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
      RAISE EXCEPTION 'You cannot change account status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_report_process()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.reports_status IS DISTINCT FROM 'pending'::reports_status THEN
      RAISE EXCEPTION 'You cannot set report status';
    END IF;
    IF NEW.handled_at IS NOT NULL THEN
      RAISE EXCEPTION 'You cannot set handled_at';
    END IF;
    IF NEW.action_type IS NOT NULL THEN
      RAISE EXCEPTION 'You cannot set action_type';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;