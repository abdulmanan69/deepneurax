/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from './client'
import type { 
  Hero, Service, Product, Metric, AboutUs, SphereShowcase, 
  FeaturesSection, CaseStudiesSection, CaseStudy, Testimonial, 
  BlogPost, CTA, Footer, SiteSettings, HomePageData 
} from './types'
import { 
  servicesData, productsData, caseStudiesData, blogPostsData,
  heroData, metricsData, aboutUsData, sphereShowcaseData,
  featuresSectionData, caseStudiesSectionData, testimonialsData,
  ctaData, footerData
} from '@/lib/data/index'

// Helper to check if Supabase is configured
const isSupabaseConfigured = (): boolean => !!supabase

// ============ HERO SECTION ============
export async function getHeroData(): Promise<Hero | null> {
  if (!isSupabaseConfigured()) {
    return {
      title: heroData.title,
      tagline: heroData.subtitle,
      description: heroData.description,
      primaryButtonText: heroData.ctaText,
      primaryButtonLink: heroData.ctaLink,
      secondaryButtonText: heroData.secondaryCtaText,
      secondaryButtonLink: heroData.secondaryCtaLink,
      backgroundImage: heroData.backgroundImage || undefined,
      backgroundVideos: heroData.backgroundVideos || [],
      taglines: heroData.taglines,
    }
  }
  
  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching hero:', error)
    return {
      title: heroData.title,
      tagline: heroData.subtitle,
      description: heroData.description,
      primaryButtonText: heroData.ctaText,
      primaryButtonLink: heroData.ctaLink,
      secondaryButtonText: heroData.secondaryCtaText,
      secondaryButtonLink: heroData.secondaryCtaLink,
      backgroundImage: heroData.backgroundImage || undefined,
      backgroundVideos: heroData.backgroundVideos || [],
      taglines: heroData.taglines,
    }
  }
  
  // Map database fields to HeroData interface expected by HeroSection component
  return {
    title: data.title,
    tagline: data.subtitle || data.tagline || '',
    description: data.description,
    primaryButtonText: data.cta_text || data.button_text || 'Get Started',
    primaryButtonLink: data.cta_link || data.button_link || '/contact',
    secondaryButtonText: data.secondary_cta_text || data.secondary_button_text || 'Watch Demo',
    secondaryButtonLink: data.secondary_cta_link || data.secondary_button_link || '#',
    backgroundImage: data.background_image_url ? { asset: { url: data.background_image_url } } : undefined,
    backgroundVideos: [],
    taglines: data.taglines || [],
  }
}

// ============ SERVICES ============
export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return servicesData.map((s) => ({
      id: s.id.toString(),
      title: s.title,
      slug: s.slug,
      description: s.description,
      icon: s.icon,
      order: s.order,
      link: s.link,
      image: s.image || undefined,
    }))
  }
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching services:', error)
    return servicesData.map((s) => ({
      id: s.id.toString(),
      title: s.title,
      slug: s.slug,
      description: s.description,
      icon: s.icon,
      order: s.order,
      link: s.link,
      image: s.image || undefined,
    }))
  }
  
  return data.map((service: any) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    icon: service.icon,
    order: service.order,
    link: service.link || `/services/${service.slug}`,
    image: service.image_url ? { asset: { url: service.image_url } } : undefined,
  }))
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  // Try to fetch from Supabase first
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        order: data.order,
        link: data.link,
        image: data.image_url ? { asset: { url: data.image_url } } : undefined,
      }
    }
  }
  
  // Fallback to static data
  const service = servicesData.find((s) => s.slug === slug)
  if (service) {
    return {
      id: service.id.toString(),
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      order: service.order,
      link: service.link,
      image: service.image || undefined,
    }
  }
  
  return null
}

