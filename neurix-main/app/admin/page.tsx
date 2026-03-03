'use client'

import { useEffect, useState } from 'react'
import { getTableCounts } from '@/lib/supabase/admin'
import Link from 'next/link'

const sections = [
  { key: 'hero', label: 'Hero Section', icon: '🎯', href: '/admin/hero', desc: 'Main hero banner' },
  { key: 'services', label: 'Services', icon: '⚙️', href: '/admin/services', desc: 'Service offerings' },
  { key: 'products', label: 'Products', icon: '📦', href: '/admin/products', desc: 'Product catalog' },
  { key: 'metrics', label: 'Metrics', icon: '📈', href: '/admin/metrics', desc: 'Stats & numbers' },
  { key: 'case_studies', label: 'Case Studies', icon: '📁', href: '/admin/case-studies', desc: 'Portfolio items' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬', href: '/admin/testimonials', desc: 'Client reviews' },
  { key: 'blog_posts', label: 'Blog Posts', icon: '✏️', href: '/admin/blog', desc: 'Articles & news' },
  { key: 'cta', label: 'CTA Section', icon: '🔔', href: '/admin/cta', desc: 'Call to action' },
  { key: 'footer', label: 'Footer', icon: '🦶', href: '/admin/footer', desc: 'Footer content' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTableCounts()
      .then(setCounts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all your website content from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{section.icon}</span>
              {loading ? (
                <div className="w-8 h-6 bg-slate-100 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-slate-900">
                  {counts[section.key] ?? 0}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {section.label}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{section.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1.5">
          <li>• Edit content here → changes saved to Supabase instantly</li>
          <li>• To see changes on your live website, rebuild & redeploy on Netlify</li>
          <li>• All data is stored in your Supabase database securely</li>
          <li>• Images: paste image URLs (use Supabase Storage or any CDN)</li>
        </ul>
      </div>
    </div>
  )
}
