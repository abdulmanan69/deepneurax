'use client'

import { useHomePageData } from '@/lib/supabase/useHomePageData'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CoreServicesSection from '@/components/CoreServicesSection'
import MetricsCounter from '@/components/MetricsCounter'
import ProductCarousel from '@/components/ProductCarousel'
import CaseStudiesScroll from '@/components/CaseStudiesScroll'
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'
import ImageSphereSection from './ImageSphereSection'
import BubbleSphereShowcase from '@/components/BubbleSphereShowcase'
import DataSphereShowcase from '@/components/DataSphereShowcase'

export default function Home() {
  const { data } = useHomePageData()

  return (
    <main className="min-h-screen bg-white">
      <Header 
        logo={data?.footer?.siteLogo}
        logoLight={data?.footer?.siteLogoLight}
        siteName={data?.footer?.siteName}
        menuItems={data?.footer?.menuItems}
        cta={data?.footer?.cta}
      />

      {data?.hero && (
        <HeroSection data={data.hero} />
      )}

      {data?.metrics && data.metrics.length > 0 && (
        <MetricsCounter metrics={data.metrics} metricsSection={data.aboutUs || undefined} />
      )}

      {/* Explore Our Vision — scroll-driven image sphere animation */}
      {data?.sphereShowcase && (
        <ImageSphereSection
          data={{
            sectionTitle: data.sphereShowcase.sectionTitle || '',
            sectionDescription: data.sphereShowcase.sectionDescription || '',
            introHeading: data.sphereShowcase.introHeading,
            introSubheading: data.sphereShowcase.introSubheading,
            contentHeading: data.sphereShowcase.contentHeading,
            contentDescription: data.sphereShowcase.contentDescription,
            items: data.sphereShowcase.items || []
          }}
        />
      )}

      {data?.services && data.services.length > 0 && (
        <CoreServicesSection services={data.services} />
      )}

      {data?.products && data.products.length > 0 && (
        <ProductCarousel products={data.products} />
      )}

      {/* Admin-managed 3D image bubble sphere — performant, no scroll lock */}
      {data?.sphereShowcase && (
        <BubbleSphereShowcase
          data={{
            sectionTitle: data.sphereShowcase.sectionTitle || '',
            sectionDescription: data.sphereShowcase.sectionDescription || '',
            introHeading: data.sphereShowcase.introHeading,
            introSubheading: data.sphereShowcase.introSubheading,
            contentHeading: data.sphereShowcase.contentHeading,
            contentDescription: data.sphereShowcase.contentDescription,
            items: data.sphereShowcase.items || []
          }}
        />
      )}

      {/* Interactive 3D Data Sphere — services, solutions, industries, products, etc. */}
      <DataSphereShowcase />

      {data?.caseStudiesSection && data.caseStudies && data.caseStudies.length > 0 && (
        <CaseStudiesScroll 
          sectionData={{
            title: data.caseStudiesSection.title,
            description: data.caseStudiesSection.description
          }}
          caseStudies={data.caseStudies}
        />
      )}

      {data?.testimonials && data.testimonials.length > 0 && (
        <TestimonialsSection 
          testimonials={data.testimonials.map(t => ({
            author: {
              name: t.author,
              handle: t.handle,
              avatar: t.avatar?.asset?.url || undefined
            },
            text: t.text
          }))}
          title="What Our Clients Say"
          description="Hear from the businesses we've helped transform with AI"
        />
      )}

      {data?.cta && (
        <CtaSection data={data.cta} />
      )}

      {data?.footer && (
        <Footer 
          data={data.footer}
          services={data.services}
        />
      )}
    </main>
  )
}
