-- =============================================
-- Migration 03: Alumni Approval & Community Updates
-- Run this script to add registration approval status & alumni updates feed
-- =============================================

-- 1. Add approval status columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS job_title TEXT DEFAULT '';

-- 2. Ensure default status for existing profiles
UPDATE profiles SET status = 'approved' WHERE is_active = true AND (status IS NULL OR status = '');
UPDATE profiles SET status = 'pending' WHERE is_active = false AND (status IS NULL OR status = '');

-- 3. Table for Alumni Community Feed & Discussion Updates
CREATE TABLE IF NOT EXISTS alumni_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS for alumni_updates
ALTER TABLE alumni_updates ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policy if present to avoid 42710 duplicate policy errors
DROP POLICY IF EXISTS "Allow all alumni_updates" ON alumni_updates;
CREATE POLICY "Allow all alumni_updates" ON alumni_updates FOR ALL USING (true) WITH CHECK (true);
