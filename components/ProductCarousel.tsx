'use client'

import React, { useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
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

/* ─── Memoised product card for stable renders ─── */
const ProductCard = React.memo(function ProductCard({
  product,
  isActive,
  isMobile,
}: {
  product: Product
  isActive: boolean
  isMobile: boolean
}) {
  return (
    <div
      className={`relative p-8 rounded-[32px] border-2 transition-colors duration-300 group ${
        isActive
          ? 'shadow-[0_20px_50px_-12px_rgba(59,130,246,0.25)] border-blue-400/40'
          : 'shadow-sm border-slate-200/60'
      }`}
      style={{
        width: isMobile ? '300px' : '420px',
        minHeight: isMobile ? '480px' : '520px',
        background: isActive ? '#ffffff' : '#f8fafc',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Subtle gradient for active card */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent rounded-[32px] pointer-events-none" />
      )}

      {/* Product Image or Icon */}
      <div className="mb-8 relative z-10">
        {product.image?.asset?.url ? (
          <div className="relative w-full h-52 rounded-2xl overflow-hidden ring-1 ring-slate-200 group-hover:ring-blue-300 transition-all">
            <Image
              src={product.image.asset.url}
              alt={product.name}
              fill
              sizes="420px"
              className={`object-cover transition-transform duration-700 ${isActive ? 'scale-105 group-hover:scale-110' : 'scale-100'}`}
              priority={isActive}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-52 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              {React.createElement(getProductIcon(product.name, product.icon), {
                size: 40,
                className: 'text-white',
                strokeWidth: 1.5,
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Name */}
      <h3
        className={`text-2xl font-black mb-4 text-center transition-colors duration-300 relative z-10 ${
          isActive ? 'text-3xl text-slate-900' : 'text-slate-400'
        }`}
        style={{ fontFamily: "'Geom', sans-serif" }}
      >
        {product.name}
      </h3>

      {/* Description */}
      <p
        className={`text-center leading-relaxed mb-8 line-clamp-3 relative z-10 transition-colors ${
          isActive ? 'text-slate-600' : 'text-slate-300'
        }`}
      >
        {product.description}
      </p>

      {/* Explore Link */}
      {isActive && (
        <Link
          href={`/products/${product.slug || product.id || product.link?.split('/').pop()}`}
          className="relative z-10 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Explore Product
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}

      {/* Active badge */}
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-500 text-white text-[10px] uppercase tracking-[0.2em] font-black rounded-full shadow-lg shadow-blue-500/30 border border-blue-400">
          Top Rated
        </div>
      )}
    </div>
  )
})

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // GSAP scroll-triggered entrance (runs once)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (document.querySelector('.products-header')) {
        gsap.from('.products-header', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-header', start: 'top 85%' },
        })
      }
      if (document.querySelector('.products-carousel')) {
        gsap.from('.products-carousel', {
          y: 50, scale: 0.97, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-carousel', start: 'top 80%' },
        })
      }
      if (document.querySelector('.products-nav')) {
        gsap.from('.products-nav', {
          y: 30, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.products-nav', start: 'top 95%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Auto-rotate
  useEffect(() => {
    if (products.length === 0) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [products.length])

  // Debounced mobile check
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const check = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIsMobile(window.innerWidth < 768), 150)
    }
    check()
    window.addEventListener('resize', check)
    return () => { window.removeEventListener('resize', check); clearTimeout(timer) }
  }, [])

  const getPosition = useCallback(
    (index: number) => {
      const total = products.length
      let diff = index - activeIndex
      if (diff > total / 2) diff -= total
      if (diff < -total / 2) diff += total
      const absPos = Math.abs(diff)

      const spacing = isMobile ? 320 : 420
      const x = diff * spacing
      const scale = absPos === 0 ? 1.1 : absPos === 1 ? 0.9 : 0.75
      const z = absPos === 0 ? 0 : absPos === 1 ? -100 : -200
      const opacity = absPos === 0 ? 1 : absPos === 1 ? 0.8 : absPos === 2 ? 0.6 : 0.3
      const rotateY = diff * 12

      return { x, z, scale, opacity, rotateY }
    },
    [activeIndex, products.length, isMobile],
  )

  // Pre-compute positions so children get stable objects
  const positions = useMemo(
    () => products.map((_, i) => getPosition(i)),
    [products, getPosition],
  )

  return (
    <section
      ref={sectionRef}
      id="products"
      className="py-16 md:py-32 relative overflow-hidden bg-white"
    >
      {/* ── Blue grid texture on white ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="products-header text-center mb-24">
          <h2
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            style={{ fontFamily: "'Geom', sans-serif", fontWeight: 900 }}
          >
            Featured Products
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Innovative AI-driven solutions designed to accelerate your digital transformation and operational excellence.
          </p>
        </div>

        {/* 3D Horizontal Carousel */}
        <div className="products-carousel relative h-[600px] flex items-center justify-center" style={{ perspective: '2000px' }}>
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {products.map((product, index) => {
              const pos = positions[index]
              const isActive = index === activeIndex

              return (
                <motion.div
                  key={index}
                  className="absolute will-change-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    x: pos.x,
                    z: pos.z,
                    scale: pos.scale,
                    opacity: pos.opacity,
                    rotateY: pos.rotateY,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <ProductCard product={product} isActive={isActive} isMobile={isMobile} />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="products-nav flex justify-center items-center gap-8 mt-20 relative z-10">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + products.length) % products.length)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            aria-label="Previous product"
          >
            <ArrowRight className="w-6 h-6 text-slate-400 rotate-180 group-hover:text-blue-600" />
          </button>

          <div className="flex gap-4">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === activeIndex
                    ? 'w-10 h-2.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % products.length)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            aria-label="Next product"
          >
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  )
}
