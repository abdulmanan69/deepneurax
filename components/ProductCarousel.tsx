'use client'

import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Box, Boxes, Cpu, Network, Sparkles, Layers, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Product {
  id?: number | string
  name: string
  slug?: string
  icon?: string
  image?: {
    asset: {
      url: string
    }
  }
  description: string
  link?: string
  cardBackgroundColor?: string
  borderColor?: string
  titleColor?: string
  textColor?: string
}

// Map product names/icons to Lucide icons
const getProductIcon = (name: string, icon?: string) => {
  const nameLower = name.toLowerCase()
  if (icon === '📦' || nameLower.includes('platform')) return Boxes
  if (icon === '⚙️' || nameLower.includes('automl') || nameLower.includes('suite')) return Cpu
  if (icon === '📊' || nameLower.includes('viz') || nameLower.includes('analytics')) return Network
  if (nameLower.includes('ai')) return Sparkles
  return Layers
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (document.querySelector('.products-header')) {
        gsap.from('.products-header', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-header', start: 'top 85%' }
        })
      }

      // Carousel container animation
      if (document.querySelector('.products-carousel')) {
        gsap.from('.products-carousel', {
          y: 50, scale: 0.97, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-carousel', start: 'top 80%' }
        })
      }

      // Navigation animation
      if (document.querySelector('.products-nav')) {
        gsap.from('.products-nav', {
          y: 30, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-nav', start: 'top 95%' }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [products.length])

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPosition = (index: number) => {
    const total = products.length
    let diff = index - activeIndex
    
    // Create infinite loop effect
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    
    const absPos = Math.abs(diff)
    
    // Horizontal positioning (responsive)
    const spacing = isMobile ? 320 : 420; // Reduced spacing on mobile
    const x = diff * spacing
    
    // Scale based on distance from center
    const scale = absPos === 0 ? 1.1 : absPos === 1 ? 0.9 : 0.75
    
    // Z-depth for 3D effect
    const z = absPos === 0 ? 0 : absPos === 1 ? -100 : -200
    
    // Opacity
    const opacity = absPos === 0 ? 1 : absPos === 1 ? 0.8 : absPos === 2 ? 0.6 : 0.3
    
    // Slight rotation for depth
    const rotateY = diff * 12

    return { x, z, scale, opacity, rotateY }
  }

  return (
    <section 
      ref={sectionRef} 
      id="products" 
      className="py-16 md:py-32 relative overflow-hidden bg-[#0b1d4f]"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient aligned with Metrics section */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] via-[#0b1d4f] to-[#050b1f]"></div>
        
        {/* Noise Texture Overlay for consistency */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        ></div>
        
        {/* Animated Rings for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-blue-500/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-indigo-500/10 rounded-full animate-[spin_45s_linear_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/10 rounded-full animate-[spin_30s_linear_infinite]"></div>

        {/* Floating Particles/Dots */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Decorative Blur Blobs */}
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="products-header text-center mb-24">
          <h2 
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Geom', sans-serif", fontWeight: 900 }}
          >
            Featured Products
          </h2>
          <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full mb-8"></div>
          <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Innovative AI-driven solutions designed to accelerate your digital transformation and operational excellence.
          </p>
        </div>

        {/* 3D Horizontal Carousel */}
        <div className="products-carousel relative h-[600px] flex items-center justify-center" style={{ perspective: '2000px' }}>
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {products.map((product, index) => {
              const position = getPosition(index)
              const isActive = index === activeIndex

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    x: position.x,
                    z: position.z,
                    scale: position.scale,
                    opacity: position.opacity,
                    rotateY: position.rotateY,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <div
                    className={`relative p-8 rounded-[32px] border-2 transition-all duration-500 group ${
                      isActive 
                        ? 'shadow-[0_20px_50px_-12px_rgba(59,130,246,0.5)] border-blue-500/50' 
                        : 'shadow-none border-white/5'
                    }`}
                    style={{
                      width: isMobile ? '300px' : '420px', // Responsive width
                      minHeight: isMobile ? '480px' : '520px',
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(20px)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    {/* Glass Overlay for Active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[32px] pointer-events-none opacity-50"></div>
                    )}

                    {/* Product Image or Icon */}
                    <div className="mb-8 relative z-10">
                      {product.image?.asset?.url ? (
                        <div className="relative w-full h-52 rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                          <Image
                            src={product.image.asset.url}
                            alt={product.name}
                            fill
                            sizes="420px"
                            className={`object-cover transition-transform duration-700 ${isActive ? 'scale-105 group-hover:scale-110' : 'scale-100'}`}
                            priority={isActive}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-52 bg-white/5 rounded-2xl border border-white/10">
                           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                              {React.createElement(getProductIcon(product.name, product.icon), {
                                size: 40,
                                className: "text-white",
                                strokeWidth: 1.5
                              })}
                           </div>
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3
                      className={`text-2xl font-black mb-4 text-center transition-all duration-300 relative z-10 ${
                        isActive ? 'text-3xl text-white' : 'text-white/40'
                      }`}
                      style={{ fontFamily: "'Geom', sans-serif" }}
                    >
                      {product.name}
                    </h3>

                    {/* Product Description */}
                    <p
                      className={`text-center leading-relaxed mb-8 line-clamp-3 relative z-10 transition-colors ${
                        isActive ? 'text-blue-100/80' : 'text-white/20'
                      }`}
                    >
                      {product.description}
                    </p>

                    {/* Explore Link */}
                    {isActive && (
                      <Link 
                        href={`/products/${product.slug || product.id || (product.link?.split('/').pop())}`} 
                        className="relative z-10 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        Explore Product
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}

                    {/* Active Indicator Badge */}
                    {isActive && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-500 text-white text-[10px] uppercase tracking-[0.2em] font-black rounded-full shadow-lg shadow-blue-500/30 border border-blue-400">
                        Top Rated
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="products-nav flex justify-center items-center gap-8 mt-20 relative z-10">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + products.length) % products.length)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group"
            aria-label="Previous product"
          >
            <ArrowRight className="w-6 h-6 text-white/60 rotate-180 group-hover:text-blue-400" />
          </button>

          <div className="flex gap-4">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === activeIndex
                    ? 'w-10 h-2.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % products.length)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group"
            aria-label="Next product"
          >
            <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-blue-400" />
          </button>
        </div>
      </div>
    </section>
  )
}
