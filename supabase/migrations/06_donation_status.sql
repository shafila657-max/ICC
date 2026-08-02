-- =============================================
-- Migration: Add donor_phone and status to donations
-- =============================================

ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS donor_phone TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
