'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Rocket, Lock, Headphones, LineChart, Sparkles, CircuitBoard, Gauge, Shield } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Feature {
  title: string
  icon?: string
  image?: {
    asset: {
      url: string
    }
  }
  description: string
  cardBackgroundColor?: string
  borderColor?: string
  titleColor?: string
  textColor?: string
}

// Map feature keywords to icons
const getFeatureIcon = (title: string, icon?: string) => {
  const titleLower = title.toLowerCase()
  if (icon === '🚀' || titleLower.includes('scalable') || titleLower.includes('fast')) return Rocket
  if (icon === '🔒' || titleLower.includes('secure') || titleLower.includes('security')) return Shield
  if (icon === '📞' || titleLower.includes('support') || titleLower.includes('24/7')) return Headphones
  if (icon === '📈' || titleLower.includes('analytics') || titleLower.includes('insights')) return LineChart
  if (icon === '⚡' || titleLower.includes('realtime') || titleLower.includes('real-time')) return Gauge
  if (titleLower.includes('innovation')) return Sparkles
  return CircuitBoard
}

export default function FeaturesGrid({ features, featuresSection }: { features: Feature[], featuresSection?: { sectionTitle?: string, sectionDescription?: string } }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (document.querySelector('.features-header')) {
        gsap.from('.features-header', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.features-header', start: 'top 85%' }
        })
      }

      // Cards stagger animation
      if (document.querySelector('.feature-card')) {
        gsap.from('.feature-card', {
          y: 50, scale: 0.95, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const title = featuresSection?.sectionTitle || "Our Key Features";
  const description = featuresSection?.sectionDescription || "We deliver exceptional results through innovation, expertise, and dedication.";

  return (
    <section ref={sectionRef} id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="features-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-8 rounded-2xl border hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              style={{
                ...(feature.cardBackgroundColor && { backgroundColor: feature.cardBackgroundColor }),
                ...(feature.borderColor && { borderColor: feature.borderColor }),
                ...(!feature.cardBackgroundColor && { backgroundColor: '#FFFFFF' }),
                ...(!feature.borderColor && { borderColor: '#E5E7EB' })
              }}
            >
              <div className="feature-icon mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                {React.createElement(getFeatureIcon(feature.title, feature.icon), {
                  size: 32,
                  className: "text-white",
                  strokeWidth: 2
                })}
              </div>

              {feature.image?.asset?.url && !feature.icon && (
                <div className="mb-4 rounded-lg overflow-hidden h-32 relative">
                  <Image
                    src={feature.image.asset.url}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              )}

              <h3 
                className="text-xl font-bold mb-3"
                style={feature.titleColor ? { color: feature.titleColor } : { color: '#111827' }}
              >
                {feature.title}
              </h3>

              <p 
                className="leading-relaxed"
                style={feature.textColor ? { color: feature.textColor } : { color: '#6B7280' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
