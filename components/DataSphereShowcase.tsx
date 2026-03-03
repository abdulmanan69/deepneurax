'use client'

import { useState, useEffect } from 'react'
import SphereDataGrid, { type SphereNodeData } from '@/components/ui/SphereDataGrid'
import {
  servicesOverviewData,
  solutionsOverviewData,
  industriesServedData,
  productSuiteData,
  pricingModelsData,
  portfolioOverviewData,
  blogTopicsOverviewData,
  learningHubData,
} from '@/lib/data/index'

// ==========================================
// SPHERE NODE DATA — all content sections
// ==========================================

const SERVICE_ITEMS: SphereNodeData[] = servicesOverviewData.categories.map((cat, i) => ({
  id: `svc-${i}`,
  alt: cat.title,
  title: cat.title,
  icon: ['💻', '🛡️', '🤖', '☁️', '🌐', '📈', '🎓'][i] || '📌',
  color: ['#1D4ED8', '#B91C1C', '#047857', '#0369A1', '#4338CA', '#B45309', '#7C2D12'][i],
  colorEnd: ['#3B82F6', '#EF4444', '#10B981', '#0EA5E9', '#6366F1', '#F59E0B', '#EA580C'][i],
  category: 'Services',
  description: servicesOverviewData.subheading,
  items: cat.items,
}))

