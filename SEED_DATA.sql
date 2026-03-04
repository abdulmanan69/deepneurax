-- ============================================================
-- DeepNeurax Technologies — Complete Seed Data
-- ============================================================
-- This file inserts ALL content that currently displays in the
-- application via the static fallback in lib/data/index.ts.
-- After running this against your Supabase database the website
-- will look identical whether Supabase is connected or not,
-- and you can then modify everything through the admin panel.
--
-- IMPORTANT: Run the schema (COMPLETE_DATABASE_SETUP.sql or
-- SUPABASE_SCHEMA.sql) FIRST, then run this file.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. CLEAN EXISTING DATA (optional — uncomment if you want a
--    fresh start; safe because every INSERT below is complete)
-- ────────────────────────────────────────────────────────────
-- TRUNCATE hero, services, products, metrics, about_us, core_values,
--   sphere_showcase, sphere_showcase_items, features_section,
--   features_section_images, case_studies_section, case_studies,
--   testimonials, blog_posts, cta, footer, site_settings CASCADE;

-- ════════════════════════════════════════════════════════════
-- 1. HERO SECTION
-- ════════════════════════════════════════════════════════════
DELETE FROM hero;
INSERT INTO hero (
  title,
  subtitle,
  description,
  cta_text,
  cta_link,
  secondary_cta_text,
  secondary_cta_link,
  background_image_url,
  background_videos,
  taglines
) VALUES (
  'DeepNeurax Technologies',
  'Transforming Businesses Through AI, IoT and Intelligent Digital Solutions',
  'DeepNeurax Technologies is a next-generation software innovation company delivering intelligent automation, scalable digital systems, and future-ready enterprise solutions. We combine the power of AI, IoT, cloud, and modern software engineering to build products that accelerate growth, optimize operations, and unlock digital transformation.',
  'Get a Free Consultation',
  '/contact',
  'Explore Services',
  '/services',
  NULL,
  '[]'::jsonb,
  '[
    {"tagline": "AI-Powered Solutions", "description": "Your vision, engineered with intelligence"},
    {"tagline": "Secure and Scalable",  "description": "Empowering your business with secure, smart, and scalable technologies"},
    {"tagline": "IoT and Digital Innovation", "description": "Bridging AI, IoT, and cloud to drive intelligent digital growth"}
  ]'::jsonb
);

-- ════════════════════════════════════════════════════════════
-- 2. SERVICES
-- ════════════════════════════════════════════════════════════
DELETE FROM services;
INSERT INTO services (title, slug, description, icon, image_url, link, "order") VALUES
  (
    'AI and Machine Learning',
    'ai-machine-learning',
    'Custom AI models, automation pipelines, generative AI integration, and agent-based solutions engineered around your business goals.',
    '🤖',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    '/services/machine-learning',
    1
  ),
  (
    'IoT Solutions',
    'iot-solutions',
    'Secure device connectivity, real-time data collection, and edge computing architectures for industrial, retail, and smart infrastructure environments.',
    '📡',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    '/services/data-analytics',
    2
  ),
  (
    'Business and API Solutions',
    'business-api-solutions',
    'Enterprise-grade APIs, microservices, and digital modernization of legacy systems to create resilient, future-ready business platforms.',
    '🧩',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    '/services/cloud-infrastructure',
    3
  ),
  (
    'SaaS Products',
    'saas-products',
    'Smart HR, payroll, inventory, and industry-specific SaaS modules designed to plug into your existing ecosystem with minimal friction.',
    '📦',
    'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80',
    '/services/ai-security',
    4
  ),
  (
    'Digital Growth Solutions',
    'digital-growth-solutions',
    'Performance-driven SEO, paid media, social media scaling, and analytics to amplify your digital presence and customer acquisition.',
    '📈',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    '/services/ai-consulting',
    5
  ),
  (
    'Custom Enterprise Platforms',
    'custom-enterprise-platforms',
    'End-to-end digital platforms tailored for startups, SMEs, enterprises, and government organizations across multiple industries.',
    '🏢',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    '/services/nlp-solutions',
    6
  );

