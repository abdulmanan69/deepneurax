'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { productsData as staticProducts } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { ArrowLeft, Sparkles, Shield, Zap, Cpu } from 'lucide-react'
import Link from 'next/link'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { footer, services } = useLayoutData()

  const staticProduct = staticProducts.find(p => p.slug === slug)
  const [product, setProduct] = useState<any>(staticProduct ? {
    id: staticProduct.id.toString(), name: staticProduct.name, slug: staticProduct.slug,
    description: staticProduct.description, icon: staticProduct.icon, order: staticProduct.order,
    link: staticProduct.link, image: staticProduct.image || undefined,
  } : null)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (data) {
        setProduct({
          id: data.id, name: data.name, slug: data.slug,
          description: data.description, icon: data.icon, order: data.order,
          link: data.link, image: data.image_url ? { asset: { url: data.image_url } } : undefined,
        })
      }
    }
    fetchProduct()
  }, [slug])

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-600 font-bold">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const mainImage = product.image

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
          <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 mb-12 hover:gap-3 transition-all font-bold">
            <ArrowLeft size={20} /> Back to All Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl">
              {mainImage?.asset?.url ? (
                <Image src={mainImage.asset.url} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                  <Cpu size={120} className="text-white opacity-20" />
                </div>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                <Sparkles size={16} /> Featured Technology
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
                {product.name}
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">High Performance</h4>
                    <p className="text-sm text-slate-500">Optimized for speed and efficiency.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Enterprise Secure</h4>
                    <p className="text-sm text-slate-500">Built with security-first architecture.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary py-4 px-10 text-lg">Request Demo</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
