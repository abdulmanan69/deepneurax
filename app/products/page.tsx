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
            Our Products
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our ecosystem of AI-powered solutions designed to accelerate your business growth.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product: any, index: number) => (
              <div 
                key={index}
                className="group relative bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500"
              >
                <div className="mb-8 relative aspect-video rounded-2xl overflow-hidden">
                  {product.image?.asset?.url ? (
                    <Image
                      src={product.image.asset.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {React.createElement(getProductIcon(product.name, product.icon), { size: 32 })}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Geom', sans-serif" }}>
                  {product.name}
                </h3>
                
                <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                <Link 
                  href={`/products/${product.slug || 'detail'}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Try our products today and experience the power of AI.</p>
              <Link href="/contact" className="btn-primary bg-white text-blue-900 hover:bg-blue-50 border-none">
                Request a Demo
              </Link>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] bg-blue-500 rounded-full blur-[150px]" />
            </div>
          </div>
        </div>
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
