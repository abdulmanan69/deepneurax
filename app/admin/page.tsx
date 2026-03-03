"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTableCounts } from '@/lib/supabase/admin'
import SphereImageGrid, { ImageData } from '@/components/ui/img-sphere'

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

const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
  {
    src: 'https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 1',
    title: 'Mountain Landscape',
    description: 'A beautiful landscape captured at golden hour with mountains in the background.',
  },
  {
    src: 'https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?auto=format&fit=crop&q=80&w=1200',
    alt: 'Image 2',
    title: 'Portrait Photography',
    description: 'Stunning portrait photography showcasing natural lighting and composition.',
  },
  {
    src: 'https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 3',
    title: 'Urban Architecture',
    description: 'Modern architectural design featuring clean lines and geometric patterns.',
  },
  {
    src: 'https://images.unsplash.com/photo-1742201877377-03d18a323c18?auto=format&fit=crop&q=80&w=1064',
    alt: 'Image 4',
    title: 'Nature Scene',
    description: 'Peaceful nature scene with vibrant colors and natural beauty.',
  },
  {
    src: 'https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 5',
    title: 'Abstract Art',
    description: 'Creative abstract composition with bold colors and unique patterns.',
  },
  {
    src: 'https://images.unsplash.com/photo-1757626961383-be254afee9a0?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 6',
    title: 'Mountain Landscape',
    description: 'A beautiful landscape captured at golden hour with mountains in the background.',
  },
  {
    src: 'https://images.unsplash.com/photo-1756748371390-099e4e6683ae?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 7',
    title: 'Portrait Photography',
    description: 'Stunning portrait photography showcasing natural lighting and composition.',
  },
  {
    src: 'https://images.unsplash.com/photo-1755884405235-5c0213aa3374?auto=format&fit=crop&q=80&w=987',
    alt: 'Image 8',
    title: 'Urban Architecture',
    description: 'Modern architectural design featuring clean lines and geometric patterns.',
  },
]

const SPHERE_IMAGES: ImageData[] = []
for (let i = 0; i < 36; i++) {
  const baseIndex = i % BASE_IMAGES.length
  const baseImage = BASE_IMAGES[baseIndex]
  SPHERE_IMAGES.push({
    id: `img-${i + 1}`,
    ...baseImage,
    alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`,
  })
}

const SPHERE_CONFIG = {
  containerSize: 360,
  sphereRadius: 200,
  dragSensitivity: 0.8,
  momentumDecay: 0.96,
  maxRotationSpeed: 6,
  baseImageScale: 0.18,
  hoverScale: 1.3,
  perspective: 1000,
  autoRotate: true,
  autoRotateSpeed: 0.2,
}

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

      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 mb-2">Visual Image Sphere</h3>
        <p className="text-xs text-slate-500 mb-4">
          Interactive 3D image sphere preview for your visual assets, powered by the Img Sphere component.
        </p>
        <div className="w-full flex justify-center">
          <SphereImageGrid
            images={SPHERE_IMAGES}
            {...SPHERE_CONFIG}
          />
        </div>
      </div>
    </div>
  )
}
