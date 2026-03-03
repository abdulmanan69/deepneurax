'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { createClient } from './client'
import type { HomePageData } from './types'
import {
  heroData, servicesData, productsData, metricsData,
  aboutUsData, sphereShowcaseData, caseStudiesSectionData,
  caseStudiesData, testimonialsData, ctaData, footerData,
} from '@/lib/data/index'

// Build the static fallback (same as the old build-time data)
function getStaticFallback(): HomePageData {
  return {
    hero: {
      title: heroData.title,
      tagline: heroData.subtitle,
      description: heroData.description,
      primaryButtonText: heroData.ctaText,
      primaryButtonLink: heroData.ctaLink,
      secondaryButtonText: heroData.secondaryCtaText,
      secondaryButtonLink: heroData.secondaryCtaLink,
      backgroundImage: heroData.backgroundImage || undefined,
      backgroundVideos: heroData.backgroundVideos || [],
      taglines: heroData.taglines,
    },
    services: servicesData.map((s) => ({
      id: s.id.toString(), title: s.title, slug: s.slug, description: s.description,
      icon: s.icon, order: s.order, link: s.link, image: s.image || undefined,
    })),
    products: productsData.map((p) => ({
      id: p.id.toString(), name: p.name, slug: p.slug, description: p.description,
      icon: p.icon, order: p.order, link: p.link, image: p.image || undefined,
    })),
    sphereShowcase: {
      sectionTitle: sphereShowcaseData.sectionTitle,
      sectionDescription: sphereShowcaseData.sectionDescription,
      introHeading: sphereShowcaseData.introHeading,
      introSubheading: sphereShowcaseData.introSubheading,
      contentHeading: sphereShowcaseData.contentHeading,
      contentDescription: sphereShowcaseData.contentDescription,
      items: sphereShowcaseData.items.map((item) => ({
        id: item.id.toString(), title: item.title, description: item.description,
        image: item.image || '', link: item.link, order: item.order,
      })),
    },
    metrics: metricsData.map((m) => ({
      id: m.id.toString(), label: m.label, value: m.value,
      suffix: m.suffix, icon: m.icon, order: m.order,
    })),
    aboutUs: {
      whoWeAreHeading: aboutUsData.whoWeAreHeading,
      whoWeAreDescription: aboutUsData.whoWeAreDescription,
      coreValuesHeading: aboutUsData.coreValuesHeading,
      coreValues: aboutUsData.coreValues,
    },
    scrollMorphHeroData: null,
    featuresSection: null,
    caseStudiesSection: {
      title: caseStudiesSectionData.title,
      description: caseStudiesSectionData.description,
    },
    caseStudies: caseStudiesData.filter(c => c.isActive).map((c) => ({
      id: c.id.toString(), title: c.title, slug: c.slug, description: c.description,
      bulletPoints: c.bulletPoints, isActive: c.isActive, order: c.order,
      backgroundImage: c.backgroundImage || null, metrics: c.metrics,
    })),
    testimonials: testimonialsData.map((t) => ({
      id: t.id.toString(), author: t.author, handle: t.handle, role: t.role,
      text: t.text, avatar: t.avatar ? { asset: { url: t.avatar } } : null, order: t.order,
    })),
    blogPosts: [],
    cta: {
      title: ctaData.title, description: ctaData.description,
      buttonText: ctaData.buttonText, buttonLink: ctaData.buttonLink,
      secondaryButtonText: ctaData.secondaryButtonText,
      secondaryButtonLink: ctaData.secondaryButtonLink,
    },
    footer: {
      siteName: footerData.siteName, tagline: footerData.tagline,
      companyDescription: footerData.companyDescription,
      siteLogo: footerData.siteLogo?.asset?.url ? { asset: { url: footerData.siteLogo.asset.url } } : undefined,
      siteLogoLight: footerData.siteLogoLight?.asset?.url ? { asset: { url: footerData.siteLogoLight.asset.url } } : undefined,
      copyrightText: footerData.copyrightText,
      contactEmail: footerData.contactEmail,
      contactPhone: footerData.contactPhone,
      address: footerData.address,
      socialLinks: footerData.socialLinks,
      menuItems: footerData.menuItems,
      cta: footerData.cta,
    },
  }
}

