-- =============================================
-- Islamic Charity Center (ICC) - Database Schema
-- Supabase PostgreSQL with RLS
-- =============================================

-- ===== Custom Types =====
CREATE TYPE user_role AS ENUM ('admin', 'student', 'alumni');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE donation_category AS ENUM ('zakat', 'sadaqah', 'fitrah', 'general');
CREATE TYPE program_category AS ENUM ('education', 'relief', 'youth', 'quran');

-- ===== Profiles =====
CREATE TABLE profiles (
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
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category program_category NOT NULL DEFAULT 'education',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Events =====
CREATE TABLE events (
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
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  priority announcement_priority DEFAULT 'low',
  target_role TEXT DEFAULT 'all', -- 'all', 'student', 'alumni', 'admin'
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Donations =====
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category donation_category DEFAULT 'general',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Gallery =====
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  description TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Courses =====
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL,
  schedule TEXT,
  materials_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Course Enrollments =====
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ===== Alumni Updates =====
CREATE TABLE alumni_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile on user signup
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_updates ENABLE ROW LEVEL SECURITY;

-- ===== Helper function: get user role =====
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ===== Profiles Policies =====
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Programs Policies =====
CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage programs"
  ON programs FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Events Policies =====
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Announcements Policies =====
CREATE POLICY "Users can view published announcements for their role"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    is_published = true AND
    (target_role = 'all' OR target_role = get_user_role()::text)
  );

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Donations Policies =====
CREATE POLICY "Anyone can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Gallery Policies =====
CREATE POLICY "Anyone can view gallery"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON gallery_items FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Courses Policies =====
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Course Enrollments Policies =====
CREATE POLICY "Students can view own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll themselves"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage enrollments"
  ON course_enrollments FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- ===== Alumni Updates Policies =====
CREATE POLICY "Alumni and admins can view updates"
  ON alumni_updates FOR SELECT
  TO authenticated
  USING (get_user_role() IN ('alumni', 'admin'));

CREATE POLICY "Alumni can post updates"
  ON alumni_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    get_user_role() = 'alumni'
  );

CREATE POLICY "Authors can edit own updates"
  ON alumni_updates FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all updates"
  ON alumni_updates FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin');

-- =============================================
-- STORAGE BUCKETS (run in Supabase Dashboard)
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
-- CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
-- CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery-images' AND get_user_role() = 'admin');
-- CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
