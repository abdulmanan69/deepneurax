'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'

interface BackgroundVideo {
  video?: {
    url: string
  }
  videoUrl?: string
  thumbnail?: {
    url: string
  }
  duration?: number
}

interface TaglineItem {
  tagline: string
  description: string
}

interface HeroData {
  title: string
  tagline: string
  description: string
  taglines?: TaglineItem[]
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  backgroundVideos?: BackgroundVideo[]
  backgroundImage?: {
    asset: {
      url: string
    }
  }
  overlayColor?: string
  overlayOpacity?: number
  titleColor?: string
  textColor?: string
  primaryButtonColor?: string
  secondaryButtonColor?: string
}

export default function HeroSection({ data }: { data: HeroData }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0)
  const [isHoveringTagline, setIsHoveringTagline] = useState(false)
  
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  
  const videos = data.backgroundVideos || []
  const hasVideos = videos.length > 0
  
  // Use new taglines array if available, otherwise fallback to single tagline/description
  const taglines = data.taglines && data.taglines.length > 0 
    ? data.taglines 
    : [{ tagline: data.tagline, description: data.description }]

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      
      tl.from('.hero-title',
        { y: 80, duration: 1.2, ease: 'power3.out' }
      )
      .from('.hero-tagline-container',
        { y: 40, duration: 1, ease: 'power3.out' },
        '-=0.8'
      )
      .from('.hero-buttons',
        { y: 40, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .from('.hero-stats > *',
        { y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Auto-rotate taglines
  useEffect(() => {
    if (taglines.length <= 1 || isHoveringTagline) return

    const interval = setInterval(() => {
      setActiveTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [taglines.length, isHoveringTagline])

  // Play video when it becomes active
  useEffect(() => {
    if (currentVideoRef.current && !isTransitioning) {
      currentVideoRef.current.load()
      currentVideoRef.current.play().catch(() => {})
    }
  }, [activeVideoIndex, isTransitioning])

  // Auto-rotate videos based on duration
  useEffect(() => {
    if (!hasVideos || videos.length <= 1) return

    const currentVideo = videos[activeVideoIndex]
    const duration = (currentVideo?.duration || 10) * 1000 // Convert to milliseconds

    const timer = setTimeout(() => {
      setActiveVideoIndex((prev) => (prev + 1) % videos.length)
    }, duration)

    return () => clearTimeout(timer)
  }, [activeVideoIndex, hasVideos, videos])

  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videos.length)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-black">
        {/* Background Videos - Crossfade */}
        {hasVideos && videos.map((video, index) => {
          const videoUrl = video?.videoUrl || video?.video?.url
          
          if (!videoUrl) return null
          
          const isActive = index === activeVideoIndex
          
          return (
            <video
              key={index}
              ref={isActive ? currentVideoRef : null}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{ 
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )
        })}

        {/* Background Image (Fallback) */}
        {data.backgroundImage && !hasVideos && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${data.backgroundImage.asset.url})` }}
          />
        )}

        {/* Enhanced Gradient Overlay */}
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            backgroundColor: data.overlayColor || 'rgba(0, 0, 0, 0.6)',
            opacity: data.overlayOpacity !== undefined ? data.overlayOpacity : 0.6
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Blob 1 */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-slow"
          />
          
          {/* Floating Blob 2 */}
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-medium"
          />

          {/* Floating Blob 3 */}
          <div
            className="absolute top-2/3 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float-fast"
          />
        </div>
      </div>

      {/* Content Container */}
      <div 
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className="relative container mx-auto px-8 md:px-12 lg:px-16 min-h-screen flex items-end justify-start z-10"
      >
        <div className="max-w-2xl mb-20">
          {/* Main Title - Professional Typography */}
          <div className="hero-title mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 tracking-tight text-white" style={{ fontFamily: "'Geom', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>
              {data.title}
            </h1>
          </div>

          {/* Tagline & Description Container with Rotation */}
          <div 
            className="hero-tagline-container min-h-[160px]"
            onMouseEnter={() => setIsHoveringTagline(true)}
            onMouseLeave={() => setIsHoveringTagline(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTaglineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col"
              >
                {/* Tagline - Accent Line */}
                <div className="hero-tagline flex items-center gap-4 mb-5">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                  <h2
                    className="text-sm md:text-base font-medium tracking-wide text-white"
                    style={{ fontFamily: "'Geom', sans-serif" }}
                  >
                    {taglines[activeTaglineIndex].tagline}
                  </h2>
                </div>

                {/* Description - Enhanced Typography */}
                <p
                  className="hero-description text-sm md:text-base mb-8 max-w-xl leading-relaxed text-white/90"
                  style={{ fontFamily: "'Geom', sans-serif" }}
                >
                  {taglines[activeTaglineIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Buttons - Enhanced with unified button system */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 pt-2">
            {/* Primary Button */}
            <Link href="/contact" className="btn-primary">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 btn-icon" />
            </Link>

            {/* Secondary Button */}
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'auto' })}
              className="btn-secondary text-white border-white/40 hover:border-transparent"
              style={{ color: 'white' }}
            >
              <Play className="w-5 h-5" />
              <span>{data.secondaryButtonText || 'Watch Demo'}</span>
            </button>
          </div>

          {/* Stats or Features Row - Optional */}
          <div className="hero-stats mt-12 flex flex-wrap gap-8 md:gap-12 max-w-xl">
            {[
              { number: '10+', label: 'Services' },
              { number: '3+', label: 'Products' },
              { number: '100%', label: 'Professional' },
            ].map((stat, index) => (
              <div
                key={index}
                className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Geom', sans-serif" }}>
                  {stat.number}
                </p>
                <p className="text-xs md:text-sm text-white group-hover:text-white transition-colors duration-300" style={{ fontFamily: "'Geom', sans-serif" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Video Navigation */}
      {hasVideos && videos.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrevVideo}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            aria-label="Previous video"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextVideo}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            aria-label="Next video"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Video Indicators - Enhanced */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveVideoIndex(index)}
                className={`transition-all duration-300 rounded-full hover:scale-110 ${
                  index === activeVideoIndex
                    ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm font-light">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 hover:border-white/60 transition-colors duration-300">
            <div className="w-1 h-2.5 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
