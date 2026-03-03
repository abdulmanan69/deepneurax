'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import {
  servicesData as staticServices,
  servicesOverviewData,
  solutionsOverviewData,
  industriesServedData,
  pricingModelsData,
  contactInfoData,
} from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Globe, Database } from 'lucide-react'
import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Shared texture overlays ── */
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
  if (icon === '🤖' || t.includes('learning')) return Database
  if (icon === '☁️' || t.includes('cloud')) return Globe
  if (icon === '⚡' || t.includes('consulting')) return Zap
  return CheckCircle
}

export default function ServicesPage() {
  const { footer, services: layoutServices } = useLayoutData()
  const [services, setServices] = useState<any[]>(
    staticServices.map((s) => ({
      id: s.id.toString(), title: s.title, slug: s.slug,
      description: s.description, icon: s.icon, order: s.order, link: s.link,
    }))
  )

  useEffect(() => {
    async function fetchServices() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('services').select('*').order('order', { ascending: true })
      if (data) {
        setServices(data.map((s: any) => ({
          id: s.id, title: s.title, slug: s.slug,
          description: s.description, icon: s.icon, order: s.order,
          link: s.link || `/services/${s.slug}`,
          image: s.image_url ? { asset: { url: s.image_url } } : undefined,
        })))
      }
    }
    fetchServices()
  }, [])

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
        <div className="relative z-10 container mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 border border-white/10">
            What We Do
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Geom', sans-serif" }}>
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
            {servicesOverviewData.subheading}
          </p>
        </div>
      </section>

      <main>
        {/* ═══════════ SERVICES GRID — White + Blue Grid ═══════════ */}
        <section className="relative bg-white overflow-hidden py-24">
          <BlueGridTexture />
          <div className="relative z-10 container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: any, index: number) => (
                <div 
                  key={index}
                  className="group p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(11,29,79,0.15)] hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0b1d4f] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {React.createElement(getServiceIcon(service.title, service.icon), { size: 28 })}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {service.title}
                  </h3>

                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  <Link 
                    href={`/services/${service.slug || service.id}`}
                    className="inline-flex items-center gap-2 text-[#0b1d4f] font-semibold text-sm hover:text-blue-600 transition-colors group/link"
                  >
                    Learn More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ DETAILED SERVICE AREAS — Blue + White Dots ═══════════ */}
        <section className="relative bg-[#0b1d4f] overflow-hidden py-24">
          <WhiteDotsTexture />
          <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Detailed Service Areas
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto mb-14 text-center">
              Deep expertise across AI, security, cloud, and data engineering domains.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesOverviewData.categories.map((category) => (
                <div
                  key={category.title}
                  className="p-8 rounded-3xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {category.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {category.items.map((item: string) => (
                      <li key={item} className="flex items-start gap-2.5 text-blue-100/80 text-sm">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SOLUTIONS — White + Blue Grid ═══════════ */}
        <section className="relative bg-white overflow-hidden py-24">
          <BlueGridTexture />
          <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Solutions
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-14 text-center">
              {solutionsOverviewData.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionsOverviewData.categories.map((category) => (
                <div
                  key={category.title}
                  className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {category.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {category.items.map((item: string) => (
                      <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ INDUSTRIES — Blue + White Dots ═══════════ */}
        <section className="relative bg-[#0b1d4f] overflow-hidden py-24">
          <WhiteDotsTexture />
          <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Industries We Serve
            </h2>
            <p className="text-blue-100/70 max-w-3xl mx-auto mb-12 text-center">
              {industriesServedData.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industriesServedData.industries.map((industry: string) => (
                <span
                  key={industry}
                  className="px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.06] text-blue-100 text-sm font-medium hover:bg-white/[0.12] transition-colors"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PRICING — White + Blue Grid ═══════════ */}
        <section className="relative bg-white overflow-hidden py-24">
          <BlueGridTexture />
          <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Pricing &amp; Engagement Models
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-14 text-center">
              {pricingModelsData.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingModelsData.models.map((model, i) => (
                <div
                  key={model.name}
                  className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                    i === 1
                      ? 'bg-[#0b1d4f] border-[#0b1d4f] text-white shadow-2xl scale-[1.03]'
                      : 'bg-white border-slate-200 shadow-lg'
                  }`}
                >
                  {i === 1 && (
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-medium mb-4">
                      Most Popular
                    </span>
                  )}
                  <h3 className={`text-xl font-bold mb-3 ${i === 1 ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Geom', sans-serif" }}>
                    {model.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${i === 1 ? 'text-blue-100/80' : 'text-slate-600'}`}>
                    {model.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0b1d4f] text-white font-semibold hover:bg-[#0e2563] transition-colors shadow-lg"
              >
                {pricingModelsData.ctaText} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ CTA — Blue + White Dots ═══════════ */}
        <section className="relative bg-[#0b1d4f] overflow-hidden py-28">
          <WhiteDotsTexture />
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Geom', sans-serif" }}>
              Ready to Transform Your Business?
            </h2>
            <p className="text-blue-100/70 mb-10 max-w-2xl mx-auto text-lg">
              Let&apos;s discuss how our AI services can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0b1d4f] font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                {contactInfoData.primaryCtaLabel} <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {contactInfoData.secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {footer && (
        <Footer 
          data={footer} 
          services={layoutServices} 
        />
      )}
    </div>
  )
}
