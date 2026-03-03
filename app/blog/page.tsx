'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { blogPostsData as staticPosts } from '@/lib/data/index'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogGrid from '@/components/BlogGrid'

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    <div className="bg-white min-h-screen">
      <Header 
        logo={footer?.siteLogo}
        logoLight={footer?.siteLogoLight}
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />
      
      <main className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: "'Geom', sans-serif" }}>
            Our Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Insights, updates, and expert perspectives on the future of AI and technology.
          </p>
        </div>

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
