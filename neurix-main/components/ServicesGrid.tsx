'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ParticlesBackground from './ui/ParticlesBackground'
import Image from 'next/image'
import { Rocket, Code, Paintbrush, Brain, TrendingUp, Database, Eye, Target, Zap, Shield, Users } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Service {
  title: string
  icon?: string
  description: string
  link?: string
  cardBackgroundColor?: string
  borderColor?: string
  titleColor?: string
  textColor?: string
  image?: {
    asset: {
      url: string
    }
  }
}

// Map icon names to Lucide components
const iconMap: Record<string, any> = {
  '🧠': Brain,
  '🤖': Brain,
  '📊': TrendingUp,
  '🎯': Target,
  '👁️': Eye,
  '⚡': Zap,
  '🛡️': Shield,
  '👥': Users,
  '💾': Database,
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export default function ServicesGrid() { return null; }
