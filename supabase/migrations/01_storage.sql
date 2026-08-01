-- =============================================
-- Migration 01: Storage Buckets & Permissions
-- Run this script to enable image file uploads to Supabase Storage
-- =============================================

-- 1. Create Storage Buckets for Gallery & Events
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Grant Public Storage Permissions
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (true);
