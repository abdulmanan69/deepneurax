'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import MagicCard, { BentoGrid, BentoCard } from '@/components/ui/MagicCard'
import Marquee, { MarqueeTag, AnimatedTagCloud } from '@/components/ui/Marquee'
import GradientHeading, { SectionBadge } from '@/components/ui/GradientHeading'
import PricingCard from '@/components/ui/PricingCard'

/* ====== Type Definitions ====== */

export interface HomepageSection {
  section_key: string
  heading: string
  subheading?: string
  description?: string
  items: unknown[]
  cta_text?: string
  cta_link?: string
  is_visible: boolean
  display_order: number
  animation_style: string
  theme: string
}

interface SectionCategory {
  title: string
  items: string[]
  icon?: string
}

interface SectionProduct {
  name: string
  description: string
  icon?: string
}

interface PricingModel {
  name: string
  description: string
}

interface PortfolioData {
  categories: string[]
  projectDetails: string[]
  subheading?: string
}

interface BlogTopicsData {
  subheading?: string
  topics: string[]
}

interface LearningHubData {
  description?: string
  resources: string[]
  upcomingCourses: string[]
}

interface ContactData {
  companyName?: string
  address?: string
  email?: string
  phone?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
}

/* ====== Fallback static data (imported at usage site) ====== */
import {
  servicesOverviewData,
  solutionsOverviewData,
  industriesServedData,
  productSuiteData,
  pricingModelsData,
  portfolioOverviewData,
  blogTopicsOverviewData,
  learningHubData,
  contactInfoData,
} from '@/lib/data/index'

/* ====== Accent colors for variety ====== */
const ACCENT_COLORS = [
  '#0066FF', '#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444',
]

/* ====== Helper: merge Supabase section data with static fallbacks ====== */
function getSectionData(sections: HomepageSection[] | null, key: string) {
  if (!sections) return null
  return sections.find(s => s.section_key === key) || null
}

/* ====== Sub-Components ====== */

/* --- Detailed Service Areas --- */
function ServiceAreasSection({ data }: { data: HomepageSection | null }) {
  const categories: SectionCategory[] = data?.items as SectionCategory[] || servicesOverviewData.categories
  const heading = data?.heading || 'Detailed Service Areas'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <SectionBadge>Our Expertise</SectionBadge>
        <GradientHeading className="text-3xl md:text-4xl font-bold mt-4 mb-4">
          {heading}
        </GradientHeading>
        {data?.subheading && (
          <AnimatedSection delay={0.1}>
            <p className="text-slate-600 max-w-2xl mx-auto">{data.subheading}</p>
          </AnimatedSection>
        )}
      </div>
      <BentoGrid>
        {categories.map((category, i) => (
          <BentoCard
            key={category.title}
            title={category.title}
            icon={category.icon}
            items={category.items}
            index={i}
            accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          />
        ))}
      </BentoGrid>
    </section>
  )
}

/* --- Solutions --- */
function SolutionsSection({ data }: { data: HomepageSection | null }) {
  const categories: SectionCategory[] = data?.items as SectionCategory[] || solutionsOverviewData.categories
  const heading = data?.heading || 'Solutions'
  const subheading = data?.subheading || solutionsOverviewData.subheading
  const visible = data?.is_visible ?? true
  if (!visible) return null

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <SectionBadge>Tailored For You</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-indigo-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
        <AnimatedSection delay={0.1}>
          <p className="text-slate-600 max-w-3xl mx-auto">{subheading}</p>
        </AnimatedSection>
      </div>
      <BentoGrid>
        {categories.map((category, i) => (
          <BentoCard
            key={category.title}
            title={category.title}
            items={category.items}
            index={i}
            accentColor={ACCENT_COLORS[(i + 2) % ACCENT_COLORS.length]}
          />
        ))}
      </BentoGrid>
    </section>
  )
}

/* --- Industries --- */
function IndustriesSection({ data }: { data: HomepageSection | null }) {
  const industries: string[] = (data?.items as string[]) || industriesServedData.industries
  const heading = data?.heading || 'Industries We Serve'
  const description = data?.description || industriesServedData.description
  const animationStyle = data?.animation_style || 'marquee'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-10">
        <SectionBadge>Sectors</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-emerald-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
        <AnimatedSection delay={0.1}>
          <p className="text-slate-600 max-w-3xl mx-auto">{description}</p>
        </AnimatedSection>
      </div>

      {animationStyle === 'marquee' ? (
        <div className="space-y-4">
          <Marquee speed={25} direction="left">
            {industries.slice(0, Math.ceil(industries.length / 2)).map(ind => (
              <MarqueeTag key={ind} label={ind} accentColor="#10B981" />
            ))}
          </Marquee>
          <Marquee speed={20} direction="right">
            {industries.slice(Math.ceil(industries.length / 2)).map(ind => (
              <MarqueeTag key={ind} label={ind} accentColor="#0066FF" />
            ))}
          </Marquee>
        </div>
      ) : (
        <AnimatedTagCloud tags={industries} accentColor="#10B981" />
      )}
    </section>
  )
}

