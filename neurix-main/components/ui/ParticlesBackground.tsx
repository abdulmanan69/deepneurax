'use client'

import React, { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
}

export default function ParticlesBackground({
  color = '#3b82f6',
  linkColor = '#60a5fa',
  maxParticles = 80,
  repelRadius = 120,
  linkDistance = 140,
}: {
  color?: string
  linkColor?: string
  maxParticles?: number
  repelRadius?: number
  linkDistance?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId = 0
    let particles: Particle[] = []

    const setSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const { clientWidth, clientHeight } = canvas.parentElement || canvas
      canvas.width = Math.floor(clientWidth * dpr)
      canvas.height = Math.floor(clientHeight * dpr)
      canvas.style.width = `${clientWidth}px`
      canvas.style.height = `${clientHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seedParticles = () => {
      particles = []
      const area = (canvas.width * canvas.height) / Math.max(1, window.devicePixelRatio || 1)
      const target = Math.min(maxParticles, Math.max(110, Math.floor(area / 14000)))
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * (canvas.width / (window.devicePixelRatio || 1)),
          y: Math.random() * (canvas.height / (window.devicePixelRatio || 1)),
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
        })
      }
    }

    const step = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      // Move and draw particles
      ctx.fillStyle = color
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Repel from mouse
        if (mouseRef.current) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist = Math.hypot(dx, dy)
          if (dist < repelRadius && dist > 0.0001) {
            const force = (repelRadius - dist) / repelRadius
            p.vx += (dx / dist) * force * 0.8
            p.vy += (dy / dist) * force * 0.8
          }
        }

        // Integrate velocity
        p.x += p.vx
        p.y += p.vy

        // Gentle damping
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap around edges
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        // Draw particle (bolder and more visible)
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore();
      }

      // Draw connections
      ctx.strokeStyle = linkColor
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDistance) {
            const alpha = 1 - dist / linkDistance
            ctx.globalAlpha = Math.max(0.08, alpha * 0.6)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      animationId = window.requestAnimationFrame(step)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleMouseLeave = () => {
      mouseRef.current = null
    }
    const handleResize = () => {
      setSize()
      seedParticles()
    }

    setSize()
    seedParticles()
    
    // Use IntersectionObserver to pause animation when off-screen (saves CPU/battery)
    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && animationId === 0) {
          step()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)
    
    // Modified step function to check visibility
    const originalStep = step
    const stepWithVisibility = () => {
      if (!isVisible) {
        animationId = 0
        return
      }
      originalStep()
    }
    
    // Start animation
    stepWithVisibility()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.cancelAnimationFrame(animationId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [color, linkColor, maxParticles, repelRadius, linkDistance])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
