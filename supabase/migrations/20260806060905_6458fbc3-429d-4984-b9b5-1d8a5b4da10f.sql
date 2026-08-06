CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('owner','admin','therapist','content_manager'));
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;

CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'owner') OR private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'owner') OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff view all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()));

CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'owner') OR private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'owner') OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'owner') OR private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);