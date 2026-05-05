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
  barExamMode,
  yearFilter,
  subjectYearLevel,
  onCaseExplain,
  onRequestPractice,
  onQuizResult,
  featureFlags,
  fontScale = 1,
  focusMode = false,
}) {
  const { toggleBookmark, isBookmarked, getHighlights } = useReaderState()
  const containerRef = useRef(null)
  const [activeSectionId, setActiveSectionId] = useState(chapter.sections?.[0]?.id || '')
  const [quizChoice, setQuizChoice] = useState({})
  const [quizShown, setQuizShown] = useState({})

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

  function withBarMeta(sec) {
    const freq = (sec.barFrequency || sec.barExam?.frequency || 'medium').toLowerCase()
    const canUseBarExam = featureFlags?.canUseBarExam !== false
    const canUseQuiz = featureFlags?.canUseQuiz !== false
    return {
      ...sec,
      yearLevel: sec.yearLevel || subjectYearLevel || '1st Year',
      difficulty: (sec.difficulty || 'medium').toLowerCase(),
      barFrequency: freq,
      barExam: canUseBarExam
        ? (sec.barExam || {
            frequency: 'Medium',
            commonTraps: ['Confusing requisites with effects', 'Skipping key exceptions'],
            sampleAnswer: 'State the doctrine, enumerate requisites, apply to facts, and conclude briefly.',
          })
        : null,
      cases: sec.cases || [
        {
          name: 'Landmark Doctrine Case',
          doctrine: 'Core doctrine application',
          facts: 'Placeholder facts for case-learning mode.',
        },
      ],
      quiz: canUseQuiz
        ? (sec.quiz || {
            question: `Which statement best captures the core doctrine in "${sec.heading}"?`,
            options: ['A principle with no exceptions', 'A rule requiring analysis of requisites and exceptions', 'A purely procedural guideline', 'A doctrine irrelevant to bar exams'],
            answerIndex: 1,
            explanation: 'Bar exam answers are strongest when you identify requisites and exceptions before applying facts.',
          })
        : null,
    }
  }

  const visibleSections = useMemo(() => {
    const mapped = sections.map(withBarMeta)
    if (!yearFilter || yearFilter === 'All') return mapped
    return mapped.filter(sec => sec.yearLevel === yearFilter)
  }, [sections, yearFilter, subjectYearLevel])

  function submitQuiz(sectionKey, quiz) {
    const selected = quizChoice[sectionKey]
    if (selected === undefined || selected === null) return
    const correct = Number(selected) === Number(quiz.answerIndex)
    setQuizShown(prev => ({ ...prev, [sectionKey]: true }))
    onQuizResult?.(sectionKey, correct)
  }

  const activeIndex = visibleSections.findIndex(sec => sec.id === activeSectionId)
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex >= 0 && activeIndex < visibleSections.length - 1

  function jumpToSectionByIndex(nextIndex) {
    const target = visibleSections[nextIndex]
    if (!target) return
    const el = document.getElementById(`sec-${target.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSectionId(target.id)
    onActiveSectionChange(target.id)
  }

  const contentStyle = {
    fontSize: `${1.06 * fontScale}rem`,
    lineHeight: `${2 * Math.max(1, fontScale * 0.95)}rem`,
  }

  return (
    <section className="flex-1 min-w-0 relative h-full">
      <div className="absolute top-0 left-0 right-0 h-1 bg-md-surf3 z-20">
        <div className="h-full bg-gradient-to-r from-md-primary to-md-secondary transition-[width] duration-200" style={{ width: 'var(--reader-progress, 0%)' }} />
      </div>

      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onScroll={handleScroll}
        className={`h-full overflow-y-auto px-5 py-8 md:py-10 ${focusMode ? 'md:px-14' : 'md:px-10'}`}
      >
        <article className={`${focusMode ? 'max-w-4xl' : 'max-w-3xl'} mx-auto animate-fade-in pb-24`}>
          <header className="mb-8 pb-6 border-b border-md-outline/40">
            <div className="text-xs uppercase tracking-[0.22em] text-md-onsurfvar">{subject}</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-md-onsurf font-reader leading-tight">
              {chapter.title}
            </h1>
            <p className="mt-3 text-sm text-md-onsurfvar">Chapter {chapterId} • Structured law book content • No PDF renderer</p>
          </header>

          <div className="space-y-12">
            {visibleSections.length === 0 && (
              <div className="bg-md-surf2 border border-md-outline/50 rounded-2xl p-4 text-sm text-md-onsurfvar">
                No sections match the selected year filter.
              </div>
            )}

            {visibleSections.map(sec => {
              const sectionKey = `${subject}:${chapterId}:${sec.id}`
              const highlights = getHighlights(sectionKey)
              const answerShown = Boolean(quizShown[sectionKey])
              const selected = quizChoice[sectionKey]
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

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-md-surf2 border border-md-outline/50 text-md-onsurfvar">Year: {sec.yearLevel}</span>
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${
                      sec.difficulty === 'hard' ? 'bg-red-900/25 border-red-900/50 text-red-300' :
                      sec.difficulty === 'easy' ? 'bg-emerald-900/25 border-emerald-900/50 text-emerald-300' :
                      'bg-amber-900/25 border-amber-900/50 text-amber-300'
                    }`}>Difficulty: {sec.difficulty}</span>
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${
                      sec.barFrequency === 'high' ? 'bg-red-900/25 border-red-900/50 text-red-300' :
                      sec.barFrequency === 'low' ? 'bg-emerald-900/25 border-emerald-900/50 text-emerald-300' :
                      'bg-amber-900/25 border-amber-900/50 text-amber-300'
                    }`}>Bar Frequency: {sec.barFrequency}</span>
                  </div>

                  <div className="text-md-onsurf/95 font-reader whitespace-pre-line" style={contentStyle}>
                    {renderWithHighlights(sec.content, highlights)}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onRequestPractice?.(sec)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 hover:bg-amber-500/25"
                    >
                      AI Summary
                    </button>
                  </div>

                  {barExamMode && sec.barExam && (
                    <div className="mt-4 bg-md-surf2 border border-md-outline/50 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Bar Exam Mode</div>
                        <span className={`text-[11px] px-2 py-1 rounded-full ${
                          sec.barFrequency === 'high' ? 'bg-red-900/30 text-red-300' :
                          sec.barFrequency === 'medium' ? 'bg-amber-900/30 text-amber-300' :
                          'bg-emerald-900/30 text-emerald-300'
                        }`}>Frequency: {sec.barFrequency}</span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-md-onsurf mb-1">Common Traps</p>
                        <ul className="text-xs text-md-onsurfvar space-y-1 list-disc pl-4">
                          {sec.barExam.commonTraps.map((trap, idx) => <li key={idx}>{trap}</li>)}
                        </ul>
                      </div>

                      <div className="text-xs text-md-onsurf">
                        <span className="font-semibold">Sample Answer Strategy:</span> {sec.barExam.sampleAnswer}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 bg-md-surf2 border border-md-outline/50 rounded-2xl p-4 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Landmark Cases</div>
                    {sec.cases.map((cs, i) => (
                      <div key={`${cs.name}-${i}`} className="bg-md-surf3 border border-md-outline/40 rounded-xl p-3">
                        <div className="text-sm text-md-onsurf font-semibold">{cs.name}</div>
                        <div className="text-xs text-md-onsurfvar mt-1">Doctrine: {cs.doctrine}</div>
                        {cs.facts && <div className="text-xs text-md-onsurfvar mt-1">Facts: {cs.facts}</div>}
                        <button
                          onClick={() => onCaseExplain?.(cs, sec)}
                          className="mt-2 ripple-root px-3 py-1.5 text-xs rounded-lg bg-md-primarycon text-md-onprimarycon hover:bg-md-primarycon/80"
                        >
                          Explain Case Simply
                        </button>
                      </div>
                    ))}
                  </div>

                  {sec.quiz ? (
                    <div className="mt-4 bg-md-surf2 border border-md-outline/50 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Section Quiz</div>
                        <button
                          onClick={() => onRequestPractice?.(sec)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-md-primarycon text-md-onprimarycon hover:bg-md-primarycon/80"
                        >
                          AI Practice Question
                        </button>
                      </div>
                      <p className="text-sm text-md-onsurf">{sec.quiz.question}</p>
                      <div className="space-y-2">
                        {sec.quiz.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setQuizChoice(prev => ({ ...prev, [sectionKey]: i }))}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                              selected === i ? 'bg-md-primarycon text-md-onprimarycon border-md-primary/50' : 'bg-md-surf3 text-md-onsurfvar border-md-outline/40 hover:text-md-onsurf'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => submitQuiz(sectionKey, sec.quiz)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-md-primarydim text-white hover:bg-md-primary"
                        >
                          Submit Quiz
                        </button>
                        {answerShown && (
                          <span className="text-xs text-md-onsurfvar">
                            {selected === sec.quiz.answerIndex ? 'Correct.' : 'Not quite.'} {sec.quiz.explanation}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200">
                      Quiz mode is locked in Free Preview. Upgrade to Premium to unlock section quizzes and bar simulation.
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </article>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-md-outline/50 bg-[#0f1627]/90 backdrop-blur px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            onClick={() => jumpToSectionByIndex(activeIndex - 1)}
            disabled={!hasPrev}
            className="h-10 px-4 rounded-xl border border-md-outline/60 bg-md-surf2 text-xs font-semibold text-md-onsurfvar disabled:opacity-40"
          >
            Previous Lesson
          </button>
          <div className="flex-1 text-center text-[11px] text-md-onsurfvar truncate">
            {activeSectionId ? `Section ${activeSectionId}` : 'Start reading'}
          </div>
          <button
            onClick={() => jumpToSectionByIndex(activeIndex + 1)}
            disabled={!hasNext}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold disabled:opacity-40"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </section>
  )
}

const ReaderContent = memo(ReaderContentBase)
export default ReaderContent
