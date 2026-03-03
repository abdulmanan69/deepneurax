'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

interface PricingCardProps {
  name: string
  description: string
  index?: number
  featured?: boolean
  accentColor?: string
}

export default function PricingCard({
  name,
  description,
  index = 0,
  featured = false,
  accentColor = '#0066FF',
}: PricingCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative group rounded-2xl p-[1px] transition-shadow duration-500 ${
        featured
          ? 'shadow-xl shadow-blue-500/10'
          : 'shadow-lg shadow-slate-200/50 hover:shadow-xl'
      }`}
    >
      {/* Animated gradient border */}
      <div
        className={`absolute inset-0 rounded-2xl ${
          featured
            ? 'bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 opacity-100'
            : 'bg-gradient-to-br from-slate-200 via-blue-200 to-slate-200 opacity-50 group-hover:opacity-100'
        } transition-opacity duration-500`}
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient 4s ease infinite',
        }}
      />

      <div
        className={`relative rounded-2xl p-8 h-full flex flex-col ${
          featured
            ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
            : 'bg-white'
        }`}
      >
        {featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold uppercase tracking-wider">
              Popular
            </span>
          </div>
        )}

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${
            featured ? 'bg-white/10' : 'bg-slate-100'
          }`}
        >
          <svg
            className={`w-5 h-5 ${featured ? 'text-blue-400' : 'text-blue-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3
          className={`text-xl font-bold mb-3 ${
            featured ? 'text-white' : 'text-slate-900'
          }`}
          style={{ fontFamily: "'Geom', sans-serif" }}
        >
          {name}
        </h3>

        <p
          className={`text-sm leading-relaxed flex-1 ${
            featured ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {description}
        </p>

        <div className="mt-6">
          <div
            className={`h-[1px] mb-5 ${
              featured
                ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'
            }`}
          />
          <Link
            href="/contact"
            className={`inline-flex items-center gap-2 text-sm font-semibold group/link ${
              featured
                ? 'text-blue-400 hover:text-blue-300'
                : 'hover:text-blue-700'
            } transition-colors`}
            style={{ color: featured ? undefined : accentColor }}
          >
            Get Started
            <svg
              className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
