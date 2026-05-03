import { useEffect, useMemo, useState } from 'react'
import { getDefaultRoute, getSubjectMeta, loadChapterContent } from '../data/books/catalog'
import { ReaderStateProvider, useReaderState } from '../reader/ReaderStateContext'
import ChapterSidebar from '../reader/ChapterSidebar'
import ReaderContent from '../reader/ReaderContent'
import AIAssistantPanel from '../reader/AIAssistantPanel'

function ReaderPageInner({ subject, chapterId, onNavigatePath, mobileNavOpen, onCloseMobileNav }) {
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('')
  const [selection, setSelection] = useState(null)
  const [request, setRequest] = useState(null)
  const [progress, setProgress] = useState(0)
  const [barExamMode, setBarExamMode] = useState(true)

  const { addHighlight, markSectionRead, recordQuizResult, getLearningInsights, isSectionRead } = useReaderState()

  const subjectMeta = useMemo(() => getSubjectMeta(subject), [subject])
  const learningInsights = useMemo(() => {
    if (!subjectMeta) return null
    return getLearningInsights(subjectMeta)
  }, [subjectMeta, getLearningInsights, progress, chapterId])

  useEffect(() => {
    if (!subjectMeta) return
    let mounted = true

    async function fetchChapter() {
      setLoading(true)
      setError('')
      const data = await loadChapterContent(subject, chapterId)
      if (!mounted) return
      setChapter(data)
      setLoading(false)
    }

    fetchChapter()
    return () => { mounted = false }
  }, [subject, chapterId, subjectMeta])

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-progress', `${progress}%`)
  }, [progress])

  if (!subjectMeta) {
    const fallback = getDefaultRoute()
    return (
      <div className="h-full flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-md-onsurfvar mb-3">Unknown subject route.</p>
          <button
            onClick={() => onNavigatePath(`/course/${fallback.subject}/chapter/${fallback.chapterId}`)}
            className="px-4 py-2 rounded-xl bg-md-primarydim text-white text-sm"
          >
            Go to Reader Home
          </button>
        </div>
      </div>
    )
  }

  function navigateChapter(nextChapterId) {
    if (nextChapterId === chapterId) return
    onNavigatePath(`/course/${subject}/chapter/${nextChapterId}`)
    onCloseMobileNav?.()
  }

  function jumpToSection(sectionId) {
    const target = document.getElementById(`sec-${sectionId}`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onCloseMobileNav?.()
  }

  function explainSelection(text, sectionId) {
    if (!text?.trim()) return
    setRequest({
      context: text,
      sectionId,
      instruction: 'Explain this paragraph in simple terms, then give one concrete legal example, then explain bar exam relevance and a concise model answer approach.',
      at: Date.now(),
    })
    setSelection(null)
  }

  function handleHighlightSelection() {
    if (!selection?.text || !selection?.sectionId) return
    const key = `${subject}:${chapterId}:${selection.sectionId}`
    addHighlight(key, selection.text)
    setSelection(null)
  }

  function quickExplain(instruction) {
    const sourceSection = chapter?.sections?.find(s => s.id === activeSectionId)
    if (!sourceSection) return
    setRequest({
      context: sourceSection.content,
      sectionId: sourceSection.id,
      instruction,
      at: Date.now(),
    })
  }

  function handleCaseExplain(cs, section) {
    const context = `Case: ${cs.name}\nDoctrine: ${cs.doctrine || ''}\nFacts: ${cs.facts || ''}\nSection: ${section.heading}`
    setRequest({
      context,
      sectionId: section.id,
      instruction: 'Explain this case in simple terms for a law student, identify the doctrine, and add one bar exam issue-spotting tip.',
      at: Date.now(),
    })
  }

  function handlePractice(sec) {
    setRequest({
      context: sec.content,
      sectionId: sec.id,
      instruction: 'Generate 2 bar-style practice questions with concise model answers and common mistakes.',
      at: Date.now(),
    })
  }

  function handleActiveSectionChange(sectionId) {
    setActiveSectionId(sectionId)
    markSectionRead(`${subject}:${chapterId}:${sectionId}`)
  }

  return (
    <div className="h-full min-h-0 flex overflow-hidden">
      <ChapterSidebar
        subjectMeta={subjectMeta}
        chapterId={chapterId}
        activeSectionId={activeSectionId}
        onNavigateChapter={navigateChapter}
        onJumpSection={jumpToSection}
        mode="desktop"
        learningInsights={learningInsights}
        isSectionRead={isSectionRead}
      />

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <ChapterSidebar
            subjectMeta={subjectMeta}
            chapterId={chapterId}
            activeSectionId={activeSectionId}
            onNavigateChapter={navigateChapter}
            onJumpSection={jumpToSection}
            mode="mobile"
            learningInsights={learningInsights}
            isSectionRead={isSectionRead}
          />
          <button
            aria-label="Close chapter navigation"
            className="flex-1 bg-black/60"
            onClick={() => onCloseMobileNav?.()}
          />
        </div>
      )}

      {loading && (
        <div className="flex-1 min-h-0 overflow-y-auto p-8 space-y-4">
          <div className="skeleton h-6 w-56" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
        </div>
      )}

      {error && !loading && (
        <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center text-md-error text-sm">{error}</div>
      )}

      {chapter && !loading && (
        <div className="flex-1 min-w-0 h-full min-h-0 flex flex-col">
          {chapter.isDummy && (
            <div className="shrink-0 px-4 py-2 text-[11px] text-amber-300 bg-amber-500/10 border-b border-amber-500/30">
              Draft content loaded: this chapter is currently using dummy text.
            </div>
          )}
          <div className="shrink-0 px-4 py-2 border-b border-md-outline/40 flex items-center justify-between">
            <span className="text-xs text-md-onsurfvar">Learning System</span>
            <button
              onClick={() => setBarExamMode(v => !v)}
              className={`text-xs px-2.5 py-1 rounded-lg border ${barExamMode ? 'bg-md-primarycon border-md-primary/50 text-md-onprimarycon' : 'bg-md-surf2 border-md-outline/50 text-md-onsurfvar'}`}
            >
              {barExamMode ? 'Bar Exam Mode: ON' : 'Bar Exam Mode: OFF'}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ReaderContent
              chapter={chapter}
              subject={subject}
              chapterId={chapterId}
              onSelection={setSelection}
              onActiveSectionChange={handleActiveSectionChange}
              onProgress={setProgress}
              barExamMode={barExamMode}
              onCaseExplain={handleCaseExplain}
              onRequestPractice={handlePractice}
              onQuizResult={recordQuizResult}
            />
          </div>
        </div>
      )}

      <AIAssistantPanel
        subject={subject}
        chapterId={chapterId}
        sectionId={activeSectionId}
        request={request}
        onQuickExplain={quickExplain}
        learningInsights={learningInsights}
      />

      {selection?.text && (
        <div className="fixed z-50 bottom-24 right-4 lg:right-[390px] bg-md-surf2 border border-md-outline/60 rounded-2xl shadow-elev3 w-[320px] p-3 animate-scale-in">
          <div className="text-[10px] text-md-onsurfvar uppercase tracking-widest mb-1">Selected Text</div>
          <p className="text-xs text-md-onsurf max-h-14 overflow-hidden">{selection.text}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => explainSelection(selection.text, selection.sectionId)} className="ripple-root flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-md-primarydim hover:bg-md-primary text-white">
              Explain with AI
            </button>
            <button onClick={handleHighlightSelection} className="ripple-root flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40">
              Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReaderPage(props) {
  return (
    <ReaderStateProvider>
      <ReaderPageInner {...props} />
    </ReaderStateProvider>
  )
}
