'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { servicesData as staticServices } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle, Zap, Shield, BarChart3, Globe, Database, Target, Layers, Cpu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Texture overlays ── */
const BlueGridTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
  </>
)

const WhiteDotsTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
  </>
)

const getServiceIcon = (title: string, icon?: string) => {
  const t = title.toLowerCase()
  if (icon === '🛡️' || t.includes('security')) return Shield
  if (icon === '📊' || t.includes('data')) return BarChart3
  if (icon === '🤖' || t.includes('learning') || t.includes('ai')) return Database
  if (icon === '☁️' || t.includes('cloud')) return Globe
  if (icon === '⚡' || t.includes('consulting')) return Zap
  if (t.includes('iot')) return Cpu
  if (t.includes('saas') || t.includes('product')) return Layers
  if (t.includes('growth') || t.includes('digital')) return Target
  if (t.includes('enterprise') || t.includes('platform')) return Globe
  if (t.includes('api') || t.includes('business')) return Layers
  return CheckCircle
}

/* ── Per-service rich content ── */
const serviceContent: Record<string, { features: string[]; benefits: string[]; process: { step: string; desc: string }[] }> = {
  'ai-machine-learning': {
    features: [
      'Custom ML model development & training',
      'Generative AI integration (LLMs, image synthesis)',
      'Intelligent automation pipelines',
      'AI agent-based systems & copilots',
      'Computer vision & NLP solutions',
      'Predictive analytics & forecasting',
    ],
    benefits: [
      'Reduce operational costs by up to 40% through intelligent automation',
      'Make data-driven decisions with real-time AI insights',
      'Scale AI capabilities from prototype to production seamlessly',
      'Stay ahead of competitors with cutting-edge AI technologies',
    ],
    process: [
      { step: 'Discovery', desc: 'We analyze your data landscape, business goals, and identify high-impact AI opportunities.' },
      { step: 'Design', desc: 'Our team architects custom ML pipelines, selects optimal models, and designs the integration strategy.' },
      { step: 'Develop', desc: 'We build, train, and fine-tune AI models using your data with rigorous testing and validation.' },
      { step: 'Deploy', desc: 'Production deployment with monitoring, auto-scaling, and continuous model improvement.' },
    ],
  },
  'iot-solutions': {
    features: [
      'Secure device connectivity & provisioning',
      'Real-time data collection & edge computing',
      'Industrial IoT monitoring dashboards',
      'Predictive maintenance systems',
      'Smart infrastructure management',
      'IoT-to-cloud data pipelines',
    ],
    benefits: [
      'Achieve real-time visibility across all connected assets',
      'Reduce unplanned downtime by up to 40% with predictive alerts',
      'Optimize energy usage and operational efficiency',
      'Build secure, scalable IoT architectures from edge to cloud',
    ],
    process: [
      { step: 'Assess', desc: 'We evaluate your environment, device landscape, and connectivity requirements.' },
      { step: 'Architect', desc: 'Design secure IoT architecture with edge processing, data flow, and cloud integration.' },
      { step: 'Implement', desc: 'Deploy sensors, gateways, and middleware with real-time monitoring dashboards.' },
      { step: 'Optimize', desc: 'Continuous monitoring, predictive analytics, and iterative system improvements.' },
    ],
  },
  'business-api-solutions': {
    features: [
      'Enterprise-grade REST & GraphQL APIs',
      'Microservices architecture design',
      'Legacy system modernization',
      'Third-party API integrations',
      'API gateway & security management',
      'Real-time event-driven systems',
    ],
    benefits: [
      'Accelerate business processes by 2-3x with modern APIs',
      'Eliminate silos by connecting all systems seamlessly',
      'Future-proof your architecture with scalable microservices',
      'Reduce integration timelines from months to weeks',
    ],
    process: [
      { step: 'Audit', desc: 'We map your existing systems, data flows, and identify modernization priorities.' },
      { step: 'Plan', desc: 'Design API-first architecture with domain-driven service boundaries.' },
      { step: 'Build', desc: 'Develop secure, versioned APIs with comprehensive documentation and testing.' },
      { step: 'Migrate', desc: 'Phased migration from legacy systems with zero-downtime deployment strategies.' },
    ],
  },
  'saas-products': {
    features: [
      'Multi-tenant SaaS architecture',
      'HR, payroll, and inventory modules',
      'Role-based access & permissions',
      'Real-time analytics dashboards',
      'White-label customization options',
      'API-first integration capabilities',
    ],
    benefits: [
      'Launch market-ready SaaS products in weeks, not months',
      'Reduce operational overhead with automated workflows',
      'Scale effortlessly from 10 users to 10,000+',
      'Plug modules into existing ecosystems with minimal friction',
    ],
    process: [
      { step: 'Define', desc: 'We work with you to define product requirements, user stories, and MVP scope.' },
      { step: 'Prototype', desc: 'Rapid prototyping with interactive wireframes and stakeholder feedback.' },
      { step: 'Develop', desc: 'Agile development sprints with multi-tenant architecture and security built-in.' },
      { step: 'Launch', desc: 'Deployment, onboarding, and continuous iteration based on user analytics.' },
    ],
  },
  'digital-growth-solutions': {
    features: [
      'Performance-driven SEO strategy',
      'Paid media campaign management',
      'Social media scaling & automation',
      'Analytics & conversion optimization',
      'Content strategy & marketing',
      'Brand identity & digital presence',
    ],
    benefits: [
      'Increase organic traffic by up to 300% with data-driven SEO',
      'Maximize ROI on ad spend with AI-optimized campaigns',
      'Build a consistent, powerful digital brand presence',
      'Convert more visitors into customers with UX-focused optimization',
    ],
    process: [
      { step: 'Analyze', desc: 'Deep audit of your digital presence, competitors, and target audience behavior.' },
      { step: 'Strategize', desc: 'Create a multi-channel growth plan with measurable KPIs and milestones.' },
      { step: 'Execute', desc: 'Launch campaigns across SEO, paid media, and social channels simultaneously.' },
      { step: 'Scale', desc: 'Data-driven optimization, A/B testing, and scaling of winning strategies.' },
    ],
  },
  'custom-enterprise-platforms': {
    features: [
      'End-to-end platform development',
      'Enterprise-grade security & compliance',
      'Multi-tenant & multi-role systems',
      'Cloud-native & hybrid architectures',
      'Custom CRM, ERP & portal solutions',
      'Government & regulated sector expertise',
    ],
    benefits: [
      'Get a platform built exactly for your business processes',
      'Ensure compliance with industry regulations and standards',
      'Scale from startup to enterprise without re-architecture',
      'Reduce vendor dependency with full ownership of your platform',
    ],
    process: [
      { step: 'Discover', desc: 'Extensive stakeholder interviews, process mapping, and requirements engineering.' },
      { step: 'Design', desc: 'System architecture, UX/UI design, and technical specification documentation.' },
      { step: 'Build', desc: 'Sprint-based development with regular demos, testing, and stakeholder sign-off.' },
      { step: 'Deliver', desc: 'Production deployment, training, documentation, and ongoing support engagement.' },
    ],
  },
}

