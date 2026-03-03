'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { servicesData as staticServices } from '@/lib/data/index'
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
            Comprehensive AI solutions tailored to drive innovation and efficiency in your organization.
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

        {/* Call to Action */}
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
