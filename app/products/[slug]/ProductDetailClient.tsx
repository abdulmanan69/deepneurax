'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { productsData as staticProducts } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Sparkles, Shield, Zap, Cpu, CheckCircle, Boxes, Network, Layers } from 'lucide-react'
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

const getProductIcon = (name: string, icon?: string) => {
  const n = name.toLowerCase()
  if (icon === '📦' || n.includes('platform') || n.includes('saas') || n.includes('modules')) return Boxes
  if (icon === '⚙️' || n.includes('automl') || n.includes('suite')) return Cpu
  if (icon === '📊' || n.includes('viz') || n.includes('analytics') || n.includes('inventory')) return Network
  if (n.includes('ai') || n.includes('grading')) return Sparkles
  if (n.includes('chemistry')) return Layers
  if (n.includes('payroll') || n.includes('hr')) return Shield
  return Layers
}

/* ── Per-product rich content ── */
const productContent: Record<string, { tagline: string; features: string[]; highlights: { label: string; value: string }[]; useCases: string[] }> = {
  'digital-chemistry': {
    tagline: 'Revolutionizing Chemistry Education',
    features: [
      'Interactive periodic table with detailed element properties',
      'Molecule formulation & 3D visualization engine',
      'Virtual reactor simulation for experiments',
      'Lab safety training modules',
      'Real-time collaboration for students & teachers',
      'Curriculum-aligned content library',
    ],
    highlights: [
      { label: 'Elements Covered', value: '118' },
      { label: 'Simulations', value: '200+' },
      { label: 'Schools Using', value: '50+' },
      { label: 'User Rating', value: '4.8/5' },
    ],
    useCases: [
      'Universities & high schools modernizing chemistry labs',
      'Research institutions running virtual experiments',
      'EdTech platforms seeking interactive science content',
      'Corporate R&D teams for chemical analysis',
    ],
  },
  'ai-grading-system': {
    tagline: 'AI That Grades Smarter',
    features: [
      'Automated assignment & exam grading with AI',
      'Transparent scoring with detailed rubric matching',
      'Plagiarism detection & originality scoring',
      'Handwriting recognition for paper-based exams',
      'Analytics dashboards for student performance',
      'Multi-format support (PDF, images, text, code)',
    ],
    highlights: [
      { label: 'Grading Accuracy', value: '95%+' },
      { label: 'Time Saved', value: '80%' },
      { label: 'Formats Supported', value: '10+' },
      { label: 'Exams Graded', value: '100K+' },
    ],
    useCases: [
      'Educational institutions with high exam volumes',
      'Online learning platforms needing auto-grading',
      'Corporate training & certification assessments',
      'Competitive exam preparation platforms',
    ],
  },
  'smart-inventory-manager': {
    tagline: 'Intelligent Stock Management',
    features: [
      'Real-time stock tracking across warehouses',
      'AI-powered demand forecasting',
      'Automated purchase order generation',
      'Barcode & QR code scanning integration',
      'Multi-location inventory management',
      'Expiry & batch tracking for perishables',
    ],
    highlights: [
      { label: 'Stock Accuracy', value: '99.5%' },
      { label: 'Cost Reduction', value: '35%' },
      { label: 'SKUs Tracked', value: '50K+' },
      { label: 'Warehouses', value: 'Unlimited' },
    ],
    useCases: [
      'Retail chains managing multi-store inventory',
      'Manufacturing plants tracking raw materials',
      'E-commerce businesses optimizing fulfillment',
      'Healthcare facilities managing medical supplies',
    ],
  },
  'ai-payroll-hrms': {
    tagline: 'Smarter HR, Automated Payroll',
    features: [
      'AI-driven payroll processing with tax compliance',
      'Biometric & geo-fenced attendance tracking',
      'Employee self-service portal',
      'Leave management & approval workflows',
      'Performance analytics & insights',
      'Multi-currency & multi-branch support',
    ],
    highlights: [
      { label: 'Processing Time', value: '-90%' },
      { label: 'Compliance Rate', value: '100%' },
      { label: 'Employees Managed', value: '10K+' },
      { label: 'Payroll Accuracy', value: '99.9%' },
    ],
    useCases: [
      'SMEs automating manual HR processes',
      'Enterprises with distributed workforces',
      'Organizations needing tax-compliant payroll',
      'Companies modernizing attendance & leave systems',
    ],
  },
  'custom-saas-modules': {
    tagline: 'Modular, Scalable, Ready to Deploy',
    features: [
      'Pre-built modules for common business functions',
      'Multi-tenant architecture out of the box',
      'White-label customization options',
      'Role-based access control & security',
      'API-first design for easy integration',
      'Real-time analytics & reporting dashboards',
    ],
    highlights: [
      { label: 'Ready Modules', value: '15+' },
      { label: 'Setup Time', value: '< 2 weeks' },
      { label: 'Uptime SLA', value: '99.9%' },
      { label: 'Integrations', value: '30+' },
    ],
    useCases: [
      'Startups launching SaaS products quickly',
      'Enterprises adding modular capabilities',
      'Agencies white-labeling software for clients',
      'Industry-specific vertical SaaS solutions',
    ],
  },
}

