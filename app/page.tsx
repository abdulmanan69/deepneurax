'use client'

import Link from 'next/link'
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
import {
  servicesOverviewData,
  solutionsOverviewData,
  industriesServedData,
  productSuiteData,
  pricingModelsData,
  portfolioOverviewData,
  blogTopicsOverviewData,
  learningHubData,
  contactInfoData,
} from '@/lib/data/index'

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

      <div className="mt-24 space-y-24">
        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Detailed Service Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesOverviewData.categories.map((category) => (
              <div
                key={category.title}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3
                  className="text-2xl font-semibold text-slate-900 mb-4"
                  style={{ fontFamily: "'Geom', sans-serif" }}
                >
                  {category.title}
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  {category.items.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Solutions
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-10 text-center">
            {solutionsOverviewData.subheading}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsOverviewData.categories.map((category) => (
              <div
                key={category.title}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  {category.items.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Industries We Serve
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
            {industriesServedData.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {industriesServedData.industries.map((industry: string) => (
              <span
                key={industry}
                className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Products
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
            Explore our ready-to-use platforms designed for security, efficiency, and growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productSuiteData.products.map((product) => (
              <div
                key={product.name}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Pricing and Engagement Models
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
            {pricingModelsData.subheading}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingModelsData.models.map((model) => (
              <div
                key={model.name}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {model.name}
                </h3>
                <p className="text-slate-600 text-sm">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              {pricingModelsData.ctaText}
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Portfolio
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-center">
            {portfolioOverviewData.subheading}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {portfolioOverviewData.categories.map((category: string) => (
              <div
                key={category}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {category}
                </h3>
                <p className="text-slate-600 text-sm">
                  End-to-end delivery from discovery to deployment with measurable business impact.
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Every project highlights
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 text-sm">
              {portfolioOverviewData.projectDetails.map((detail: string) => (
                <li key={detail} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-500">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Insights and Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Blog Topics
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {blogTopicsOverviewData.subheading}
              </p>
              <ul className="space-y-2 text-slate-700 text-sm">
                {blogTopicsOverviewData.topics.map((topic: string) => (
                  <li key={topic} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Learning Hub
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                {learningHubData.description}
              </p>
              <ul className="space-y-2 text-slate-700 text-sm mb-4">
                {learningHubData.resources.map((resource: string) => (
                  <li key={resource} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Upcoming Courses
              </h4>
              <ul className="space-y-1 text-slate-700 text-sm">
                {learningHubData.upcomingCourses.map((course: string) => (
                  <li key={course} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Contact Us
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-600 mb-4">
              DeepNeurax Technologies
            </p>
            <p className="text-slate-600 mb-6">
              {contactInfoData.address}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {contactInfoData.email && (
                <a
                  href={`mailto:${contactInfoData.email}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {contactInfoData.email}
                </a>
              )}
              {contactInfoData.phone && (
                <a
                  href={`tel:${contactInfoData.phone}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {contactInfoData.phone}
                </a>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {contactInfoData.primaryCtaLabel}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {contactInfoData.secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>

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
