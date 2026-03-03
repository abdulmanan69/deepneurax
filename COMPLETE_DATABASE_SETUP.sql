-- ================================================================
-- DeepNeurax Website — COMPLETE Database Setup
-- ================================================================
-- Run this SINGLE file in Supabase Dashboard → SQL Editor
-- to create ALL tables, RLS policies, seed data, and storage setup.
--
-- This file consolidates:
--   SUPABASE_SCHEMA.sql, ADD_HERO_VIDEOS_COLUMN.sql,
--   BLOG_SEO_COLUMNS.sql, SPHERE_SHOWCASE_SETUP.sql,
--   FIX_RLS_POLICIES.sql, CONTACT_AND_STORAGE_SETUP.sql,
--   STORAGE_RLS_POLICIES.sql
-- Plus the NEW homepage_sections table for animated sections.
--
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT).
-- ================================================================


-- ============================================
-- 1. CREATE ALL TABLES
-- ============================================

-- HERO SECTION
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Transforming Business with AI',
  subtitle TEXT DEFAULT 'Building the Future of Intelligent Solutions',
  description TEXT DEFAULT 'We deliver cutting-edge AI solutions that drive innovation, efficiency, and growth for businesses worldwide.',
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '/contact',
  secondary_cta_text TEXT DEFAULT 'Learn More',
  secondary_cta_link TEXT DEFAULT '/services',
  background_image_url TEXT,
  background_videos JSONB DEFAULT '[]'::jsonb,
  taglines JSONB DEFAULT '[
    {"tagline": "AI Innovation", "description": "Pioneering the future of artificial intelligence"},
    {"tagline": "Smart Solutions", "description": "Intelligent systems tailored for your needs"},
    {"tagline": "Digital Transformation", "description": "Revolutionizing how businesses operate"}
  ]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '🚀',
  image_url TEXT,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '📦',
  image_url TEXT,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- METRICS
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT DEFAULT '+',
  icon TEXT DEFAULT '📊',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ABOUT US
CREATE TABLE IF NOT EXISTS about_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  who_we_are_heading TEXT DEFAULT 'Who We Are',
  who_we_are_description TEXT,
  core_values_heading TEXT DEFAULT 'Our Core Values',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CORE VALUES
CREATE TABLE IF NOT EXISTS core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '💡',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPHERE SHOWCASE (with extra columns from SPHERE_SHOWCASE_SETUP.sql)
CREATE TABLE IF NOT EXISTS sphere_showcase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_title TEXT DEFAULT 'Explore Our Capabilities',
  section_description TEXT DEFAULT 'We deliver exceptional results through innovation, expertise, and dedication',
  intro_heading TEXT DEFAULT 'The future is built on AI.',
  intro_subheading TEXT DEFAULT 'SCROLL TO EXPLORE',
  content_heading TEXT DEFAULT 'Explore Our Vision',
  content_description TEXT DEFAULT 'Discover a world where technology meets creativity.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sphere_showcase_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link TEXT DEFAULT '#',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEATURES SECTION
CREATE TABLE IF NOT EXISTS features_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  intro_heading TEXT DEFAULT 'Our Technology',
  intro_subheading TEXT DEFAULT 'Built for the Future',
  section_title TEXT DEFAULT 'Cutting-Edge AI Features',
  section_description TEXT DEFAULT 'Experience the power of next-generation artificial intelligence',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS features_section_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CASE STUDIES SECTION
CREATE TABLE IF NOT EXISTS case_studies_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT 'Success Stories',
  description TEXT DEFAULT 'See how we have helped businesses transform with AI',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CASE STUDIES
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  bullet_points JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '[]'::jsonb,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  handle TEXT,
  role TEXT,
  text TEXT NOT NULL,
  avatar_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS (with SEO columns from BLOG_SEO_COLUMNS.sql)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA (Call to Action)
