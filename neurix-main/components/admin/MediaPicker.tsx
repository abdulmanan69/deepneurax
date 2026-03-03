'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { adminClient } from '@/lib/supabase/admin'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

interface MediaPickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: 'image' | 'video' | 'all'
  previewType?: 'image' | 'video' | 'avatar'
  bucket?: string
  folder?: string
  placeholder?: string
}

interface StorageFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  metadata: {
    size: number
    mimetype: string
  }
}

const BUCKET = 'assets'

export default function MediaPicker({
  value,
  onChange,
  label,
  accept = 'image',
  previewType = 'image',
  bucket = BUCKET,
  folder = '',
  placeholder = 'https://...',
}: MediaPickerProps) {
  const [showLibrary, setShowLibrary] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [libraryItems, setLibraryItems] = useState<{ name: string; url: string; type: string; size: number }[]>([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [librarySearch, setLibrarySearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const acceptTypes = accept === 'video' ? 'video/*' : accept === 'all' ? 'image/*,video/*' : 'image/*'

  // Load library items
  const loadLibrary = useCallback(async () => {
    if (!adminClient) return
    setLibraryLoading(true)
    try {
      // List all files in bucket. We try multiple common folders.
      const folders = folder ? [folder] : ['', 'logos', 'images', 'videos', 'uploads', 'blog', 'hero', 'services', 'products']
      const allFiles: { name: string; url: string; type: string; size: number }[] = []

      for (const f of folders) {
        try {
          const { data } = await adminClient.storage.from(bucket).list(f || undefined, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
          if (data) {
            for (const file of data) {
              // Skip folders (they have no metadata)
              if (!file.metadata || !file.metadata.mimetype) continue
              const path = f ? `${f}/${file.name}` : file.name
              const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(path)
              allFiles.push({
                name: file.name,
                url: urlData.publicUrl,
                type: file.metadata.mimetype,
                size: file.metadata.size || 0,
              })
            }
          }
        } catch {
          // folder doesn't exist, skip
        }
      }

      // Deduplicate by URL
      const seen = new Set<string>()
      const unique = allFiles.filter(f => {
        if (seen.has(f.url)) return false
        seen.add(f.url)
        return true
      })

      // Filter by accept type
      const filtered = unique.filter(f => {
        if (accept === 'image') return f.type.startsWith('image/')
        if (accept === 'video') return f.type.startsWith('video/')
        return true
      })

      setLibraryItems(filtered)
    } catch (err) {
      console.error('Failed to load library:', err)
    } finally {
      setLibraryLoading(false)
    }
  }, [bucket, folder, accept])

  // Close library on outside click
  useEffect(() => {
    if (!showLibrary) return
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowLibrary(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showLibrary])

  // Load library when opened
  useEffect(() => {
    if (showLibrary) loadLibrary()
  }, [showLibrary, loadLibrary])

  const handleUpload = async (file: File) => {
    if (!adminClient) return
    if (file.size > 50 * 1024 * 1024) {
      alert('File must be under 50MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'bin'
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/_{2,}/g, '_')
      const timestamp = Date.now()
      const uploadFolder = folder || (file.type.startsWith('video/') ? 'videos' : 'images')
      const path = `${uploadFolder}/${timestamp}-${safeName}`

      const { error } = await adminClient.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

      if (error) {
        if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
          alert(`Storage bucket "${bucket}" not found. Please create it in Supabase → Storage.`)
        } else {
          alert(`Upload failed: ${error.message}`)
        }
        return
      }

      const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(path)
      onChange(urlData.publicUrl)

      // If library is open, refresh it
      if (showLibrary) loadLibrary()
    } catch (err: any) {
      alert(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const filteredLibrary = librarySearch
    ? libraryItems.filter(f => f.name.toLowerCase().includes(librarySearch.toLowerCase()))
    : libraryItems

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url) || (value && libraryItems.find(f => f.url === url)?.type.startsWith('video/'))

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}

      {/* URL Input + Buttons Row */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shrink-0 flex items-center gap-1.5"
          title="Upload file"
        >
          {uploading ? (
            <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Uploading...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Upload</>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all shrink-0 flex items-center gap-1.5"
          title="Choose from library"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Library
        </button>
      </div>

      <input ref={fileRef} type="file" accept={acceptTypes} className="hidden" onChange={handleFileChange} />

      {/* Drop Zone (when no preview) */}
      {!value && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-2xl mb-2">{accept === 'video' ? '🎬' : '📷'}</div>
          <p className="text-sm text-slate-500">Drag & drop or click to upload</p>
          <p className="text-xs text-slate-400 mt-1">
            {accept === 'video' ? 'MP4, WebM, MOV' : accept === 'all' ? 'Images or Videos' : 'PNG, JPG, SVG, WebP'} · Max 50MB
          </p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative group">
          {previewType === 'avatar' ? (
            <div className="flex items-center gap-3">
              <img src={value} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200" />
              <button
                onClick={() => onChange('')}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Remove
              </button>
            </div>
          ) : previewType === 'video' || isVideo(value) ? (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-w-xs relative">
              <video src={value} className="w-full h-32 object-cover" muted />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <span className="text-slate-700 ml-0.5">▶</span>
                </div>
              </div>
              <button
                onClick={() => onChange('')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-w-xs relative">
              <img src={value} alt="Preview" className="w-full h-32 object-cover" />
              <button
                onClick={() => onChange('')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">📁 Media Library</h2>
                <p className="text-sm text-slate-500 mt-0.5">{libraryItems.length} files in storage</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload New
                </button>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-slate-100">
              <input
                type="text"
                value={librarySearch}
                onChange={e => setLibrarySearch(e.target.value)}
                placeholder="Search files..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {libraryLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-4xl mb-3">📂</p>
                  <p className="text-slate-400">
                    {librarySearch ? 'No files match your search' : 'No files uploaded yet. Upload your first file!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredLibrary.map((file) => {
                    const isSelected = value === file.url
                    const isVid = file.type.startsWith('video/')
                    return (
                      <button
                        key={file.url}
                        onClick={() => { onChange(file.url); setShowLibrary(false) }}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="aspect-square bg-slate-100 relative">
                          {isVid ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                              <div className="text-center">
                                <div className="text-3xl mb-1">🎬</div>
                                <p className="text-xs text-white/60">{file.name.split('.').pop()?.toUpperCase()}</p>
                              </div>
                            </div>
                          ) : (
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
