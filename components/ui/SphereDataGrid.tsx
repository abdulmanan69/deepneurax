'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

/**
 * SphereDataGrid — Interactive 3D Data Sphere Component
 *
 * Adapted from SphereImageGrid to support both image bubbles and
 * rich data-content bubbles (icon + title + description + items list).
 *
 * Each node is positioned on a 3D sphere using Fibonacci distribution.
 * Supports drag-to-rotate, momentum physics, auto-rotation, and
 * a detail modal when clicking any bubble.
 */

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface SphericalPosition {
  theta: number
  phi: number
  radius: number
}

export interface WorldPosition extends Position3D {
  scale: number
  zIndex: number
  isVisible: boolean
  fadeOpacity: number
  originalIndex: number
}

/** A single node on the sphere — can be an image or a data bubble. */
export interface SphereNodeData {
  id: string
  src?: string          // Image URL (leave empty for data bubbles)
  alt: string
  title?: string
  description?: string
  icon?: string         // Emoji shown in the bubble
  color?: string        // Gradient start
  colorEnd?: string     // Gradient end
  category?: string     // Category label (shown in modal badge)
  items?: string[]      // Bullet-list items for the detail modal
}

export interface SphereDataGridProps {
  nodes?: SphereNodeData[]
  containerSize?: number
  sphereRadius?: number
  dragSensitivity?: number
  momentumDecay?: number
  maxRotationSpeed?: number
  baseNodeScale?: number
  hoverScale?: number
  perspective?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  className?: string
}

interface RotationState { x: number; y: number; z: number }
interface VelocityState { x: number; y: number }
interface MousePosition { x: number; y: number }

// ==========================================
// MATH HELPERS
// ==========================================

const SPHERE_MATH = {
  degreesToRadians: (degrees: number): number => degrees * (Math.PI / 180),
  radiansToDegrees: (radians: number): number => radians * (180 / Math.PI),

  sphericalToCartesian: (radius: number, theta: number, phi: number): Position3D => ({
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  }),

  calculateDistance: (pos: Position3D, center: Position3D = { x: 0, y: 0, z: 0 }): number => {
    const dx = pos.x - center.x
    const dy = pos.y - center.y
    const dz = pos.z - center.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  },

  normalizeAngle: (angle: number): number => {
    while (angle > 180) angle -= 360
    while (angle < -180) angle += 360
    return angle
  },
}

// ==========================================
// MAIN COMPONENT
// ==========================================

