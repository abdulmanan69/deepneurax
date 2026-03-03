'use client'

import { useEffect, useState } from 'react'
import { sphereShowcaseAdmin, sphereShowcaseItemsAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

interface SectionSettings {
  id?: string
  section_title: string
  section_description: string
  intro_heading: string
  intro_subheading: string
  content_heading: string
  content_description: string
}

interface ShowcaseItem {
  id?: string | number
  title: string
  description: string
  image_url: string
  link: string
  order: number
}

const emptyItem: ShowcaseItem = { title: '', description: '', image_url: '', link: '#', order: 0 }

const defaultSection: SectionSettings = {
  section_title: 'Explore Our Capabilities',
  section_description: 'We deliver exceptional results through innovation, expertise, and dedication',
  intro_heading: 'The future is built on AI.',
  intro_subheading: 'SCROLL TO EXPLORE',
  content_heading: 'Explore Our Vision',
  content_description: 'Discover a world where technology meets creativity.',
}

export default function SphereShowcasePage() {
  const { showToast } = useToast()
  const [section, setSection] = useState<SectionSettings>(defaultSection)
  const [items, setItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState(false)
  const [editing, setEditing] = useState<ShowcaseItem | null>(null)
  const [savingItem, setSavingItem] = useState(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'items'>('settings')

  const loadData = async () => {
    setLoading(true)
    try {
      const [sectionData, itemsData] = await Promise.all([
        sphereShowcaseAdmin.get(),
        sphereShowcaseItemsAdmin.getAll(),
      ])
      if (sectionData) {
        setSection({
          id: sectionData.id,
          section_title: sectionData.section_title || defaultSection.section_title,
          section_description: sectionData.section_description || defaultSection.section_description,
          intro_heading: sectionData.intro_heading || defaultSection.intro_heading,
          intro_subheading: sectionData.intro_subheading || defaultSection.intro_subheading,
          content_heading: sectionData.content_heading || defaultSection.content_heading,
          content_description: sectionData.content_description || defaultSection.content_description,
        })
      }
      setItems(itemsData || [])
    } catch {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSaveSection = async () => {
    setSavingSection(true)
    try {
      const payload: Record<string, unknown> = {
        section_title: section.section_title,
        section_description: section.section_description,
        intro_heading: section.intro_heading,
        intro_subheading: section.intro_subheading,
        content_heading: section.content_heading,
        content_description: section.content_description,
      }
      await sphereShowcaseAdmin.save(payload)
      showToast('Section settings saved!')
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSavingSection(false)
    }
  }

  const handleSaveItem = async () => {
    if (!editing) return
    setSavingItem(true)
    try {
      const payload: Record<string, unknown> = {
        title: editing.title,
        description: editing.description,
        image_url: editing.image_url,
        link: editing.link,
        order: editing.order,
      }
      if (editing.id) {
        await sphereShowcaseItemsAdmin.update(editing.id, payload)
        showToast('Item updated!')
      } else {
        await sphereShowcaseItemsAdmin.create(payload)
        showToast('Item created!')
      }
      setEditing(null)
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSavingItem(false)
    }
  }

  const handleDeleteItem = async (id: string | number) => {
    if (!confirm('Delete this image?')) return
    try {
      await sphereShowcaseItemsAdmin.delete(id)
      showToast('Item deleted!')
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // --- Item Edit Form ---
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {editing.id ? 'Edit Showcase Image' : 'New Showcase Image'}
          </h1>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button onClick={handleSaveItem} disabled={savingItem} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
              {savingItem ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input type="text" value={editing.title} onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="e.g. Deep Learning" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
              <input type="number" value={editing.order} onChange={e => setEditing(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={editing.description} onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : prev)} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900" placeholder="Short description..." />
          </div>
          <div>
            <MediaPicker
              label="Image"
              value={editing.image_url}
              onChange={url => setEditing(prev => prev ? { ...prev, image_url: url } : prev)}
              accept="image"
              folder="sphere"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Link</label>
            <input type="text" value={editing.link} onChange={e => setEditing(prev => prev ? { ...prev, link: e.target.value } : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="#" />
          </div>
        </div>
      </div>
    )
  }

  // --- Main Page with Tabs ---
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🌐 Sphere Showcase</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the intro animation section on the homepage</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ⚙️ Section Settings
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'items' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🖼️ Images ({items.length})
        </button>
      </div>

      {/* Section Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Section Title</label>
              <input type="text" value={section.section_title} onChange={e => setSection(prev => ({ ...prev, section_title: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Section Description</label>
              <input type="text" value={section.section_description} onChange={e => setSection(prev => ({ ...prev, section_description: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">🎬 Intro Animation Text</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Intro Heading</label>
                <input type="text" value={section.intro_heading} onChange={e => setSection(prev => ({ ...prev, intro_heading: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="The future is built on AI." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Intro Subheading</label>
                <input type="text" value={section.intro_subheading} onChange={e => setSection(prev => ({ ...prev, intro_subheading: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="SCROLL TO EXPLORE" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">📝 Content (after scroll)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Heading</label>
                <input type="text" value={section.content_heading} onChange={e => setSection(prev => ({ ...prev, content_heading: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Explore Our Vision" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Description</label>
                <input type="text" value={section.content_description} onChange={e => setSection(prev => ({ ...prev, content_description: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Discover a world where technology meets creativity." />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSaveSection} disabled={savingSection} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
              {savingSection ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setEditing({ ...emptyItem, order: items.length + 1 })} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
              + Add Image
            </button>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-4xl mb-3">🖼️</p>
              <p className="text-slate-400">No images yet. Add images that will appear in the showcase animation.</p>
              <p className="text-slate-300 text-sm mt-2">For best results, add 10-20 images</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {item.image_url ? (
                    <div className="h-40 bg-slate-100">
                      <img src={item.image_url} alt={item.title || 'Showcase image'} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 bg-slate-100 flex items-center justify-center">
                      <span className="text-3xl">🖼️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 truncate">{item.title || 'Untitled'}</h3>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">#{item.order}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => setEditing({ ...item })} className="flex-1 text-sm px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                        Edit
                      </button>
                      <button onClick={() => item.id && handleDeleteItem(item.id)} className="text-sm px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Add 10-20 images with URLs for the best visual effect. Images will animate in a scatter → circle → arc pattern on the homepage.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
