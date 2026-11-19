-- Migration 0002: Content Management System (CMS) & Faculty Staff
-- Enables dynamic, back-office editing for all important sections of the website.

-- 1. site_content table
CREATE TABLE IF NOT EXISTS site_content (
    section_key TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. faculty_staff table
CREATE TABLE IF NOT EXISTS faculty_staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    cadre TEXT NOT NULL CHECK (cadre IN ('professor', 'lecturer', 'technologist')),
    category_label TEXT,
    qualifications TEXT[] DEFAULT '{}',
    specialization TEXT,
    focus_area TEXT DEFAULT 'general',
    email TEXT,
    office TEXT,
    biography TEXT,
    photo_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_staff ENABLE ROW LEVEL SECURITY;

-- POLICIES for site_content
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

-- POLICIES for faculty_staff
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