-- ════════════════════════════════════════════════════════════
-- 3. PRODUCTS
-- ════════════════════════════════════════════════════════════
DELETE FROM products;
INSERT INTO products (name, slug, description, icon, image_url, link, "order") VALUES
  (
    'Digital Chemistry',
    'digital-chemistry',
    'Interactive periodic table, molecule formulation, reactor simulation, and 3D visualization for modern chemistry education and research.',
    '🧪',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    '/products/neurax-platform',
    1
  ),
  (
    'AI-Powered Grading System',
    'ai-grading-system',
    'Automated grading and evaluation platform that uses AI to assess assignments, exams, and practical work with transparent analytics.',
    '🧠',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    '/products/automl-suite',
    2
  ),
  (
    'Smart Inventory Manager',
    'smart-inventory-manager',
    'A smart inventory management system that tracks, automates, and optimizes stock levels, purchasing, and warehousing operations.',
    '📊',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    '/products/dataviz-pro',
    3
  ),
  (
    'AI-Powered Payroll and HRMS',
    'ai-payroll-hrms',
    'AI-driven payroll and HR management platform that automates attendance, payroll processing, and employee insights in real time.',
    '👥',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    '/products/ai-payroll-hrms',
    4
  ),
  (
    'Custom SaaS Modules',
    'custom-saas-modules',
    'Modular SaaS components that are scalable, secure, and ready to integrate with any industry environment.',
    '📦',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    '/products/custom-saas-modules',
    5
  );

-- ════════════════════════════════════════════════════════════
-- 4. METRICS
-- ════════════════════════════════════════════════════════════
DELETE FROM metrics;
INSERT INTO metrics (label, value, suffix, icon, "order") VALUES
  ('Projects Delivered',     500,  '+',  '🚀', 1),
  ('Happy Clients',          200,  '+',  '😊', 2),
  ('AI Models Deployed',     1000, '+',  '🤖', 3),
  ('Data Points Processed',  10,   'B+', '📊', 4);

-- ════════════════════════════════════════════════════════════
-- 5. ABOUT US
-- ════════════════════════════════════════════════════════════
DELETE FROM about_us;
INSERT INTO about_us (who_we_are_heading, who_we_are_description, core_values_heading) VALUES (
  'Who We Are',
  'DeepNeurax Technologies is a Pakistan-based technology company and cybersecurity-focused software house delivering intelligent digital systems, AI solutions, and end-to-end platforms for startups, SMEs, enterprises, and government sectors. Our mission is to empower organizations through secure, scalable, and intelligent digital technologies that enhance productivity, unlock operational efficiencies, and enable sustainable digital transformation. Our vision is to become Pakistan''s most trusted technology partner, leading the future of Industry 5.0, cybersecurity excellence, digital transformation, and AI-driven innovation.',
  'Core Values'
);

-- ════════════════════════════════════════════════════════════
-- 6. CORE VALUES
-- ════════════════════════════════════════════════════════════
DELETE FROM core_values;
INSERT INTO core_values (title, description, icon, "order") VALUES
  ('Integrity and Trust',       'Security and transparency above all in every engagement.',                    '🛡️', 1),
  ('Innovation',                'Constantly evolving with modern AI, IoT, and digital technologies.',           '💡', 2),
  ('Customer-First Approach',   'Your success and outcomes sit at the heart of our solutions.',                '🤝', 3),
  ('Quality and Excellence',    'Delivering reliable, secure, and highly scalable systems.',                   '🏆', 4),
  ('Teamwork and Collaboration','Building together, succeeding together as one integrated team.',              '👥', 5);

-- ════════════════════════════════════════════════════════════
-- 7. SPHERE SHOWCASE (section + items)
-- ════════════════════════════════════════════════════════════
DELETE FROM sphere_showcase_items;
DELETE FROM sphere_showcase;

