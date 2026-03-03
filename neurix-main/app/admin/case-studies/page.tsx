'use client'

import { useEffect, useState } from 'react'
import { caseStudiesAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

interface CaseStudyRow {
  id?: string | number
  title: string
  slug: string
  description: string
  bullet_points: string[]
  is_active: boolean
  order: number
  background_image_url: string
  metrics: { label: string; value: string }[]
}

const empty: CaseStudyRow = {
  title: '', slug: '', description: '', bullet_points: [], is_active: true,
  order: 0, background_image_url: '', metrics: []
}

export default function CaseStudiesPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<CaseStudyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CaseStudyRow | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    caseStudiesAdmin.getAll()
      .then(data => setItems(data || []))
      .catch(() => showToast('Failed to load', 'error'))
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
        await caseStudiesAdmin.update(editing.id, payload)
        showToast('Case study updated!')
      } else {
        await caseStudiesAdmin.create(payload)
        showToast('Case study created!')
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
    if (!confirm('Delete this case study?')) return
    try {
      await caseStudiesAdmin.delete(id)
      showToast('Deleted!')
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{editing.id ? 'Edit Case Study' : 'New Case Study'}</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
              <input type="number" value={editing.order} onChange={e => setEditing(prev => prev ? {...prev, order: parseInt(e.target.value) || 0} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 py-3 cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing(prev => prev ? {...prev, is_active: e.target.checked} : prev)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
          </div>
          <div>
            <MediaPicker
              label="Background Image"
              value={editing.background_image_url}
              onChange={url => setEditing(prev => prev ? {...prev, background_image_url: url} : prev)}
              accept="image"
              folder="case-studies"
            />
          </div>

          {/* Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Bullet Points</label>
              <button onClick={() => setEditing(prev => prev ? {...prev, bullet_points: [...prev.bullet_points, '']} : prev)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add</button>
            </div>
            {editing.bullet_points.map((bp, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={bp} onChange={e => { const bps = [...editing.bullet_points]; bps[i] = e.target.value; setEditing(prev => prev ? {...prev, bullet_points: bps} : prev) }} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
                <button onClick={() => setEditing(prev => prev ? {...prev, bullet_points: prev.bullet_points.filter((_, idx) => idx !== i)} : prev)} className="text-red-400 hover:text-red-600 px-2">✕</button>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Metrics</label>
              <button onClick={() => setEditing(prev => prev ? {...prev, metrics: [...prev.metrics, { label: '', value: '' }]} : prev)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add</button>
            </div>
            {editing.metrics.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={m.label} placeholder="Label" onChange={e => { const ms = [...editing.metrics]; ms[i] = {...ms[i], label: e.target.value}; setEditing(prev => prev ? {...prev, metrics: ms} : prev) }} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
                <input type="text" value={m.value} placeholder="Value" onChange={e => { const ms = [...editing.metrics]; ms[i] = {...ms[i], value: e.target.value}; setEditing(prev => prev ? {...prev, metrics: ms} : prev) }} className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
                <button onClick={() => setEditing(prev => prev ? {...prev, metrics: prev.metrics.filter((_, idx) => idx !== i)} : prev)} className="text-red-400 hover:text-red-600 px-2">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📁 Case Studies</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} case studies</p>
        </div>
        <button onClick={() => setEditing({...empty, order: items.length + 1})} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
          + Add Case Study
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">No case studies yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Slug</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.title}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 font-mono">{item.slug}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
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
