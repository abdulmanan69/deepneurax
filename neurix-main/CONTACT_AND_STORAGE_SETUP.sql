-- ==========================================
-- CONTACT SUBMISSIONS + STORAGE SETUP
-- Run in Supabase SQL Editor
-- ==========================================

-- 1. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS Policies for contact_submissions
-- Anyone can INSERT (public contact form)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public insert (for the contact form - no auth needed)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can read all submissions
CREATE POLICY "Authenticated users can read submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update (mark as read)
CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Also allow anon to read (for static export)
CREATE POLICY "Anon can read submissions"
  ON contact_submissions FOR SELECT
  TO anon
  USING (true);

-- Anon can update
CREATE POLICY "Anon can update submissions"
  ON contact_submissions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Anon can delete
CREATE POLICY "Anon can delete submissions"
  ON contact_submissions FOR DELETE
  TO anon
  USING (true);

-- 3. Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_submissions' 
ORDER BY ordinal_position;