// ============ PRODUCTS ============
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return productsData.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      icon: p.icon,
      order: p.order,
      link: p.link,
      image: p.image || undefined,
    }))
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching products:', error)
    return productsData.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      icon: p.icon,
      order: p.order,
      link: p.link,
      image: p.image || undefined,
    }))
  }
  
  return data.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    icon: product.icon,
    order: product.order,
    link: product.link || `/products/${product.slug}`,
    image: product.image_url ? { asset: { url: product.image_url } } : undefined,
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Try to fetch from Supabase first
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        order: data.order,
        link: data.link,
        image: data.image_url ? { asset: { url: data.image_url } } : undefined,
      }
    }
  }
  
  // Fallback to static data
  const product = productsData.find((p) => p.slug === slug)
  if (product) {
    return {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      icon: product.icon,
      order: product.order,
      link: product.link,
      image: product.image || undefined,
    }
  }
  
  return null
}

// ============ METRICS ============
export async function getMetrics(): Promise<Metric[]> {
  if (!isSupabaseConfigured()) {
    return metricsData.map((m) => ({
      id: m.id.toString(),
      label: m.label,
      value: m.value,
      suffix: m.suffix,
      icon: m.icon,
      order: m.order,
    }))
  }
  
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching metrics:', error)
    return metricsData.map((m) => ({
      id: m.id.toString(),
      label: m.label,
      value: m.value,
      suffix: m.suffix,
      icon: m.icon,
      order: m.order,
    }))
  }
  
  return data.map((metric: any) => ({
    id: metric.id,
    label: metric.label,
    value: metric.value,
    suffix: metric.suffix,
    icon: metric.icon,
    order: metric.order,
  }))
}

// ============ ABOUT US ============
export async function getAboutUs(): Promise<AboutUs | null> {
  if (!isSupabaseConfigured()) {
    return {
      whoWeAreHeading: aboutUsData.whoWeAreHeading,
      whoWeAreDescription: aboutUsData.whoWeAreDescription,
      coreValuesHeading: aboutUsData.coreValuesHeading,
      coreValues: aboutUsData.coreValues,
    }
  }
  
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching about us:', error)
    return {
      whoWeAreHeading: aboutUsData.whoWeAreHeading,
      whoWeAreDescription: aboutUsData.whoWeAreDescription,
      coreValuesHeading: aboutUsData.coreValuesHeading,
      coreValues: aboutUsData.coreValues,
    }
  }
  
  // Get core values
  const { data: coreValues, error: coreValuesError } = await supabase
    .from('core_values')
    .select('*')
    .order('order', { ascending: true })
  
  if (coreValuesError) {
    console.error('Error fetching core values:', coreValuesError)
  }
  
  return {
    whoWeAreHeading: data.who_we_are_heading,
    whoWeAreDescription: data.who_we_are_description,
    coreValuesHeading: data.core_values_heading,
    coreValues: (coreValues || []).map((cv: any) => ({
      title: cv.title,
      description: cv.description,
      icon: cv.icon,
    })),
  }
}

// ============ SPHERE SHOWCASE ============
export async function getSphereShowcase(): Promise<SphereShowcase | null> {
  if (!isSupabaseConfigured()) {
    return {
      sectionTitle: sphereShowcaseData.sectionTitle,
      sectionDescription: sphereShowcaseData.sectionDescription,
      items: sphereShowcaseData.items.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        image: item.image || '',
        link: item.link,
        order: item.order,
      })),
    }
  }
  
  const { data, error } = await supabase
    .from('sphere_showcase')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching sphere showcase:', error)
    return {
      sectionTitle: sphereShowcaseData.sectionTitle,
      sectionDescription: sphereShowcaseData.sectionDescription,
      items: sphereShowcaseData.items.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        image: item.image || '',
        link: item.link,
        order: item.order,
      })),
    }
  }
  
  // Get sphere items
  const { data: items, error: itemsError } = await supabase
    .from('sphere_showcase_items')
    .select('*')
    .order('order', { ascending: true })
  
  if (itemsError) {
    console.error('Error fetching sphere showcase items:', itemsError)
  }
  
  return {
    sectionTitle: data.section_title,
    sectionDescription: data.section_description,
    items: (items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image_url,
      link: item.link || '#',
      order: item.order,
    })),
  }
}

