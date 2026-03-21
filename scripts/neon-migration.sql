-- =============================================================================
-- ANJAL VENTURES — Neon PostgreSQL Migration Script
-- Client Portal Redesign: 3-Stage Workflow
-- Run this once in your Neon SQL Editor (console.neon.tech)
-- =============================================================================

-- 1. Add portal_stage column (tracks whether client is in review or progress)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS portal_stage VARCHAR(30) DEFAULT 'review';

-- 2. Add quotation_content column (full quotation text shown in portal)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS quotation_content TEXT;

-- 3. Add contract_content column (contract terms shown in portal)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS contract_content TEXT;

-- 4. Add project_completed_at column (set when admin marks project delivered)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS project_completed_at TIMESTAMP;

-- =============================================================================
-- VERIFICATION — run this after the migration to confirm all columns exist
-- =============================================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'clients'
  AND column_name IN ('portal_stage', 'quotation_content', 'contract_content', 'project_completed_at')
ORDER BY column_name;

-- =============================================================================
-- OPTIONAL: Seed the ADAM client with full quotation content
-- Replace 'adam' with your actual client slug if different
-- =============================================================================
-- UPDATE clients
-- SET
--   quotation_content = 'Paste your full quotation text here',
--   contract_content  = 'Paste your full contract text here',
--   portal_stage      = 'review'
-- WHERE slug = 'adam';
