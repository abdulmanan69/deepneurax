'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface NumberTickerProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export default function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: NumberTickerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const incrementTime = (duration * 1000) / end
    const minInterval = 16 // ~60fps

    if (end <= 0) {
      setDisplayValue(0)
      return
    }

    const step = Math.max(1, Math.floor(end / (duration * 1000 / minInterval)))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, Math.max(incrementTime * step, minInterval))

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`tabular-nums ${className}`}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  )
}
