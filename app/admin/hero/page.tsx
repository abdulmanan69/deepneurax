'use client'

import { useEffect, useState } from 'react'
import { heroAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import MediaPicker from '@/components/admin/MediaPicker'

interface VideoItem {
  videoUrl: string
  thumbnail: string
  duration: number
}

export default function HeroEditorPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_text: '',
    cta_link: '',
    secondary_cta_text: '',
    secondary_cta_link: '',
    background_image_url: '',
    taglines: [] as { tagline: string; description: string }[],
    background_videos: [] as VideoItem[],
  })

  useEffect(() => {
    heroAdmin.get().then((data) => {
      if (data) {
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          cta_text: data.cta_text || '',
          cta_link: data.cta_link || '',
          secondary_cta_text: data.secondary_cta_text || '',
          secondary_cta_link: data.secondary_cta_link || '',
          background_image_url: data.background_image_url || '',
          taglines: data.taglines || [],
          background_videos: (data.background_videos || []).map((v: VideoItem) => ({
            videoUrl: v.videoUrl || '',
            thumbnail: v.thumbnail || '',
            duration: v.duration || 10,
          })),
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await heroAdmin.save(form)
      showToast('Hero section saved successfully!')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Tagline helpers
  const addTagline = () => {
    setForm(prev => ({
      ...prev,
      taglines: [...prev.taglines, { tagline: '', description: '' }]
    }))
  }

  const removeTagline = (index: number) => {
    setForm(prev => ({
      ...prev,
      taglines: prev.taglines.filter((_, i) => i !== index)
    }))
  }

  const updateTagline = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      taglines: prev.taglines.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }))
  }

  // Video helpers
  const addVideo = () => {
    setForm(prev => ({
      ...prev,
      background_videos: [...prev.background_videos, { videoUrl: '', thumbnail: '', duration: 10 }]
    }))
  }

  const removeVideo = (index: number) => {
    setForm(prev => ({
      ...prev,
      background_videos: prev.background_videos.filter((_, i) => i !== index)
    }))
  }

  const updateVideo = (index: number, field: keyof VideoItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      background_videos: prev.background_videos.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🎯 Hero Section</h1>
          <p className="text-slate-500 text-sm mt-1">Edit the main banner on your homepage</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={e => setForm(prev => ({...prev, title: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="Main headline..." />
        </div>

        {/* Subtitle / Tagline */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle / Tagline</label>
          <input type="text" value={form.subtitle} onChange={e => setForm(prev => ({...prev, subtitle: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="Short tagline..." />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => setForm(prev => ({...prev, description: e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-900" placeholder="Hero description..." />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Button Text</label>
            <input type="text" value={form.cta_text} onChange={e => setForm(prev => ({...prev, cta_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="Get Started" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Button Link</label>
            <input type="text" value={form.cta_link} onChange={e => setForm(prev => ({...prev, cta_link: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="/contact" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Button Text</label>
            <input type="text" value={form.secondary_cta_text} onChange={e => setForm(prev => ({...prev, secondary_cta_text: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="Watch Demo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Button Link</label>
            <input type="text" value={form.secondary_cta_link} onChange={e => setForm(prev => ({...prev, secondary_cta_link: e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900" placeholder="#demo" />
          </div>
        </div>

        {/* Background Image */}
        <div>
          <MediaPicker
            label="Background Image"
            value={form.background_image_url}
            onChange={url => setForm(prev => ({...prev, background_image_url: url}))}
            accept="image"
            folder="hero"
          />
        </div>

        {/* Background Videos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">🎬 Background Videos</label>
              <p className="text-xs text-slate-400 mt-0.5">Add MP4 video URLs. Videos rotate automatically based on duration. If videos are added, they take priority over the background image.</p>
            </div>
            <button onClick={addVideo} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              <span>+</span> Add Video
            </button>
          </div>
          {form.background_videos.length === 0 && (
            <p className="text-sm text-slate-400 italic">No videos added yet — background image will be used instead</p>
          )}
          <div className="space-y-4">
            {form.background_videos.map((v, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Video {i + 1}</span>
                  <button onClick={() => removeVideo(i)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <MediaPicker
                      label="Video URL (MP4)"
                      value={v.videoUrl}
                      onChange={url => updateVideo(i, 'videoUrl', url)}
                      accept="video"
                      previewType="video"
                      folder="videos"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <MediaPicker
                        label="Thumbnail (optional)"
                        value={v.thumbnail}
                        onChange={url => updateVideo(i, 'thumbnail', url)}
                        accept="image"
                        folder="hero"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Duration (seconds)</label>
                      <input
                        type="number"
                        min={1}
                        max={300}
                        value={v.duration}
                        onChange={e => updateVideo(i, 'duration', parseInt(e.target.value) || 10)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  {v.videoUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-w-sm">
                      <video src={v.videoUrl} className="w-full h-28 object-cover" muted playsInline controls />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taglines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700">Rotating Taglines</label>
            <button onClick={addTagline} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Tagline</button>
          </div>
          {form.taglines.length === 0 && (
            <p className="text-sm text-slate-400 italic">No taglines added yet</p>
          )}
          <div className="space-y-3">
            {form.taglines.map((t, i) => (
              <div key={i} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl">
                <div className="flex-1 space-y-2">
                  <input type="text" value={t.tagline} onChange={e => updateTagline(i, 'tagline', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Tagline text" />
                  <input type="text" value={t.description} onChange={e => updateTagline(i, 'description', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900" placeholder="Tagline description" />
                </div>
                <button onClick={() => removeTagline(i)} className="text-red-400 hover:text-red-600 p-1 mt-1">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
