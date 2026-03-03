'use client'

import { useEffect, useState } from 'react'
import { ctaAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'

export default function CtaEditorPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
  })

  useEffect(() => {
    ctaAdmin.get().then((data) => {
      if (data) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          button_text: data.button_text || '',
          button_link: data.button_link || '',
          secondary_button_text: data.secondary_button_text || '',
          secondary_button_link: data.secondary_button_link || '',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await ctaAdmin.save(form)
      showToast('CTA section saved!')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🔔 CTA Section</h1>
          <p className="text-slate-500 text-sm mt-1">Edit the Call to Action section</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={e => setForm(prev => ({...prev, title: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="Ready to get started?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => setForm(prev => ({...prev, description: e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-900" placeholder="Compelling description..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Button Text</label>
            <input type="text" value={form.button_text} onChange={e => setForm(prev => ({...prev, button_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Get Started" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Button Link</label>
            <input type="text" value={form.button_link} onChange={e => setForm(prev => ({...prev, button_link: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="/contact" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Button Text</label>
            <input type="text" value={form.secondary_button_text} onChange={e => setForm(prev => ({...prev, secondary_button_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Learn More" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Button Link</label>
            <input type="text" value={form.secondary_button_link} onChange={e => setForm(prev => ({...prev, secondary_button_link: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="/services" />
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-center">
          <h3 className="text-xl font-bold text-white">{form.title || 'CTA Title'}</h3>
          <p className="text-blue-100 text-sm mt-2 max-w-md mx-auto">{form.description || 'CTA description goes here'}</p>
          <div className="mt-4 flex justify-center gap-3">
            {form.button_text && <span className="px-5 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">{form.button_text}</span>}
            {form.secondary_button_text && <span className="px-5 py-2 border border-white/30 text-white rounded-lg text-sm font-medium">{form.secondary_button_text}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
