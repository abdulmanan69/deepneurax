'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { blogPostsData as staticPosts } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogGrid from '@/components/BlogGrid'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Texture overlays ── */
const WhiteDotsTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
  </>
)

export default function BlogPage() {
  const { footer, services } = useLayoutData()
  const [posts, setPosts] = useState<any[]>(
    staticPosts.map((p) => ({
      id: p.id.toString(), title: p.title, slug: p.slug, excerpt: p.excerpt,
      content: p.content, publishedAt: p.publishedAt, author: p.author,
      tags: p.tags, coverImage: p.coverImage || undefined,
    }))
  )

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
      if (data) {
        setPosts(data.map((p: any) => ({
          id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt,
          content: p.content, publishedAt: p.published_at, author: p.author,
          tags: p.tags || [],
          coverImage: p.cover_image_url ? { asset: { url: p.cover_image_url } } : undefined,
        })))
      }
    }
    fetchPosts()
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
            Insights &amp; Resources
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Geom', sans-serif" }}>
            Our Blog
          </h1>
          <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
            Insights, updates, and expert perspectives on the future of AI and technology.
          </p>
        </div>
      </section>

      <main>
        <BlogGrid posts={posts} />
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