CREATE TABLE IF NOT EXISTS cta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT 'Ready to Transform Your Business?',
  description TEXT DEFAULT 'Let''s discuss how AI can help you achieve your goals.',
  button_text TEXT DEFAULT 'Get Started Today',
  button_link TEXT DEFAULT '/contact',
  secondary_button_text TEXT DEFAULT 'View Our Work',
  secondary_button_link TEXT DEFAULT '/#case-studies',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FOOTER
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'DeepNeurax',
  tagline TEXT DEFAULT 'AI-Powered Solutions for the Future',
  company_description TEXT DEFAULT 'DeepNeurax is a pioneering AI company dedicated to transforming businesses through innovative artificial intelligence solutions.',
  site_logo_url TEXT,
  site_logo_light_url TEXT,
  copyright_text TEXT DEFAULT '© 2025 DeepNeurax. All rights reserved.',
  contact_email TEXT DEFAULT 'contact@deepneurax.com',
  contact_phone TEXT DEFAULT '+1 (555) 123-4567',
  address TEXT DEFAULT '123 AI Blvd, San Francisco, CA',
  social_links JSONB DEFAULT '[
    {"platform": "twitter", "url": "https://twitter.com/deepneurax"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/deepneurax"},
    {"platform": "github", "url": "https://github.com/deepneurax"}
  ]'::jsonb,
  menu_items JSONB DEFAULT '[
    {"label": "Home", "href": "/"},
    {"label": "Services", "href": "/services"},
    {"label": "Products", "href": "/products"},
    {"label": "Blog", "href": "/blog"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  cta JSONB DEFAULT '{"label": "Get Started", "href": "/contact"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'DeepNeurax',
  site_description TEXT DEFAULT 'AI-Powered Solutions for the Future',
  site_logo_url TEXT,
  site_logo_light_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT SUBMISSIONS (from CONTACT_AND_STORAGE_SETUP.sql)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HOMEPAGE SECTIONS (NEW — animated homepage sections)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  heading TEXT,
  subheading TEXT,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT,
  cta_link TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  animation_style TEXT DEFAULT 'fade-up',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 2. ADD COLUMNS (for existing databases)
-- ============================================
-- These are safe no-ops on a fresh database (columns already exist above),
-- but needed when upgrading an existing DB that used the old schema.

-- Hero: background_videos
ALTER TABLE hero ADD COLUMN IF NOT EXISTS background_videos JSONB DEFAULT '[]'::jsonb;

-- Sphere Showcase: extra intro/content columns
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

-- Blog Posts: SEO columns
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


-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE sphere_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE sphere_showcase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE features_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE features_section_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;


-- ============================================
-- 4. RLS POLICIES — PUBLIC READ ACCESS
-- ============================================
-- Everyone (anon + authenticated) can SELECT from content tables.

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'hero','services','products','metrics','about_us','core_values',
    'sphere_showcase','sphere_showcase_items','features_section','features_section_images',
    'case_studies_section','case_studies','testimonials','blog_posts',
    'cta','footer','site_settings','homepage_sections'
  ])
  LOOP
    -- Anon SELECT
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = tbl AND policyname = 'public_read_' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY "public_read_%s" ON %I FOR SELECT USING (true)',
        tbl, tbl
      );
    END IF;
  END LOOP;
END $$;

-- Contact submissions: anon can also read (needed for static export)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'public_read_contact_submissions') THEN
    CREATE POLICY "public_read_contact_submissions" ON contact_submissions FOR SELECT USING (true);
  END IF;
END $$;


-- ============================================
-- 5. RLS POLICIES — AUTHENTICATED WRITE ACCESS
-- ============================================
-- Authenticated users (admin) can INSERT, UPDATE, DELETE on all content tables.

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'hero','services','products','metrics','about_us','core_values',
    'sphere_showcase','sphere_showcase_items','features_section','features_section_images',
    'case_studies_section','case_studies','testimonials','blog_posts',
    'cta','footer','site_settings','homepage_sections'
  ])
  LOOP
    -- INSERT
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = tbl AND policyname = 'auth_insert_' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY "auth_insert_%s" ON %I FOR INSERT TO authenticated WITH CHECK (true)',
        tbl, tbl
      );
    END IF;

    -- UPDATE
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = tbl AND policyname = 'auth_update_' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY "auth_update_%s" ON %I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)',
        tbl, tbl
      );
    END IF;

    -- DELETE
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = tbl AND policyname = 'auth_delete_' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY "auth_delete_%s" ON %I FOR DELETE TO authenticated USING (true)',
        tbl, tbl
      );
    END IF;
  END LOOP;
