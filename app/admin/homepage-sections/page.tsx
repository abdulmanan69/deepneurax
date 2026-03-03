'use client'

import { useEffect, useState, useCallback } from 'react'
import { homepageSectionsAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'

/* ====== Section definitions ====== */
const SECTION_DEFS = [
  {
    key: 'service_areas',
    label: 'Detailed Service Areas',
    icon: '⚙️',
    description: 'Grid of service categories with list items',
    itemType: 'categories' as const,
  },
  {
    key: 'solutions',
    label: 'Solutions',
    icon: '🎯',
    description: 'Industry-specific solutions with categories',
    itemType: 'categories' as const,
  },
  {
    key: 'industries',
    label: 'Industries We Serve',
    icon: '🏭',
    description: 'Industry tags displayed as marquee or tag cloud',
    itemType: 'tags' as const,
  },
  {
    key: 'product_suite',
    label: 'Product Suite',
    icon: '📦',
    description: 'Product cards with name and description',
    itemType: 'products' as const,
  },
  {
    key: 'pricing',
    label: 'Pricing & Engagement',
    icon: '💰',
    description: 'Pricing models with CTA button',
    itemType: 'pricing' as const,
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    icon: '📁',
    description: 'Portfolio categories and project highlights',
    itemType: 'portfolio' as const,
  },
  {
    key: 'insights',
    label: 'Insights & Learning',
    icon: '📚',
    description: 'Blog topics and learning hub resources',
    itemType: 'insights' as const,
  },
  {
    key: 'contact_cta',
    label: 'Contact CTA',
    icon: '📞',
    description: 'Contact information and call-to-action',
    itemType: 'contact' as const,
  },
]

const ANIMATION_STYLES = [
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'fade-left', label: 'Fade Left' },
  { value: 'fade-right', label: 'Fade Right' },
  { value: 'marquee', label: 'Marquee (for tags)' },
  { value: 'tag-cloud', label: 'Tag Cloud (for tags)' },
  { value: 'stagger', label: 'Stagger Cards' },
]

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'gradient', label: 'Gradient' },
]

/* ====== Types ====== */
interface SectionForm {
  section_key: string
  heading: string
  subheading: string
  description: string
  items: unknown[]
  cta_text: string
  cta_link: string
  is_visible: boolean
  display_order: number
  animation_style: string
  theme: string
}

interface CategoryItem {
  title: string
  items: string[]
  icon?: string
}

interface ProductItem {
  name: string
  description: string
  icon?: string
}

interface PricingItem {
  name: string
  description: string
}

interface PortfolioItems {
  categories: string[]
  projectDetails: string[]
}

interface InsightsItems {
  subheading: string
  topics: string[]
}

interface ContactItems {
  email: string
  phone: string
  address: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
}