// ============ FEATURES SECTION ============
export async function getFeaturesSection(): Promise<FeaturesSection | null> {
  if (!isSupabaseConfigured()) {
    return {
      introHeading: featuresSectionData.introHeading,
      introSubheading: featuresSectionData.introSubheading,
      sectionTitle: featuresSectionData.sectionTitle,
      sectionDescription: featuresSectionData.sectionDescription,
      images: featuresSectionData.images || [],
    }
  }
  
  const { data, error } = await supabase
    .from('features_section')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching features section:', error)
    return {
      introHeading: featuresSectionData.introHeading,
      introSubheading: featuresSectionData.introSubheading,
      sectionTitle: featuresSectionData.sectionTitle,
      sectionDescription: featuresSectionData.sectionDescription,
      images: featuresSectionData.images || [],
    }
  }
  
  // Get feature images
  const { data: images, error: imagesError } = await supabase
    .from('features_section_images')
    .select('*')
    .order('order', { ascending: true })
  
  if (imagesError) {
    console.error('Error fetching feature images:', imagesError)
  }
  
  return {
    introHeading: data.intro_heading,
    introSubheading: data.intro_subheading,
    sectionTitle: data.section_title,
    sectionDescription: data.section_description,
    images: (images || []).map((img: any) => ({ url: img.image_url })).filter((img: { url: string }) => img.url),
  }
}

// ============ CASE STUDIES ============
export async function getCaseStudiesSection(): Promise<CaseStudiesSection> {
  if (!isSupabaseConfigured()) {
    return {
      title: caseStudiesSectionData.title,
      description: caseStudiesSectionData.description,
    }
  }
  
  const { data, error } = await supabase
    .from('case_studies_section')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching case studies section:', error)
    return {
      title: caseStudiesSectionData.title,
      description: caseStudiesSectionData.description,
    }
  }
  
  return {
    title: data.title,
    description: data.description,
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!isSupabaseConfigured()) {
    return caseStudiesData.filter(c => c.isActive).map((c) => ({
      id: c.id.toString(),
      title: c.title,
      slug: c.slug,
      description: c.description,
      bulletPoints: c.bulletPoints,
      isActive: c.isActive,
      order: c.order,
      backgroundImage: c.backgroundImage || null,
      metrics: c.metrics,
    }))
  }
  
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching case studies:', error)
    return caseStudiesData.filter(c => c.isActive).map((c) => ({
      id: c.id.toString(),
      title: c.title,
      slug: c.slug,
      description: c.description,
      bulletPoints: c.bulletPoints,
      isActive: c.isActive,
      order: c.order,
      backgroundImage: c.backgroundImage || null,
      metrics: c.metrics,
    }))
  }
  
  return data.map((study: any) => ({
    id: study.id,
    title: study.title,
    slug: study.slug,
    description: study.description,
    bulletPoints: study.bullet_points || [],
    isActive: study.is_active,
    order: study.order,
    backgroundImage: study.background_image_url ? { asset: { url: study.background_image_url } } : null,
    metrics: study.metrics || [],
  }))
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  // Try to fetch from Supabase first
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        bulletPoints: data.bullet_points || [],
        isActive: data.is_active,
        order: data.order,
        backgroundImage: data.background_image_url ? { asset: { url: data.background_image_url } } : null,
        metrics: data.metrics || [],
        link: data.link || null,
      }
    }
  }
  
  // Fallback to static data
  const study = caseStudiesData.find((c) => c.slug === slug)
  if (study) {
    return {
      id: study.id.toString(),
      title: study.title,
      slug: study.slug,
      description: study.description,
      bulletPoints: study.bulletPoints,
      isActive: study.isActive,
      order: study.order,
      backgroundImage: study.backgroundImage || null,
      metrics: study.metrics,
      link: null,
    }
  }
  
  return null
}

