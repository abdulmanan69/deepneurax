'use client'

import { useEffect, useState } from 'react'
import { footerAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'

interface SocialLink { platform: string; url: string }
interface MenuItem { label: string; href: string }

export default function FooterEditorPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    site_name: '',
    tagline: '',
    company_description: '',
    site_logo_url: '',
    site_logo_light_url: '',
    copyright_text: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    social_links: [] as SocialLink[],
    menu_items: [] as MenuItem[],
    cta: { label: '', href: '' },
  })

  useEffect(() => {
    footerAdmin.get().then((data) => {
      if (data) {
        setForm({
          site_name: data.site_name || '',
          tagline: data.tagline || '',
          company_description: data.company_description || '',
          site_logo_url: data.site_logo_url || '',
          site_logo_light_url: data.site_logo_light_url || '',
          copyright_text: data.copyright_text || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
          social_links: data.social_links || [],
          menu_items: data.menu_items || [],
          cta: data.cta || { label: '', href: '' },
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await footerAdmin.save(form)
      showToast('Footer saved!')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const addSocialLink = () => setForm(prev => ({...prev, social_links: [...prev.social_links, { platform: '', url: '' }]}))
  const removeSocialLink = (i: number) => setForm(prev => ({...prev, social_links: prev.social_links.filter((_, idx) => idx !== i)}))
  const updateSocialLink = (i: number, field: string, value: string) => {
    setForm(prev => ({...prev, social_links: prev.social_links.map((s, idx) => idx === i ? {...s, [field]: value} : s)}))
  }

  const addMenuItem = () => setForm(prev => ({...prev, menu_items: [...prev.menu_items, { label: '', href: '' }]}))
  const removeMenuItem = (i: number) => setForm(prev => ({...prev, menu_items: prev.menu_items.filter((_, idx) => idx !== i)}))
  const updateMenuItem = (i: number, field: string, value: string) => {
    setForm(prev => ({...prev, menu_items: prev.menu_items.map((m, idx) => idx === i ? {...m, [field]: value} : m)}))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🦶 Footer</h1>
          <p className="text-slate-500 text-sm mt-1">Edit footer content, links, and contact info</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Site Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
              <input type="text" value={form.site_name} onChange={e => setForm(prev => ({...prev, site_name: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
              <input type="text" value={form.tagline} onChange={e => setForm(prev => ({...prev, tagline: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Description</label>
            <textarea value={form.company_description} onChange={e => setForm(prev => ({...prev, company_description: e.target.value}))} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Copyright Text</label>
            <input type="text" value={form.copyright_text} onChange={e => setForm(prev => ({...prev, copyright_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="© 2025 Company. All rights reserved." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo URL (dark)</label>
              <input type="url" value={form.site_logo_url} onChange={e => setForm(prev => ({...prev, site_logo_url: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
              {form.site_logo_url && <img src={form.site_logo_url} alt="Logo" className="mt-2 h-10 object-contain bg-slate-100 rounded-lg px-3 py-1" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo URL (light)</label>
              <input type="url" value={form.site_logo_light_url} onChange={e => setForm(prev => ({...prev, site_logo_light_url: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
              {form.site_logo_light_url && <img src={form.site_logo_light_url} alt="Logo Light" className="mt-2 h-10 object-contain bg-slate-800 rounded-lg px-3 py-1" />}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(prev => ({...prev, contact_email: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input type="text" value={form.contact_phone} onChange={e => setForm(prev => ({...prev, contact_phone: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input type="text" value={form.address} onChange={e => setForm(prev => ({...prev, address: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Footer CTA Button</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Label</label>
              <input type="text" value={form.cta?.label || ''} onChange={e => setForm(prev => ({...prev, cta: {...prev.cta, label: e.target.value}}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Contact Us" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Link</label>
              <input type="text" value={form.cta?.href || ''} onChange={e => setForm(prev => ({...prev, cta: {...prev.cta, href: e.target.value}}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="/contact" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Social Links</h2>
            <button onClick={addSocialLink} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Link</button>
          </div>
          {form.social_links.length === 0 && <p className="text-sm text-slate-400 italic">No social links added</p>}
          {form.social_links.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={link.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="twitter" />
              <input type="url" value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="https://twitter.com/..." />
              <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Menu Items</h2>
            <button onClick={addMenuItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Item</button>
          </div>
          {form.menu_items.length === 0 && <p className="text-sm text-slate-400 italic">No menu items added</p>}
          {form.menu_items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={item.label} onChange={e => updateMenuItem(i, 'label', e.target.value)} className="w-40 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Services" />
              <input type="text" value={item.href} onChange={e => updateMenuItem(i, 'href', e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="/services" />
              <button onClick={() => removeMenuItem(i)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
