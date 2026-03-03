'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import {
  servicesData as staticServices,
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
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Globe, Database } from 'lucide-react'
import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    <div className="bg-white min-h-screen">
      <Header 
        logo={footer?.siteLogo}
        logoLight={footer?.siteLogoLight}
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
            Our Services
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {servicesOverviewData.subheading}
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any, index: number) => (
              <div 
                key={index}
                className="group p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {React.createElement(getServiceIcon(service.title, service.icon), { size: 32 })}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {service.description}
                </p>

                <Link 
                  href={`/services/${service.slug || service.id}`}
                  className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors"
                >
                  Learn More <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 mt-24 space-y-24">
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Detailed Service Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesOverviewData.categories.map((category) => (
                <div
                  key={category.title}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {category.title}
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    {category.items.map((item: string) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-blue-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Solutions
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-10 text-center">
              {solutionsOverviewData.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionsOverviewData.categories.map((category) => (
                <div
                  key={category.title}
                  className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    {category.items.map((item: string) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-blue-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Industries We Serve
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
              {industriesServedData.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industriesServedData.industries.map((industry: string) => (
                <span
                  key={industry}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Products
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
              Explore our ready-to-use platforms designed for security, efficiency, and growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productSuiteData.products.map((product) => (
                <div
                  key={product.name}
                  className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Pricing and Engagement Models
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
              {pricingModelsData.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingModelsData.models.map((model) => (
                <div
                  key={model.name}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {model.name}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {pricingModelsData.ctaText}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Portfolio
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
              {portfolioOverviewData.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {portfolioOverviewData.categories.map((category: string) => (
                <div
                  key={category}
                  className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {category}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    End-to-end delivery from discovery to deployment with measurable business impact.
                  </p>
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Every project highlights
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 text-sm">
                {portfolioOverviewData.projectDetails.map((detail: string) => (
                  <li key={detail} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Insights and Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Blog Topics
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {blogTopicsOverviewData.subheading}
                </p>
                <ul className="space-y-2 text-slate-700 text-sm">
                  {blogTopicsOverviewData.topics.map((topic: string) => (
                    <li key={topic} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-500">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Learning Hub
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  {learningHubData.description}
                </p>
                <ul className="space-y-2 text-slate-700 text-sm mb-4">
                  {learningHubData.resources.map((resource: string) => (
                    <li key={resource} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-500">•</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Upcoming Courses
                </h4>
                <ul className="space-y-1 text-slate-700 text-sm">
                  {learningHubData.upcomingCourses.map((course: string) => (
                    <li key={course} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-500">•</span>
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Geom', sans-serif" }}>
              Contact Us
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-slate-600 mb-4">
                DeepNeurax Technologies
              </p>
              <p className="text-slate-600 mb-6">
                {contactInfoData.address}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                {contactInfoData.email && (
                  <a
                    href={`mailto:${contactInfoData.email}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contactInfoData.email}
                  </a>
                )}
                {contactInfoData.phone && (
                  <a
                    href={`tel:${contactInfoData.phone}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contactInfoData.phone}
                  </a>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  {contactInfoData.primaryCtaLabel}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  {contactInfoData.secondaryCtaLabel}
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="container mx-auto px-6 mt-32">
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Let&apos;s discuss how our AI services can help you achieve your goals.</p>
              <Link href="/contact" className="btn-primary bg-white text-blue-900 hover:bg-blue-50 border-none">
                Get a Consultation
              </Link>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-blue-500 rounded-full blur-[150px]" />
            </div>
          </div>
        </div>
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