/* --- Product Suite --- */
function ProductSuiteSection({ data }: { data: HomepageSection | null }) {
  const products: SectionProduct[] = data?.items as SectionProduct[] || productSuiteData.products
  const heading = data?.heading || 'Products'
  const subheading = data?.subheading || 'Explore our ready-to-use platforms designed for security, efficiency, and growth.'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <SectionBadge>Our Products</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-purple-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
        <AnimatedSection delay={0.1}>
          <p className="text-slate-600 max-w-3xl mx-auto">{subheading}</p>
        </AnimatedSection>
      </div>
      <BentoGrid>
        {products.map((product, i) => (
          <BentoCard
            key={product.name}
            title={product.name}
            description={product.description}
            icon={product.icon}
            index={i}
            accentColor={ACCENT_COLORS[(i + 4) % ACCENT_COLORS.length]}
          />
        ))}
      </BentoGrid>
    </section>
  )
}

/* --- Pricing --- */
function PricingSection({ data }: { data: HomepageSection | null }) {
  const models: PricingModel[] = data?.items as PricingModel[] || pricingModelsData.models
  const heading = data?.heading || 'Pricing and Engagement Models'
  const subheading = data?.subheading || pricingModelsData.subheading
  const ctaText = data?.cta_text || pricingModelsData.ctaText
  const ctaLink = data?.cta_link || '/contact'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <SectionBadge>Plans</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-cyan-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
        <AnimatedSection delay={0.1}>
          <p className="text-slate-600 max-w-3xl mx-auto">{subheading}</p>
        </AnimatedSection>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {models.map((model, i) => (
          <PricingCard
            key={model.name}
            name={model.name}
            description={model.description}
            index={i}
            featured={i === 1}
          />
        ))}
      </div>
      <AnimatedSection delay={0.4} className="mt-12 flex justify-center">
        <Link
          href={ctaLink}
          className="btn-primary"
        >
          {ctaText}
          <svg className="w-4 h-4 btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </AnimatedSection>
    </section>
  )
}

