-- =============================================
-- Islamic Charity Center (ICC) - Complete Database Schema
-- Supabase PostgreSQL RLS, Storage Buckets & Grants
-- =============================================

-- ===== Custom Types & Enums =====
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'student', 'alumni');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_category AS ENUM ('zakat', 'sadaqah', 'fitrah', 'general');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE program_category AS ENUM ('education', 'relief', 'youth', 'quran');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ===== User Profiles =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  graduation_year INT,
  batch TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Programs =====
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category program_category NOT NULL DEFAULT 'education',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Events =====
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  max_attendees INT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Announcements =====
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  priority announcement_priority DEFAULT 'low',
  target_role TEXT DEFAULT 'all',
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Donations =====
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category donation_category DEFAULT 'general',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Gallery =====
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Events',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Courses =====
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL,
  schedule TEXT,
  materials_url TEXT,
  progress INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Testimonials =====
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Event Registrations / RSVPs =====
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Contact Messages =====
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Alumni Updates =====
CREATE TABLE IF NOT EXISTS alumni_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUPABASE STORAGE BUCKETS SETUP
-- =============================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (true);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_updates ENABLE ROW LEVEL SECURITY;

-- Permissive policies for client CRUD operations
DROP POLICY IF EXISTS "Allow all profiles" ON profiles;
CREATE POLICY "Allow all profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all programs" ON programs;
CREATE POLICY "Allow all programs" ON programs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all events" ON events;
CREATE POLICY "Allow all events" ON events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all announcements" ON announcements;
CREATE POLICY "Allow all announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all donations" ON donations;
CREATE POLICY "Allow all donations" ON donations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all gallery_items" ON gallery_items;
CREATE POLICY "Allow all gallery_items" ON gallery_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all courses" ON courses;
CREATE POLICY "Allow all courses" ON courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all testimonials" ON testimonials;
CREATE POLICY "Allow all testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all event_registrations" ON event_registrations;
CREATE POLICY "Allow all event_registrations" ON event_registrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all contact_messages" ON contact_messages;
CREATE POLICY "Allow all contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all alumni_updates" ON alumni_updates;
CREATE POLICY "Allow all alumni_updates" ON alumni_updates FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SEED DATA INSERTS
-- =============================================

INSERT INTO programs (title, description, category, is_active) VALUES
  ('Quranic Studies', 'Comprehensive Quran memorization and Tajweed classes for all ages with certified scholars.', 'quran', true),
  ('Youth Leadership', 'Empowering young Muslims with leadership skills, Islamic values, and community service.', 'youth', true),
  ('Community Relief', 'Emergency aid, food distribution, and housing support for families in need.', 'relief', true),
  ('Islamic Education', 'Weekend Islamic school covering Fiqh, Seerah, Arabic language, and Islamic history.', 'education', true)
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, instructor, schedule, progress) VALUES
  ('Tajweed Fundamentals', 'Master the rules of Quran recitation with proper pronunciation.', 'Sheikh Ahmad', 'Mon & Wed, 6–7 PM', 65),
  ('Arabic Language I', 'Beginner Arabic covering reading, writing, and basic conversation.', 'Ustadha Noor', 'Tue & Thu, 5–6 PM', 40),
  ('Islamic History', 'Journey through the golden age of Islam and key historical events.', 'Dr. Yusuf Ali', 'Saturday, 10–12 PM', 80),
  ('Fiqh of Worship', 'Understanding the rulings of prayer, fasting, zakat and hajj.', 'Mufti Bilal', 'Sunday, 2–4 PM', 25)
ON CONFLICT DO NOTHING;
