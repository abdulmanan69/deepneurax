'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BlogPost {
  title: string
  slug: string | { current: string }
  publishedAt: string
  excerpt: string
  coverImage?: {
    asset: {
      url: string
    }
  }
  tags?: string[]
}

/* ── Texture overlay ── */
const BlueGridTexture = () => (
  <>
    <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
    <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
  </>
)

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (document.querySelector('.blog-card')) {
        gsap.from('.blog-card', {
          y: 50, scale: 0.97, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.blog-grid', start: 'top 80%' }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section ref={sectionRef} id="blog" className="relative bg-white overflow-hidden py-24">
      <BlueGridTexture />
      <div className="relative z-10 container mx-auto px-6">
        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current
            const key = slug ?? String(post.title ?? index)
            return (
            <article
              key={key}
              className="blog-card group rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {post.coverImage?.asset?.url ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.coverImage.asset.url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized={!post.coverImage.asset.url.startsWith('http')}
                  />
                </div>
              ) : (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0b1d4f] to-[#162d6b]" />
              )}

              <div className="p-6">
                <div className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                  <span>{formatDate(post.publishedAt)}</span>
                  {(post as Record<string, unknown> & { category?: { data?: { attributes?: { name?: string } } } }).category?.data?.attributes?.name && (
                    <>
                      <span>•</span>
                      <span className="text-[#0b1d4f] font-semibold">
                        {(post as Record<string, unknown> & { category?: { data?: { attributes?: { name?: string } } } }).category?.data?.attributes?.name}
                      </span>
                    </>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#0b1d4f]/5 text-[#0b1d4f] font-medium border border-[#0b1d4f]/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#0b1d4f] transition-colors duration-300" style={{ fontFamily: "'Geom', sans-serif" }}>
                  {post.title}
                </h3>

                <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3 text-sm">
                  {post.excerpt}
                </p>

                {slug && (
                  <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-[#0b1d4f] font-semibold text-sm hover:text-blue-600 transition-colors group/link"
                  >
                    Read More
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