/* --- Portfolio --- */
function PortfolioSection({ data }: { data: HomepageSection | null }) {
  const portfolioItems = data?.items as unknown as PortfolioData | null
  const categories = portfolioItems?.categories || portfolioOverviewData.categories
  const projectDetails = portfolioItems?.projectDetails || portfolioOverviewData.projectDetails
  const heading = data?.heading || 'Portfolio'
  const subheading = data?.subheading || portfolioOverviewData.subheading
  const visible = data?.is_visible ?? true
  if (!visible) return null

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section className="container mx-auto px-6" ref={ref}>
      <div className="text-center mb-12">
        <SectionBadge>Our Work</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-orange-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
        <AnimatedSection delay={0.1}>
          <p className="text-slate-600 max-w-3xl mx-auto">{subheading}</p>
        </AnimatedSection>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {categories.map((category, i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="relative group p-5 rounded-2xl bg-white border border-slate-200/60 text-center hover:border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="relative text-sm font-semibold text-slate-800">
              {category}
            </h3>
          </motion.div>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-8">
          <h3
            className="text-lg font-bold text-slate-900 mb-4"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Every project highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectDetails.map((detail, i) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-3 text-sm text-slate-600"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>{detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

/* --- Insights & Learning --- */
function InsightsSection({ data }: { data: HomepageSection | null }) {
  const blogTopics = (data?.items as unknown as BlogTopicsData)?.topics || blogTopicsOverviewData.topics
  const blogSubheading = (data?.items as unknown as BlogTopicsData)?.subheading || blogTopicsOverviewData.subheading
  const heading = data?.heading || 'Insights and Learning'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  const hub: LearningHubData = {
    description: learningHubData.description,
    resources: learningHubData.resources,
    upcomingCourses: learningHubData.upcomingCourses,
  }

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <SectionBadge>Knowledge Base</SectionBadge>
        <GradientHeading
          className="text-3xl md:text-4xl font-bold mt-4 mb-4"
          gradient="from-slate-900 via-pink-800 to-slate-900"
        >
          {heading}
        </GradientHeading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blog Topics Card */}
        <MagicCard index={0} glowColor="rgba(99, 102, 241, 0.15)">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Geom', sans-serif" }}>
                Blog Topics
              </h3>
            </div>
            <p className="text-slate-600 text-sm mb-5">{blogSubheading}</p>
            <ul className="space-y-3">
              {blogTopics.map((topic, i) => (
                <AnimatedSection key={topic} delay={i * 0.05} direction="left">
                  <li className="flex items-start gap-3 text-sm text-slate-600 group/item hover:text-slate-900 transition-colors">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/item:scale-150 transition-transform" />
                    <span>{topic}</span>
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </MagicCard>

        {/* Learning Hub Card */}
        <MagicCard index={1} glowColor="rgba(16, 185, 129, 0.15)">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Geom', sans-serif" }}>
                Learning Hub
              </h3>
            </div>
            <p className="text-slate-600 text-sm mb-5">{hub.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {hub.resources.map((resource, i) => (
                <AnimatedSection key={resource} delay={i * 0.05} direction="none">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                    {resource}
                  </span>
                </AnimatedSection>
              ))}
            </div>

            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500" />
              Upcoming Courses
            </h4>
            <ul className="space-y-2.5">
              {hub.upcomingCourses.map((course, i) => (
                <AnimatedSection key={course} delay={0.2 + i * 0.05} direction="left">
                  <li className="flex items-start gap-3 text-sm text-slate-600 group/item hover:text-slate-900 transition-colors">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover/item:scale-150 transition-transform" />
                    <span>{course}</span>
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </MagicCard>
      </div>
    </section>
  )
}

/* --- Contact CTA --- */
function ContactSection({ data, footerData }: { data: HomepageSection | null; footerData?: { contactEmail?: string; contactPhone?: string; address?: string } }) {
  const contactItems = data?.items as unknown as ContactData | null
  const heading = data?.heading || 'Contact Us'
  const visible = data?.is_visible ?? true
  if (!visible) return null

  const email = contactItems?.email || footerData?.contactEmail || contactInfoData.email
  const phone = contactItems?.phone || footerData?.contactPhone || contactInfoData.phone
  const address = contactItems?.address || footerData?.address || contactInfoData.address
  const primaryCta = contactItems?.primaryCtaLabel || contactInfoData.primaryCtaLabel
  const secondaryCta = contactItems?.secondaryCtaLabel || contactInfoData.secondaryCtaLabel

  return (
    <section className="container mx-auto px-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 md:p-16 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative z-10">
            <GradientHeading
              className="text-3xl md:text-4xl font-bold mb-4"
              gradient="from-white via-blue-200 to-white"
            >
              {heading}
            </GradientHeading>

            <AnimatedSection delay={0.1}>
              <p className="text-slate-400 mb-2 text-lg">DeepNeurax Technologies</p>
            </AnimatedSection>

            {address && address !== '(Your address here)' && (
              <AnimatedSection delay={0.15}>
                <p className="text-slate-400 mb-6">{address}</p>
              </AnimatedSection>
            )}

            <AnimatedSection delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {phone}
                  </a>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  {primaryCta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  {secondaryCta}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

/* ====== Main Export ====== */

interface HomepageSectionsProps {
  sections: HomepageSection[] | null
  footerData?: { contactEmail?: string; contactPhone?: string; address?: string }
}

export default function HomepageSections({ sections, footerData }: HomepageSectionsProps) {
  // Define the order of sections (can be reordered by display_order from DB)
  const sectionOrder = [
    'service_areas',
    'solutions',
    'industries',
    'product_suite',
    'pricing',
    'portfolio',
    'insights',
    'contact_cta',
  ]

  // Sort by display_order if available
  const orderedKeys = sections
    ? [...sectionOrder].sort((a, b) => {
        const sA = getSectionData(sections, a)
        const sB = getSectionData(sections, b)
        return (sA?.display_order ?? 99) - (sB?.display_order ?? 99)
      })
    : sectionOrder

  const componentMap: Record<string, React.ReactNode> = {
    service_areas: <ServiceAreasSection key="service_areas" data={getSectionData(sections, 'service_areas')} />,
    solutions: <SolutionsSection key="solutions" data={getSectionData(sections, 'solutions')} />,
    industries: <IndustriesSection key="industries" data={getSectionData(sections, 'industries')} />,
    product_suite: <ProductSuiteSection key="product_suite" data={getSectionData(sections, 'product_suite')} />,
    pricing: <PricingSection key="pricing" data={getSectionData(sections, 'pricing')} />,
    portfolio: <PortfolioSection key="portfolio" data={getSectionData(sections, 'portfolio')} />,
    insights: <InsightsSection key="insights" data={getSectionData(sections, 'insights')} />,
    contact_cta: <ContactSection key="contact_cta" data={getSectionData(sections, 'contact_cta')} footerData={footerData} />,
  }

  return (
    <div className="mt-24 space-y-28">
      {orderedKeys.map(key => componentMap[key])}
    </div>
  )
}
