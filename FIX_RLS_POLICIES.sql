-- ============================================================
-- RUN THIS IN SUPABASE DASHBOARD → SQL EDITOR
-- This adds write permissions for authenticated (logged-in) users
-- so the admin panel can create, update, and delete content.
-- ============================================================

-- HERO TABLE
CREATE POLICY "Allow authenticated users to insert hero"
  ON hero FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero"
  ON hero FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete hero"
  ON hero FOR DELETE TO authenticated USING (true);

-- SERVICES TABLE
CREATE POLICY "Allow authenticated users to insert services"
  ON services FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
  ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete services"
  ON services FOR DELETE TO authenticated USING (true);

-- PRODUCTS TABLE
CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON products FOR DELETE TO authenticated USING (true);

-- METRICS TABLE
CREATE POLICY "Allow authenticated users to insert metrics"
  ON metrics FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update metrics"
  ON metrics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete metrics"
  ON metrics FOR DELETE TO authenticated USING (true);

-- CASE_STUDIES TABLE
CREATE POLICY "Allow authenticated users to insert case_studies"
  ON case_studies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update case_studies"
  ON case_studies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete case_studies"
  ON case_studies FOR DELETE TO authenticated USING (true);

-- TESTIMONIALS TABLE
CREATE POLICY "Allow authenticated users to insert testimonials"
  ON testimonials FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update testimonials"
  ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete testimonials"
  ON testimonials FOR DELETE TO authenticated USING (true);

-- BLOG_POSTS TABLE
CREATE POLICY "Allow authenticated users to insert blog_posts"
  ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blog_posts"
  ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete blog_posts"
  ON blog_posts FOR DELETE TO authenticated USING (true);

-- CTA TABLE
CREATE POLICY "Allow authenticated users to insert cta"
  ON cta FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cta"
  ON cta FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete cta"
  ON cta FOR DELETE TO authenticated USING (true);

-- FOOTER TABLE
CREATE POLICY "Allow authenticated users to insert footer"
  ON footer FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update footer"
  ON footer FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete footer"
  ON footer FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DONE! Your admin panel can now write to all tables.
-- Make sure you also have SELECT policies for anon (public reads):
-- ============================================================

-- Ensure public read access exists (won't error if already exists)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['hero','services','products','metrics','case_studies','testimonials','blog_posts','cta','footer'])
  LOOP
    -- Check if anon select policy already exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = tbl 
      AND policyname LIKE '%anon%select%'
    ) THEN
      EXECUTE format(
        'CREATE POLICY "Allow anon to select %s" ON %I FOR SELECT TO anon USING (true)',
        tbl, tbl
      );
    END IF;
    
    -- Also allow authenticated to read
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = tbl 
      AND policyname LIKE '%authenticated%select%'
    ) THEN
      EXECUTE format(
        'CREATE POLICY "Allow authenticated to select %s" ON %I FOR SELECT TO authenticated USING (true)',
        tbl, tbl
      );
    END IF;
  END LOOP;
END $$;
