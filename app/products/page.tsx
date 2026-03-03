'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { productsData as staticProducts } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Boxes, Cpu, Network, Sparkles, Layers } from 'lucide-react'
import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Shared texture overlays ── */
const BlueGridTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
  </>
)

const WhiteDotsTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
  </>
)

const getProductIcon = (name: string, icon?: string) => {
  const nameLower = name.toLowerCase()
  if (icon === '📦' || nameLower.includes('platform')) return Boxes
  if (icon === '⚙️' || nameLower.includes('automl') || nameLower.includes('suite')) return Cpu
  if (icon === '📊' || nameLower.includes('viz') || nameLower.includes('analytics')) return Network
  if (nameLower.includes('ai')) return Sparkles
  return Layers
}

export default function ProductsPage() {
  const { footer, services } = useLayoutData()
  const [products, setProducts] = useState<any[]>(
    staticProducts.map((p) => ({
      id: p.id.toString(), name: p.name, slug: p.slug,
      description: p.description, icon: p.icon, order: p.order, link: p.link,
    }))
  )

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('products').select('*').order('order', { ascending: true })
      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id, name: p.name, slug: p.slug,
          description: p.description, icon: p.icon, order: p.order,
          link: p.link || `/products/${p.slug}`,
          image: p.image_url ? { asset: { url: p.image_url } } : undefined,
        })))
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen">
      <Header 
        logo={footer?.siteLogo}
        logoLight={footer?.siteLogoLight}
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />

      {/* ═══════════ HERO — Blue + White Dots ═══════════ */}
      <section className="relative bg-[#0b1d4f] overflow-hidden pt-36 pb-24">
        <WhiteDotsTexture />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 border border-white/10">
            Our Ecosystem
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Geom', sans-serif" }}>
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
            Explore our ecosystem of AI-powered solutions designed to accelerate your business growth.
          </p>
        </div>
      </section>

      <main>
        {/* ═══════════ PRODUCTS GRID — White + Blue Grid ═══════════ */}
        <section className="relative bg-white overflow-hidden py-24">
          <BlueGridTexture />
          <div className="relative z-10 container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any, index: number) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  {/* Image / Icon Area */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    {product.image?.asset?.url ? (
                      <Image
                        src={product.image.asset.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0b1d4f] to-[#162d6b] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                          {React.createElement(getProductIcon(product.name, product.icon), { size: 32 })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Geom', sans-serif" }}>
                      {product.name}
                    </h3>

                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed text-sm">
                      {product.description}
                    </p>

                    <Link 
                      href={`/products/${product.slug || 'detail'}`}
                      className="inline-flex items-center gap-2 text-[#0b1d4f] font-semibold text-sm hover:text-blue-600 transition-colors group/link"
                    >
                      Learn More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA — Blue + White Dots ═══════════ */}
        <section className="relative bg-[#0b1d4f] overflow-hidden py-28">
          <WhiteDotsTexture />
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Geom', sans-serif" }}>
              Ready to Get Started?
            </h2>
            <p className="text-blue-100/70 mb-10 max-w-2xl mx-auto text-lg">
              Try our products today and experience the power of AI.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0b1d4f] font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Request a Demo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {footer && (
        <Footer 
          data={footer} 
          services={services} 
        />
      )}
    </div>
  )
}
