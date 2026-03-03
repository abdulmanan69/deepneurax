'use client'

import { useEffect, useState } from 'react'
import { blogAdmin } from '@/lib/supabase/admin'
import { useToast } from '@/components/admin/Toast'
import RichTextEditor from '@/components/admin/RichTextEditor'
import SEOPanel from '@/components/admin/SEOPanel'
import MediaPicker from '@/components/admin/MediaPicker'

interface BlogRow {
  id?: string | number
  title: string
  slug: string
  excerpt: string
  content: string
  published_at: string
  author: string
  tags: string[]
  cover_image_url: string
  is_published: boolean
  meta_title: string
  meta_description: string
  focus_keyword: string
  og_image_url: string
  canonical_url: string
}

const empty: BlogRow = {
  title: '', slug: '', excerpt: '', content: '',
  published_at: new Date().toISOString().slice(0, 10),
  author: '', tags: [], cover_image_url: '', is_published: true,
  meta_title: '', meta_description: '', focus_keyword: '',
  og_image_url: '', canonical_url: '',
}

export default function BlogPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<BlogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [activeSection, setActiveSection] = useState<'content' | 'seo'>('content')

  const loadData = () => {
    setLoading(true)
    blogAdmin.getAll()
      .then(data => setItems((data || []).map((d: Record<string, unknown>) => ({
        ...d,
        tags: d.tags || [],
        meta_title: d.meta_title || '',
        meta_description: d.meta_description || '',
        focus_keyword: d.focus_keyword || '',
        og_image_url: d.og_image_url || '',
        canonical_url: d.canonical_url || '',
      })) as BlogRow[]))
      .catch(() => showToast('Failed to load', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        title: editing.title,
        slug: editing.slug,
        excerpt: editing.excerpt,
        content: editing.content,
        published_at: editing.published_at,
        author: editing.author,
        tags: editing.tags,
        cover_image_url: editing.cover_image_url,
        is_published: editing.is_published,
        meta_title: editing.meta_title || null,
        meta_description: editing.meta_description || null,
        focus_keyword: editing.focus_keyword || null,
        og_image_url: editing.og_image_url || null,
        canonical_url: editing.canonical_url || null,
      }
      if (editing.id) {
        await blogAdmin.update(editing.id, payload)
        showToast('Blog post updated!')
      } else {
        await blogAdmin.create(payload)
        showToast('Blog post created!')
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
    if (!confirm('Delete this blog post?')) return
    try {
      await blogAdmin.delete(id)
      showToast('Deleted!')
      loadData()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && editing && !editing.tags.includes(tag)) {
      setEditing(prev => prev ? {...prev, tags: [...prev.tags, tag]} : prev)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setEditing(prev => prev ? {...prev, tags: prev.tags.filter(t => t !== tag)} : prev)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  // =================== EDITOR VIEW ===================
  if (editing) {
    return (
      <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="px-3 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-sm">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-slate-900">{editing.id ? 'Edit Post' : 'New Post'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-xl px-3 py-2">
              <input type="checkbox" checked={editing.is_published} onChange={e => setEditing(prev => prev ? {...prev, is_published: e.target.checked} : prev)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-600">{editing.is_published ? '✅ Published' : '📝 Draft'}</span>
            </label>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
              {saving ? 'Saving...' : '💾 Save Post'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <input
                type="text"
                value={editing.title}
                onChange={e => {
                  const title = e.target.value
                  setEditing(prev => prev ? {...prev, title, slug: prev.slug || generateSlug(title)} : prev)
                }}
                className="w-full px-4 py-3 text-2xl font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
                placeholder="Post title..."
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
              <span className="text-sm text-slate-400">/blog/</span>
              <input
                type="text"
                value={editing.slug}
                onChange={e => setEditing(prev => prev ? {...prev, slug: e.target.value} : prev)}
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none font-mono"
                placeholder="post-slug"
              />
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveSection('content')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'content' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                ✏️ Content
              </button>
              <button
                onClick={() => setActiveSection('seo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'seo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                🔍 SEO
              </button>
            </div>

            {/* Content Tab */}
            {activeSection === 'content' && (
              <div className="space-y-5">
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt / Summary</label>
                  <textarea
                    value={editing.excerpt}
                    onChange={e => setEditing(prev => prev ? {...prev, excerpt: e.target.value} : prev)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm text-slate-900"
                    placeholder="A brief summary of the post (shown in blog list and search results)..."
                  />
                </div>

                {/* Rich Text Editor for Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
                  <RichTextEditor
                    value={editing.content}
                    onChange={content => setEditing(prev => prev ? {...prev, content} : prev)}
                    placeholder="Start writing your blog post..."
                    minHeight={500}
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeSection === 'seo' && (
              <SEOPanel
                title={editing.title}
                slug={editing.slug}
                excerpt={editing.excerpt}
                content={editing.content}
                coverImageUrl={editing.cover_image_url}
                metaTitle={editing.meta_title}
                metaDescription={editing.meta_description}
                focusKeyword={editing.focus_keyword}
                ogImageUrl={editing.og_image_url}
                canonicalUrl={editing.canonical_url}
                onMetaTitleChange={v => setEditing(prev => prev ? {...prev, meta_title: v} : prev)}
                onMetaDescriptionChange={v => setEditing(prev => prev ? {...prev, meta_description: v} : prev)}
                onFocusKeywordChange={v => setEditing(prev => prev ? {...prev, focus_keyword: v} : prev)}
                onOgImageUrlChange={v => setEditing(prev => prev ? {...prev, og_image_url: v} : prev)}
                onCanonicalUrlChange={v => setEditing(prev => prev ? {...prev, canonical_url: v} : prev)}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Author & Date */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">📋 Post Details</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Author</label>
                <input type="text" value={editing.author} onChange={e => setEditing(prev => prev ? {...prev, author: e.target.value} : prev)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900" placeholder="Author name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Publish Date</label>
                <input type="date" value={editing.published_at?.slice(0, 10)} onChange={e => setEditing(prev => prev ? {...prev, published_at: e.target.value} : prev)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900" />
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">🖼️ Cover Image</h3>
              <MediaPicker
                value={editing.cover_image_url}
                onChange={url => setEditing(prev => prev ? {...prev, cover_image_url: url} : prev)}
                accept="image"
                folder="blog"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">🏷️ Tags</h3>
              <div className="flex gap-1.5">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900" placeholder="Add tag..." />
                <button onClick={addTag} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all text-sm">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {editing.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-600">✕</button>
                  </span>
                ))}
                {editing.tags.length === 0 && <p className="text-xs text-slate-400">No tags yet</p>}
              </div>
            </div>

            {/* Quick SEO Score (sidebar) */}
            {editing.focus_keyword && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">🔍 SEO Score</h3>
                <div className="flex items-center gap-3">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    {(() => {
                      const plainContent = editing.content.replace(/[#*_~`>\-\[\]\(\)!|]/g, '').toLowerCase()
                      const kw = editing.focus_keyword.toLowerCase().trim()
                      const checks = [
                        (editing.meta_title || editing.title).toLowerCase().includes(kw),
                        (editing.meta_title || editing.title).length >= 50 && (editing.meta_title || editing.title).length <= 60,
                        (editing.meta_description || editing.excerpt).toLowerCase().includes(kw),
                        plainContent.split(/\s+/).filter(Boolean).length >= 300,
                        editing.slug.toLowerCase().includes(kw.replace(/\s+/g, '-')),
                      ]
                      const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100)
                      const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      return <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                    })()}
                  </div>
                </div>
                <button onClick={() => setActiveSection('seo')} className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View full analysis →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // =================== LIST VIEW ===================
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">✏️ Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} posts</p>
        </div>
        <button onClick={() => { setEditing({...empty}); setActiveSection('content') }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
          + New Post
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">✏️</p>
          <p className="text-slate-400">No blog posts yet. Click &quot;+ New Post&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow flex items-center gap-4">
              {/* Cover Image Thumb */}
              {item.cover_image_url ? (
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-slate-300 text-lg">📄</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{item.title || 'Untitled'}</h3>
                  {!item.is_published && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">Draft</span>}
                  {item.focus_keyword && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">🔍 SEO</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="font-mono">/blog/{item.slug}</span>
                  {item.author && <span>by {item.author}</span>}
                  <span>{item.published_at?.slice(0, 10)}</span>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(item.tags).slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px]">{tag}</span>
                    ))}
                    {item.tags.length > 4 && <span className="text-[10px] text-slate-400">+{item.tags.length - 4}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing({...empty, ...item, tags: item.tags || []}); setActiveSection('content') }} className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all font-medium">
                  Edit
                </button>
                <button onClick={() => item.id && handleDelete(item.id)} className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
