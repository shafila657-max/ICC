-- =============================================
-- Migration 04: Organization Data Separation
-- Adds organization_id to isolate data for ICC, ACSA, and ASMAR
-- =============================================

-- 1. Add organization_id column to programs
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS organization_id TEXT DEFAULT 'icc';

ALTER TABLE programs
ADD CONSTRAINT valid_programs_organization 
CHECK (organization_id IN ('icc', 'acsa', 'asmar'));

-- 2. Add organization_id column to events
ALTER TABLE events
ADD COLUMN IF NOT EXISTS organization_id TEXT DEFAULT 'icc';

ALTER TABLE events
ADD CONSTRAINT valid_events_organization 
CHECK (organization_id IN ('icc', 'acsa', 'asmar'));

-- 3. Add organization_id column to announcements
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS organization_id TEXT DEFAULT 'icc';

ALTER TABLE announcements
ADD CONSTRAINT valid_announcements_organization 
CHECK (organization_id IN ('icc', 'acsa', 'asmar'));

-- 4. Add organization_id column to gallery_items
ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS organization_id TEXT DEFAULT 'icc';

ALTER TABLE gallery_items
ADD CONSTRAINT valid_gallery_organization 
CHECK (organization_id IN ('icc', 'acsa', 'asmar'));
