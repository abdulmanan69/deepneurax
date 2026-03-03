'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  logo?: {
    asset?: {
      url: string
    }
  }
  logoLight?: {
    asset?: {
      url: string
    }
  }
  siteName?: string
  menuItems?: Array<{ label: string; href: string }>
  cta?: { label: string; href: string }
}

export default function Header({ logo, logoLight, siteName, menuItems: propMenuItems, cta }: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const headerRef = useRef<HTMLElement>(null)

  const defaultMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Products', href: '/products' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/#about' },
  ]

  const menuItems = (propMenuItems && propMenuItems.length > 0) ? propMenuItems : defaultMenuItems
  const ctaButton = cta || { label: 'Contact Us', href: '/contact' }

  // Scroll listener for header background transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll() // check on mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed z-50 left-0 right-0 top-0 transition-[background,padding,box-shadow,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled
            ? 'bg-white/90 backdrop-blur-xl py-3 shadow-lg shadow-black/5 rounded-2xl border border-gray-100 left-4 right-4 top-4'
            : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent py-5 border-transparent'}
        `}
        style={{
          maxWidth: scrolled ? 'calc(100% - 32px)' : '100%',
          margin: scrolled ? '0 auto' : undefined,
          transition: 'background 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.5s cubic-bezier(0.4,0,0.2,1), backdrop-filter 0.5s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        <nav className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                {(logo || logoLight) ? (
                  <div className="relative h-10 w-auto transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={scrolled ? (logo?.asset?.url || logoLight?.asset?.url || '') : (logoLight?.asset?.url || logo?.asset?.url || '')}
                      alt={siteName || 'Site Logo'}
                      width={120}
                      height={40}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-white font-bold text-xl">∆N</span>
                    </div>
                    <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
                      scrolled ? 'text-gray-900' : 'text-white'
                    }`}>
                      {siteName || 'DeepNeurax'}
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-item relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                    scrolled
                      ? 'text-gray-600 hover:text-blue-600'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    scrolled ? 'bg-blue-600' : 'bg-white'
                  }`} />
                  <span className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 ${
                    scrolled ? 'bg-blue-50' : 'bg-white/10'
                  }`} />
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:flex">
              <Link 
                href={ctaButton.href}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 group ${
                  scrolled
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40'
                    : 'bg-white text-gray-900 shadow-lg hover:bg-gray-50'
                }`}
              >
                {ctaButton.label}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 relative z-50 ${
                scrolled || mobileMenuOpen ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl z-40 md:hidden transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {menuItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-4 rounded-xl text-lg font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-b border-gray-50 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <Link href={ctaButton.href} onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all duration-300">
                {ctaButton.label}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
