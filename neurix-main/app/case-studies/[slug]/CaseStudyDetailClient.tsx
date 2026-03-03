'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { caseStudiesData as staticCaseStudies } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CaseStudyDetailClient({ slug }: { slug: string }) {
  const { footer, services } = useLayoutData()

  const staticStudy = staticCaseStudies.find(c => c.slug === slug)
  const [study, setStudy] = useState<any>(staticStudy ? {
    id: staticStudy.id.toString(), title: staticStudy.title, slug: staticStudy.slug,
    description: staticStudy.description, bulletPoints: staticStudy.bulletPoints,
    isActive: staticStudy.isActive, order: staticStudy.order,
    backgroundImage: staticStudy.backgroundImage || null,
    metrics: staticStudy.metrics, link: null,
  } : null)

  useEffect(() => {
    async function fetchStudy() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('case_studies').select('*').eq('slug', slug).single()
      if (data) {
        setStudy({
          id: data.id, title: data.title, slug: data.slug,
          description: data.description, bulletPoints: data.bullet_points || [],
          isActive: data.is_active, order: data.order,
          backgroundImage: data.background_image_url ? { asset: { url: data.background_image_url } } : null,
          metrics: data.metrics || [], link: data.link || null,
        })
      }
    }
    fetchStudy()
  }, [slug])

  if (!study) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Case Study Not Found</h1>
          <Link href="/" className="text-blue-600 font-bold">← Back Home</Link>
        </div>
      </div>
    )
  }

  const bgImage = study.backgroundImage

  return (
    <div className="bg-white min-h-screen">
      <Header 
        logo={footer?.siteLogo} 
        logoLight={footer?.siteLogoLight} 
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />
      
      <main>
        <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            {bgImage?.asset?.url ? (
              <Image src={bgImage.asset.url} alt={study.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900" />
            )}
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <Link href="/#case-studies" className="inline-flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-colors">
              <ArrowLeft size={20} /> Back to Case Studies
            </Link>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
              {study.title}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
              {study.description}
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8 text-slate-900">Project Overview</h2>
                <div className="prose prose-lg max-w-none text-slate-600">
                  <p>{study.description}</p>
                </div>

                {study.bulletPoints && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 text-slate-900">Key Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {study.bulletPoints.map((point: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                          <span className="text-slate-700 font-medium">{typeof point === 'string' ? point : point.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-32">
                  <h3 className="text-xl font-bold mb-8 border-b border-white/10 pb-4">Impact Metrics</h3>
                  <div className="space-y-8">
                    {study.metrics && Array.isArray(study.metrics) && study.metrics.map((m: any, i: number) => (
                      <div key={i}>
                        <div className="text-4xl font-black text-blue-400 mb-1" style={{ fontFamily: "'Geom', sans-serif" }}>{m.value}</div>
                        <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {study.link && (
                    <a href={study.link} target="_blank" className="btn-primary w-full mt-10">
                      Visit Project
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
