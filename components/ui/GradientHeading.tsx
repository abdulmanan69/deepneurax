'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GradientHeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  gradient?: string
}

export default function GradientHeading({
  children,
  className = '',
  as: Tag = 'h2',
  gradient = 'from-slate-900 via-blue-800 to-slate-900',
}: GradientHeadingProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Tag
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${className}`}
        style={{ fontFamily: "'Geom', sans-serif" }}
      >
        {children}
      </Tag>
    </motion.div>
  )
}

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/60 bg-blue-50/50 text-blue-600 text-xs font-semibold uppercase tracking-wider ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      {children}
    </motion.div>
  )
}
