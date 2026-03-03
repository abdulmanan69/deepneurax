-- =====================================================
-- SPHERE SHOWCASE: Add new columns + RLS policies
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================

-- 1) Add new text columns to sphere_showcase (safe: won't error if they exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sphere_showcase' AND column_name = 'intro_heading') THEN
    ALTER TABLE sphere_showcase ADD COLUMN intro_heading TEXT DEFAULT 'The future is built on AI.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sphere_showcase' AND column_name = 'intro_subheading') THEN
    ALTER TABLE sphere_showcase ADD COLUMN intro_subheading TEXT DEFAULT 'SCROLL TO EXPLORE';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sphere_showcase' AND column_name = 'content_heading') THEN
    ALTER TABLE sphere_showcase ADD COLUMN content_heading TEXT DEFAULT 'Explore Our Vision';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sphere_showcase' AND column_name = 'content_description') THEN
    ALTER TABLE sphere_showcase ADD COLUMN content_description TEXT DEFAULT 'Discover a world where technology meets creativity.';
  END IF;
END $$;

-- 2) Enable RLS on sphere_showcase tables (idempotent)
ALTER TABLE sphere_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE sphere_showcase_items ENABLE ROW LEVEL SECURITY;

-- 3) SELECT policies (anyone can read, including anon for the frontend)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase' AND policyname = 'Allow public read sphere_showcase') THEN
    CREATE POLICY "Allow public read sphere_showcase" ON sphere_showcase FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase_items' AND policyname = 'Allow public read sphere_showcase_items') THEN
    CREATE POLICY "Allow public read sphere_showcase_items" ON sphere_showcase_items FOR SELECT USING (true);
  END IF;
END $$;

-- 4) INSERT policies (authenticated users only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase' AND policyname = 'Allow authenticated insert sphere_showcase') THEN
    CREATE POLICY "Allow authenticated insert sphere_showcase" ON sphere_showcase FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase_items' AND policyname = 'Allow authenticated insert sphere_showcase_items') THEN
    CREATE POLICY "Allow authenticated insert sphere_showcase_items" ON sphere_showcase_items FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- 5) UPDATE policies (authenticated users only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase' AND policyname = 'Allow authenticated update sphere_showcase') THEN
    CREATE POLICY "Allow authenticated update sphere_showcase" ON sphere_showcase FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase_items' AND policyname = 'Allow authenticated update sphere_showcase_items') THEN
    CREATE POLICY "Allow authenticated update sphere_showcase_items" ON sphere_showcase_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6) DELETE policies (authenticated users only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase' AND policyname = 'Allow authenticated delete sphere_showcase') THEN
    CREATE POLICY "Allow authenticated delete sphere_showcase" ON sphere_showcase FOR DELETE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sphere_showcase_items' AND policyname = 'Allow authenticated delete sphere_showcase_items') THEN
    CREATE POLICY "Allow authenticated delete sphere_showcase_items" ON sphere_showcase_items FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- 7) Seed a default section row if the table is empty
INSERT INTO sphere_showcase (section_title, section_description, intro_heading, intro_subheading, content_heading, content_description)
SELECT 
  'Explore Our Capabilities',
  'We deliver exceptional results through innovation, expertise, and dedication',
  'The future is built on AI.',
  'SCROLL TO EXPLORE',
  'Explore Our Vision',
  'Discover a world where technology meets creativity.'
WHERE NOT EXISTS (SELECT 1 FROM sphere_showcase LIMIT 1);

-- Done! ✅
-- After running this, the admin panel can read/write sphere_showcase and sphere_showcase_items.