const defaultProductContent = {
  tagline: 'AI-Powered Innovation',
  features: [
    'Intelligent automation & workflows',
    'Real-time analytics dashboards',
    'Secure, scalable architecture',
    'API-first integration design',
    'Multi-tenant & multi-role support',
    'Continuous updates & support',
  ],
  highlights: [
    { label: 'Uptime', value: '99.9%' },
    { label: 'Performance', value: 'Fast' },
    { label: 'Security', value: 'Enterprise' },
    { label: 'Support', value: '24/7' },
  ],
  useCases: [
    'Businesses looking to automate operations',
    'Teams needing data-driven insights',
    'Organizations requiring scalable infrastructure',
    'Companies modernizing legacy systems',
  ],
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { footer, services } = useLayoutData()

  const staticProduct = staticProducts.find(p => p.slug === slug)
  const [product, setProduct] = useState<any>(staticProduct ? {
    id: staticProduct.id.toString(), name: staticProduct.name, slug: staticProduct.slug,
    description: staticProduct.description, icon: staticProduct.icon, order: staticProduct.order,
    link: staticProduct.link, image: staticProduct.image || undefined,
  } : null)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (data) {
        setProduct({
          id: data.id, name: data.name, slug: data.slug,
          description: data.description, icon: data.icon, order: data.order,
          link: data.link, image: data.image_url ? { asset: { url: data.image_url } } : undefined,
        })
      }
    }
    fetchProduct()
  }, [slug])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1d4f]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-300 font-semibold hover:text-white transition-colors">
            <ArrowLeft size={16} className="inline mr-2" />Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const content = productContent[product.slug] || defaultProductContent
  const mainImage = typeof product.image === 'string' ? product.image : product.image?.asset?.url
  const otherProducts = staticProducts.filter(p => p.slug !== slug).slice(0, 3)

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
          <Link href="/products" className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Back to All Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 border border-white/10">
                <Sparkles size={14} /> {content.tagline}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Geom', sans-serif" }}>
                {product.name}
              </h1>
              <p className="text-lg text-blue-100/70 mb-8 leading-relaxed max-w-lg">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0b1d4f] font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                  Request Demo <ArrowRight size={18} />
                </Link>
                <Link href="#features" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors">
                  View Features
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                  {React.createElement(getProductIcon(product.name, product.icon), { size: 80, className: 'text-white/20' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ KEY METRICS — White + Blue Grid ═══════════ */}
      <section className="relative bg-white overflow-hidden py-16">
        <BlueGridTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center">
                <div className="text-3xl font-black text-[#0b1d4f] mb-2" style={{ fontFamily: "'Geom', sans-serif" }}>{h.value}</div>
                <div className="text-slate-500 text-sm font-medium">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES — Blue + White Dots ═══════════ */}
      <section id="features" className="relative bg-[#0b1d4f] overflow-hidden py-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
              Key Features
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Everything that makes {product.name} a powerful solution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <CheckCircle size={20} />
                </div>
                <span className="text-blue-100/80 font-medium text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ USE CASES — White + Blue Grid ═══════════ */}
      <section className="relative bg-white overflow-hidden py-24">
        <BlueGridTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Geom', sans-serif" }}>
                Who Is This For?
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                {product.name} is built for organizations that need a reliable, scalable, and intelligent solution to transform their operations.
              </p>
              <div className="space-y-5">
                {content.useCases.map((useCase, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#0b1d4f] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Zap, label: 'High Performance', desc: 'Optimized for speed and efficiency' },
                { icon: Shield, label: 'Enterprise Secure', desc: 'Security-first architecture' },
                { icon: Sparkles, label: 'AI-Powered', desc: 'Intelligent automation built-in' },
                { icon: Cpu, label: 'Scalable', desc: 'Grows with your business needs' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="w-10 h-10 rounded-xl bg-[#0b1d4f] flex items-center justify-center text-white mb-4">
                    {React.createElement(item.icon, { size: 20 })}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.label}</h4>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OTHER PRODUCTS — Blue + White Dots ═══════════ */}
      <section className="relative bg-[#0b1d4f] overflow-hidden py-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
              Explore More Products
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Discover our full range of AI-powered solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherProducts.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group p-8 rounded-3xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  {React.createElement(getProductIcon(p.name, p.icon), { size: 24 })}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                <p className="text-blue-100/60 text-sm line-clamp-2">{p.description}</p>
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
            Ready to Try {product.name}?
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg">
            Get a personalized demo and see how it can transform your operations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0b1d4f] text-white font-semibold hover:bg-[#0e2563] transition-colors shadow-lg"
          >
            Request a Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