// ============ TESTIMONIALS ============
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return testimonialsData.map((t) => ({
      id: t.id.toString(),
      author: t.author,
      handle: t.handle,
      role: t.role,
      text: t.text,
      avatar: t.avatar ? { asset: { url: t.avatar } } : null,
      order: t.order,
    }))
  }
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching testimonials:', error)
    return testimonialsData.map((t) => ({
      id: t.id.toString(),
      author: t.author,
      handle: t.handle,
      role: t.role,
      text: t.text,
      avatar: t.avatar ? { asset: { url: t.avatar } } : null,
      order: t.order,
    }))
  }
  
  return data.map((testimonial: any) => ({
    id: testimonial.id,
    author: testimonial.author,
    handle: testimonial.handle,
    role: testimonial.role,
    text: testimonial.text,
    avatar: testimonial.avatar_url ? { asset: { url: testimonial.avatar_url } } : null,
    order: testimonial.order,
  }))
}

// ============ BLOG POSTS ============
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    const posts = blogPostsData.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      publishedAt: p.publishedAt,
      author: p.author,
      tags: p.tags,
      coverImage: p.coverImage || undefined,
    }))
    return limit ? posts.slice(0, limit) : posts
  }
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    const posts = blogPostsData.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      publishedAt: p.publishedAt,
      author: p.author,
      tags: p.tags,
      coverImage: p.coverImage || undefined,
    }))
    return limit ? posts.slice(0, limit) : posts
  }
  
  return data.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.published_at,
    author: post.author,
    tags: post.tags || [],
    coverImage: post.cover_image_url ? { asset: { url: post.cover_image_url } } : undefined,
  }))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try to fetch from Supabase first
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        publishedAt: data.published_at,
        author: data.author,
        tags: data.tags || [],
        coverImage: data.cover_image_url ? { asset: { url: data.cover_image_url } } : undefined,
      }
    }
  }
  
  // Fallback to static data
  const post = blogPostsData.find((b) => b.slug === slug)
  if (post) {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishedAt,
      author: post.author,
      tags: post.tags,
      coverImage: post.coverImage || undefined,
    }
  }
  
  return null
}

// ============ CTA SECTION ============
export async function getCta(): Promise<CTA | null> {
  if (!isSupabaseConfigured()) {
    return {
      title: ctaData.title,
      description: ctaData.description,
      buttonText: ctaData.buttonText,
      buttonLink: ctaData.buttonLink,
      secondaryButtonText: ctaData.secondaryButtonText,
      secondaryButtonLink: ctaData.secondaryButtonLink,
    }
  }
  
  const { data, error } = await supabase
    .from('cta')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching CTA:', error)
    return {
      title: ctaData.title,
      description: ctaData.description,
      buttonText: ctaData.buttonText,
      buttonLink: ctaData.buttonLink,
      secondaryButtonText: ctaData.secondaryButtonText,
      secondaryButtonLink: ctaData.secondaryButtonLink,
    }
  }
  
  return {
    title: data.title,
    description: data.description,
    buttonText: data.button_text,
    buttonLink: data.button_link,
    secondaryButtonText: data.secondary_button_text,
    secondaryButtonLink: data.secondary_button_link,
  }
}

// ============ FOOTER ============
export async function getFooter(): Promise<Footer | null> {
  const fallbackFooter: Footer = {
    siteName: footerData.siteName,
    tagline: footerData.tagline,
    companyDescription: footerData.companyDescription,
    siteLogo: footerData.siteLogo?.asset?.url ? { asset: { url: footerData.siteLogo.asset.url } } : undefined,
    siteLogoLight: footerData.siteLogoLight?.asset?.url ? { asset: { url: footerData.siteLogoLight.asset.url } } : undefined,
    copyrightText: footerData.copyrightText,
    contactEmail: footerData.contactEmail,
    contactPhone: footerData.contactPhone,
    address: footerData.address,
    socialLinks: footerData.socialLinks,
    menuItems: footerData.menuItems,
    cta: footerData.cta,
  }

  if (!isSupabaseConfigured()) return fallbackFooter
  
  const { data, error } = await supabase
    .from('footer')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching footer:', error)
    return fallbackFooter
  }
  
  // Transform cta to Header-compatible format
  let ctaData: { label: string; href: string } | undefined = undefined
  if (data.cta) {
    if (data.cta.label && data.cta.href) {
      ctaData = { label: data.cta.label, href: data.cta.href }
    } else if (data.cta.text && data.cta.link) {
      ctaData = { label: data.cta.text, href: data.cta.link }
    }
  }
  
  return {
    siteName: data.site_name,
    tagline: data.tagline,
    companyDescription: data.company_description,
    siteLogo: data.site_logo_url ? { asset: { url: data.site_logo_url } } : undefined,
    siteLogoLight: data.site_logo_light_url ? { asset: { url: data.site_logo_light_url } } : undefined,
    copyrightText: data.copyright_text,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    address: data.address,
    socialLinks: data.social_links || [],
    menuItems: data.menu_items || [],
    cta: ctaData,
  }
}

