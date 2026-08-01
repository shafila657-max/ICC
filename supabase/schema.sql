-- =============================================
-- Islamic Charity Center (ICC) - PostgreSQL Database Schema
-- Supabase RLS Policies & Triggers
-- =============================================

-- ===== Custom Types & Enums =====
CREATE TYPE user_role AS ENUM ('admin', 'student', 'alumni');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE donation_category AS ENUM ('zakat', 'sadaqah', 'fitrah', 'general');
CREATE TYPE program_category AS ENUM ('education', 'relief', 'youth', 'quran');

-- ===== User Profiles =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Announcements =====
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  priority announcement_priority DEFAULT 'low',
  target_role TEXT DEFAULT 'all', -- 'all', 'student', 'alumni', 'admin'
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id),
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
-- TRIGGERS & AUTOMATION
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

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

-- Public READ Policies
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);

-- Public INSERT Policies (Forms & Registrations)
CREATE POLICY "Public insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert event_registrations" ON event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin CRUD Policies
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Admin manage programs" ON programs FOR ALL USING (is_admin());
CREATE POLICY "Admin manage events" ON events FOR ALL USING (is_admin());
CREATE POLICY "Admin manage announcements" ON announcements FOR ALL USING (is_admin());
CREATE POLICY "Admin manage gallery_items" ON gallery_items FOR ALL USING (is_admin());
CREATE POLICY "Admin manage courses" ON courses FOR ALL USING (is_admin());
CREATE POLICY "Admin view donations" ON donations FOR SELECT USING (is_admin());
CREATE POLICY "Admin view contact_messages" ON contact_messages FOR SELECT USING (is_admin());

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
