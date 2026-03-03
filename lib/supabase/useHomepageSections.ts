'use client'

import { useState, useEffect } from 'react'
import { createClient } from './client'
import type { HomepageSection } from '@/components/HomepageSections'

export function useHomepageSections() {
  const [sections, setSections] = useState<HomepageSection[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSections() {
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('homepage_sections')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) {
          // Table may not exist yet — that's fine, fall back to static data
          console.warn('homepage_sections fetch failed:', error.message)
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setSections(
            data.map((row: Record<string, unknown>) => ({
              section_key: row.section_key as string,
              heading: (row.heading as string) || '',
              subheading: (row.subheading as string) || undefined,
              description: (row.description as string) || undefined,
              items: (row.items as unknown[]) || [],
              cta_text: (row.cta_text as string) || undefined,
              cta_link: (row.cta_link as string) || undefined,
              is_visible: row.is_visible !== false,
              display_order: (row.display_order as number) || 0,
              animation_style: (row.animation_style as string) || 'fade-up',
              theme: (row.theme as string) || 'light',
            }))
          )
        }
      } catch (err) {
        console.warn('homepage_sections fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  return { sections, loading }
}
