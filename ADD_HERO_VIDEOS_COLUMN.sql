-- ============================================================
-- ADD background_videos COLUMN TO hero TABLE
-- Run this in your Supabase Dashboard → SQL Editor
-- ============================================================

-- Add JSONB column for storing multiple background videos
-- Each video object: { "videoUrl": "https://...", "thumbnail": "https://...", "duration": 10 }
ALTER TABLE hero
ADD COLUMN IF NOT EXISTS background_videos JSONB DEFAULT '[]'::jsonb;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'hero' AND column_name = 'background_videos';
