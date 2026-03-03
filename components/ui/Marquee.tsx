'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      const firstChild = containerRef.current.children[0] as HTMLElement
      if (firstChild) {
        setContentWidth(firstChild.scrollWidth)
      }
    }
  }, [children])

  const duration = contentWidth / speed

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
    >
      <div
        ref={containerRef}
        className={`flex gap-4 w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee-scroll ${duration || 40}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`,
        }}
      >
        <div className="flex gap-4 shrink-0">{children}</div>
        <div className="flex gap-4 shrink-0" aria-hidden>{children}</div>
      </div>
    </div>
  )
}

/* ========== Marquee Tag ========== */

interface MarqueeTagProps {
  label: string
  icon?: string
  accentColor?: string
}

export function MarqueeTag({ label, icon, accentColor = '#0066FF' }: MarqueeTagProps) {
  return (
    <div className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-slate-200/60 bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-default select-none">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors whitespace-nowrap">
        {label}
      </span>
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(100px circle at 50% 50%, ${accentColor}10, transparent)`,
        }}
      />
    </div>
  )
}

/* ========== Animated Tag Cloud ========== */

interface AnimatedTagCloudProps {
  tags: string[]
  accentColor?: string
}

export function AnimatedTagCloud({ tags, accentColor = '#0066FF' }: AnimatedTagCloudProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-3">
      {tags.map((tag, i) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: `0 4px 20px ${accentColor}25`,
          }}
          className="px-5 py-2.5 rounded-full border border-slate-200/60 bg-white text-slate-700 text-sm font-medium cursor-default hover:border-blue-200 hover:text-slate-900 transition-colors duration-200"
        >
          {tag}
        </motion.span>
      ))}
    </div>
  )
}
