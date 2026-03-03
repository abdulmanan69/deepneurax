'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { createClient } from './client'
import { footerData as staticFooterData, servicesData as staticServicesData } from '@/lib/data/index'

// Shared layout data (header/footer) used by all sub-pages
interface LayoutData {
  footer: any
  services: any[]
}

function getStaticLayout(): LayoutData {
  return {
    footer: {
      siteName: staticFooterData.siteName,
      tagline: staticFooterData.tagline,
      companyDescription: staticFooterData.companyDescription,
      siteLogo: staticFooterData.siteLogo?.asset?.url ? { asset: { url: staticFooterData.siteLogo.asset.url } } : undefined,
      siteLogoLight: staticFooterData.siteLogoLight?.asset?.url ? { asset: { url: staticFooterData.siteLogoLight.asset.url } } : undefined,
      copyrightText: staticFooterData.copyrightText,
      contactEmail: staticFooterData.contactEmail,
      contactPhone: staticFooterData.contactPhone,
      address: staticFooterData.address,
      socialLinks: staticFooterData.socialLinks,
      menuItems: staticFooterData.menuItems,
      cta: staticFooterData.cta,
    },
    services: staticServicesData.map((s) => ({
      id: s.id.toString(), title: s.title, slug: s.slug,
      description: s.description, icon: s.icon, order: s.order,
      link: s.link, image: s.image || undefined,
    })),
  }
}

export function useLayoutData() {
  const [layout, setLayout] = useState<LayoutData>(getStaticLayout)

  useEffect(() => {
    async function fetchLayout() {
      const supabase = createClient()
      if (!supabase) return

      const [footerRes, servicesRes] = await Promise.all([
        supabase.from('footer').select('*').single(),
        supabase.from('services').select('*').order('order', { ascending: true }),
      ])

      const f = footerRes.data
      let footerCta: { label: string; href: string } | undefined
      if (f?.cta) {
        if (f.cta.label && f.cta.href) footerCta = { label: f.cta.label, href: f.cta.href }
        else if (f.cta.text && f.cta.link) footerCta = { label: f.cta.text, href: f.cta.link }
      }

      const footer = f ? {
        siteName: f.site_name, tagline: f.tagline,
        companyDescription: f.company_description,
        siteLogo: f.site_logo_url ? { asset: { url: f.site_logo_url } } : undefined,
        siteLogoLight: f.site_logo_light_url ? { asset: { url: f.site_logo_light_url } } : undefined,
        copyrightText: f.copyright_text,
        contactEmail: f.contact_email, contactPhone: f.contact_phone,
        address: f.address,
        socialLinks: f.social_links || [],
        menuItems: f.menu_items || [],
        cta: footerCta,
      } : null

      const services = (servicesRes.data || []).map((s: any) => ({
        id: s.id, title: s.title, slug: s.slug,
        description: s.description, icon: s.icon, order: s.order,
        link: s.link || `/services/${s.slug}`,
        image: s.image_url ? { asset: { url: s.image_url } } : undefined,
      }))

      setLayout({ footer: footer || getStaticLayout().footer, services })
    }
    fetchLayout()
  }, [])

  return layout
}

// Hook to fetch a single table's data
export function useLiveTable<T>(table: string, options?: {
  orderBy?: string
  filter?: Record<string, any>
  single?: boolean
  mapper?: (row: any) => T
}) {
  const [data, setData] = useState<T | T[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      let query = supabase.from(table).select('*')
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, val]) => {
          query = query.eq(key, val)
        })
      }
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: true })
      }
      if (options?.single) {
        const { data: row } = await query.single()
        setData(options?.mapper && row ? options.mapper(row) : row as T)
      } else {
        const { data: rows } = await query
        setData(options?.mapper ? (rows || []).map(options.mapper) : rows as T[])
      }
      setLoading(false)
    }
    fetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  return { data, loading }
}