END $$;


-- ============================================
-- 6. RLS POLICIES — CONTACT SUBMISSIONS (special)
-- ============================================
-- Anon can INSERT (public contact form) + read/update/delete for static export

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'anon_insert_contact') THEN
    CREATE POLICY "anon_insert_contact" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'anon_update_contact') THEN
    CREATE POLICY "anon_update_contact" ON contact_submissions FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'anon_delete_contact') THEN
    CREATE POLICY "anon_delete_contact" ON contact_submissions FOR DELETE TO anon USING (true);
  END IF;
END $$;


-- ============================================
-- 7. STORAGE — "assets" BUCKET
-- ============================================
-- Make the bucket public + set RLS for file operations.

UPDATE storage.buckets SET public = true WHERE id = 'assets';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read access on assets' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public read access on assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload to assets' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can upload to assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update assets' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can update assets" ON storage.objects FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete from assets' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can delete from assets" ON storage.objects FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;


-- ============================================
-- 8. SEED DATA — Default content
-- ============================================

-- Hero
INSERT INTO hero (title, subtitle, description) VALUES (
  'Transforming Business with AI',
  'Building the Future of Intelligent Solutions',
  'We deliver cutting-edge AI solutions that drive innovation, efficiency, and growth for businesses worldwide.'
) ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (title, slug, description, icon, "order") VALUES
  ('Machine Learning Solutions', 'machine-learning', 'Custom ML models designed to solve your most complex business challenges. From predictive analytics to recommendation systems, we build intelligent solutions that learn and improve.', '🤖', 1),
  ('Data Analytics & Insights', 'data-analytics', 'Transform raw data into actionable insights. Our analytics solutions help you make data-driven decisions with advanced visualization and reporting tools.', '📊', 2),
  ('Cloud AI Infrastructure', 'cloud-infrastructure', 'Scalable cloud solutions for AI workloads. We design and deploy infrastructure that grows with your needs while maintaining optimal performance.', '☁️', 3),
  ('AI Security & Compliance', 'ai-security', 'Protect your AI systems with enterprise-grade security. We ensure your models and data meet the highest standards of compliance and protection.', '🛡️', 4),
  ('AI Consulting', 'ai-consulting', 'Strategic guidance for your AI journey. Our experts help you identify opportunities, plan implementations, and maximize ROI from AI investments.', '⚡', 5),
  ('Natural Language Processing', 'nlp-solutions', 'Advanced NLP solutions for text analysis, chatbots, sentiment analysis, and language understanding. Make sense of unstructured text data at scale.', '💬', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, description, icon, "order") VALUES
  ('NeuraxPlatform', 'neurax-platform', 'An enterprise-grade AI platform that enables rapid development and deployment of machine learning models with intuitive interfaces and powerful automation.', '📦', 1),
  ('AutoML Suite', 'automl-suite', 'Automated machine learning toolkit that handles feature engineering, model selection, and hyperparameter tuning, making AI accessible to every team.', '⚙️', 2),
  ('DataViz Pro', 'dataviz-pro', 'Advanced data visualization and analytics dashboard that transforms complex datasets into intuitive, interactive visualizations for better decision making.', '📊', 3),
  ('AI Agent Framework', 'ai-agent-framework', 'Build intelligent conversational agents and autonomous AI systems with our comprehensive framework supporting multiple LLM providers.', '🤖', 4)
ON CONFLICT (slug) DO NOTHING;

-- Metrics
INSERT INTO metrics (label, value, suffix, icon, "order") VALUES
  ('Projects Delivered', 500, '+', '🚀', 1),
  ('Happy Clients', 200, '+', '😊', 2),
  ('AI Models Deployed', 1000, '+', '🤖', 3),
  ('Data Points Processed', 10, 'B+', '📊', 4)
ON CONFLICT DO NOTHING;