// Fetch live data from Supabase on the client side
async function fetchLiveData(): Promise<HomePageData | null> {
  const supabase = createClient()
  if (!supabase) return null

  try {
    const [
      heroRes, servicesRes, productsRes, metricsRes,
      caseStudiesRes, testimonialsRes, ctaRes, footerRes,
      sphereSectionRes, sphereItemsRes,
    ] = await Promise.all([
      supabase.from('hero').select('*').single(),
      supabase.from('services').select('*').order('order', { ascending: true }),
      supabase.from('products').select('*').order('order', { ascending: true }),
      supabase.from('metrics').select('*').order('order', { ascending: true }),
      supabase.from('case_studies').select('*').eq('is_active', true).order('order', { ascending: true }),
      supabase.from('testimonials').select('*').order('order', { ascending: true }),
      supabase.from('cta').select('*').single(),
      supabase.from('footer').select('*').single(),
      supabase.from('sphere_showcase').select('*').single(),
      supabase.from('sphere_showcase_items').select('*').order('order', { ascending: true }),
    ])

    const fallback = getStaticFallback()

    // Hero
    const heroRow = heroRes.data
    const hero = heroRow ? {
      title: heroRow.title,
      tagline: heroRow.subtitle || '',
      description: heroRow.description,
      primaryButtonText: heroRow.cta_text || heroRow.button_text || 'Get Started',
      primaryButtonLink: heroRow.cta_link || heroRow.button_link || '/contact',
      secondaryButtonText: heroRow.secondary_cta_text || heroRow.secondary_button_text || 'Watch Demo',
      secondaryButtonLink: heroRow.secondary_cta_link || heroRow.secondary_button_link || '#',
      backgroundImage: heroRow.background_image_url ? { asset: { url: heroRow.background_image_url } } : undefined,
      backgroundVideos: (heroRow.background_videos || []).map((v: any) => ({
        videoUrl: v.videoUrl || '',
        video: v.videoUrl ? { url: v.videoUrl } : undefined,
        thumbnail: v.thumbnail ? { url: v.thumbnail } : undefined,
        duration: v.duration || 10,
      })),
      taglines: heroRow.taglines || [],
    } : fallback.hero

    // Services
    const services = servicesRes.data?.map((s: any) => ({
      id: s.id, title: s.title, slug: s.slug, description: s.description,
      icon: s.icon, order: s.order, link: s.link || `/services/${s.slug}`,
      image: s.image_url ? { asset: { url: s.image_url } } : undefined,
    })) || fallback.services

    // Products
    const products = productsRes.data?.map((p: any) => ({
      id: p.id, name: p.name, slug: p.slug, description: p.description,
      icon: p.icon, order: p.order, link: p.link || `/products/${p.slug}`,
      image: p.image_url ? { asset: { url: p.image_url } } : undefined,
    })) || fallback.products

    // Metrics
    const metrics = metricsRes.data?.map((m: any) => ({
      id: m.id, label: m.label, value: m.value,
      suffix: m.suffix, icon: m.icon, order: m.order,
    })) || fallback.metrics

    // Case studies
    const caseStudies = caseStudiesRes.data?.map((c: any) => ({
      id: c.id, title: c.title, slug: c.slug, description: c.description,
      bulletPoints: c.bullet_points || [], isActive: c.is_active, order: c.order,
      backgroundImage: c.background_image_url ? { asset: { url: c.background_image_url } } : null,
      metrics: c.metrics || [],
    })) || fallback.caseStudies

    // Testimonials
    const testimonials = testimonialsRes.data?.map((t: any) => ({
      id: t.id, author: t.author, handle: t.handle, role: t.role,
      text: t.text, avatar: t.avatar_url ? { asset: { url: t.avatar_url } } : null,
      order: t.order,
    })) || fallback.testimonials

    // CTA
    const ctaRow = ctaRes.data
    const cta = ctaRow ? {
      title: ctaRow.title, description: ctaRow.description,
      buttonText: ctaRow.button_text, buttonLink: ctaRow.button_link,
      secondaryButtonText: ctaRow.secondary_button_text,
      secondaryButtonLink: ctaRow.secondary_button_link,
    } : fallback.cta

    // Footer
    const footerRow = footerRes.data
    let footerCta: { label: string; href: string } | undefined
    if (footerRow?.cta) {
      if (footerRow.cta.label && footerRow.cta.href) {
        footerCta = { label: footerRow.cta.label, href: footerRow.cta.href }
      } else if (footerRow.cta.text && footerRow.cta.link) {
        footerCta = { label: footerRow.cta.text, href: footerRow.cta.link }
      }
    }
    const footer = footerRow ? {
      siteName: footerRow.site_name, tagline: footerRow.tagline,
      companyDescription: footerRow.company_description,
      siteLogo: footerRow.site_logo_url ? { asset: { url: footerRow.site_logo_url } } : undefined,
      siteLogoLight: footerRow.site_logo_light_url ? { asset: { url: footerRow.site_logo_light_url } } : undefined,
      copyrightText: footerRow.copyright_text,
      contactEmail: footerRow.contact_email,
      contactPhone: footerRow.contact_phone,
      address: footerRow.address,
      socialLinks: footerRow.social_links || [],
      menuItems: footerRow.menu_items || [],
      cta: footerCta,
    } : fallback.footer

    // Sphere showcase
    const sphereSection = sphereSectionRes.data
    const sphereItems = sphereItemsRes.data
    const sphereShowcase = (sphereSection || sphereItems?.length) ? {
      sectionTitle: sphereSection?.section_title || fallback.sphereShowcase?.sectionTitle || '',
      sectionDescription: sphereSection?.section_description || fallback.sphereShowcase?.sectionDescription || '',
      introHeading: sphereSection?.intro_heading || undefined,
      introSubheading: sphereSection?.intro_subheading || undefined,
      contentHeading: sphereSection?.content_heading || undefined,
      contentDescription: sphereSection?.content_description || undefined,
      items: (sphereItems || []).map((item: any) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        image: item.image_url || '',
        link: item.link || '#',
        order: item.order || 0,
      })),
    } : fallback.sphereShowcase

    return {
      hero, services, products, metrics,
      sphereShowcase,
      aboutUs: fallback.aboutUs,
      scrollMorphHeroData: null,
      featuresSection: null,
      caseStudiesSection: fallback.caseStudiesSection,
      caseStudies, testimonials,
      blogPosts: [],
      cta, footer,
    }
  } catch (err) {
    console.error('Failed to fetch live data:', err)
    return null
  }
}

export function useHomePageData() {
  const [data, setData] = useState<HomePageData>(getStaticFallback)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    fetchLiveData().then((live) => {
      if (live) {
        setData(live)
        setIsLive(true)
      }
    })
  }, [])

  return { data, isLive }
}
