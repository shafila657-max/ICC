-- =============================================
-- Migration: Add organization_id column to multi-org tables
-- This enables data isolation between ICC, ACSA, and ASMAR
-- =============================================

-- Add organization_id to programs
ALTER TABLE programs ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'icc';

-- Add organization_id to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'icc';

-- Add organization_id to gallery_items
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'icc';

-- Add organization_id to announcements
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'icc';

-- Add indexes for faster org-scoped queries
CREATE INDEX IF NOT EXISTS idx_programs_org ON programs(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_org ON gallery_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(organization_id);