const SOLUTION_ITEMS: SphereNodeData[] = solutionsOverviewData.categories.map((cat, i) => ({
  id: `sol-${i}`,
  alt: cat.title,
  title: cat.title,
  icon: ['🏢', '🛒', '🔒', '⚙️', '🏭'][i] || '📌',
  color: ['#4338CA', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'][i],
  colorEnd: ['#6366F1', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'][i],
  category: 'Solutions',
  description: solutionsOverviewData.subheading,
  items: cat.items,
}))

const industryIcons = ['💻', '📚', '🏥', '🛍️', '🏠', '🏭', '💰', '🏛️', '🚚', '🌾']
const INDUSTRY_ITEMS: SphereNodeData[] = industriesServedData.industries.map((ind, i) => ({
  id: `ind-${i}`,
  alt: ind,
  title: ind,
  icon: industryIcons[i] || '🏢',
  color: ['#047857', '#059669', '#0D9488', '#0891B2', '#0E7490', '#047857', '#059669', '#0D9488', '#0891B2', '#0E7490'][i],
  colorEnd: ['#10B981', '#34D399', '#2DD4BF', '#22D3EE', '#06B6D4', '#10B981', '#34D399', '#2DD4BF', '#22D3EE', '#06B6D4'][i],
  category: 'Industries',
  description: industriesServedData.description,
}))

const PRODUCT_ITEMS: SphereNodeData[] = productSuiteData.products.map((prod, i) => ({
  id: `prd-${i}`,
  alt: prod.name,
  title: prod.name,
  icon: ['🔐', '📊', '🎓', '👁️', '📋'][i] || '📦',
  color: ['#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#7C3AED'][i],
  colorEnd: ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#A78BFA'][i],
  category: 'Products',
  description: prod.description,
}))

const PRICING_ITEMS: SphereNodeData[] = pricingModelsData.models.map((model, i) => ({
  id: `prc-${i}`,
  alt: model.name,
  title: model.name,
  icon: ['💵', '🔄', '👥'][i] || '💳',
  color: ['#0E7490', '#0891B2', '#06B6D4'][i],
  colorEnd: ['#22D3EE', '#67E8F9', '#A5F3FC'][i],
  category: 'Pricing',
  description: model.description,
}))

const PORTFOLIO_ITEMS: SphereNodeData[] = portfolioOverviewData.categories.map((cat, i) => ({
  id: `ptf-${i}`,
  alt: cat,
  title: cat,
  icon: ['📱', '🌐', '🔒', '🤖', '🎨'][i] || '📂',
  color: ['#C2410C', '#EA580C', '#D97706', '#B45309', '#92400E'][i],
  colorEnd: ['#F97316', '#FB923C', '#FBBF24', '#F59E0B', '#D97706'][i],
  category: 'Portfolio',
  description: portfolioOverviewData.subheading,
  items: portfolioOverviewData.projectDetails,
}))

const INSIGHT_ITEMS: SphereNodeData[] = [
  {
    id: 'ins-blog',
    alt: 'Blog & Insights',
    title: 'Blog & Insights',
    icon: '📝',
    color: '#BE185D',
    colorEnd: '#EC4899',
    category: 'Insights',
    description: blogTopicsOverviewData.subheading,
    items: blogTopicsOverviewData.topics,
  },
  {
    id: 'ins-hub',
    alt: 'Learning Hub',
    title: 'Learning Hub',
    icon: '📖',
    color: '#9D174D',
    colorEnd: '#F472B6',
    category: 'Insights',
    description: learningHubData.description,
    items: [...learningHubData.resources, '—', ...learningHubData.upcomingCourses],
  },
]

const ALL_NODES: SphereNodeData[] = [
  ...SERVICE_ITEMS,
  ...SOLUTION_ITEMS,
  ...INDUSTRY_ITEMS,
  ...PRODUCT_ITEMS,
  ...PRICING_ITEMS,
  ...PORTFOLIO_ITEMS,
  ...INSIGHT_ITEMS,
]

const CATEGORIES = ['All', 'Services', 'Solutions', 'Industries', 'Products', 'Pricing', 'Portfolio', 'Insights'] as const

const CATEGORY_COLORS: Record<string, string> = {
  All: '#3B82F6',
  Services: '#2563EB',
  Solutions: '#6366F1',
  Industries: '#10B981',
  Products: '#8B5CF6',
  Pricing: '#06B6D4',
  Portfolio: '#F97316',
  Insights: '#EC4899',
}

// ==========================================
// COMPONENT
// ==========================================

export default function DataSphereShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [containerSize, setContainerSize] = useState(500)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 480) setContainerSize(320)
      else if (w < 640) setContainerSize(380)
      else if (w < 1024) setContainerSize(450)
      else setContainerSize(560)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const filteredNodes =
    activeCategory === 'All' ? ALL_NODES : ALL_NODES.filter((n) => n.category === activeCategory)

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background — matches metrics blue */}
      <div className="absolute inset-0 bg-[#0b1d4f]" />
      {/* White dot texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      {/* Subtle center glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />

      <div className="relative z-10 container mx-auto px-6">
        {/* ---- Heading ---- */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Our Ecosystem
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Geom', sans-serif" }}
          >
            Explore Everything We{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Offer
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Interact with our 3D sphere to discover our complete range of services, solutions,
            products, and expertise. Drag to rotate — click any bubble to learn more.
          </p>
        </div>

        {/* ---- Category filter ---- */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer border"
                style={{
                  background: isActive ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.04)',
                  borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: isActive ? `0 4px 20px ${CATEGORY_COLORS[cat]}40` : 'none',
                }}
              >
                {cat}
                {isActive && (
                  <span className="ml-1.5 text-white/70 text-xs">
                    ({filteredNodes.length})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ---- Sphere ---- */}
        <div className="flex justify-center">
          <SphereDataGrid
            key={activeCategory}
            nodes={filteredNodes}
            containerSize={containerSize}
            sphereRadius={containerSize * 0.42}
            autoRotate={true}
            autoRotateSpeed={0.2}
            baseNodeScale={0.14}
            dragSensitivity={0.5}
            momentumDecay={0.94}
          />
        </div>

        {/* ---- Hint ---- */}
        <p className="text-center text-slate-600 text-xs sm:text-sm mt-5 select-none">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-600 animate-pulse" />
            Drag to rotate
          </span>
          <span className="mx-2 text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-600 animate-pulse" />
            Click to explore
          </span>
        </p>
      </div>
    </section>
  )
}
