import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { buildDummyChapter, getDefaultRoute, getSubjectMeta } from '../data/books/catalog'
import { fetchChaptersBySubject, fetchSubjectsByYear, fetchTopic, fetchYears } from '../lib/curriculumApi'
import { ReaderStateProvider, useReaderState } from '../reader/ReaderStateContext'
import ChapterSidebar from '../reader/ChapterSidebar'
import ReaderContent from '../reader/ReaderContent'
import AIAssistantPanel from '../reader/AIAssistantPanel'

const READER_FOCUS_KEY = 'lexisai.reader.focus-mode'
const READER_FONT_KEY = 'lexisai.reader.font-scale'

function ReaderPageInner({ subject, chapterId, onNavigatePath, mobileNavOpen, onCloseMobileNav }) {
  const [years, setYears] = useState([])
  const [subjects, setSubjects] = useState([])
  const [subjectMeta, setSubjectMeta] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('')
  const [selection, setSelection] = useState(null)
  const [request, setRequest] = useState(null)
  const [progress, setProgress] = useState(0)
  const [barExamMode, setBarExamMode] = useState(true)
  const [yearFilter, setYearFilter] = useState('All')
  const [capabilities, setCapabilities] = useState({ canUseQuiz: true, canUseBarExam: true, canUseAI: true })
  const [access, setAccess] = useState(null)
  const [focusMode, setFocusMode] = useState(() => {
    try { return localStorage.getItem(READER_FOCUS_KEY) === 'true' } catch { return false }
  })
  const [fontScale, setFontScale] = useState(() => {
    try {
      const raw = Number(localStorage.getItem(READER_FONT_KEY))
      return Number.isFinite(raw) && raw >= 0.9 && raw <= 1.3 ? raw : 1
    } catch {
      return 1
    }
  })

  const { addHighlight, markSectionRead, recordQuizResult, getLearningInsights, isSectionRead } = useReaderState()

  const fallbackMeta = useMemo(() => getSubjectMeta(subject), [subject])
  const resolvedSubjectMeta = subjectMeta || fallbackMeta
  const learningInsights = useMemo(() => {
    if (!resolvedSubjectMeta) return null
    return getLearningInsights(resolvedSubjectMeta)
  }, [resolvedSubjectMeta, getLearningInsights, progress, chapterId])

  function yearLabelToParam(label) {
    if (!label || label === 'All') return null
    if (label.startsWith('1')) return 1
    if (label.startsWith('2')) return 2
    if (label.startsWith('3')) return 3
    if (label.startsWith('4')) return 4
    return null
  }

  useEffect(() => {
    let mounted = true
    fetchYears()
      .then(data => { if (mounted) setYears(data) })
      .catch(() => { if (mounted) setYears([{ id: 1, label: '1st Year' }, { id: 2, label: '2nd Year' }, { id: 3, label: '3rd Year' }, { id: 4, label: '4th Year' }]) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    const year = yearLabelToParam(yearFilter)
    fetchSubjectsByYear(year)
      .then(list => {
        if (!mounted) return
        setSubjects(list)
      })
      .catch(() => {
        if (!mounted) return
        const local = Object.values({ [subject]: fallbackMeta }).filter(Boolean).map(s => ({ id: s.subject, title: s.title, yearLevel: s.yearLevel }))
        setSubjects(local)
      })
    return () => { mounted = false }
  }, [yearFilter, subject, fallbackMeta])

  useEffect(() => {
    let mounted = true
    fetchChaptersBySubject(subject)
      .then(data => {
        if (!mounted) return
        setCapabilities(data?.capabilities || { canUseQuiz: true, canUseBarExam: true, canUseAI: true })
        setAccess(data?.access || null)
        setSubjectMeta({
          subject: data.subject,
          title: data.title,
          yearLevel: data.yearLevel,
          chapters: data.chapters,
        })
      })
      .catch((err) => {
        if (!mounted) return
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          onNavigatePath('/login')
          return
        }
        if (fallbackMeta) setSubjectMeta(fallbackMeta)
      })
    return () => { mounted = false }
  }, [subject, fallbackMeta])

  useEffect(() => {
    if (!resolvedSubjectMeta) return
    let mounted = true

    async function fetchChapter() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchTopic(subject, chapterId)
        if (!mounted) return
        setCapabilities(data?.capabilities || { canUseQuiz: true, canUseBarExam: true, canUseAI: true })
        setAccess(data?.access || null)
        if (data?.capabilities?.canUseBarExam === false) {
          setBarExamMode(false)
        }
        setChapter(data)
      } catch (err) {
        if (!mounted) return
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          onNavigatePath('/login')
          return
        }
        if (axios.isAxiosError(err) && err.response?.status === 402) {
          const target = err.response?.data?.redirectTo || `/subject/${subject}`
          onNavigatePath(target)
          return
        }
        setChapter(buildDummyChapter(subject, chapterId))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchChapter()
    return () => { mounted = false }
  }, [subject, chapterId, resolvedSubjectMeta, yearFilter])

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-progress', `${progress}%`)
  }, [progress])

  useEffect(() => {
    try { localStorage.setItem(READER_FOCUS_KEY, String(focusMode)) } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent('lexisai:reader-focus-mode', { detail: { enabled: focusMode } }))
  }, [focusMode])

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent('lexisai:reader-focus-mode', { detail: { enabled: false } }))
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(READER_FONT_KEY, String(fontScale)) } catch { /* noop */ }
  }, [fontScale])

  if (!resolvedSubjectMeta) {
    const fallback = getDefaultRoute()
    return (
      <div className="h-full flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-md-onsurfvar mb-3">Unknown subject route.</p>
          <button
            onClick={() => onNavigatePath(`/subject/${fallback.subject}/chapter/${fallback.chapterId}`)}
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
    onNavigatePath(`/subject/${subject}/chapter/${nextChapterId}`)
    onCloseMobileNav?.()
  }

  function navigateSubject(nextSubject) {
    if (!nextSubject) return
    fetchChaptersBySubject(nextSubject)
      .then(data => {
        const firstChapterId = data?.chapters?.[0]?.id || '1'
        onNavigatePath(`/subject/${nextSubject}/chapter/${firstChapterId}`)
        onCloseMobileNav?.()
      })
      .catch(() => {
        const meta = getSubjectMeta(nextSubject)
        const firstChapterId = meta?.chapters?.[0]?.id || '1'
        onNavigatePath(`/subject/${nextSubject}/chapter/${firstChapterId}`)
        onCloseMobileNav?.()
      })
  }

  function handleYearFilterChange(next) {
    setYearFilter(next)
    const year = yearLabelToParam(next)
    if (!year) return
    fetchSubjectsByYear(year).then(list => {
      if (!list?.length) return
      if (list.some(s => s.id === subject)) return
      navigateSubject(list[0].id)
    }).catch(() => {})
  }

  function jumpToSection(sectionId) {
    const target = document.getElementById(`sec-${sectionId}`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onCloseMobileNav?.()
  }

  function explainSelection(text, sectionId) {
    if (!text?.trim()) return
    if (!capabilities.canUseAI) {
      setError('Free AI weekly limit reached. Upgrade to Premium for unlimited AI usage.')
      return
    }
    setRequest({
      context: text,
      sectionId,
      instruction: barExamMode
        ? 'Explain this paragraph concisely for bar prep, highlight issue-spotting cues, and give one exam tip plus a short model answer frame.'
        : 'Explain this paragraph in simple terms for a law student and give one concrete practical example.',
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
    if (!capabilities.canUseAI) {
      setError('Free AI weekly limit reached. Upgrade to Premium for unlimited AI usage.')
      return
    }
    setRequest({
      context: sourceSection.content,
      sectionId: sourceSection.id,
      instruction: barExamMode
        ? `${instruction} Keep it concise, issue-spotting focused, and include an exam tip.`
        : `${instruction} Use a clear learning explanation with one practical example.`,
      at: Date.now(),
    })
  }

  function handleCaseExplain(cs, section) {
    if (!capabilities.canUseAI) {
      setError('Free AI weekly limit reached. Upgrade to Premium for unlimited AI usage.')
      return
    }
    const context = `Case: ${cs.name}\nDoctrine: ${cs.doctrine || ''}\nFacts: ${cs.facts || ''}\nSection: ${section.heading}`
    setRequest({
      context,
      sectionId: section.id,
      instruction: 'Explain this case in simple terms for a law student, identify the doctrine, and add one bar exam issue-spotting tip.',
      at: Date.now(),
    })
  }

  function handlePractice(sec) {
    if (!capabilities.canUseAI) {
      setError('Free AI weekly limit reached. Upgrade to Premium for unlimited AI usage.')
      return
    }
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
      {!focusMode && (
      <ChapterSidebar
        subjectMeta={resolvedSubjectMeta}
        chapterId={chapterId}
        activeSectionId={activeSectionId}
        onNavigateChapter={navigateChapter}
        onJumpSection={jumpToSection}
        onSubjectNavigate={navigateSubject}
        mode="desktop"
        learningInsights={learningInsights}
        isSectionRead={isSectionRead}
        yearFilter={yearFilter}
        onYearFilterChange={handleYearFilterChange}
        subjects={subjects}
        yearOptions={years}
      />
      )}

      {mobileNavOpen && !focusMode && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <ChapterSidebar
            subjectMeta={resolvedSubjectMeta}
            chapterId={chapterId}
            activeSectionId={activeSectionId}
            onNavigateChapter={navigateChapter}
            onJumpSection={jumpToSection}
            onSubjectNavigate={navigateSubject}
            mode="mobile"
            learningInsights={learningInsights}
            isSectionRead={isSectionRead}
            yearFilter={yearFilter}
            onYearFilterChange={handleYearFilterChange}
            subjects={subjects}
            yearOptions={years}
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
            <button
              onClick={() => onNavigatePath(`/subject/${subject}`)}
              className="flex items-center gap-1.5 text-xs text-md-onsurfvar hover:text-md-onsurf transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Back
            </button>
            <div className="hidden md:flex items-center bg-md-surf2 border border-md-outline/50 rounded-xl px-2 py-1 gap-2 text-xs text-md-onsurfvar">
              <span>{resolvedSubjectMeta.title}</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="flex items-center bg-md-surf2 border border-md-outline/50 rounded-xl p-1 gap-1 text-xs">
              <button
                onClick={() => setBarExamMode(false)}
                className={`px-2.5 py-1 rounded-lg ${!barExamMode ? 'bg-md-primarycon text-md-onprimarycon' : 'text-md-onsurfvar'}`}
              >
                Study Mode
              </button>
              <button
                disabled={!capabilities.canUseBarExam}
                onClick={() => capabilities.canUseBarExam && setBarExamMode(true)}
                className={`px-2.5 py-1 rounded-lg ${barExamMode ? 'bg-md-primarycon text-md-onprimarycon' : 'text-md-onsurfvar'} ${!capabilities.canUseBarExam ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Bar Mode
              </button>
                <button
                  onClick={() => setFontScale(v => Math.max(0.9, Number((v - 0.05).toFixed(2))))}
                  className="px-2 py-1 rounded-lg text-md-onsurfvar hover:text-md-onsurf"
                  title="Decrease font size"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale(v => Math.min(1.3, Number((v + 0.05).toFixed(2))))}
                  className="px-2 py-1 rounded-lg text-md-onsurfvar hover:text-md-onsurf"
                  title="Increase font size"
                >
                  A+
                </button>
                <button
                  onClick={() => setFocusMode(v => !v)}
                  className={`px-2.5 py-1 rounded-lg ${focusMode ? 'bg-amber-500/20 text-amber-300' : 'text-md-onsurfvar hover:text-md-onsurf'}`}
                  title="Toggle focus mode"
                >
                  Focus
                </button>
            </div>
          </div>
          {!capabilities.canUseBarExam && (
            <div className="shrink-0 px-4 py-2 text-[11px] text-amber-300 bg-amber-500/10 border-b border-amber-500/30">
              Bar Exam mode and quiz mode are Premium features. Upgrade to unlock.
            </div>
          )}
          {access && (
            <div className="shrink-0 px-4 py-2 text-[11px] text-md-onsurfvar bg-md-surf2 border-b border-md-outline/40">
              {access.tier === 'premium'
                ? 'Premium active: full chapters and unlimited AI usage.'
                : `Free preview: ${access.weeklyPreviewUsedCount}/${access.weeklyPreviewLimit} subject used • AI ${access.aiPromptsUsed}/${access.aiPromptLimit} used • Resets in ${access.resetsInDays} day(s)`}
            </div>
          )}
          <div className="flex-1 min-h-0">
            <ReaderContent
              chapter={chapter}
              subject={subject}
              chapterId={chapterId}
              onSelection={setSelection}
              onActiveSectionChange={handleActiveSectionChange}
              onProgress={setProgress}
              barExamMode={barExamMode}
              yearFilter={yearFilter}
              subjectYearLevel={resolvedSubjectMeta.yearLevel}
              onCaseExplain={handleCaseExplain}
              onRequestPractice={handlePractice}
              onQuizResult={recordQuizResult}
              featureFlags={capabilities}
              fontScale={fontScale}
              focusMode={focusMode}
            />
          </div>
        </div>
      )}

      {!focusMode && (
      <AIAssistantPanel
        subject={subject}
        chapterId={chapterId}
        sectionId={activeSectionId}
        request={request}
        onQuickExplain={quickExplain}
        learningInsights={learningInsights}
        canUseAI={capabilities.canUseAI}
      />
      )}

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