INSERT INTO sphere_showcase (
  section_title,
  section_description,
  intro_heading,
  intro_subheading,
  content_heading,
  content_description
) VALUES (
  'Explore Our Capabilities',
  'We deliver exceptional results through innovation, expertise, and dedication',
  'The future is built on AI.',
  'SCROLL TO EXPLORE',
  'Explore Our Vision',
  'Discover a world where technology meets creativity.'
);

INSERT INTO sphere_showcase_items (title, description, image_url, link, "order") VALUES
  ('Deep Learning',         'Neural networks that understand complex patterns',   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80', '#deep-learning',    1),
  ('Computer Vision',       'AI that sees and understands the visual world',      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&q=80', '#computer-vision',   2),
  ('NLP',                   'Natural language understanding at scale',            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', '#nlp',               3),
  ('Predictive Analytics',  'Forecasting the future with data',                   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',  '#analytics',          4);

-- ════════════════════════════════════════════════════════════
-- 8. FEATURES SECTION (section + images)
-- ════════════════════════════════════════════════════════════
DELETE FROM features_section_images;
DELETE FROM features_section;

INSERT INTO features_section (intro_heading, intro_subheading, section_title, section_description) VALUES (
  'Our Technology',
  'Built for the Future',
  'Cutting-Edge AI Features',
  'Experience the power of next-generation artificial intelligence'
);

INSERT INTO features_section_images (image_url, alt_text, "order") VALUES
  ('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80', 'AI neural network visualization',  1),
  ('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',    'Data center infrastructure',       2),
  ('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',  'Global technology network',        3),
  ('https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80',  'Computer vision technology',       4);

-- ════════════════════════════════════════════════════════════
-- 9. CASE STUDIES SECTION + CASE STUDIES
-- ════════════════════════════════════════════════════════════
DELETE FROM case_studies;
DELETE FROM case_studies_section;

INSERT INTO case_studies_section (title, description) VALUES (
  'Success Stories',
  'See how we have helped businesses transform with AI'
);

INSERT INTO case_studies (title, slug, description, bullet_points, metrics, background_image_url, is_active, "order") VALUES
  (
    'Retail Automation',
    'retail-automation',
    'Deployed an AI-driven stock intelligence layer that reduced manual inventory errors by 83% and improved replenishment accuracy across multi-store retail networks.',
    '["83% reduction in manual inventory errors", "Automated stock forecasting and replenishment", "Real-time visibility across stores and warehouses", "Integrated with existing POS and ERP systems"]'::jsonb,
    '[{"label": "Error Reduction", "value": "83%"}, {"label": "Stock Visibility", "value": "Real-time"}, {"label": "Stores Onboarded", "value": "50+"}]'::jsonb,
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    true,
    1
  ),
  (
    'Industrial IoT Monitoring',
    'industrial-iot-monitoring',
    'Implemented an industrial IoT platform with real-time machine monitoring that reduced unplanned downtime and improved overall equipment effectiveness.',
    '["Real-time monitoring of critical machines and production lines", "Predictive maintenance alerts for high-risk assets", "Unified dashboards for plant, operations, and management teams", "Secure connectivity from edge devices to cloud analytics"]'::jsonb,
    '[{"label": "Downtime Reduction", "value": "40%"}, {"label": "Monitored Assets", "value": "200+"}, {"label": "Alert Accuracy", "value": "92%"}]'::jsonb,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    true,
    2
  ),
  (
    'API Modernization',
    'api-modernization',
    'Modernized a legacy monolithic system into an API-first microservices architecture, accelerating critical business processes and integrations.',
    '["Re-architected monolith into domain-driven microservices", "Introduced secure, versioned REST and GraphQL APIs", "Legacy workflows accelerated by 2.3x end-to-end", "Comprehensive monitoring, logging, and CI/CD pipelines"]'::jsonb,
    '[{"label": "Process Acceleration", "value": "2.3x"}, {"label": "Legacy Modules Migrated", "value": "30+"}, {"label": "New Integrations", "value": "15+"}]'::jsonb,
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    true,
    3
  );

-- ════════════════════════════════════════════════════════════
-- 10. TESTIMONIALS
-- ════════════════════════════════════════════════════════════
DELETE FROM testimonials;
INSERT INTO testimonials (author, handle, role, text, avatar_url, "order") VALUES
  (
    'CEO, Electronics and Engineering Spark',
    '',
    'Chief Executive Officer',
    'DeepNeurax transformed our entire business ecosystem with an integrated AI and IoT platform. Remarkable experience.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    1
  ),
  (
    'CEO, TronicsInn Solutions',
    '',
    'Chief Executive Officer',
    'Professional team, clear communication, and world-class software delivery.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    2
  );

-- ════════════════════════════════════════════════════════════
-- 11. BLOG POSTS
-- ════════════════════════════════════════════════════════════
DELETE FROM blog_posts;
INSERT INTO blog_posts (
  title, slug, excerpt, content, author, tags, cover_image_url,
  og_image_url, meta_title, meta_description, published_at, is_published
) VALUES
  (
    'The Future of AI in Enterprise',
    'future-of-ai-enterprise',
    'Exploring how artificial intelligence is reshaping enterprise operations and what to expect in the coming years.',
    E'## The Future of AI in Enterprise\n\nArtificial intelligence is no longer a futuristic concept—it''s here, and it''s transforming how businesses operate. From automating routine tasks to providing deep insights from complex data, AI is becoming an essential tool for enterprises worldwide.\n\n### Key Trends\n\n1. **Automated Decision Making** - AI systems are increasingly being used to make complex business decisions in real-time.\n\n2. **Predictive Analytics** - Companies are leveraging AI to forecast market trends, customer behavior, and operational needs.\n\n3. **Natural Language Processing** - Chatbots and virtual assistants are becoming more sophisticated, handling complex customer interactions.\n\n### What This Means for Your Business\n\nThe enterprises that embrace AI today will be the market leaders of tomorrow. The key is to start small, prove value, and scale strategically.',
    'Dr. James Wilson',
    '["AI", "Enterprise", "Technology"]'::jsonb,
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    'The Future of AI in Enterprise | DeepNeurax',
    'Exploring how artificial intelligence is reshaping enterprise operations.',
    '2025-12-15T10:00:00.000Z',
    true
  ),
  (
    'Machine Learning Best Practices',
    'ml-best-practices',
    'A comprehensive guide to implementing machine learning solutions that deliver real business value.',
    E'## Machine Learning Best Practices\n\nImplementing machine learning successfully requires more than just algorithms—it requires a strategic approach that considers data quality, model selection, and deployment strategies.\n\n### Essential Practices\n\n1. **Start with Clean Data** - The quality of your ML model is only as good as the data you train it on.\n\n2. **Choose the Right Model** - Not every problem needs deep learning. Sometimes simpler models work better.\n\n3. **Monitor and Iterate** - ML models need continuous monitoring and retraining to maintain accuracy.\n\n### Common Pitfalls to Avoid\n\n- Overfitting to training data\n- Ignoring bias in datasets\n- Not having a clear success metric',
    'Sarah Chen',
    '["Machine Learning", "Best Practices", "Data Science"]'::jsonb,
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80',
    'Machine Learning Best Practices | DeepNeurax',
    'A comprehensive guide to implementing machine learning solutions that deliver real business value.',
    '2025-11-28T10:00:00.000Z',
    true
  ),
  (
    'Building Ethical AI Systems',
    'ethical-ai-systems',
    'Why ethical considerations should be at the forefront of AI development and how to implement them.',
    E'## Building Ethical AI Systems\n\nAs AI becomes more prevalent, ensuring these systems are fair, transparent, and accountable is crucial for building trust and avoiding harm.\n\n### Principles of Ethical AI\n\n1. **Fairness** - AI systems should not discriminate against any group.\n\n2. **Transparency** - Users should understand how AI decisions are made.\n\n3. **Accountability** - There should be clear ownership of AI outcomes.\n\n### Implementation Strategies\n\n- Regular bias audits\n- Explainable AI techniques\n- Diverse development teams',
    'Maria Rodriguez',
    '["Ethics", "AI", "Responsible AI"]'::jsonb,
    'https://images.unsplash.com/photo-1531746790095-e5577e0e3ede?w=800&q=80',
    'https://images.unsplash.com/photo-1531746790095-e5577e0e3ede?w=1200&q=80',
    'Building Ethical AI Systems | DeepNeurax',
    'Why ethical considerations should be at the forefront of AI development.',
    '2025-11-10T10:00:00.000Z',
    true
  ),
  (
    'Cloud Infrastructure for AI Workloads',
    'cloud-ai-infrastructure',
    'How to design and deploy cloud infrastructure optimized for AI and machine learning workloads.',
    E'## Cloud Infrastructure for AI Workloads\n\nRunning AI workloads efficiently requires specialized infrastructure that can handle the computational demands of training and inference.\n\n### Key Considerations\n\n1. **GPU Selection** - Choose the right GPU instances for your workload type.\n\n2. **Data Pipeline** - Build efficient data pipelines that can feed your models at scale.\n\n3. **Cost Optimization** - Use spot instances and auto-scaling to manage costs.\n\n### Best Practices\n\n- Use containerization for reproducibility\n- Implement proper monitoring and logging\n- Design for fault tolerance',
    'Alex Thompson',
    '["Cloud", "Infrastructure", "MLOps"]'::jsonb,
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
    'Cloud Infrastructure for AI Workloads | DeepNeurax',
    'How to design and deploy cloud infrastructure optimized for AI and machine learning workloads.',
    '2025-10-22T10:00:00.000Z',
    true
  );

-- ════════════════════════════════════════════════════════════
-- 12. CTA (Call to Action)
-- ════════════════════════════════════════════════════════════
DELETE FROM cta;
INSERT INTO cta (
  title,
  description,
  button_text,
  button_link,
  secondary_button_text,
  secondary_button_link,
  background_image_url
) VALUES (
  'Ready to Build Something Next-Level?',
  'Start your project, get a tailored quote, or talk directly to our experts about AI, IoT, and digital transformation.',
  'Start Your Project',
  '/contact',
  'Explore Services',
  '/services',
  NULL
);

-- ════════════════════════════════════════════════════════════
-- 13. FOOTER
-- ════════════════════════════════════════════════════════════
DELETE FROM footer;
INSERT INTO footer (
  site_name,
  tagline,
  company_description,
  site_logo_url,
  site_logo_light_url,
  copyright_text,
  contact_email,
  contact_phone,
  address,
  social_links,
  menu_items,
  cta
) VALUES (
  'DeepNeurax Technologies',
  'Transforming Businesses Through AI, IoT and Intelligent Digital Solutions',
  'DeepNeurax Technologies is a Pakistan-based software house and cybersecurity-focused technology company delivering intelligent digital systems, AI solutions, and high-performance enterprise products.',
  NULL,
  NULL,
  '© 2026 DeepNeurax Technologies. All Rights Reserved.',
  '',
  '',
  '(Your address here)',
  '[
    {"platform": "twitter",  "url": "https://twitter.com/deepneurax"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/deepneurax"},
    {"platform": "github",   "url": "https://github.com/deepneurax"}
  ]'::jsonb,
  '[
    {"label": "Home",     "href": "/",         "isExternal": false},
    {"label": "Services", "href": "/services",  "isExternal": false},
    {"label": "Products", "href": "/products",  "isExternal": false},
    {"label": "Blog",     "href": "/blog",      "isExternal": false},
    {"label": "Contact",  "href": "/contact",   "isExternal": false}
  ]'::jsonb,
  '{"label": "Get Started", "href": "/contact", "isExternal": false}'::jsonb
);

-- ════════════════════════════════════════════════════════════
-- 14. SITE SETTINGS
-- ════════════════════════════════════════════════════════════
DELETE FROM site_settings;
INSERT INTO site_settings (site_name, site_description) VALUES (
  'DeepNeurax Technologies',
  'Transforming Businesses Through AI, IoT and Intelligent Digital Solutions'
);

-- ============================================================
-- DONE — All seed data inserted.
-- The website will now display exactly the same content
-- whether served from static fallback or from Supabase.
-- ============================================================
