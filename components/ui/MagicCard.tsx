'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  index?: number
  glowColor?: string
}

export default function MagicCard({
  children,
  className = '',
  index = 0,
  glowColor = 'rgba(0, 102, 255, 0.15)',
}: MagicCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.95 }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: `0 20px 40px ${glowColor}, 0 0 60px ${glowColor}`,
      }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-colors duration-300 hover:border-blue-200/80 ${className}`}
    >
      {/* Shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
          }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/* ========== Bento Grid ========== */

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  title: string
  description?: string
  icon?: string
  items?: string[]
  index?: number
  className?: string
  accentColor?: string
}

export function BentoCard({
  title,
  description,
  icon,
  items,
  index = 0,
  className = '',
  accentColor = '#0066FF',
}: BentoCardProps) {
  return (
    <MagicCard
      index={index}
      className={`${className}`}
      glowColor={`${accentColor}20`}
    >
      <div className="p-6 lg:p-8 h-full flex flex-col">
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
            }}
          >
            {icon}
          </div>
        )}
        <h3
          className="text-lg font-bold text-slate-900 mb-2"
          style={{ fontFamily: "'Geom', sans-serif" }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}
        {items && items.length > 0 && (
          <ul className="space-y-2 mt-auto">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MagicCard>
  )
}
