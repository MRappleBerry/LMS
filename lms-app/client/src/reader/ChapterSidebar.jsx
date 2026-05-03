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
    ? 'w-72 max-w-[84vw] shrink-0 border-r border-md-outline/50 bg-md-surf2 h-full min-h-0 overflow-y-auto'
    : 'hidden lg:block w-72 shrink-0 border-r border-md-outline/50 bg-md-surf2/70 backdrop-blur sticky top-0 h-full min-h-0 overflow-y-auto'

  return (
    <aside ref={scrollRef} onScroll={handleSidebarScroll} className={asideClass}>
      <div className="p-4 border-b border-md-outline/50">
        <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Subject</div>
        <h2 className="mt-1 text-sm font-semibold text-md-onsurf">{subjectMeta.title}</h2>
        <p className="text-[11px] text-md-onsurfvar mt-1">Year: {subjectMeta.yearLevel || 'N/A'}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {YEAR_OPTIONS.map(y => (
            <button
              key={y}
              onClick={() => onYearFilterChange?.(y)}
              className={`px-2 py-1 text-[10px] rounded-lg border transition-colors ${
                yearFilter === y
                  ? 'bg-md-primarycon border-md-primary/50 text-md-onprimarycon'
                  : 'bg-md-surf border-md-outline/50 text-md-onsurfvar'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-1">
          {filteredSubjects.map(s => (
            <button
              key={s.id || s.subject}
              onClick={() => onSubjectNavigate?.(s.id || s.subject)}
              className={`w-full px-2.5 py-2 rounded-lg text-left text-xs border transition-colors ${
                (s.id || s.subject) === subjectMeta.subject
                  ? 'bg-md-primarycon border-md-primary/50 text-md-onprimarycon'
                  : 'bg-md-surf3 border-md-outline/40 text-md-onsurfvar hover:text-md-onsurf'
              }`}
            >
              <div className="font-medium truncate">{s.title}</div>
              <div className="text-[10px] opacity-70">{s.yearLevel || 'N/A'}</div>
            </button>
          ))}
        </div>

        {learningInsights && (
          <div className="mt-3 bg-md-surf3 border border-md-outline/40 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-md-onsurfvar">Progress</span>
              <span className="text-md-primary font-semibold">{learningInsights.progressPct}%</span>
            </div>
            <div className="h-1.5 bg-md-surf rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-md-primary to-md-secondary" style={{ width: `${learningInsights.progressPct}%` }} />
            </div>
            {learningInsights.recommendedNext && (
              <div className="text-[11px] text-md-onsurfvar">
                Next: <span className="text-md-onsurf">{learningInsights.recommendedNext.title}</span>
              </div>
            )}
            {learningInsights.weakAreas?.length > 0 && (
              <div className="text-[11px] text-md-onsurfvar">
                Weak: <span className="text-red-300">{learningInsights.weakAreas[0].title}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-2">
        {chapters.map(ch => {
          const isActiveChapter = ch.id === chapterId
          const isOpen = openMap[ch.id]
          return (
            <div key={ch.id} className="mb-1">
              <button
                onClick={() => { toggleChapter(ch.id); onNavigateChapter(ch.id) }}
                className={`ripple-root w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                  isActiveChapter ? 'bg-md-primarycon text-md-onprimarycon' : 'text-md-onsurf hover:bg-md-surf3'
                }`}
              >
                <span className="text-xs font-semibold opacity-70">Ch {ch.id}</span>
                <span className="text-sm font-medium truncate">{ch.title}</span>
                <span className="ml-auto text-xs opacity-60">{isOpen ? '▾' : '▸'}</span>
              </button>

              {isOpen && (
                <div className="mt-1 space-y-0.5 pl-2">
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
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-start gap-2 ${
                          active ? 'bg-md-surf3 text-md-onsurf' : 'text-md-onsurfvar hover:text-md-onsurf hover:bg-md-surf3/70'
                        }`}
                      >
                        <span className="mt-0.5">{bookmarked ? '★' : read ? '✓' : '•'}</span>
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
