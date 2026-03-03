'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

// Toolbar button data
const HEADING_OPTIONS = [
  { label: 'H1', prefix: '# ', desc: 'Heading 1' },
  { label: 'H2', prefix: '## ', desc: 'Heading 2' },
  { label: 'H3', prefix: '### ', desc: 'Heading 3' },
  { label: 'H4', prefix: '#### ', desc: 'Heading 4' },
  { label: 'H5', prefix: '##### ', desc: 'Heading 5' },
  { label: 'H6', prefix: '###### ', desc: 'Heading 6' },
]

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 400 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [showHeadings, setShowHeadings] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  // Word & character count
  useEffect(() => {
    const text = value.replace(/[#*_~`>\-\[\]\(\)!|]/g, '').trim()
    setCharCount(value.length)
    setWordCount(text ? text.split(/\s+/).length : 0)
  }, [value])

  // Insert text at cursor position
  const insertAtCursor = useCallback((before: string, after: string = '', placeholder_text: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const textToInsert = selected || placeholder_text

    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange(newValue)

    // Restore cursor position
    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(
        selected ? cursorPos + after.length : start + before.length,
        selected ? cursorPos + after.length : start + before.length + textToInsert.length
      )
    })
  }, [value, onChange])

  // Wrap selection with prefix/suffix
  const wrapSelection = useCallback((prefix: string, suffix: string, ph: string = '') => {
    insertAtCursor(prefix, suffix, ph)
  }, [insertAtCursor])

  // Insert line prefix (for headings, lists, blockquotes)
  const insertLinePrefix = useCallback((prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    // Find start of current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd)

    // Remove existing heading prefix if any
    const cleanLine = currentLine.replace(/^#{1,6}\s/, '')
    const newLine = prefix + cleanLine

    const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd)
    onChange(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const newPos = lineStart + newLine.length
      textarea.setSelectionRange(newPos, newPos)
    })
  }, [value, onChange])

  // Insert new line content
  const insertNewLine = useCallback((content: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeCursor = value.substring(0, start)
    const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n') ? '\n' : ''
    const extraNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n\n') ? '\n' : ''

    const insert = extraNewline + needsNewline + content + '\n'
    const newValue = value.substring(0, start) + insert + value.substring(start)
    onChange(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const newPos = start + insert.length
      textarea.setSelectionRange(newPos, newPos)
    })
  }, [value, onChange])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); wrapSelection('**', '**', 'bold text'); break
        case 'i': e.preventDefault(); wrapSelection('*', '*', 'italic text'); break
        case 'u': e.preventDefault(); wrapSelection('<u>', '</u>', 'underlined text'); break
        case 'k': e.preventDefault(); wrapSelection('[', '](https://)', 'link text'); break
        case 'd': e.preventDefault(); wrapSelection('~~', '~~', 'strikethrough'); break
        case 'e': e.preventDefault(); wrapSelection('`', '`', 'code'); break
        case '1': e.preventDefault(); insertLinePrefix('# '); break
        case '2': e.preventDefault(); insertLinePrefix('## '); break
        case '3': e.preventDefault(); insertLinePrefix('### '); break
      }
    }
    // Tab for indent
    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtCursor('  ')
    }
  }, [wrapSelection, insertLinePrefix, insertAtCursor])

  // Table generator
  const insertTable = (rows: number, cols: number) => {
    const header = '| ' + Array(cols).fill('Header').map((h, i) => `${h} ${i + 1}`).join(' | ') + ' |'
    const separator = '| ' + Array(cols).fill('---').join(' | ') + ' |'
    const body = Array(rows).fill('| ' + Array(cols).fill('Cell').join(' | ') + ' |').join('\n')
    insertNewLine(`${header}\n${separator}\n${body}`)
    setShowTable(false)
  }

  // Simple markdown → HTML for preview (basic)
  const renderPreview = () => {
    if (!value.trim()) return '<p class="text-slate-400 italic">Nothing to preview yet...</p>'

    let html = value
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm my-4"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-xl my-4 shadow-sm border border-slate-200" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener">$1</a>')
      // Headings
      .replace(/^###### (.+)$/gm, '<h6 class="text-base font-bold text-slate-900 mt-6 mb-2">$1</h6>')
      .replace(/^##### (.+)$/gm, '<h5 class="text-lg font-bold text-slate-900 mt-6 mb-2">$1</h5>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-xl font-bold text-slate-900 mt-8 mb-3">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold text-slate-900 mt-8 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold text-slate-900 mt-10 mb-4">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold text-slate-900 mt-12 mb-6">$1</h1>')
      // Bold + Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Strikethrough
      .replace(/~~(.+?)~~/g, '<del class="line-through text-slate-400">$1</del>')
      // Underline
      .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>')
      // Horizontal Rule
      .replace(/^---$/gm, '<hr class="my-8 border-slate-200" />')
      // Blockquote
      .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-4 italic text-slate-600 bg-blue-50/50 rounded-r-lg">$1</blockquote>')
      // Unordered list
      .replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
      // Ordered list
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-700">$1</li>')
      // Checkbox
      .replace(/^- \[x\] (.+)$/gm, '<li class="ml-4 flex items-center gap-2"><input type="checkbox" checked disabled class="rounded" /><span>$1</span></li>')
      .replace(/^- \[ \] (.+)$/gm, '<li class="ml-4 flex items-center gap-2"><input type="checkbox" disabled class="rounded" /><span>$1</span></li>')
      // Paragraphs (lines that aren't already wrapped)
      .replace(/^(?!<[hbulaoidpcrif])(.+)$/gm, '<p class="text-slate-700 text-base leading-relaxed mb-4">$1</p>')

    return html
  }

  // Estimate reading time
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50">
        {/* Top toolbar row */}
        <div className="flex items-center gap-0.5 p-1.5 flex-wrap">
          {/* Headings dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowHeadings(!showHeadings); setShowTable(false) }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all flex items-center gap-1"
              title="Headings"
            >
              H▾
            </button>
            {showHeadings && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 w-36">
                {HEADING_OPTIONS.map(h => (
                  <button key={h.label} onClick={() => { insertLinePrefix(h.prefix); setShowHeadings(false) }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <span className="font-bold text-slate-900 w-6">{h.label}</span>
                    <span className="text-slate-400 text-xs">{h.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Inline formatting */}
          <button onClick={() => wrapSelection('**', '**', 'bold')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Bold (Ctrl+B)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
          </button>
          <button onClick={() => wrapSelection('*', '*', 'italic')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Italic (Ctrl+I)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M10 4h4m-2 0l-4 16m0 0h4m-8 0h4"/></svg>
          </button>
          <button onClick={() => wrapSelection('<u>', '</u>', 'underlined')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Underline (Ctrl+U)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0012 0V3M4 21h16"/></svg>
          </button>
          <button onClick={() => wrapSelection('~~', '~~', 'strikethrough')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Strikethrough (Ctrl+D)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M16 4H9a3 3 0 000 6h6a3 3 0 010 6H8M4 12h16"/></svg>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Links & Media */}
          <button onClick={() => wrapSelection('[', '](https://)', 'link text')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Link (Ctrl+K)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button onClick={() => insertAtCursor('![', '](https://image-url.jpg)', 'alt text')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Image">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Lists */}
          <button onClick={() => insertLinePrefix('- ')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Bullet List">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          </button>
          <button onClick={() => insertLinePrefix('1. ')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Numbered List">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11M4 6V4l-2 2m0 0h3M3 18v-2l-1 1m0 0h2.5M2 12h3"/></svg>
          </button>
          <button onClick={() => insertNewLine('- [ ] Task item')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Checklist">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><path d="M14 6h7M14 18h7"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M5 16l1.5 1.5L9 15"/></svg>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Block elements */}
          <button onClick={() => insertLinePrefix('> ')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Blockquote">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
          </button>
          <button onClick={() => wrapSelection('`', '`', 'code')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Inline Code (Ctrl+E)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
          </button>
          <button onClick={() => insertNewLine('```\ncode here\n```')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Code Block">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13 7l-2 10"/></svg>
          </button>
          <button onClick={() => insertNewLine('---')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Horizontal Rule">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M3 12h18"/></svg>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Table dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowTable(!showTable); setShowHeadings(false) }}
              className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all"
              title="Table"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
            </button>
            {showTable && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                <p className="text-xs font-medium text-slate-500 mb-2">Insert Table</p>
                <div className="grid grid-cols-4 gap-1">
                  {[2, 3, 4, 5].map(rows => (
                    [2, 3, 4, 5].map(cols => (
                      <button key={`${rows}x${cols}`} onClick={() => insertTable(rows, cols)}
                        className="w-8 h-8 text-[10px] rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-500 font-medium transition-all"
                      >
                        {rows}×{cols}
                      </button>
                    ))
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Special inserts */}
          <button onClick={() => insertNewLine('> 💡 **Tip:** Your tip text here')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Callout/Tip">
            💡
          </button>
          <button onClick={() => insertNewLine('> ⚠️ **Warning:** Your warning text here')} className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all" title="Warning">
            ⚠️
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Write/Preview toggle */}
          <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'write' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              ✏️ Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="px-3 pb-1.5 flex gap-3 text-[10px] text-slate-400">
          <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-500">Ctrl+B</kbd> Bold</span>
          <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-500">Ctrl+I</kbd> Italic</span>
          <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-500">Ctrl+K</kbd> Link</span>
          <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-500">Ctrl+E</kbd> Code</span>
          <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-500">Ctrl+1/2/3</kbd> Headings</span>
        </div>
      </div>

      {/* Editor / Preview area */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={() => { setShowHeadings(false); setShowTable(false) }}
          placeholder={placeholder || 'Start writing your blog post...\n\nUse the toolbar above or keyboard shortcuts for formatting.'}
          className="w-full px-4 py-3 outline-none resize-y font-mono text-sm text-slate-900 leading-relaxed"
          style={{ minHeight }}
        />
      ) : (
        <div
          className="px-6 py-4 prose prose-slate max-w-none overflow-auto"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      )}

      {/* Status bar */}
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>~{readingTime} min read</span>
        </div>
        <span>Markdown</span>
      </div>
    </div>
  )
}
