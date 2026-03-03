'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Hero Section', href: '/admin/hero', icon: '🎯' },
  { label: 'Services', href: '/admin/services', icon: '⚙️' },
  { label: 'Products', href: '/admin/products', icon: '📦' },
  { label: 'Sphere Showcase', href: '/admin/sphere-showcase', icon: '🌐' },
  { label: 'Metrics', href: '/admin/metrics', icon: '📈' },
  { label: 'Case Studies', href: '/admin/case-studies', icon: '📁' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: '💬' },
  { label: 'Blog Posts', href: '/admin/blog', icon: '✏️' },
  { label: 'CTA Section', href: '/admin/cta', icon: '🔔' },
  { label: 'Footer', href: '/admin/footer', icon: '🦶' },
  { label: 'Contact Submissions', href: '/admin/contact-submissions', icon: '📬' },
  { label: 'Global Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold">
            N
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Neurix Admin</h1>
            <p className="text-[11px] text-slate-400">Content Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="text-base">🌐</span>
          <span>View Website</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="text-base">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