/* ====== Main Page ====== */
export default function HomepageSectionsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<Record<string, SectionForm>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await homepageSectionsAdmin.getAll()
      const map: Record<string, SectionForm> = {}
      if (data) {
        for (const row of data) {
          map[row.section_key] = {
            section_key: row.section_key,
            heading: row.heading || '',
            subheading: row.subheading || '',
            description: row.description || '',
            items: row.items || [],
            cta_text: row.cta_text || '',
            cta_link: row.cta_link || '',
            is_visible: row.is_visible !== false,
            display_order: row.display_order || 0,
            animation_style: row.animation_style || 'fade-up',
            theme: row.theme || 'light',
          }
        }
      }
      setSections(map)
    } catch {
      // Table may not exist yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const getForm = (key: string): SectionForm => {
    return sections[key] || {
      section_key: key,
      heading: '',
      subheading: '',
      description: '',
      items: [],
      cta_text: '',
      cta_link: '',
      is_visible: true,
      display_order: SECTION_DEFS.findIndex(d => d.key === key),
      animation_style: key === 'industries' ? 'marquee' : 'fade-up',
      theme: 'light',
    }
  }

  const [form, setForm] = useState<SectionForm | null>(null)

  const startEditing = (key: string) => {
    setEditingKey(key)
    setForm(getForm(key))
  }

  const handleSave = async () => {
    if (!form || !editingKey) return
    setSaving(true)
    try {
      await homepageSectionsAdmin.save(editingKey, {
        heading: form.heading,
        subheading: form.subheading || null,
        description: form.description || null,
        items: form.items,
        cta_text: form.cta_text || null,
        cta_link: form.cta_link || null,
        is_visible: form.is_visible,
        display_order: form.display_order,
        animation_style: form.animation_style,
        theme: form.theme,
      })
      showToast('Section saved successfully!')
      setSections(prev => ({ ...prev, [editingKey]: form }))
      setEditingKey(null)
      setForm(null)
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save section', 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleVisibility = async (key: string) => {
    const current = getForm(key)
    const newVisible = !current.is_visible
    try {
      await homepageSectionsAdmin.save(key, {
        heading: current.heading || null,
        subheading: current.subheading || null,
        description: current.description || null,
        items: current.items,
        cta_text: current.cta_text || null,
        cta_link: current.cta_link || null,
        is_visible: newVisible,
        display_order: current.display_order,
        animation_style: current.animation_style,
        theme: current.theme,
      })
      setSections(prev => ({ ...prev, [key]: { ...current, is_visible: newVisible } }))
      showToast(`Section ${newVisible ? 'shown' : 'hidden'}`)
    } catch {
      showToast('Failed to toggle visibility', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  /* ====== Editing Form ====== */
  if (editingKey && form) {
    const def = SECTION_DEFS.find(d => d.key === editingKey)!
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {def.icon} Edit: {def.label}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{def.description}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setEditingKey(null); setForm(null) }}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Common fields */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-blue-500" />
              Section Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={e => setForm(prev => prev ? { ...prev, heading: e.target.value } : prev)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                  placeholder="Section heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={e => setForm(prev => prev ? { ...prev, display_order: parseInt(e.target.value) || 0 } : prev)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subheading</label>
              <input
                type="text"
                value={form.subheading}
                onChange={e => setForm(prev => prev ? { ...prev, subheading: e.target.value } : prev)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                placeholder="Optional subheading..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => prev ? { ...prev, description: e.target.value } : prev)}
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-900"
                placeholder="Optional description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Animation Style</label>
                <select
                  value={form.animation_style}
                  onChange={e => setForm(prev => prev ? { ...prev, animation_style: e.target.value } : prev)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                >
                  {ANIMATION_STYLES.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Theme</label>
                <select
                  value={form.theme}
                  onChange={e => setForm(prev => prev ? { ...prev, theme: e.target.value } : prev)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                >
                  {THEMES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer py-3">
                  <input
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={e => setForm(prev => prev ? { ...prev, is_visible: e.target.checked } : prev)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Visible on homepage</span>
                </label>
              </div>
            </div>

            {/* CTA fields for sections that need them */}
            {(editingKey === 'pricing' || editingKey === 'contact_cta') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA Button Text</label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={e => setForm(prev => prev ? { ...prev, cta_text: e.target.value } : prev)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                    placeholder="Button text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA Button Link</label>
                  <input
                    type="text"
                    value={form.cta_link}
                    onChange={e => setForm(prev => prev ? { ...prev, cta_link: e.target.value } : prev)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                    placeholder="/contact"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Item-specific editors */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-5">
              <span className="w-1 h-5 rounded-full bg-emerald-500" />
              Content Items
            </h2>
            {def.itemType === 'categories' && (
              <CategoriesEditor
                items={(form.items as CategoryItem[]) || []}
                onChange={items => setForm(prev => prev ? { ...prev, items } : prev)}
              />
            )}
            {def.itemType === 'tags' && (
              <TagsEditor
                items={(form.items as string[]) || []}
                onChange={items => setForm(prev => prev ? { ...prev, items } : prev)}
              />
            )}
            {def.itemType === 'products' && (
              <ProductsEditor
                items={(form.items as ProductItem[]) || []}
                onChange={items => setForm(prev => prev ? { ...prev, items } : prev)}
              />
            )}
            {def.itemType === 'pricing' && (
              <PricingEditor
                items={(form.items as PricingItem[]) || []}
                onChange={items => setForm(prev => prev ? { ...prev, items } : prev)}
              />
            )}
            {def.itemType === 'portfolio' && (
              <PortfolioEditor
                items={(form.items as unknown as PortfolioItems) || { categories: [], projectDetails: [] }}
                onChange={items => setForm(prev => prev ? { ...prev, items: items as unknown as unknown[] } : prev)}
              />
            )}
            {def.itemType === 'insights' && (
              <InsightsEditor
                items={(form.items as unknown as InsightsItems) || { subheading: '', topics: [] }}
                onChange={items => setForm(prev => prev ? { ...prev, items: items as unknown as unknown[] } : prev)}
              />
            )}
            {def.itemType === 'contact' && (
              <ContactEditor
                items={(form.items as unknown as ContactItems) || { email: '', phone: '', address: '', primaryCtaLabel: '', secondaryCtaLabel: '' }}
                onChange={items => setForm(prev => prev ? { ...prev, items: items as unknown as unknown[] } : prev)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ====== List View ====== */
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">✨ Homepage Sections</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage animated sections displayed below the featured products area
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {SECTION_DEFS.map((def, i) => {
          const sec = sections[def.key]
          const isVisible = sec?.is_visible ?? true
          return (
            <div
              key={def.key}
              className={`bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-all ${
                !isVisible ? 'opacity-60' : ''
              }`}
            >
              <div className="text-2xl w-10 text-center shrink-0">{def.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{def.label}</h3>
                  {sec && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                      Configured
                    </span>
                  )}
                  {!isVisible && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{def.description}</p>
                {sec && (
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>Animation: {sec.animation_style}</span>
                    <span>•</span>
                    <span>Theme: {sec.theme}</span>
                    <span>•</span>
                    <span>Order: {sec.display_order}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisibility(def.key)}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    isVisible
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                  title={isVisible ? 'Hide section' : 'Show section'}
                >
                  {isVisible ? '👁️' : '🚫'}
                </button>
                <button
                  onClick={() => startEditing(def.key)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all"
                >
                  Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ====== Sub-Editors ====== */

/* --- Categories Editor (service_areas, solutions) --- */
function CategoriesEditor({ items, onChange }: { items: CategoryItem[]; onChange: (items: CategoryItem[]) => void }) {
  const addCategory = () => onChange([...items, { title: '', items: [], icon: '' }])
  const removeCategory = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: string, value: unknown) =>
    onChange(items.map((cat, idx) => idx === i ? { ...cat, [field]: value } : cat))

  return (
    <div className="space-y-4">
      {items.map((cat, i) => (
        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">Category {i + 1}</span>
            <button onClick={() => removeCategory(i)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div className="md:col-span-3">
              <input
                type="text"
                value={cat.title}
                onChange={e => update(i, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                placeholder="Category title"
              />
            </div>
            <div>
              <input
                type="text"
                value={cat.icon || ''}
                onChange={e => update(i, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                placeholder="Icon emoji"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Items (one per line)</label>
            <textarea
              value={cat.items.join('\n')}
              onChange={e => update(i, 'items', e.target.value.split('\n').filter(Boolean))}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900"
              placeholder="Item 1&#10;Item 2&#10;Item 3"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addCategory}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-medium"
      >
        + Add Category
      </button>
    </div>
  )
}

/* --- Tags Editor (industries) --- */
function TagsEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">Tags (one per line)</label>
      <textarea
        value={items.join('\n')}
        onChange={e => onChange(e.target.value.split('\n').filter(Boolean))}
        rows={8}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900 text-sm"
        placeholder="Information Technology (IT)&#10;Education and EdTech&#10;Healthcare&#10;..."
      />
      <p className="text-xs text-slate-400 mt-1.5">{items.length} tags</p>
    </div>
  )
}

/* --- Products Editor --- */
function ProductsEditor({ items, onChange }: { items: ProductItem[]; onChange: (items: ProductItem[]) => void }) {
  const add = () => onChange([...items, { name: '', description: '', icon: '' }])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: string, value: string) =>
    onChange(items.map((p, idx) => idx === i ? { ...p, [field]: value } : p))

  return (
    <div className="space-y-4">
      {items.map((product, i) => (
        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">Product {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={product.name}
                onChange={e => update(i, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                placeholder="Product name"
              />
            </div>
            <div>
              <input
                type="text"
                value={product.icon || ''}
                onChange={e => update(i, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                placeholder="Icon"
              />
            </div>
          </div>
          <div className="mt-3">
            <textarea
              value={product.description}
              onChange={e => update(i, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900"
              placeholder="Product description..."
            />
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-medium"
      >
        + Add Product
      </button>
    </div>
  )
}

/* --- Pricing Editor --- */
function PricingEditor({ items, onChange }: { items: PricingItem[]; onChange: (items: PricingItem[]) => void }) {
  const add = () => onChange([...items, { name: '', description: '' }])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: string, value: string) =>
    onChange(items.map((p, idx) => idx === i ? { ...p, [field]: value } : p))

  return (
    <div className="space-y-4">
      {items.map((model, i) => (
        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">
              Model {i + 1} {i === 1 && <span className="text-blue-500">(Featured)</span>}
            </span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={model.name}
              onChange={e => update(i, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
              placeholder="Model name"
            />
            <textarea
              value={model.description}
              onChange={e => update(i, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900"
              placeholder="Description..."
            />
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-medium"
      >
        + Add Pricing Model
      </button>
    </div>
  )
}

/* --- Portfolio Editor --- */
function PortfolioEditor({ items, onChange }: { items: PortfolioItems; onChange: (items: PortfolioItems) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Categories (one per line)</label>
        <textarea
          value={(items.categories || []).join('\n')}
          onChange={e => onChange({ ...items, categories: e.target.value.split('\n').filter(Boolean) })}
          rows={5}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900 text-sm"
          placeholder="Mobile Apps&#10;Web Applications&#10;..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Project Details/Highlights (one per line)</label>
        <textarea
          value={(items.projectDetails || []).join('\n')}
          onChange={e => onChange({ ...items, projectDetails: e.target.value.split('\n').filter(Boolean) })}
          rows={5}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900 text-sm"
          placeholder="Overview&#10;Technologies Used&#10;..."
        />
      </div>
    </div>
  )
}

/* --- Insights Editor --- */
function InsightsEditor({ items, onChange }: { items: InsightsItems; onChange: (items: InsightsItems) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Blog Section Subheading</label>
        <input
          type="text"
          value={items.subheading || ''}
          onChange={e => onChange({ ...items, subheading: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
          placeholder="Latest insights, trends, and guides."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Blog Topics (one per line)</label>
        <textarea
          value={(items.topics || []).join('\n')}
          onChange={e => onChange({ ...items, topics: e.target.value.split('\n').filter(Boolean) })}
          rows={6}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900 text-sm"
          placeholder="Emerging Cyber Threats&#10;AI Transforming Businesses&#10;..."
        />
      </div>
    </div>
  )
}

/* --- Contact Editor --- */
function ContactEditor({ items, onChange }: { items: ContactItems; onChange: (items: ContactItems) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
          <input
            type="email"
            value={items.email || ''}
            onChange={e => onChange({ ...items, email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
          <input
            type="text"
            value={items.phone || ''}
            onChange={e => onChange({ ...items, phone: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
            placeholder="+92 300 1234567"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Address</label>
        <input
          type="text"
          value={items.address || ''}
          onChange={e => onChange({ ...items, address: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
          placeholder="123 Street, City"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Primary CTA Label</label>
          <input
            type="text"
            value={items.primaryCtaLabel || ''}
            onChange={e => onChange({ ...items, primaryCtaLabel: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
            placeholder="Reach Out to Us"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Secondary CTA Label</label>
          <input
            type="text"
            value={items.secondaryCtaLabel || ''}
            onChange={e => onChange({ ...items, secondaryCtaLabel: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 text-sm"
            placeholder="Book a Consultation"
          />
        </div>
      </div>
    </div>
  )
}