// ============ SITE SETTINGS ============
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) {
    return {
      siteName: 'DeepNeurax',
      siteDescription: 'AI-Powered Solutions for the Future',
      siteLogo: null,
      siteLogoLight: null,
    }
  }
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching site settings:', error)
    return {
      siteName: 'DeepNeurax',
      siteDescription: 'AI-Powered Solutions for the Future',
      siteLogo: null,
      siteLogoLight: null,
    }
  }
  
  return {
    siteName: data.site_name,
    siteDescription: data.site_description,
    siteLogo: data.site_logo_url ? { asset: { url: data.site_logo_url } } : null,
    siteLogoLight: data.site_logo_light_url ? { asset: { url: data.site_logo_light_url } } : null,
  }
}

// ============ COMBINED DATA FETCHER FOR HOME PAGE ============
export async function getHomePageData(): Promise<HomePageData> {
  const [
    hero,
    services,
    products,
    sphereShowcase,
    metrics,
    aboutUs,
    featuresSection,
    caseStudiesSection,
    caseStudies,
    testimonials,
    blogPosts,
    cta,
    footer,
  ] = await Promise.all([
    getHeroData(),
    getServices(),
    getProducts(),
    getSphereShowcase(),
    getMetrics(),
    getAboutUs(),
    getFeaturesSection(),
    getCaseStudiesSection(),
    getCaseStudies(),
    getTestimonials(),
    getBlogPosts(6),
    getCta(),
    getFooter(),
  ])
  
  return {
    hero,
    services,
    products,
    sphereShowcase,
    metrics,
    aboutUs,
    scrollMorphHeroData: featuresSection,
    featuresSection,
    caseStudiesSection,
    caseStudies,
    testimonials,
    blogPosts,
    cta,
    footer,
  }
}

// ============ GET ALL SLUGS FOR STATIC GENERATION ============
export async function getAllServiceSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Return static fallback data for build time
    return servicesData.map((s) => s.slug)
  }
  
  const { data, error } = await supabase
    .from('services')
    .select('slug')
  
  if (error) {
    // Fallback to static data if query fails
    return servicesData.map((s) => s.slug)
  }
  return data.map((s: any) => s.slug)
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Return static fallback data for build time
    return productsData.map((p) => p.slug)
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('slug')
  
  if (error) {
    // Fallback to static data if query fails
    return productsData.map((p) => p.slug)
  }
  return data.map((p: any) => p.slug)
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Return static fallback data for build time (only active ones)
    return caseStudiesData.filter(c => c.isActive).map((c) => c.slug)
  }
  
  const { data, error } = await supabase
    .from('case_studies')
    .select('slug')
    .eq('is_active', true)
  
  if (error) {
    // Fallback to static data if query fails
    return caseStudiesData.filter(c => c.isActive).map((c) => c.slug)
  }
  return data.map((c: any) => c.slug)
}

export async function getAllBlogPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Return static fallback data for build time
    return blogPostsData.map((b) => b.slug)
  }
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
  
  if (error) {
    // Fallback to static data if query fails
    return blogPostsData.map((b) => b.slug)
  }
  return data.map((b: any) => b.slug)
}
