-- ==========================================
-- BLOG SEO COLUMNS - Run in Supabase SQL Editor
-- ==========================================
-- Run each block separately if needed

-- STEP 1: Add all SEO columns (run this first)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='meta_title') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='meta_description') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='focus_keyword') THEN
    ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='og_image_url') THEN
    ALTER TABLE blog_posts ADD COLUMN og_image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='canonical_url') THEN
    ALTER TABLE blog_posts ADD COLUMN canonical_url TEXT;
  END IF;
END $$;

-- STEP 2: Verify (run this separately after step 1)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'blog_posts' ORDER BY ordinal_position;