const SphereDataGrid: React.FC<SphereDataGridProps> = ({
  nodes = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseNodeScale = 0.12,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = '',
}) => {
  // ==========================================
  // STATE & REFS
  // ==========================================

  const [isMounted, setIsMounted] = useState(false)
  const [rotation, setRotation] = useState<RotationState>({ x: 15, y: 15, z: 0 })
  const [velocity, setVelocity] = useState<VelocityState>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNode, setSelectedNode] = useState<SphereNodeData | null>(null)
  const [nodePositions, setNodePositions] = useState<SphericalPosition[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastMousePos = useRef<MousePosition>({ x: 0, y: 0 })
  const animationFrame = useRef<number | null>(null)

  // ==========================================
  // COMPUTED
  // ==========================================

  const actualSphereRadius = sphereRadius || containerSize * 0.5
  const baseNodeSize = containerSize * baseNodeScale

  // ==========================================
  // SPHERE POSITION GENERATION (Fibonacci)
  // ==========================================

  const generateSpherePositions = useCallback((): SphericalPosition[] => {
    const positions: SphericalPosition[] = []
    const nodeCount = nodes.length
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = (2 * Math.PI) / goldenRatio

    for (let i = 0; i < nodeCount; i++) {
      const t = i / nodeCount
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      let phi = inclination * (180 / Math.PI)
      let theta = (azimuth * (180 / Math.PI)) % 360

      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35
      if (phi < 90) {
        phi = Math.max(5, phi - poleBonus)
      } else {
        phi = Math.min(175, phi + poleBonus)
      }

      phi = 15 + (phi / 180) * 150

      const randomOffset = (Math.random() - 0.5) * 20
      theta = (theta + randomOffset) % 360
      phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10))

      positions.push({ theta, phi, radius: actualSphereRadius })
    }

    return positions
  }, [nodes.length, actualSphereRadius])

  // ==========================================
  // 3D → 2D PROJECTION
  // ==========================================

  const calculateWorldPositions = useCallback((): WorldPosition[] => {
    const positions = nodePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta)
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi)
      const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x)
      const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y)

      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad)
      let y = pos.radius * Math.cos(phiRad)
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad)

      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad)
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad)
      x = x1; z = z1

      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad)
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad)
      y = y2; z = z2

      const worldPos: Position3D = { x, y, z }

      const fadeZoneStart = -10
      const fadeZoneEnd = -30
      const isVisible = worldPos.z > fadeZoneEnd

      let fadeOpacity = 1
      if (worldPos.z <= fadeZoneStart) {
        fadeOpacity = Math.max(0, (worldPos.z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd))
      }

      const isPoleImage = pos.phi < 30 || pos.phi > 150
      const distanceFromCenter = Math.sqrt(worldPos.x * worldPos.x + worldPos.y * worldPos.y)
      const maxDistance = actualSphereRadius
      const distanceRatio = Math.min(distanceFromCenter / maxDistance, 1)

      const distancePenalty = isPoleImage ? 0.4 : 0.7
      const centerScale = Math.max(0.3, 1 - distanceRatio * distancePenalty)
      const depthScale = (worldPos.z + actualSphereRadius) / (2 * actualSphereRadius)
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3)

      return {
        ...worldPos,
        scale,
        zIndex: Math.round(1000 + worldPos.z),
        isVisible,
        fadeOpacity,
        originalIndex: index,
      }
    })

    // Collision detection
    const adjusted = [...positions]
    for (let i = 0; i < adjusted.length; i++) {
      const pos = adjusted[i]
      if (!pos.isVisible) continue

      let adjScale = pos.scale
      const nodeSize = baseNodeSize * adjScale

      for (let j = 0; j < adjusted.length; j++) {
        if (i === j) continue
        const other = adjusted[j]
        if (!other.isVisible) continue

        const otherSize = baseNodeSize * other.scale
        const dx = pos.x - other.x
        const dy = pos.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = (nodeSize + otherSize) / 2 + 25

        if (distance < minDistance && distance > 0) {
          const overlap = minDistance - distance
          const reduction = Math.max(0.4, 1 - (overlap / minDistance) * 0.6)
          adjScale = Math.min(adjScale, adjScale * reduction)
        }
      }
      adjusted[i] = { ...pos, scale: Math.max(0.25, adjScale) }
    }

    return adjusted
  }, [nodePositions, rotation, actualSphereRadius, baseNodeSize])

  const clampSpeed = useCallback(
    (speed: number): number => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed)),
    [maxRotationSpeed],
  )

  // ==========================================
  // PHYSICS & MOMENTUM
  // ==========================================

  const updateMomentum = useCallback(() => {
    if (isDragging) return

    setVelocity(prev => {
      const nv = { x: prev.x * momentumDecay, y: prev.y * momentumDecay }
      if (!autoRotate && Math.abs(nv.x) < 0.01 && Math.abs(nv.y) < 0.01) return { x: 0, y: 0 }
      return nv
    })

    setRotation(prev => {
      let newY = prev.y
      if (autoRotate) newY += autoRotateSpeed
      newY += clampSpeed(velocity.y)
      return {
        x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(velocity.x)),
        y: SPHERE_MATH.normalizeAngle(newY),
        z: prev.z,
      }
    })
  }, [isDragging, momentumDecay, velocity, clampSpeed, autoRotate, autoRotateSpeed])

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setVelocity({ x: 0, y: 0 })
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      const rd = { x: -dy * dragSensitivity, y: dx * dragSensitivity }

      setRotation(prev => ({
        x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(rd.x)),
        y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(rd.y)),
        z: prev.z,
      }))
      setVelocity({ x: clampSpeed(rd.x), y: clampSpeed(rd.y) })
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    },
    [isDragging, dragSensitivity, clampSpeed],
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const t = e.touches[0]
    setIsDragging(true)
    setVelocity({ x: 0, y: 0 })
    lastMousePos.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - lastMousePos.current.x
      const dy = t.clientY - lastMousePos.current.y
      const rd = { x: -dy * dragSensitivity, y: dx * dragSensitivity }

      setRotation(prev => ({
        x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(rd.x)),
        y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(rd.y)),
        z: prev.z,
      }))
      setVelocity({ x: clampSpeed(rd.x), y: clampSpeed(rd.y) })
      lastMousePos.current = { x: t.clientX, y: t.clientY }
    },
    [isDragging, dragSensitivity, clampSpeed],
  )

  const handleTouchEnd = useCallback(() => setIsDragging(false), [])

  // ==========================================
  // LIFECYCLE
  // ==========================================

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    setNodePositions(generateSpherePositions())
  }, [generateSpherePositions])

  useEffect(() => {
    const animate = () => {
      updateMomentum()
      animationFrame.current = requestAnimationFrame(animate)
    }
    if (isMounted) animationFrame.current = requestAnimationFrame(animate)
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current) }
  }, [isMounted, updateMomentum])

  useEffect(() => {
    if (!isMounted) return
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // ==========================================
  // WORLD POSITIONS (per-render)
  // ==========================================

  const worldPositions = calculateWorldPositions()

  // ==========================================
  // RENDER: node bubble
  // ==========================================

  const renderNode = useCallback(
    (node: SphereNodeData, index: number) => {
      const position = worldPositions[index]
      if (!position || !position.isVisible) return null

      const nodeSize = baseNodeSize * position.scale
      const isHov = hoveredIndex === index
      const finalScale = isHov ? Math.min(1.3, 1.3 / position.scale) : 1
      const isDataNode = !!node.icon && !node.src

      return (
        <div
          key={node.id}
          className="absolute cursor-pointer select-none transition-all duration-200 ease-out"
          style={{
            width: `${nodeSize}px`,
            height: `${nodeSize}px`,
            left: `${containerSize / 2 + position.x}px`,
            top: `${containerSize / 2 + position.y}px`,
            opacity: position.fadeOpacity,
            transform: `translate(-50%, -50%) scale(${finalScale})`,
            zIndex: position.zIndex,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => setSelectedNode(node)}
        >
          {isDataNode ? (
            <div
              className="relative w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center text-center p-0.5"
              style={{
                background: `linear-gradient(135deg, ${node.color || '#3B82F6'}, ${node.colorEnd || '#6366F1'})`,
                boxShadow: isHov
                  ? `0 0 20px ${node.color || '#3B82F6'}80, 0 4px 12px rgba(0,0,0,0.3)`
                  : '0 4px 12px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.25)',
              }}
            >
              <span
                className="leading-none drop-shadow-sm"
                style={{ fontSize: nodeSize > 60 ? '1.4rem' : nodeSize > 40 ? '1rem' : '0.75rem' }}
              >
                {node.icon}
              </span>
              {nodeSize > 58 && node.title && (
                <span
                  className="font-bold text-white/90 mt-0.5 px-0.5 leading-[1.1] line-clamp-2 max-w-full drop-shadow-sm"
                  style={{ fontSize: nodeSize > 70 ? '8px' : '7px' }}
                >
                  {node.title}
                </span>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white/20">
              <img
                src={node.src}
                alt={node.alt}
                className="w-full h-full object-cover"
                draggable={false}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
          )}
        </div>
      )
    },
    [worldPositions, baseNodeSize, containerSize, hoveredIndex],
  )

  // ==========================================
  // RENDER: detail modal
  // ==========================================

  const renderDetailModal = () => {
    if (!selectedNode) return null
    const isDataNode = !!selectedNode.icon && !selectedNode.src

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedNode(null)}
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          animation: 'sdg-fadeIn 0.25s ease-out',
        }}
      >
        <div
          className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: 'sdg-scaleIn 0.25s ease-out' }}
        >
          {isDataNode ? (
            <>
              {/* Gradient header */}
              <div
                className="relative p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${selectedNode.color || '#3B82F6'}, ${selectedNode.colorEnd || '#6366F1'})`,
                }}
              >
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/20 rounded-full text-white flex items-center justify-center hover:bg-black/40 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
                {selectedNode.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider mb-3">
                    {selectedNode.category}
                  </span>
                )}
                <div className="text-5xl mb-3">{selectedNode.icon}</div>
                <h3 className="text-2xl font-bold text-white">{selectedNode.title}</h3>
              </div>
              {/* Body */}
              <div className="p-6 max-h-[50vh] overflow-y-auto">
                {selectedNode.description && (
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">{selectedNode.description}</p>
                )}
                {selectedNode.items && selectedNode.items.length > 0 && (
                  <ul className="space-y-2.5">
                    {selectedNode.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: selectedNode.color || '#3B82F6' }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {(!selectedNode.description && (!selectedNode.items || selectedNode.items.length === 0)) && (
                  <p className="text-slate-400 text-sm italic">Click to learn more about {selectedNode.title}.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="relative aspect-square">
                <img src={selectedNode.src} alt={selectedNode.alt} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              {(selectedNode.title || selectedNode.description) && (
                <div className="p-6">
                  {selectedNode.title && <h3 className="text-xl font-bold mb-2">{selectedNode.title}</h3>}
                  {selectedNode.description && <p className="text-gray-600">{selectedNode.description}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // ==========================================
  // EARLY RETURNS
  // ==========================================

  if (!isMounted) {
    return (
      <div
        className="rounded-lg animate-pulse flex items-center justify-center"
        style={{ width: containerSize, height: containerSize, background: 'rgba(255,255,255,0.05)' }}
      >
        <div className="text-slate-500">Loading sphere…</div>
      </div>
    )
  }

  if (!nodes.length) {
    return (
      <div
        className="rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        <div className="text-slate-500 text-center">
          <p>No data nodes provided</p>
        </div>
      </div>
    )
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================

  return (
    <>
      <style>{`
        @keyframes sdg-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sdg-scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div
        ref={containerRef}
        className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
        style={{
          width: containerSize,
          height: containerSize,
          perspective: `${perspective}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full h-full" style={{ zIndex: 10 }}>
          {nodes.map((node, index) => renderNode(node, index))}
        </div>
      </div>

      {renderDetailModal()}
    </>
  )
}

export default SphereDataGrid
