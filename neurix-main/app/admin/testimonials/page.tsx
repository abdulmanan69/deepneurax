'use client'

import { useEffect, useState } from 'react'
import { testimonialsAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

interface TestimonialRow {
  id?: string | number
  author: string
  handle: string
  role: string
  text: string
  avatar_url: string
  order: number
}

const empty: TestimonialRow = { author: '', handle: '', role: '', text: '', avatar_url: '', order: 0 }

export default function TestimonialsPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<TestimonialRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TestimonialRow | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    testimonialsAdmin.getAll()
      .then(data => setItems(data || []))
      .catch(() => showToast('Failed to load', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const payload = { ...editing }
      delete payload.id
      if (editing.id) {
        await testimonialsAdmin.update(editing.id, payload)
        showToast('Testimonial updated!')
      } else {
        await testimonialsAdmin.create(payload)
        showToast('Testimonial created!')
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
    if (!confirm('Delete this testimonial?')) return
    try {
      await testimonialsAdmin.delete(id)
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
          <h1 className="text-2xl font-bold text-slate-900">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h1>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Author Name</label>
              <input type="text" value={editing.author} onChange={e => setEditing(prev => prev ? {...prev, author: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Handle</label>
              <input type="text" value={editing.handle} onChange={e => setEditing(prev => prev ? {...prev, handle: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="@johndoe" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role / Company</label>
              <input type="text" value={editing.role} onChange={e => setEditing(prev => prev ? {...prev, role: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="CEO at Company" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
              <input type="number" value={editing.order} onChange={e => setEditing(prev => prev ? {...prev, order: parseInt(e.target.value) || 0} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Testimonial Text</label>
            <textarea value={editing.text} onChange={e => setEditing(prev => prev ? {...prev, text: e.target.value} : prev)} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900" placeholder="What they said..." />
          </div>
          <div>
            <MediaPicker
              label="Avatar"
              value={editing.avatar_url}
              onChange={url => setEditing(prev => prev ? {...prev, avatar_url: url} : prev)}
              accept="image"
              previewType="avatar"
              folder="avatars"
            />
          </div>

          {/* Preview Card */}
          <div className="mt-4 p-5 bg-slate-50 rounded-xl">
            <p className="text-xs font-medium text-slate-500 mb-3">Preview:</p>
            <div className="flex items-start gap-3">
              {editing.avatar_url ? (
                <img src={editing.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{editing.author?.[0] || '?'}</div>
              )}
              <div>
                <p className="text-sm text-slate-700 italic">&ldquo;{editing.text || 'Testimonial text...'}&rdquo;</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">{editing.author || 'Author'} · {editing.role || 'Role'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">💬 Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} testimonials</p>
        </div>
        <button onClick={() => setEditing({...empty, order: items.length + 1})} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
          + Add Testimonial
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 group hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">{item.author?.[0]}</div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.author}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-3">&ldquo;{item.text}&rdquo;</p>
              <div className="mt-3 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing({...item})} className="text-blue-600 text-sm font-medium">Edit</button>
                <button onClick={() => item.id && handleDelete(item.id)} className="text-red-500 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
