'use client'

import { useState, useEffect } from 'react'
import { useLayoutData } from '@/lib/supabase/useLayoutData'
import { createClient } from '@/lib/supabase/client'
import { blogPostsData as staticPosts } from '@/lib/data/index'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function BlogPostClient({ slug }: { slug: string }) {
  const { footer, services } = useLayoutData()

  const staticPost = staticPosts.find(p => p.slug === slug)
  const [post, setPost] = useState<any>(staticPost ? {
    id: staticPost.id.toString(), title: staticPost.title, slug: staticPost.slug,
    excerpt: staticPost.excerpt, content: staticPost.content,
    publishedAt: staticPost.publishedAt, author: staticPost.author,
    tags: staticPost.tags, coverImage: staticPost.coverImage || undefined,
    metaTitle: '', metaDescription: '', focusKeyword: '', ogImageUrl: '', canonicalUrl: '',
  } : null)

  useEffect(() => {
    async function fetchPost() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
      if (data) {
        setPost({
          id: data.id, title: data.title, slug: data.slug,
          excerpt: data.excerpt, content: data.content,
          publishedAt: data.published_at, author: data.author,
          tags: data.tags || [],
          coverImage: data.cover_image_url ? { asset: { url: data.cover_image_url } } : undefined,
          metaTitle: data.meta_title || '',
          metaDescription: data.meta_description || '',
          focusKeyword: data.focus_keyword || '',
          ogImageUrl: data.og_image_url || '',
          canonicalUrl: data.canonical_url || '',
        })
      }
    }
    fetchPost()
  }, [slug])

  // Inject SEO meta tags into <head>
  useEffect(() => {
    if (!post) return

    const seoTitle = post.metaTitle || post.title
    const seoDescription = post.metaDescription || post.excerpt
    const ogImage = post.ogImageUrl || post.coverImage?.asset?.url || ''

    document.title = seoTitle

    const setMeta = (name: string, content: string, attr = 'name') => {
      if (!content) return
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, name)
        document.head.appendChild(tag)
      }
      tag.content = content
    }

    setMeta('description', seoDescription)
    setMeta('keywords', [post.focusKeyword, ...(post.tags || [])].filter(Boolean).join(', '))
    setMeta('author', post.author || '')
    setMeta('og:title', seoTitle, 'property')
    setMeta('og:description', seoDescription, 'property')
    setMeta('og:type', 'article', 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', seoTitle)
    setMeta('twitter:description', seoDescription)
    setMeta('twitter:image', ogImage)
    setMeta('article:published_time', post.publishedAt || '', 'property')
    setMeta('article:author', post.author || '', 'property')

    if (post.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = post.canonicalUrl
    }

    // JSON-LD Structured Data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: seoTitle,
      description: seoDescription,
      image: ogImage,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author || 'Unknown' },
      keywords: [post.focusKeyword, ...(post.tags || [])].filter(Boolean).join(', '),
    }
    let script = document.querySelector('#blog-jsonld') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'blog-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)

    return () => {
      document.querySelector('#blog-jsonld')?.remove()
    }
  }, [post])

  if (!post) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-blue-600 font-bold">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const wordCount = post.content?.split(/\s+/).filter(Boolean).length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="bg-white min-h-screen">
      <Header 
        logo={footer?.siteLogo}
        logoLight={footer?.siteLogoLight}
        siteName={footer?.siteName}
        menuItems={footer?.menuItems}
        cta={footer?.cta}
      />

      <section className="pt-32 pb-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              {post.author && (<><span>•</span><span>By {post.author}</span></>)}
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
            {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>}
          </div>
        </div>
      </section>

      {post.coverImage?.asset?.url && (
        <section className="container mx-auto px-6 -mt-8 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image src={post.coverImage.asset.url} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-lg prose-blue max-w-none">
            {post.content && (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-4xl font-bold text-gray-900 mt-12 mb-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-xl font-bold text-gray-900 mt-6 mb-2">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-lg font-bold text-gray-900 mt-5 mb-2">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-base font-bold text-gray-900 mt-4 mb-2">{children}</h6>,
                  p: ({ children }) => {
                    const text = String(children)
                    // Callout/tip box
                    if (text.startsWith('💡 **Tip:**') || text.startsWith('💡 **TIP:**')) {
                      return <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg"><p className="text-blue-800 text-base">{children}</p></div>
                    }
                    // Warning box
                    if (text.startsWith('⚠️ **Warning:**') || text.startsWith('⚠️ **WARNING:**')) {
                      return <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg"><p className="text-amber-800 text-base">{children}</p></div>
                    }
                    return <p className="text-gray-700 text-lg leading-relaxed mb-6">{children}</p>
                  },
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 italic text-gray-600 bg-gray-50 rounded-r-lg">{children}</blockquote>,
                  a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 underline-offset-2 transition-colors">{children}</a>,
                  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  del: ({ children }) => <del className="line-through text-gray-400">{children}</del>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700 text-lg leading-relaxed">{children}</li>,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-')
                    if (isBlock) {
                      return (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-xl text-sm font-mono overflow-x-auto my-6 leading-relaxed">
                          {children}
                        </code>
                      )
                    }
                    return <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                  },
                  pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto my-6 text-sm leading-relaxed">{children}</pre>,
                  hr: () => <hr className="my-10 border-t-2 border-gray-200" />,
                  img: ({ src, alt }) => (
                    <figure className="my-8">
                      <div className="rounded-xl overflow-hidden shadow-lg">
                        <img src={src} alt={alt || ''} className="w-full h-auto" loading="lazy" />
                      </div>
                      {alt && <figcaption className="text-center text-sm text-gray-500 mt-3 italic">{alt}</figcaption>}
                    </figure>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-8 rounded-xl border border-gray-200">
                      <table className="w-full border-collapse text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                  th: ({ children }) => <th className="text-left font-semibold text-gray-900 px-4 py-3 border-b border-gray-200">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 border-b border-gray-100 text-gray-700">{children}</td>,
                  tr: ({ children }) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
                  input: ({ checked, type }) => {
                    if (type === 'checkbox') {
                      return <input type="checkbox" checked={checked || false} readOnly className="mr-2 rounded border-gray-300 text-blue-600 pointer-events-none" />
                    }
                    return null
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            )}
          </article>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {footer && <Footer data={footer} services={services} />}
    </div>
  )
}