-- About Us
INSERT INTO about_us (who_we_are_heading, who_we_are_description, core_values_heading) VALUES (
  'Who We Are',
  'DeepNeurax is a pioneering AI company dedicated to transforming businesses through innovative artificial intelligence solutions. With a team of world-class engineers and data scientists, we deliver cutting-edge technology that drives real results.',
  'Our Core Values'
) ON CONFLICT DO NOTHING;

-- Core Values
INSERT INTO core_values (title, description, icon, "order") VALUES
  ('Innovation', 'Pushing the boundaries of what AI can achieve', '💡', 1),
  ('Excellence', 'Delivering exceptional quality in everything we do', '⭐', 2),
  ('Integrity', 'Building trust through transparent and ethical AI', '🤝', 3),
  ('Impact', 'Creating meaningful change for our clients and society', '🎯', 4)
ON CONFLICT DO NOTHING;

-- Sphere Showcase
INSERT INTO sphere_showcase (section_title, section_description, intro_heading, intro_subheading, content_heading, content_description)
SELECT
  'Explore Our Capabilities',
  'We deliver exceptional results through innovation, expertise, and dedication',
  'The future is built on AI.',
  'SCROLL TO EXPLORE',
  'Explore Our Vision',
  'Discover a world where technology meets creativity.'
WHERE NOT EXISTS (SELECT 1 FROM sphere_showcase LIMIT 1);

-- Sphere Showcase Items
INSERT INTO sphere_showcase_items (title, description, "order") VALUES
  ('Deep Learning', 'Neural networks that understand complex patterns', 1),
  ('Computer Vision', 'AI that sees and understands the visual world', 2),
  ('NLP', 'Natural language understanding at scale', 3),
  ('Predictive Analytics', 'Forecasting the future with data', 4)
ON CONFLICT DO NOTHING;

-- Features Section
INSERT INTO features_section (intro_heading, intro_subheading, section_title, section_description) VALUES (
  'Our Technology',
  'Built for the Future',
  'Cutting-Edge AI Features',
  'Experience the power of next-generation artificial intelligence'
) ON CONFLICT DO NOTHING;

-- Case Studies Section
INSERT INTO case_studies_section (title, description) VALUES (
  'Success Stories',
  'See how we have helped businesses transform with AI'
) ON CONFLICT DO NOTHING;

