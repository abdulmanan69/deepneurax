'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CaseStudy {
  id: number | string
  title: string
  slug: string
  description?: string
  bulletPoints?: (string | { text?: string | null })[]
  backgroundImage?: {
    asset?: { url: string }
    url?: string
  } | null
  link?: string | null
}

interface SectionData {
  title: string
  description: string
}

export default function CaseStudiesScroll({ 
  caseStudies, 
  sectionData 
}: { 
  caseStudies: CaseStudy[], 
  sectionData: SectionData 
}) {
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const normalized = useMemo(() => {
    return caseStudies.map(study => {
      let bgUrl = ''
      const bg = study.backgroundImage
      if (bg) {
        if (typeof bg === 'string') bgUrl = bg
        else if (bg.asset?.url) bgUrl = bg.asset.url
        else if (bg.url) bgUrl = bg.url
      }
      
      return {
        ...study,
        bulletPoints: Array.isArray(study.bulletPoints)
          ? study.bulletPoints
              .map(bp => (typeof bp === 'string' ? bp : bp?.text || ''))
              .filter(Boolean) as string[]
          : [],
        backgroundUrl: bgUrl,
      }
    })
  }, [caseStudies])

  useEffect(() => {
    if (!mainContainerRef.current || !titleRef.current || !descriptionRef.current) return

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: Simple Stacked Layout (No Pinning)
      gsap.set(titleRef.current, { position: 'relative', fontSize: '3rem', textAlign: 'center', width: '100%', left: 'auto', top: 'auto', xPercent: 0, yPercent: 0, marginBottom: '2rem' });
      gsap.set(descriptionRef.current, { position: 'relative', opacity: 1, y: 0, left: 'auto', top: 'auto', width: '100%', marginBottom: '3rem' });
      gsap.set('.cs-card-stack', { position: 'relative', opacity: 1, x: 0, scale: 1, marginBottom: '2rem' });
      return; // Exit GSAP setup for mobile
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.cs-card-stack')
      
      // Initial States
      gsap.set(titleRef.current, {
        fontSize: '12vw',
        position: 'fixed',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        textAlign: 'center',
        width: '100vw',
        zIndex: 100,
        opacity: 1,
        willChange: 'transform, font-size',
      })

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 30,
        position: 'fixed',
        left: '10%',
        top: '40%',
        width: '35vw',
        zIndex: 90,
        willChange: 'transform, opacity',
      })

      gsap.set(cards, {
        opacity: 0,
        x: 100,
        scale: 0.9,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      })

      // Master Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          end: `+=${(normalized.length + 1) * 100}%`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        }
      })

      // 1. Title Move: Center -> Left
      tl.to(titleRef.current, {
        fontSize: '3.5rem',
        left: '10%',
        top: '20%',
        xPercent: 0,
        yPercent: 0,
        textAlign: 'left',
        width: '35vw',
        duration: 2,
        ease: 'power2.inOut'
      })

      // 2. Description Fade In
      tl.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1
      }, '-=0.5')

      // 3. Cards Sequential Display
      cards.forEach((card, i) => {
        const cardTl = gsap.timeline()
        
        if (i > 0) {
          // Fade out previous
          cardTl.to(cards[i-1], {
            opacity: 0,
            x: -50,
            scale: 0.95,
            duration: 1,
            pointerEvents: 'none'
          })
        }

        // Fade in current
        cardTl.to(card, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          pointerEvents: 'auto'
        }, i === 0 ? '-=0.5' : '<')

        // Hold frame
        cardTl.to({}, { duration: 1.5 })

        tl.add(cardTl)
      })

    }, mainContainerRef)

    return () => {
      ctx.revert()
    }
  }, [normalized])

  if (!normalized.length) return null

  return (
    <section 
      id="case-studies"
      ref={mainContainerRef} 
      className="relative w-full min-h-screen bg-white text-slate-900 overflow-hidden py-20 md:py-0"
    >
      {/* Blue grid texture */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      <div className="container mx-auto px-6 md:px-10 h-full flex flex-col md:flex-row relative">
        
        {/* TEXT CONTENT */}
        <div className="w-full md:w-[45%] h-auto md:h-full relative z-[100] md:pointer-events-none mb-10 md:mb-0">
          <h2 
            ref={titleRef}
            className="font-black tracking-tighter leading-none uppercase pointer-events-auto text-center md:text-left"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            {sectionData.title}
          </h2>
          
          <div ref={descriptionRef} className="pointer-events-auto px-4 md:px-0">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-center md:text-left">
              {sectionData.description}
            </p>
            <div className="mt-8 flex gap-2 justify-center md:justify-start">
               <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
               <div className="w-4 h-1 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* CARDS AREA */}
        <div className="w-full md:w-[55%] h-auto md:h-full relative flex flex-col md:block items-center justify-center z-10 gap-8 md:gap-0">
          {normalized.map((study, index) => (
            <div 
              key={study.id} 
              className="cs-card-stack relative md:absolute inset-0 flex items-center justify-center p-0 md:p-10 w-full"
            >
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl">
                {/* Image Section */}
                <div className="relative h-[220px] md:h-[280px] w-full">
                  {study.backgroundUrl ? (
                    <Image
                      src={study.backgroundUrl}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black tracking-widest rounded-full uppercase">
                    Case Study {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10">
                  <h3 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {study.title}
                  </h3>

                  {study.description && (
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {study.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {study.bulletPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-xs font-medium">{point}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={`/case-studies/${study.slug || study.id}`}
                    className="group/btn relative inline-flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white font-black text-xs rounded-xl overflow-hidden transition-all hover:bg-blue-700"
                  >
                    <span className="relative z-10 uppercase tracking-wider">Explore Details</span>
                    <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Effects — blue radial gradients on white */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)' }} />
    </section>
  )
}