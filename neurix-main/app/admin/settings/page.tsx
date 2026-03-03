'use client'

import { useEffect, useState } from 'react'
import { footerAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

export default function SettingsPage() {
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
    social_links: [] as { platform: string; url: string }[],
    menu_items: [] as { label: string; href: string }[],
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
      showToast('Settings saved!')
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
          <h1 className="text-2xl font-bold text-slate-900">⚙️ Global Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Site identity, logos, contact info, navigation & social links</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Site Identity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">🏢 Site Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
              <input type="text" value={form.site_name} onChange={e => setForm(prev => ({...prev, site_name: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="My Website" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
              <input type="text" value={form.tagline} onChange={e => setForm(prev => ({...prev, tagline: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Your catchy tagline" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Description</label>
            <textarea value={form.company_description} onChange={e => setForm(prev => ({...prev, company_description: e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900" placeholder="Brief description of your company..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Copyright Text</label>
            <input type="text" value={form.copyright_text} onChange={e => setForm(prev => ({...prev, copyright_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="© 2026 Company. All rights reserved." />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">🖼️ Logo</h2>
          <p className="text-sm text-slate-500">Upload your logo files or paste URLs. The dark logo shows on light backgrounds, the light logo shows on dark backgrounds.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaPicker
              label="Dark Logo (for light backgrounds)"
              value={form.site_logo_url}
              onChange={(url) => setForm(prev => ({ ...prev, site_logo_url: url }))}
              accept="image"
              folder="logos"
              placeholder="https://example.com/dark-logo.png"
            />
            <MediaPicker
              label="Light Logo (for dark backgrounds)"
              value={form.site_logo_light_url}
              onChange={(url) => setForm(prev => ({ ...prev, site_logo_light_url: url }))}
              accept="image"
              folder="logos"
              placeholder="https://example.com/light-logo.png"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">📞 Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(prev => ({...prev, contact_email: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="contact@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input type="text" value={form.contact_phone} onChange={e => setForm(prev => ({...prev, contact_phone: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input type="text" value={form.address} onChange={e => setForm(prev => ({...prev, address: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="123 Main St, City, Country" />
          </div>
        </div>

        {/* Navigation Header CTA */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">🔗 Header CTA Button</h2>
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

        {/* Navigation Menu Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">📑 Navigation Menu Items</h2>
            <button onClick={addMenuItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Item</button>
          </div>
          <p className="text-sm text-slate-500">These links appear in the site header and footer.</p>
          {form.menu_items.length === 0 && <p className="text-sm text-slate-400 italic">No menu items added. Default navigation will be used.</p>}
          {form.menu_items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
              <input type="text" value={item.label} onChange={e => updateMenuItem(i, 'label', e.target.value)} className="w-40 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Label" />
              <input type="text" value={item.href} onChange={e => updateMenuItem(i, 'href', e.target.value)} className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-mono" placeholder="/path" />
              <button onClick={() => removeMenuItem(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">🌐 Social Links</h2>
            <button onClick={addSocialLink} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Link</button>
          </div>
          {form.social_links.length === 0 && <p className="text-sm text-slate-400 italic">No social links added</p>}
          {form.social_links.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <select value={link.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} className="w-36 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white">
                <option value="">Select...</option>
                <option value="twitter">Twitter / X</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="github">GitHub</option>
                <option value="tiktok">TikTok</option>
                <option value="discord">Discord</option>
              </select>
              <input type="url" value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="https://..." />
              <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
