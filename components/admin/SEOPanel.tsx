'use client'

import { useState, useEffect, useMemo } from 'react'

interface SEOPanelProps {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  ogImageUrl: string
  canonicalUrl: string
  onMetaTitleChange: (v: string) => void
  onMetaDescriptionChange: (v: string) => void
  onFocusKeywordChange: (v: string) => void
  onOgImageUrlChange: (v: string) => void
  onCanonicalUrlChange: (v: string) => void
}

interface SEOCheck {
  label: string
  passed: boolean
  tip: string
}

export default function SEOPanel({
  title, slug, excerpt, content, coverImageUrl,
  metaTitle, metaDescription, focusKeyword, ogImageUrl, canonicalUrl,
  onMetaTitleChange, onMetaDescriptionChange, onFocusKeywordChange, onOgImageUrlChange, onCanonicalUrlChange,
}: SEOPanelProps) {
  const [expanded, setExpanded] = useState(true)

  const effectiveTitle = metaTitle || title
  const effectiveDescription = metaDescription || excerpt
  const effectiveOgImage = ogImageUrl || coverImageUrl
  const plainContent = content.replace(/[#*_~`>\-\[\]\(\)!|]/g, '').toLowerCase()
  const keyword = focusKeyword.toLowerCase().trim()

  // SEO Checks
  const checks = useMemo<SEOCheck[]>(() => {
    if (!keyword) return []

    const titleLower = effectiveTitle.toLowerCase()
    const descLower = effectiveDescription.toLowerCase()
    const slugLower = slug.toLowerCase()
    const wordCount = plainContent.split(/\s+/).filter(Boolean).length

    // Count keyword occurrences
    const keywordCount = plainContent.split(keyword).length - 1
    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0

    // Check headings for keyword
    const headingMatches = content.match(/^#{1,6}\s.+$/gm) || []
    const keywordInHeading = headingMatches.some(h => h.toLowerCase().includes(keyword))

    // Check first paragraph
    const firstPara = plainContent.split('\n').find(l => l.trim().length > 20) || ''
    const keywordInFirst = firstPara.includes(keyword)

    // Check images have alt text
    const images = content.match(/!\[[^\]]*\]\([^)]+\)/g) || []
    const imagesWithAlt = images.filter(img => {
      const alt = img.match(/!\[([^\]]*)\]/)
      return alt && alt[1].trim().length > 0
    })

    return [
      {
        label: 'Focus keyword in SEO title',
        passed: titleLower.includes(keyword),
        tip: 'Include your focus keyword in the meta title for better rankings.',
      },
      {
        label: 'SEO title length (50-60 chars)',
        passed: effectiveTitle.length >= 50 && effectiveTitle.length <= 60,
        tip: `Current: ${effectiveTitle.length} chars. Google displays 50-60 characters.`,
      },
      {
        label: 'Focus keyword in meta description',
        passed: descLower.includes(keyword),
        tip: 'Include the focus keyword in your meta description.',
      },
      {
        label: 'Meta description length (120-160 chars)',
        passed: effectiveDescription.length >= 120 && effectiveDescription.length <= 160,
        tip: `Current: ${effectiveDescription.length} chars. Aim for 120-160 characters.`,
      },
      {
        label: 'Focus keyword in URL/slug',
        passed: slugLower.includes(keyword.replace(/\s+/g, '-')),
        tip: 'Include your focus keyword in the URL slug.',
      },
      {
        label: 'Focus keyword in first paragraph',
        passed: keywordInFirst,
        tip: 'Use the focus keyword within the first 100 words.',
      },
      {
        label: 'Focus keyword in a heading',
        passed: keywordInHeading,
        tip: 'Use the keyword in at least one subheading (H2-H6).',
      },
      {
        label: 'Keyword density (0.5-2.5%)',
        passed: keywordDensity >= 0.5 && keywordDensity <= 2.5,
        tip: `Current: ${keywordDensity.toFixed(1)}%. Aim for 0.5-2.5%.`,
      },
      {
        label: 'Content length (300+ words)',
        passed: wordCount >= 300,
        tip: `Current: ${wordCount} words. Aim for 300+ words minimum, 1500+ ideal.`,
      },
      {
        label: 'Images have alt text',
        passed: images.length === 0 || imagesWithAlt.length === images.length,
        tip: `${imagesWithAlt.length}/${images.length} images have alt text.`,
      },
      {
        label: 'Internal/external links present',
        passed: (content.match(/\[.+?\]\(.+?\)/g) || []).length > 0,
        tip: 'Add links to other pages or external resources.',
      },
      {
        label: 'OG image set',
        passed: !!effectiveOgImage,
        tip: 'Set an Open Graph image for social media sharing.',
      },
    ]
  }, [keyword, effectiveTitle, effectiveDescription, slug, plainContent, content, effectiveOgImage])

  const passedCount = checks.filter(c => c.passed).length
  const totalChecks = checks.length
  const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 0

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const scoreBg = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-900">SEO Analysis</h3>
            {keyword && (
              <p className="text-xs text-slate-400 mt-0.5">
                Keyword: &quot;{focusKeyword}&quot; — <span className={scoreColor}>{score}%</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {keyword && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${scoreBg}`} style={{ width: `${score}%` }} />
              </div>
              <span className={`text-xs font-medium ${scoreColor}`}>{passedCount}/{totalChecks}</span>
            </div>
          )}
          <span className="text-slate-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 p-4 space-y-4">
          {/* Focus Keyword */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">🎯 Focus Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={e => onFocusKeywordChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900"
              placeholder="e.g. artificial intelligence solutions"
            />
            <p className="text-[11px] text-slate-400 mt-1">Enter the main keyword you want this post to rank for.</p>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">📝 SEO Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={e => onMetaTitleChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900"
              placeholder={title || 'SEO title (defaults to post title)'}
            />
            <div className="flex justify-between mt-1">
              <p className="text-[11px] text-slate-400">Optimal: 50-60 characters</p>
              <p className={`text-[11px] font-medium ${effectiveTitle.length > 60 ? 'text-red-500' : effectiveTitle.length >= 50 ? 'text-green-600' : 'text-amber-500'}`}>
                {effectiveTitle.length}/60
              </p>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">📄 Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={e => onMetaDescriptionChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none text-slate-900"
              placeholder={excerpt || 'Meta description (defaults to excerpt)'}
            />
            <div className="flex justify-between mt-1">
              <p className="text-[11px] text-slate-400">Optimal: 120-160 characters</p>
              <p className={`text-[11px] font-medium ${effectiveDescription.length > 160 ? 'text-red-500' : effectiveDescription.length >= 120 ? 'text-green-600' : 'text-amber-500'}`}>
                {effectiveDescription.length}/160
              </p>
            </div>
          </div>

          {/* Google Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">🔎 Google Search Preview</label>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-green-700 truncate">yourdomain.com/blog/{slug || 'your-post-slug'}</p>
              <h4 className="text-lg text-blue-800 font-medium mt-0.5 line-clamp-1 hover:underline cursor-pointer">
                {effectiveTitle || 'Your Post Title'}
              </h4>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {effectiveDescription || 'Your meta description will appear here. Write a compelling summary to improve click-through rates.'}
              </p>
            </div>
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">🖼️ OG Image URL (Social Media)</label>
            <input
              type="url"
              value={ogImageUrl}
              onChange={e => onOgImageUrlChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900"
              placeholder={coverImageUrl || 'https://... (defaults to cover image)'}
            />
            {effectiveOgImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-w-sm">
                <img src={effectiveOgImage} alt="OG Preview" className="w-full h-36 object-cover" />
                <div className="px-3 py-2 bg-slate-50">
                  <p className="text-[11px] text-slate-400 truncate">yourdomain.com</p>
                  <p className="text-xs font-medium text-slate-900 truncate">{effectiveTitle || 'Post Title'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{effectiveDescription || 'Description'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">🔗 Canonical URL</label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={e => onCanonicalUrlChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-slate-900"
              placeholder="Leave empty to use default URL"
            />
            <p className="text-[11px] text-slate-400 mt-1">Set if this content exists at another URL to avoid duplicate content penalties.</p>
          </div>

          {/* SEO Checklist */}
          {keyword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">✅ SEO Checklist</label>
              <div className="space-y-1.5">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    <span className={`text-sm mt-0.5 ${check.passed ? 'text-green-500' : 'text-red-400'}`}>
                      {check.passed ? '✅' : '❌'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${check.passed ? 'text-green-700' : 'text-slate-700'}`}>{check.label}</p>
                      {!check.passed && <p className="text-[11px] text-slate-400 mt-0.5">{check.tip}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!keyword && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="text-xs text-amber-700">
                <strong>💡 Tip:</strong> Enter a focus keyword above to see SEO analysis and recommendations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