const defaultContent = {
  features: [
    'Custom solution design & architecture',
    'Agile development methodology',
    'Enterprise-grade security',
    'Scalable cloud infrastructure',
    'Comprehensive testing & QA',
    'Ongoing support & maintenance',
  ],
  benefits: [
    'Accelerate your digital transformation journey',
    'Reduce costs with intelligent automation',
    'Scale confidently with robust architecture',
    'Stay secure with built-in compliance',
  ],
  process: [
    { step: 'Discovery', desc: 'We understand your business goals, challenges, and technical requirements.' },
    { step: 'Design', desc: 'Our team creates detailed architecture, UX/UI designs, and project roadmaps.' },
    { step: 'Develop', desc: 'Agile sprints with transparent progress tracking and regular stakeholder demos.' },
    { step: 'Deploy', desc: 'Production launch with monitoring, optimization, and continuous improvement.' },
  ],
}

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const { footer, services } = useLayoutData()

  const staticService = staticServices.find(s => s.slug === slug)
  const [service, setService] = useState<any>(staticService ? {
    id: staticService.id.toString(), title: staticService.title, slug: staticService.slug,
    description: staticService.description, icon: staticService.icon, order: staticService.order,
    link: staticService.link, image: staticService.image || undefined,
  } : null)

  useEffect(() => {
    async function fetchService() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('services').select('*').eq('slug', slug).single()
      if (data) {
        setService({
          id: data.id, title: data.title, slug: data.slug,
          description: data.description, icon: data.icon, order: data.order,
          link: data.link, image: data.image_url ? { asset: { url: data.image_url } } : undefined,
        })
      }
    }
    fetchService()
  }, [slug])

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1d4f]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/services" className="text-blue-300 font-semibold hover:text-white transition-colors">
            <ArrowLeft size={16} className="inline mr-2" />Back to Services
          </Link>
        </div>
      </div>
    )
  }

  const content = serviceContent[service.slug] || defaultContent
  const mainImage = typeof service.image === 'string' ? service.image : service.image?.asset?.url
  const otherServices = staticServices.filter(s => s.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen">
      <Header
        logo={footer?.siteLogo}
        logoLight={footer?.siteLogoLight}
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />

      {/* ═══════════ HERO — Blue + White Dots ═══════════ */}
      <section className="relative bg-[#0b1d4f] overflow-hidden pt-36 pb-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6">
          <Link href="/services" className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Back to All Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-6">
                {React.createElement(getServiceIcon(service.title, service.icon), { size: 28 })}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Geom', sans-serif" }}>
                {service.title}
              </h1>
              <p className="text-lg text-blue-100/70 mb-8 leading-relaxed max-w-lg">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0b1d4f] font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link href="#features" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors">
                  View Features
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {mainImage ? (
                <Image src={mainImage} alt={service.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                  {React.createElement(getServiceIcon(service.title, service.icon), { size: 80, className: 'text-white/20' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ KEY FEATURES — White + Blue Grid ═══════════ */}
      <section id="features" className="relative bg-white overflow-hidden py-24">
        <BlueGridTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
              Key Features
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to leverage {service.title.toLowerCase()} for your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(11,29,79,0.1)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#0b1d4f] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <CheckCircle size={20} />
                </div>
                <span className="text-slate-700 font-medium text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ OUR PROCESS — Blue + White Dots ═══════════ */}
      <section className="relative bg-[#0b1d4f] overflow-hidden py-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
              Our Process
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              A proven methodology that delivers results every time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.process.map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-400/20 flex items-center justify-center text-blue-200 font-bold text-lg mb-5">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.step}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US — White + Blue Grid ═══════════ */}
      <section className="relative bg-white overflow-hidden py-24">
        <BlueGridTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Geom', sans-serif" }}>
                Why Choose DeepNeurax?
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                We don&apos;t just deliver services — we engineer outcomes. Our team combines deep domain expertise with cutting-edge technology to create solutions that drive measurable business impact.
              </p>
              <div className="space-y-5">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#0b1d4f] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Projects Delivered', value: '500+' },
                { label: 'Client Satisfaction', value: '98%' },
                { label: 'AI Models Deployed', value: '1000+' },
                { label: 'Data Points Processed', value: '10B+' },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center">
                  <div className="text-3xl font-black text-[#0b1d4f] mb-2" style={{ fontFamily: "'Geom', sans-serif" }}>{stat.value}</div>
                  <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OTHER SERVICES — Blue + White Dots ═══════════ */}
      <section className="relative bg-[#0b1d4f] overflow-hidden py-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
              Explore More Services
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Discover our full range of capabilities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group p-8 rounded-3xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  {React.createElement(getServiceIcon(s.title, s.icon), { size: 24 })}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-blue-100/60 text-sm line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA — White + Blue Grid ═══════════ */}
      <section className="relative bg-white overflow-hidden py-28">
        <BlueGridTexture />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Geom', sans-serif" }}>
            Ready to Get Started?
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg">
            Let&apos;s discuss how {service.title.toLowerCase()} can accelerate your business growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0b1d4f] text-white font-semibold hover:bg-[#0e2563] transition-colors shadow-lg"
          >
            Start Your Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
