'use client'

import { useEffect, useState } from 'react'
import { metricsAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'

interface MetricRow {
  id?: string | number
  label: string
  value: number
  suffix: string
  icon: string
  order: number
}

const emptyMetric: MetricRow = { label: '', value: 0, suffix: '', icon: '', order: 0 }

export default function MetricsPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<MetricRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<MetricRow | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    metricsAdmin.getAll()
      .then(data => setItems(data || []))
      .catch(() => showToast('Failed to load metrics', 'error'))
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
        await metricsAdmin.update(editing.id, payload)
        showToast('Metric updated!')
      } else {
        await metricsAdmin.create(payload)
        showToast('Metric created!')
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
    if (!confirm('Delete this metric?')) return
    try {
      await metricsAdmin.delete(id)
      showToast('Metric deleted!')
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
          <h1 className="text-2xl font-bold text-slate-900">{editing.id ? 'Edit Metric' : 'New Metric'}</h1>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
              <input type="text" value={editing.label} onChange={e => setEditing(prev => prev ? {...prev, label: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="e.g. Projects Completed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Value (number)</label>
              <input type="number" value={editing.value} onChange={e => setEditing(prev => prev ? {...prev, value: parseFloat(e.target.value) || 0} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="150" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Suffix</label>
              <input type="text" value={editing.suffix} onChange={e => setEditing(prev => prev ? {...prev, suffix: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="+ or % or K+" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
              <input type="text" value={editing.icon} onChange={e => setEditing(prev => prev ? {...prev, icon: e.target.value} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="📈" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
              <input type="number" value={editing.order} onChange={e => setEditing(prev => prev ? {...prev, order: parseInt(e.target.value) || 0} : prev)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-medium text-slate-500 mb-2">Preview:</p>
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-600">{editing.value}{editing.suffix}</span>
              <p className="text-sm text-slate-500 mt-1">{editing.label}</p>
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
          <h1 className="text-2xl font-bold text-slate-900">📈 Metrics</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} metrics</p>
        </div>
        <button onClick={() => setEditing({...emptyMetric, order: items.length + 1})} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
          + Add Metric
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">No metrics yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 text-center group hover:shadow-lg transition-all">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-3xl font-bold text-blue-600">{item.value}{item.suffix}</div>
              <div className="text-sm text-slate-500 mt-1">{item.label}</div>
              <div className="mt-3 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
