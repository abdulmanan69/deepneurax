'use client'

import { useEffect, useState } from 'react'
import { contactSubmissionsAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'

interface Submission {
  id: string | number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ContactSubmissionsPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)

  const loadData = () => {
    setLoading(true)
    contactSubmissionsAdmin.getAll()
      .then(data => setItems((data || []) as Submission[]))
      .catch(() => showToast('Failed to load submissions', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const markRead = async (item: Submission) => {
    try {
      await contactSubmissionsAdmin.update(item.id, { is_read: true })
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_read: true } : i))
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this submission?')) return
    try {
      await contactSubmissionsAdmin.delete(id)
      showToast('Deleted!')
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  const unreadCount = items.filter(i => !i.is_read).length

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📬 Contact Submissions</h1>
          <p className="text-slate-500 text-sm mt-1">
            {items.length} total{unreadCount > 0 && <span className="text-blue-600 font-medium"> · {unreadCount} unread</span>}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">📬</p>
          <p className="text-slate-400">No contact submissions yet. They will appear here when someone fills out the contact form.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => { setSelected(item); if (!item.is_read) markRead(item) }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === item.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {!item.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <p className={`text-sm truncate ${!item.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {item.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.subject || 'No subject'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selected.subject || 'No Subject'}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      From <span className="font-medium text-slate-700">{selected.name}</span> · {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(selected.id)} className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium">
                    Delete
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 w-12">Name</span>
                    <span className="text-sm text-slate-900">{selected.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 w-12">Email</span>
                    <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:text-blue-700 underline">{selected.email}</a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Message</h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 text-sm"
                  >
                    ✉️ Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-4xl mb-3">👈</p>
                <p className="text-slate-400">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
