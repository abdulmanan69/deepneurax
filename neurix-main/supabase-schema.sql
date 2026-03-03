-- Deep Neurax Website - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  link TEXT,
  image JSONB, -- { "asset": { "url": "..." } }
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  image JSONB, -- { "asset": { "url": "..." } }
  features JSONB, -- Array of { "title": "...", "description": "..." }
  integrations TEXT[],
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image JSONB, -- { "asset": { "url": "..." } }
  author TEXT,
  category TEXT,
  read_time TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CASE STUDIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT,
  industry TEXT,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB, -- Array of { "metric": "...", "value": "...", "description": "..." }
  image JSONB, -- { "asset": { "url": "..." } }
  testimonial JSONB, -- { "quote": "...", "author": "...", "role": "..." }
  technologies TEXT[],
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  handle TEXT,
  role TEXT,
  text TEXT NOT NULL,
  avatar JSONB, -- { "asset": { "url": "..." } }
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HERO SECTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  background_image JSONB, -- { "asset": { "url": "..." } }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CTA SECTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cta_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FOOTER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  tagline TEXT,
  copyright TEXT,
  social_links JSONB, -- Array of { "platform": "...", "url": "...", "icon": "..." }
  menu_items JSONB, -- Array of { "title": "...", "links": [{ "label": "...", "href": "..." }] }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SPHERE SHOWCASE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sphere_showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT,
  section_description TEXT,
  items JSONB, -- Array of { "title": "...", "description": "...", "icon": "...", "technologies": [...] }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCROLL MORPH HERO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scroll_morph_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  items JSONB, -- Array of { "title": "...", "description": "...", "icon": "..." }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES SECTION TABLE (for homepage section header)
-- ============================================
CREATE TABLE IF NOT EXISTS services_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CASE STUDIES SECTION TABLE (for homepage section header)
-- ============================================
CREATE TABLE IF NOT EXISTS case_studies_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- METRICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  suffix TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (Optional - Enable for production)
-- ============================================
-- Enable RLS on all tables (uncomment if needed)
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cta_section ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sphere_showcase ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scroll_morph_hero ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services_section ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE case_studies_section ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create public read policies (uncomment if RLS is enabled)
-- CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON case_studies FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON hero_section FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON cta_section FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON footer FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON sphere_showcase FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON scroll_morph_hero FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON services_section FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON case_studies_section FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON metrics FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA (Already populated in your Supabase)
-- ============================================
-- The sample data has already been inserted via the application.
-- If you need to repopulate, you can run the dev server and it will
-- check for missing data and insert it automatically.
