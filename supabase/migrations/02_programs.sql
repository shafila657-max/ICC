-- =============================================
-- Migration 02: Programs Schema Enhancement
-- Run this script to add full program builder details & registration fields
-- =============================================

ALTER TABLE programs 
  ADD COLUMN IF NOT EXISTS full_content TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS schedule TEXT DEFAULT 'Flexible Schedule',
  ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT 'info@icc.org',
  ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT 'Register / Get In Touch';
