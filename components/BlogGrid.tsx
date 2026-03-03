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

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (document.querySelector('.blog-header')) {
        gsap.from('.blog-header', {
          y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.blog-header', start: 'top 85%' }
        })
      }
      
      // Cards stagger animation
      if (document.querySelector('.blog-card')) {
        gsap.from('.blog-card', {
          y: 50, scale: 0.97, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.blog-grid', start: 'top 80%' }
        })
      }

      // Button animation
      if (document.querySelector('.blog-cta')) {
        gsap.from('.blog-cta', {
          y: 30, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.blog-cta', start: 'top 90%' }
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
    <section ref={sectionRef} id="blog" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <div className="blog-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog & Resources
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Insights, trends, and expertise from our team
          </p>
        </div>

        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current
            const key = slug ?? String(post.title ?? index)
            return (
            <article
              key={key}
              className="blog-card group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {post.coverImage?.asset?.url ? (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500">
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
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500" />
              )}

              <div className="p-6">
                <div className="text-gray-500 text-sm mb-2 flex items-center gap-2">
                  <span>{formatDate(post.publishedAt)}</span>
                  {(post as any).category?.data?.attributes?.name && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 font-semibold">
                        {(post as any).category.data.attributes.name}
                      </span>
                    </>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {slug && (
                  <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 font-semibold"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
            )
          })}
        </div>

        <div className="blog-cta text-center mt-12">
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
