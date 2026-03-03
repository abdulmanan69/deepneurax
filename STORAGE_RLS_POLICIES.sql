-- ============================================
-- Storage RLS Policies for "assets" bucket
-- Run this in Supabase → SQL Editor
-- ============================================

-- 1. Make the bucket PUBLIC (so images/videos are accessible on the frontend)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'assets';

-- 2. Allow anyone to READ files (needed for public website to show images)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Public read access on assets' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public read access on assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'assets');
  END IF;
END $$;

-- 3. Allow authenticated users to UPLOAD files
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Authenticated users can upload to assets' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can upload to assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- 4. Allow authenticated users to UPDATE/REPLACE files (for upsert)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Authenticated users can update assets' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can update assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- 5. Allow authenticated users to DELETE files
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Authenticated users can delete from assets' 
    AND tablename = 'objects' 
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can delete from assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;
