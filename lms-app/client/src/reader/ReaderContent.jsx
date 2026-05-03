import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useReaderState } from './ReaderStateContext'

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderWithHighlights(content, highlights) {
  if (!highlights.length) return content

  const unique = [...new Set(highlights.filter(Boolean))]
  if (!unique.length) return content

  const pattern = unique
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')

  if (!pattern) return content

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = content.split(regex)

  return parts.map((part, idx) => {
    const matched = unique.some(s => s.toLowerCase() === part.toLowerCase())
    return matched
      ? <mark key={idx} className="bg-amber-300/70 text-black px-0.5 rounded">{part}</mark>
      : <span key={idx}>{part}</span>
  })
}

function ReaderContentBase({
  chapter,
  subject,
  chapterId,
  onSelection,
  onActiveSectionChange,
  onProgress,
}) {
  const { toggleBookmark, isBookmarked, getHighlights } = useReaderState()
  const containerRef = useRef(null)
  const [activeSectionId, setActiveSectionId] = useState(chapter.sections?.[0]?.id || '')

  useEffect(() => {
    setActiveSectionId(chapter.sections?.[0]?.id || '')
    onActiveSectionChange(chapter.sections?.[0]?.id || '')
  }, [chapter, onActiveSectionChange])

  function handleMouseUp() {
    const selection = window.getSelection()
    const text = selection?.toString()?.trim()
    if (!text || text.length < 8) {
      onSelection(null)
      return
    }

    const range = selection.getRangeAt(0)
    const parent = range.commonAncestorContainer.nodeType === 1
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement
    const sectionEl = parent?.closest?.('[data-section-id]')
    const sectionId = sectionEl?.getAttribute?.('data-section-id') || activeSectionId

    onSelection({ text, sectionId })
  }

  function handleScroll() {
    const el = containerRef.current
    if (!el) return

    const total = el.scrollHeight - el.clientHeight
    const pct = total <= 0 ? 0 : Math.min(100, Math.max(0, (el.scrollTop / total) * 100))
    onProgress(pct)

    const sectionNodes = el.querySelectorAll('[data-section-id]')
    let found = activeSectionId
    for (const node of sectionNodes) {
      const top = node.getBoundingClientRect().top - el.getBoundingClientRect().top
      if (top <= 100) found = node.getAttribute('data-section-id')
      else break
    }
    if (found !== activeSectionId) {
      setActiveSectionId(found)
      onActiveSectionChange(found)
    }
  }

  const sections = useMemo(() => chapter.sections || [], [chapter])

  return (
    <section className="flex-1 min-w-0 relative h-full">
      <div className="absolute top-0 left-0 right-0 h-1 bg-md-surf3 z-20">
        <div className="h-full bg-gradient-to-r from-md-primary to-md-secondary transition-[width] duration-200" style={{ width: 'var(--reader-progress, 0%)' }} />
      </div>

      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-5 md:px-10 py-8 md:py-10"
      >
        <article className="max-w-3xl mx-auto animate-fade-in">
          <header className="mb-8 pb-6 border-b border-md-outline/40">
            <div className="text-xs uppercase tracking-[0.22em] text-md-onsurfvar">{subject}</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-md-onsurf font-reader leading-tight">
              {chapter.title}
            </h1>
            <p className="mt-3 text-sm text-md-onsurfvar">Chapter {chapterId} • Structured law book content • No PDF renderer</p>
          </header>

          <div className="space-y-12">
            {sections.map(sec => {
              const sectionKey = `${subject}:${chapterId}:${sec.id}`
              const highlights = getHighlights(sectionKey)
              return (
                <section key={sec.id} id={`sec-${sec.id}`} data-section-id={sec.id} className="scroll-mt-24">
                  <div className="flex items-start gap-3 mb-3">
                    <h2 className="font-reader text-2xl text-md-onsurf leading-tight flex-1">{sec.heading}</h2>
                    <button
                      onClick={() => toggleBookmark(sectionKey)}
                      className={`ripple-root mt-1 px-2 py-1 rounded-lg text-xs border transition-colors ${
                        isBookmarked(sectionKey)
                          ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                          : 'bg-md-surf2 border-md-outline/50 text-md-onsurfvar hover:text-md-onsurf'
                      }`}
                    >
                      {isBookmarked(sectionKey) ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>

                  <div className="text-[1.06rem] leading-8 text-md-onsurf/95 font-reader whitespace-pre-line">
                    {renderWithHighlights(sec.content, highlights)}
                  </div>
                </section>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

const ReaderContent = memo(ReaderContentBase)
export default ReaderContent
