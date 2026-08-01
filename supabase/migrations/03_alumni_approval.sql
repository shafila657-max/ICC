-- =============================================
-- Migration 03: Alumni Approval & Community Updates
-- Run this script to add registration approval status & alumni updates feed
-- =============================================

-- Add approval status column to profiles
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS job_title TEXT DEFAULT '';

-- Ensure default status for new registrations is pending if inactive
UPDATE profiles SET status = 'approved' WHERE is_active = true AND status IS NULL;
UPDATE profiles SET status = 'pending' WHERE is_active = false AND status IS NULL;

-- Table for Alumni Community Feed & Discussion Updates
CREATE TABLE IF NOT EXISTS alumni_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for alumni_updates
ALTER TABLE alumni_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all alumni_updates" ON alumni_updates;
CREATE POLICY "Allow all alumni_updates" ON alumni_updates FOR ALL USING (true) WITH CHECK (true);
