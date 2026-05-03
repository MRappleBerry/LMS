import { memo, useMemo, useState } from 'react'
import { useReaderState } from './ReaderStateContext'

function ChapterSidebarBase({ subjectMeta, chapterId, activeSectionId, onNavigateChapter, onJumpSection }) {
  const { isBookmarked } = useReaderState()
  const [openMap, setOpenMap] = useState(() => {
    const initial = {}
    for (const ch of subjectMeta.chapters) initial[ch.id] = ch.id === chapterId
    return initial
  })

  const chapters = useMemo(() => subjectMeta.chapters || [], [subjectMeta])

  function toggleChapter(id) {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-md-outline/50 bg-md-surf2/70 backdrop-blur sticky top-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-md-outline/50">
        <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Subject</div>
        <h2 className="mt-1 text-sm font-semibold text-md-onsurf">{subjectMeta.title}</h2>
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
                  {ch.sections.map(sec => {
                    const sectionKey = `${subjectMeta.subject}:${ch.id}:${sec.id}`
                    const active = isActiveChapter && activeSectionId === sec.id
                    const bookmarked = isBookmarked(sectionKey)
                    return (
                      <button
                        key={sec.id}
                        onClick={() => onJumpSection(sec.id)}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-start gap-2 ${
                          active ? 'bg-md-surf3 text-md-onsurf' : 'text-md-onsurfvar hover:text-md-onsurf hover:bg-md-surf3/70'
                        }`}
                      >
                        <span className="mt-0.5">{bookmarked ? '★' : '•'}</span>
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
