'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { footerLegalLinksData } from '@/lib/data/index'

import { Github, Linkedin, Twitter, Instagram, Globe } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface FooterData {
  siteLogo?: { asset?: { url: string } }
  siteLogoLight?: { asset?: { url: string } }
  siteName?: string
  tagline?: string
  companyDescription?: string
  socialLinks?: Array<{
    platform: string
    url: string
    icon?: string
  }>
  contactEmail?: string
  contactPhone?: string
  address?: string
  copyrightText: string
}

interface FooterProps {
  data: FooterData
  services: Array<{ title: string; link?: string }>
}

export default function Footer({ data, services }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null)

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/#about' },
    { label: 'Contact', href: '/contact' },
  ]

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase()
    if (p.includes('linkedin')) return <Linkedin size={20} />
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />
    if (p.includes('github')) return <Github size={20} />
    if (p.includes('instagram')) return <Instagram size={20} />
    return <Globe size={20} />
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer columns stagger animation (no opacity to prevent invisible footer)
      if (document.querySelector('.footer-col')) {
        gsap.from('.footer-col', {
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-grid', start: 'top 92%' }
        })
      }

      // Bottom bar animation
      if (document.querySelector('.footer-bottom')) {
        gsap.from('.footer-bottom', {
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-bottom', start: 'top 98%' }
        })
      }
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-8 md:py-16">
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="footer-col">
            <Link href="/" className="flex items-center space-x-3 mb-4 group w-fit">
              {(data.siteLogoLight || data.siteLogo) ? (
                <div className="relative h-10 w-auto">
                  <Image
                    src={data.siteLogoLight?.asset?.url || data.siteLogo?.asset?.url || ''}
                    alt={data.siteName || 'Site Logo'}
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">∆N</span>
                  </div>
                  <span className="text-white font-bold text-xl">{data.siteName || 'DeepNeurax'}</span>
                </>
              )}
            </Link>
            
            {data.tagline && (
              <p className="text-blue-400 text-sm font-medium mb-3">
                {data.tagline}
              </p>
            )}

            {data.companyDescription && (
              <p className="text-white/70 mb-6 leading-relaxed">
                {data.companyDescription}
              </p>
            )}

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {data.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 text-white"
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {services.slice(0, 6).map((service, index) => (
                <li key={index}>
                  {service.link ? (
                    <Link
                      href={service.link}
                      className="text-white/70 hover:text-blue-400 transition-colors duration-300"
                    >
                      {service.title}
                    </Link>
                  ) : (
                    <span className="text-white/70">{service.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links (Pages) */}
          <div className="footer-col">
            <h3 className="text-white font-bold text-lg mb-4">Pages</h3>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-blue-400 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              {data.contactEmail && (
                <li>
                  <a
                    href={`mailto:${data.contactEmail}`}
                    className="text-white/70 hover:text-blue-400 transition-colors duration-300 flex items-start gap-2"
                  >
                    <span>📧</span>
                    <span>{data.contactEmail}</span>
                  </a>
                </li>
              )}
              {data.contactPhone && (
                <li>
                  <a
                    href={`tel:${data.contactPhone}`}
                    className="text-white/70 hover:text-blue-400 transition-colors duration-300 flex items-start gap-2"
                  >
                    <span>📞</span>
                    <span>{data.contactPhone}</span>
                  </a>
                </li>
              )}
              {data.address && (
                <li className="text-white/70 flex items-start gap-2">
                  <span>📍</span>
                  <span>{data.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-white/60 text-sm">
                {data.copyrightText}
              </p>
              <p className="text-white/40 text-xs flex items-center gap-1 group/dev">
                Developed by 
                <a 
                  href="https://github.com/abdulmanan69" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                >
                  abdulmanan69
                  <span className="inline-block transform group-hover/dev:translate-x-1 group-hover/dev:-translate-y-1 transition-transform duration-300">↗</span>
                </a>
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-white/60">
              {footerLegalLinksData.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
