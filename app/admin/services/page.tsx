'use client'

import { useEffect, useState } from 'react'
import { servicesAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

interface ServiceRow {
  id?: string | number
  title: string
  slug: string
  description: string
  icon: string
  order: number
  link: string
  image_url: string
}

const emptyService: ServiceRow = { title: '', slug: '', description: '', icon: '', order: 0, link: '', image_url: '' }

export default function ServicesPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    servicesAdmin.getAll()
      .then(data => setItems(data || []))
      .catch(() => showToast('Failed to load services', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const payload = { ...editing }
      delete payload.id
      if (editing.id) {
        await servicesAdmin.update(editing.id, payload)
        showToast('Service updated!')
      } else {
        await servicesAdmin.create(payload)
        showToast('Service created!')
      }
      setEditing(null)
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this service?')) return
    try {
      await servicesAdmin.delete(id)
      showToast('Service deleted!')
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  // Editing/Creating Form
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{editing.id ? 'Edit Service' : 'New Service'}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input type="text" value={editing.title} onChange={e => { const title = e.target.value; setEditing(prev => prev ? {...prev, title, slug: prev.slug || generateSlug(title)} : prev) }} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
              <input type="text" value={editing.slug} onChange={e => setEditing(prev => prev ? {...prev, slug: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={editing.description} onChange={e => setEditing(prev => prev ? {...prev, description: e.target.value} : prev)} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon (emoji or class)</label>
              <input type="text" value={editing.icon} onChange={e => setEditing(prev => prev ? {...prev, icon: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="⚙️" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
              <input type="number" value={editing.order} onChange={e => setEditing(prev => prev ? {...prev, order: parseInt(e.target.value) || 0} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Link</label>
              <input type="text" value={editing.link} onChange={e => setEditing(prev => prev ? {...prev, link: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="/services/slug" />
            </div>
          </div>
          <div>
            <MediaPicker
              label="Image"
              value={editing.image_url}
              onChange={url => setEditing(prev => prev ? {...prev, image_url: url} : prev)}
              accept="image"
              folder="services"
            />
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">⚙️ Services</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} services</p>
        </div>
        <button onClick={() => setEditing({...emptyService, order: items.length + 1})} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
          + Add Service
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">No services yet. Click &quot;Add Service&quot; to create one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Slug</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-500">{item.icon || '—'}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.title}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 font-mono">{item.slug}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{item.order}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => setEditing({...item})} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    <button onClick={() => item.id && handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
