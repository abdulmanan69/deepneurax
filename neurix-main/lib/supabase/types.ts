// Supabase data types

export interface Asset {
  url: string
}

export interface ImageAsset {
  asset: Asset
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  order: number
  link?: string
  image?: ImageAsset
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  order: number
  link?: string
  image?: ImageAsset
}

export interface Metric {
  id: string
  label: string
  value: number
  suffix?: string
  icon?: string
  order: number
}

export interface CoreValue {
  title: string
  description: string
  icon?: string
}

export interface AboutUs {
  whoWeAreHeading: string
  whoWeAreDescription: string
  coreValuesHeading: string
  coreValues: CoreValue[]
}

export interface SphereShowcaseItem {
  id: string
  title: string
  description: string
  image: string
  link: string
  order: number
}

export interface SphereShowcase {
  sectionTitle: string
  sectionDescription: string
  introHeading?: string
  introSubheading?: string
  contentHeading?: string
  contentDescription?: string
  items: SphereShowcaseItem[]
}

export interface FeaturesSection {
  introHeading: string
  introSubheading: string
  sectionTitle: string
  sectionDescription: string
  images: { url: string }[]
}

export interface CaseStudiesSection {
  title: string
  description: string
}

export interface CaseStudyMetric {
  label: string
  value: string
}

export interface CaseStudy {
  id: number | string
  title: string
  slug: string
  description: string
  bulletPoints: string[]
  isActive: boolean
  order: number
  backgroundImage: ImageAsset | null
  metrics: CaseStudyMetric[]
  link?: string | null
}

export interface Testimonial {
  id: string
  author: string
  handle?: string
  role: string
  text: string
  avatar: ImageAsset | null
  order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  author: string
  tags: string[]
  coverImage?: ImageAsset
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  ogImageUrl?: string
  canonicalUrl?: string
}

export interface CTA {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface MenuItem {
  label: string
  href: string
}

export interface FooterCTA {
  label: string
  href: string
}

export interface Footer {
  siteName: string
  tagline: string
  companyDescription: string
  siteLogo?: ImageAsset
  siteLogoLight?: ImageAsset
  copyrightText: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: SocialLink[]
  menuItems: MenuItem[]
  cta?: FooterCTA
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteLogo: ImageAsset | null
  siteLogoLight: ImageAsset | null
}

export interface Hero {
  title: string
  tagline: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  backgroundImage?: ImageAsset
  backgroundVideos: BackgroundVideo[]
  taglines: TaglineItem[]
}

export interface BackgroundVideo {
  video?: {
    url: string
  }
  videoUrl?: string
  thumbnail?: {
    url: string
  }
  duration?: number
}

export interface TaglineItem {
  tagline: string
  description: string
}

export interface HomePageData {
  hero: Hero | null
  services: Service[]
  products: Product[]
  sphereShowcase: SphereShowcase | null
  metrics: Metric[]
  aboutUs: AboutUs | null
  scrollMorphHeroData: FeaturesSection | null
  featuresSection: FeaturesSection | null
  caseStudiesSection: CaseStudiesSection
  caseStudies: CaseStudy[]
  testimonials: Testimonial[]
  blogPosts: BlogPost[]
  cta: CTA | null
  footer: Footer | null
}
