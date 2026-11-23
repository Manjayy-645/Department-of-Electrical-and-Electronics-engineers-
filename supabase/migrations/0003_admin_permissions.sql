-- Migration 0003: Universal Admin Permissions & Full CMS Read/Write Power
-- Guarantees every back-office administrator has complete read and write power across all CMS content, faculty staff, and back-office tables.

-- 1. Support all admin roles by altering admin_roles.role to TEXT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_roles' AND column_name = 'role'
  ) THEN
    ALTER TABLE admin_roles ALTER COLUMN role TYPE TEXT USING role::TEXT;
    ALTER TABLE admin_roles ALTER COLUMN role SET DEFAULT 'admin';
  END IF;
END $$;

-- 2. Add extra metadata columns to admin_roles if not already present
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT ARRAY['read', 'write', 'cms_edit', 'staff_edit', 'audit'];
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS can_edit_cms BOOLEAN DEFAULT true;

-- 3. Update public.is_admin() to recognize any admin role:
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    -- Any registered admin in the admin_roles table has admin power
    EXISTS (
      SELECT 1 FROM admin_roles WHERE admin_roles.user_id = auth.uid()
    )
    -- Any user whose JWT user_metadata contains an admin role
    OR (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE ANY (ARRAY['%admin%', '%editor%', '%technical_director%', '%pro%', '%staff%', '%hod%'])
    -- Any user whose JWT app_metadata contains an admin role
    OR (auth.jwt() -> 'app_metadata' ->> 'role') ILIKE ANY (ARRAY['%admin%', '%editor%', '%technical_director%', '%pro%', '%staff%', '%hod%'])
    -- Any user with claims_admin
    OR (auth.jwt() -> 'app_metadata' ->> 'claims_admin')::boolean = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable full read, insert, update, delete for ALL admins on admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own admin role" ON admin_roles;
DROP POLICY IF EXISTS "Admins can view all admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Admins can insert admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Admins can update admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Admins can delete admin roles" ON admin_roles;

CREATE POLICY "Admins can view all admin roles"
    ON admin_roles FOR SELECT
    USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can insert admin roles"
    ON admin_roles FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update admin roles"
    ON admin_roles FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete admin roles"
    ON admin_roles FOR DELETE
    USING (public.is_admin());

-- 5. Guarantee site_content read and write policies for all admins
DROP POLICY IF EXISTS "Public read access for site_content" ON site_content;
DROP POLICY IF EXISTS "Admins can insert site_content" ON site_content;
DROP POLICY IF EXISTS "Admins can update site_content" ON site_content;
DROP POLICY IF EXISTS "Admins can delete site_content" ON site_content;

CREATE POLICY "Public read access for site_content"
    ON site_content FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert site_content"
    ON site_content FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update site_content"
    ON site_content FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete site_content"
    ON site_content FOR DELETE
    USING (public.is_admin());

-- 6. Guarantee faculty_staff read and write policies for all admins
DROP POLICY IF EXISTS "Public read access for faculty_staff" ON faculty_staff;
DROP POLICY IF EXISTS "Admins can insert faculty_staff" ON faculty_staff;
DROP POLICY IF EXISTS "Admins can update faculty_staff" ON faculty_staff;
DROP POLICY IF EXISTS "Admins can delete faculty_staff" ON faculty_staff;

CREATE POLICY "Public read access for faculty_staff"
    ON faculty_staff FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert faculty_staff"
    ON faculty_staff FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update faculty_staff"
    ON faculty_staff FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete faculty_staff"
    ON faculty_staff FOR DELETE
    USING (public.is_admin());
