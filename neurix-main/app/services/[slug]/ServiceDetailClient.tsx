'use client'

import { useState, useEffect, use } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { servicesData as staticServices } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Zap, Shield, BarChart3, Globe, Database } from 'lucide-react'
import Link from 'next/link'
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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <Link href="/services" className="text-blue-600 font-bold">← Back to Services</Link>
        </div>
      </div>
    )
  }

  const mainImage = service.image

  return (
    <div className="bg-white min-h-screen">
      <Header 
        logo={footer?.siteLogo} 
        logoLight={footer?.siteLogoLight} 
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />
      
      <main className="pt-32">
        <div className="container mx-auto px-6 py-12">
          <Link href="/services" className="inline-flex items-center gap-2 text-blue-600 mb-12 hover:gap-3 transition-all font-bold">
            <ArrowLeft size={20} /> Back to All Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8">
                 {React.createElement(getServiceIcon(service.title, service.icon), { size: 32 })}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
                {service.title}
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {service.description}
              </p>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
                <h3 className="font-bold text-lg mb-2 text-slate-900">Why Choose This Service?</h3>
                <p className="text-slate-600">Our {service.title} service is designed to deliver scalable, high-impact results for your business using cutting-edge AI technologies.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary py-4 px-10 text-lg">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-[40px] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl">
              {mainImage?.asset?.url ? (
                <Image src={mainImage.asset.url} alt={service.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
                  <Database size={120} className="text-white opacity-20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
