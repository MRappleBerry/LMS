import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useReaderState } from './ReaderStateContext'

function ChapterSidebarBase({
  subjectMeta,
  chapterId,
  activeSectionId,
  onNavigateChapter,
  onJumpSection,
  mode = 'desktop',
  learningInsights,
  isSectionRead,
  yearFilter = 'All',
  onYearFilterChange,
  subjects = [],
  onSubjectNavigate,
  yearOptions = [],
}) {
  const { isBookmarked } = useReaderState()
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})
  const scrollByChapter = useRef({})
  const [openMap, setOpenMap] = useState(() => {
    const initial = {}
    for (const ch of subjectMeta.chapters) initial[ch.id] = ch.id === chapterId
    return initial
  })

  const YEAR_OPTIONS = ['All', ...(yearOptions?.map(y => y.label) || ['1st Year', '2nd Year', '3rd Year', '4th Year'])]

  const chapters = useMemo(() => {
    const source = subjectMeta.chapters || []
    if (yearFilter === 'All') return source
    return source
      .map(ch => ({
        ...ch,
        sections: (ch.sections || []).filter(sec => (sec.yearLevel || subjectMeta.yearLevel) === yearFilter),
      }))
      .filter(ch => (ch.sections || []).length > 0)
  }, [subjectMeta, yearFilter])

  const filteredSubjects = useMemo(() => {
    if (!subjects?.length) return [{ id: subjectMeta.subject, title: subjectMeta.title, yearLevel: subjectMeta.yearLevel }]
    if (yearFilter === 'All') return subjects
    return subjects.filter(s => (s.yearLevel || '').toLowerCase() === yearFilter.toLowerCase())
  }, [subjects, subjectMeta, yearFilter])

  function toggleChapter(id) {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSidebarScroll() {
    const container = scrollRef.current
    if (!container) return
    const key = `${subjectMeta.subject}:${chapterId}`
    scrollByChapter.current[key] = container.scrollTop
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const key = `${subjectMeta.subject}:${chapterId}`
    const top = scrollByChapter.current[key] ?? 0
    container.scrollTop = top
  }, [subjectMeta.subject, chapterId])

  useEffect(() => {
    const el = sectionRefs.current[activeSectionId]
    const container = scrollRef.current
    if (!el || !container) return

    const cRect = container.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()
    const above = eRect.top < cRect.top + 56
    const below = eRect.bottom > cRect.bottom - 24

    if (above || below) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeSectionId, chapterId])

  const asideClass = mode === 'mobile'
    ? 'w-72 max-w-[84vw] shrink-0 border-r border-white/[0.06] bg-[#0f1117] h-full min-h-0 overflow-y-auto'
    : 'hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-white/[0.06] bg-[#0f1117] sticky top-0 h-full min-h-0 overflow-y-auto'

  return (
    <aside ref={scrollRef} onScroll={handleSidebarScroll} className={asideClass}>

      {/* ── Subject header ── */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12V2zm-2 12H9V4h9v10zM4 6H2v14c0 1.1.9 2 2 2h12v-2H4V6z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400/70">Subject</div>
            <h2 className="text-sm font-semibold text-white leading-tight truncate">{subjectMeta.title}</h2>
          </div>
        </div>

        {/* Year badge */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/50 mb-4">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
          </svg>
          {subjectMeta.yearLevel || 'N/A'}
        </div>

        {/* Year filter pills — horizontal scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {YEAR_OPTIONS.map(y => (
            <button
              key={y}
              onClick={() => onYearFilterChange?.(y)}
              className={`shrink-0 px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                yearFilter === y
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.09] hover:text-white/70'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* ── Subject list ── */}
      <div className="px-3 pb-3 space-y-0.5">
        {filteredSubjects.map(s => {
          const isActive = (s.id || s.subject) === subjectMeta.subject
          return (
            <button
              key={s.id || s.subject}
              onClick={() => onSubjectNavigate?.(s.id || s.subject)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : 'hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-indigo-400' : 'bg-white/20 group-hover:bg-white/40'}`} />
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-medium truncate ${isActive ? 'text-indigo-200' : 'text-white/60 group-hover:text-white/80'}`}>{s.title}</div>
                <div className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-400/70' : 'text-white/30'}`}>{s.yearLevel || 'N/A'}</div>
              </div>
              {isActive && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-indigo-400 shrink-0">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Progress card ── */}
      {learningInsights && (
        <div className="mx-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-white/50">Progress</span>
            <span className="text-sm font-bold text-indigo-300">{learningInsights.progressPct}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-500"
              style={{ width: `${learningInsights.progressPct}%` }}
            />
          </div>
          {learningInsights.recommendedNext && (
            <div className="mt-2.5 flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 18.56l-6.18 2.44L7 14.14 2 9.27l6.91-1.01z"/>
              </svg>
              <div>
                <div className="text-[10px] text-white/30 leading-none mb-0.5">Up next</div>
                <div className="text-[11px] text-white/70 leading-snug">{learningInsights.recommendedNext.title}</div>
              </div>
            </div>
          )}
          {learningInsights.weakAreas?.length > 0 && (
            <div className="mt-2 flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-400 mt-0.5 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <div>
                <div className="text-[10px] text-white/30 leading-none mb-0.5">Review</div>
                <div className="text-[11px] text-red-300/80 leading-snug">{learningInsights.weakAreas[0].title}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div className="mx-3 mb-2 border-t border-white/[0.05]" />
      <div className="px-4 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">Contents</span>
      </div>

      {/* ── Chapter list ── */}
      <div className="px-2 pb-6">
        {chapters.map(ch => {
          const isActiveChapter = ch.id === chapterId
          const isOpen = openMap[ch.id]
          const locked = Boolean(ch.isLocked)
          return (
            <div key={ch.id} className="mb-0.5">
              <button
                disabled={locked}
                onClick={() => { if (!locked) { toggleChapter(ch.id); onNavigateChapter(ch.id) } }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActiveChapter
                    ? 'bg-indigo-600/20 text-indigo-200'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
                }`}
              >
                <span className={`text-[10px] font-bold shrink-0 w-6 h-5 flex items-center justify-center rounded-md ${
                  isActiveChapter ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/[0.06] text-white/30'
                }`}>{ch.id}</span>
                <span className="text-xs font-medium flex-1 truncate">{ch.title}</span>
                {locked ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0 opacity-30">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180 opacity-60' : 'opacity-30'}`}>
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
              </button>

              {isOpen && !locked && (
                <div className="mt-0.5 ml-3 pl-3 border-l border-white/[0.07] space-y-0.5 mb-1">
                  {(ch.sections || []).map(sec => {
                    const sectionKey = `${subjectMeta.subject}:${ch.id}:${sec.id}`
                    const active = isActiveChapter && activeSectionId === sec.id
                    const bookmarked = isBookmarked(sectionKey)
                    const read = isSectionRead?.(sectionKey)
                    return (
                      <button
                        key={sec.id}
                        onClick={() => onJumpSection(sec.id)}
                        ref={el => { if (el) sectionRefs.current[sec.id] = el }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[11px] transition-all flex items-center gap-2 ${
                          active
                            ? 'bg-indigo-500/15 text-indigo-200'
                            : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className={`shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                          bookmarked
                            ? 'bg-amber-500/20 text-amber-300'
                            : read
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/[0.06] text-white/20'
                        }`}>
                          {bookmarked ? '★' : read ? '✓' : ''}
                        </span>
                        <span className="leading-relaxed">{sec.heading}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

const ChapterSidebar = memo(ChapterSidebarBase)
export default ChapterSidebar
