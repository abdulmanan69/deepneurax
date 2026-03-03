'use client'

import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { Trophy, Users, Briefcase, TrendingUp, Star, Award, Target, Zap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticlesBackground from './ui/ParticlesBackground'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Metric {
  label: string
  value: number
  suffix?: string
  icon?: string
  iconUrl?: string
  sectionBackgroundColor?: string
  cardBackgroundColor?: string
  borderColor?: string
  numberColor?: string
  labelColor?: string
  sectionTitleColor?: string
  sectionSubtitleColor?: string
  decorativeElementsColor?: string
}

// Map of available icons. The key should be a string that can be entered in Strapi.
const iconMap = {
  Trophy,
  Users,
  Briefcase,
  TrendingUp,
  Star,
  Award,
  Target,
  Zap,
};

// Default icon if one isn't specified or found
const DefaultIcon = Zap;

// Animated background blob component
const AnimatedBlob = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute rounded-full mix-blend-screen blur-3xl opacity-20"
    animate={{
      x: [0, 100, -100, 0],
      y: [0, -100, 100, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration: 20 + delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

interface CoreValue {
  title: string
  description?: string
  icon?: string
}

interface MetricsSectionData {
  whoWeAreHeading: string
  whoWeAreDescription: string
  coreValuesHeading: string
  coreValues: CoreValue[]
}

export default function MetricsCounter({ metrics, metricsSection }: { metrics: Metric[], metricsSection?: MetricsSectionData }) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoverSeed, setHoverSeed] = useState<Record<number, number>>({})
  const sectionRef = useRef<HTMLDivElement>(null)

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Who We Are animation
      if (document.querySelector('.who-we-are-anim')) {
        gsap.from('.who-we-are-anim', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.who-we-are-anim', start: 'top 85%' }
        })
      }

      // Core Values animation
      if (document.querySelector('.core-values-anim')) {
        gsap.from('.core-values-anim', {
          y: 40, duration: 1, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.core-values-anim', start: 'top 85%' }
        })
      }

      // Core Value Cards stagger
      if (document.querySelector('.core-value-card-anim')) {
        gsap.from('.core-value-card-anim', {
          y: 30, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.core-values-anim', start: 'top 85%' }
        })
      }

      // Metrics Header animation
      if (document.querySelector('.metrics-header')) {
        gsap.from('.metrics-header', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.metrics-header', start: 'top 85%' }
        })
      }

      // Cards stagger animation
      if (document.querySelector('.metric-card')) {
        gsap.from('.metric-card', {
          y: 50, scale: 0.95, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.metrics-grid', start: 'top 80%' }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      id="about"
      className="py-24 relative overflow-hidden bg-[#0b1d4f]"
    >
      {/* Dynamic animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] via-[#0b1d4f] to-[#050b1f]"></div>
        
        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        ></div>

        {/* Particles Integration */}
        <div className="absolute inset-0 opacity-40">
          <ParticlesBackground 
            color="#60a5fa" 
            linkColor="#93c5fd" 
            maxParticles={60} 
            linkDistance={150}
          />
        </div>

        {/* Animated geometric blobs */}
        <motion.div
          className="absolute top-0 -left-20 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen blur-[120px] opacity-20"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen blur-[100px] opacity-15"
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -60, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        ></motion.div>

        {/* Dots Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: `24px 24px`
          }}
        ></div>

        {/* Subtle Horizontal Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_40px]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Who We Are + Metrics */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Who We Are Text */}
            {metricsSection && (
              <div className="who-we-are-anim">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: "'Geom', sans-serif", fontWeight: 800 }}>
                  {metricsSection.whoWeAreHeading}
                </h2>
                <p className="text-lg text-blue-100/90 leading-relaxed max-w-xl">
                  {metricsSection.whoWeAreDescription}
                </p>
              </div>
            )}

            {/* Metrics Header */}
            <div className="metrics-header">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Geom', sans-serif", fontWeight: 700 }}>
                Our Impact in Numbers
              </h3>
              <p className="text-blue-200/70 text-sm mb-6">Measurable results that speak for themselves</p>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
              {metrics.map((metric, index) => {
                const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || DefaultIcon;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoverSeed(prev => ({ ...prev, [index]: Date.now() }))}
                    className="metric-card group relative overflow-hidden rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Glass card background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300"></div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30 group-hover:bg-blue-400/30 group-hover:text-white transition-colors">
                        {metric.iconUrl ? (
                          <img src={metric.iconUrl} alt={metric.label} className="w-5 h-5 object-contain" />
                        ) : (
                          React.createElement(IconComponent, {
                            size: 20,
                            strokeWidth: 2
                          })
                        )}
                      </div>

                      {/* Number */}
                      <div 
                        className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight"
                        style={{ fontFamily: "'Geom', sans-serif", fontWeight: 900 }}
                      >
                        {isVisible ? (
                          <>
                            <CountUp 
                              key={`${metric.label}-${hoverSeed[index] ?? 'base'}`}
                              end={metric.value} 
                              duration={2.5} 
                              separator="," 
                            />
                            {metric.suffix}
                          </>
                        ) : (
                          '0'
                        )}
                      </div>

                      {/* Label */}
                      <div 
                        className="text-xs font-bold tracking-wider uppercase text-blue-200/80 group-hover:text-white transition-colors mt-auto"
                        style={{ fontFamily: "'Geom', sans-serif", letterSpacing: '0.05em' }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Core Values (Enhanced) */}
          {metricsSection && (
            <div className="flex-1 w-full core-values-anim lg:pt-8">
              <div className="relative">
                {/* Decorative title background */}
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-400/0 via-blue-400/50 to-blue-400/0 hidden lg:block"></div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight pl-0 lg:pl-6" style={{ fontFamily: "'Geom', sans-serif", fontWeight: 700 }}>
                  {metricsSection.coreValuesHeading}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {metricsSection.coreValues.map((value, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-gradient-to-r from-white/5 to-white/0 hover:from-white/10 hover:to-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 core-value-card-anim flex gap-5 items-start"
                    >
                      {/* Icon Container */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300 group-hover:text-white group-hover:scale-110 group-hover:border-blue-400/40 group-hover:bg-blue-500/20 transition-all duration-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                           <span className="text-2xl drop-shadow-lg">{value.icon || '✦'}</span>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div>
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {value.title}
                        </h4>
                        {value.description && (
                          <p className="text-blue-100/70 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">
                            {value.description}
                          </p>
                        )}
                      </div>

                      {/* Interactive glow */}
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-10 right-10 flex gap-3 opacity-30">
           <div className="w-16 h-1 bg-white/20 rounded-full"></div>
           <div className="w-8 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