-- Case Studies
INSERT INTO case_studies (title, slug, description, bullet_points, metrics, "order") VALUES
  ('Healthcare AI Transformation', 'healthcare-ai-transformation',
   'Implemented an AI-powered diagnostic system that improved patient outcomes by 40% and reduced diagnosis time by 60%.',
   '["Reduced diagnosis time by 60%", "Improved accuracy to 95%", "Processed 1M+ patient records", "Integrated with existing systems"]'::jsonb,
   '[{"label": "Accuracy Improvement", "value": "95%"}, {"label": "Time Saved", "value": "60%"}, {"label": "Records Processed", "value": "1M+"}]'::jsonb, 1),
  ('Financial Fraud Detection', 'financial-fraud-detection',
   'Developed a real-time fraud detection system for a major bank that prevented $50M in fraudulent transactions annually.',
   '["Real-time transaction analysis", "$50M+ fraud prevented annually", "99.9% uptime achieved", "Reduced false positives by 70%"]'::jsonb,
   '[{"label": "Fraud Prevented", "value": "$50M+"}, {"label": "Uptime", "value": "99.9%"}, {"label": "False Positive Reduction", "value": "70%"}]'::jsonb, 2),
  ('E-commerce Personalization', 'ecommerce-personalization',
   'Built a recommendation engine that increased customer engagement by 150% and boosted sales by 35%.',
   '["Personalized recommendations for 10M+ users", "35% increase in sales", "150% boost in engagement", "Seamless API integration"]'::jsonb,
   '[{"label": "Sales Increase", "value": "35%"}, {"label": "Engagement Boost", "value": "150%"}, {"label": "Users Served", "value": "10M+"}]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (author, handle, role, text, "order") VALUES
  ('Sarah Johnson', '@sarahj_cto', 'CTO, TechCorp', 'DeepNeurax transformed our data infrastructure. Their AI solutions have been game-changing for our business operations.', 1),
  ('Michael Chen', '@mchen_ai', 'VP Engineering, DataFlow', 'The team at DeepNeurax delivered exceptional results. Our ML pipeline is now 10x faster and more reliable.', 2),
  ('Emily Rodriguez', '@emilyrod', 'Director of AI, InnovateCo', 'Working with DeepNeurax was a pleasure. They understood our needs and delivered beyond expectations.', 3),
  ('David Park', '@dpark_tech', 'CEO, StartupX', 'The AI consulting services helped us identify opportunities we never knew existed. Highly recommended!', 4),
  ('Lisa Wang', '@lisawang_ml', 'Head of Data Science, FinServ', 'DeepNeurax''s fraud detection system saved us millions. Their expertise in financial AI is unmatched.', 5)
ON CONFLICT DO NOTHING;

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, tags, published_at) VALUES
  ('The Future of AI in Enterprise', 'future-of-ai-enterprise',
   'Exploring how artificial intelligence is reshaping enterprise operations and what to expect in the coming years.',
   '## The Future of AI in Enterprise\n\nArtificial intelligence is no longer a futuristic concept—it''s here, and it''s transforming how businesses operate.\n\n### Key Trends\n\n1. **Automated Decision Making** - AI systems are increasingly being used to make complex business decisions in real-time.\n\n2. **Predictive Analytics** - Companies are leveraging AI to forecast market trends, customer behavior, and operational needs.\n\n3. **Natural Language Processing** - Chatbots and virtual assistants are becoming more sophisticated.',
   'Dr. James Wilson', '["AI", "Enterprise", "Technology"]'::jsonb, '2025-12-15T10:00:00.000Z'),
  ('Machine Learning Best Practices', 'ml-best-practices',
   'A comprehensive guide to implementing machine learning solutions that deliver real business value.',
   '## Machine Learning Best Practices\n\nImplementing machine learning successfully requires more than just algorithms—it requires a strategic approach.\n\n### Essential Practices\n\n1. **Start with Clean Data** - The quality of your ML model is only as good as the data you train it on.\n\n2. **Choose the Right Model** - Not every problem needs deep learning. Sometimes simpler models work better.\n\n3. **Monitor and Iterate** - ML models need continuous monitoring and retraining to maintain accuracy.',
   'Sarah Chen', '["Machine Learning", "Best Practices", "Data Science"]'::jsonb, '2025-11-28T10:00:00.000Z'),
  ('Building Ethical AI Systems', 'ethical-ai-systems',
   'Why ethical considerations should be at the forefront of AI development and how to implement them.',
   '## Building Ethical AI Systems\n\nAs AI becomes more prevalent, ensuring these systems are fair, transparent, and accountable is crucial.\n\n### Principles of Ethical AI\n\n1. **Fairness** - AI systems should not discriminate against any group.\n\n2. **Transparency** - Users should understand how AI decisions are made.\n\n3. **Accountability** - There should be clear ownership of AI outcomes.',
   'Maria Rodriguez', '["Ethics", "AI", "Responsible AI"]'::jsonb, '2025-11-10T10:00:00.000Z')
ON CONFLICT (slug) DO NOTHING;

-- CTA
INSERT INTO cta (title, description, button_text, button_link) VALUES (
  'Ready to Transform Your Business?',
  'Let''s discuss how AI can help you achieve your goals. Schedule a free consultation with our experts.',
  'Get Started Today',
  '/contact'
) ON CONFLICT DO NOTHING;

-- Footer
INSERT INTO footer (site_name, tagline, copyright_text) VALUES (
  'DeepNeurax',
  'AI-Powered Solutions for the Future',
  '© 2025 DeepNeurax. All rights reserved.'
) ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO site_settings (site_name, site_description) VALUES (
  'DeepNeurax',
  'AI-Powered Solutions for the Future'
) ON CONFLICT DO NOTHING;


-- ================================================================
-- DONE! Your entire database is now set up.
-- ================================================================
-- Next steps:
--   1. Create an "assets" storage bucket in Dashboard → Storage
--   2. Create an auth user for the admin panel in Dashboard → Authentication
--   3. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env
-- ================================================================
