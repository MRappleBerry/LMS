import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ReaderStateContext = createContext(null)
const STORAGE_KEY = 'lexisai.reader.state.v1'

function readStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { highlights: {}, notes: {}, bookmarks: {}, completedSections: {}, quizStats: {} }
    return JSON.parse(raw)
  } catch {
    return { highlights: {}, notes: {}, bookmarks: {}, completedSections: {}, quizStats: {} }
  }
}

export function ReaderStateProvider({ children }) {
  const [state, setState] = useState(() => readStoredState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function toggleBookmark(sectionKey) {
    setState(prev => {
      const bookmarks = { ...prev.bookmarks }
      if (bookmarks[sectionKey]) delete bookmarks[sectionKey]
      else bookmarks[sectionKey] = true
      return { ...prev, bookmarks }
    })
  }

  function isBookmarked(sectionKey) {
    return Boolean(state.bookmarks[sectionKey])
  }

  function addHighlight(sectionKey, snippet) {
    const clean = (snippet || '').trim()
    if (!clean) return
    setState(prev => {
      const existing = prev.highlights[sectionKey] || []
      if (existing.includes(clean)) return prev
      return {
        ...prev,
        highlights: {
          ...prev.highlights,
          [sectionKey]: [...existing, clean],
        },
      }
    })
  }

  function getHighlights(sectionKey) {
    return state.highlights[sectionKey] || []
  }

  function setSectionNote(sectionKey, text) {
    setState(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [sectionKey]: text,
      },
    }))
  }

  function getSectionNote(sectionKey) {
    return state.notes[sectionKey] || ''
  }

  function markSectionRead(sectionKey) {
    if (!sectionKey) return
    setState(prev => {
      if (prev.completedSections?.[sectionKey]) return prev
      return {
        ...prev,
        completedSections: {
          ...(prev.completedSections || {}),
          [sectionKey]: Date.now(),
        },
      }
    })
  }

  function isSectionRead(sectionKey) {
    return Boolean(state.completedSections?.[sectionKey])
  }

  function recordQuizResult(sectionKey, correct) {
    if (!sectionKey) return
    setState(prev => {
      const current = prev.quizStats?.[sectionKey] || { attempted: 0, correct: 0, wrong: 0 }
      const next = {
        attempted: current.attempted + 1,
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      }
      return {
        ...prev,
        quizStats: {
          ...(prev.quizStats || {}),
          [sectionKey]: next,
        },
      }
    })
  }

  function getQuizStats(sectionKey) {
    return state.quizStats?.[sectionKey] || { attempted: 0, correct: 0, wrong: 0 }
  }

  function getLearningInsights(subjectMeta) {
    const chapters = subjectMeta?.chapters || []
    const sectionKeys = []

    for (const ch of chapters) {
      for (const sec of ch.sections || []) {
        sectionKeys.push(`${subjectMeta.subject}:${ch.id}:${sec.id}`)
      }
    }

    const totalSections = sectionKeys.length || 1
    const completed = sectionKeys.filter(key => state.completedSections?.[key]).length
    const progressPct = Math.round((completed / totalSections) * 100)

    let recommendedNext = null
    for (const ch of chapters) {
      const firstUnread = (ch.sections || []).find(sec => !state.completedSections?.[`${subjectMeta.subject}:${ch.id}:${sec.id}`])
      if (firstUnread) {
        recommendedNext = {
          chapterId: ch.id,
          sectionId: firstUnread.id,
          title: firstUnread.heading,
        }
        break
      }
    }

    const weakAreas = sectionKeys
      .map(key => ({ key, stats: state.quizStats?.[key] || { attempted: 0, wrong: 0 } }))
      .filter(item => item.stats.attempted >= 1)
      .sort((a, b) => (b.stats.wrong / Math.max(1, b.stats.attempted)) - (a.stats.wrong / Math.max(1, a.stats.attempted)))
      .slice(0, 3)
      .map(item => {
        const [, chapterId, sectionId] = item.key.split(':')
        const chapter = chapters.find(ch => String(ch.id) === String(chapterId))
        const section = chapter?.sections?.find(sec => String(sec.id) === String(sectionId))
        return {
          chapterId,
          sectionId,
          title: section?.heading || sectionId,
          wrongRate: Math.round((item.stats.wrong / Math.max(1, item.stats.attempted)) * 100),
        }
      })

    return { progressPct, completed, totalSections, recommendedNext, weakAreas }
  }

  const value = useMemo(() => ({
    state,
    toggleBookmark,
    isBookmarked,
    addHighlight,
    getHighlights,
    setSectionNote,
    getSectionNote,
    markSectionRead,
    isSectionRead,
    recordQuizResult,
    getQuizStats,
    getLearningInsights,
  }), [state])

  return (
    <ReaderStateContext.Provider value={value}>
      {children}
    </ReaderStateContext.Provider>
  )
}

export function useReaderState() {
  const ctx = useContext(ReaderStateContext)
  if (!ctx) throw new Error('useReaderState must be used inside ReaderStateProvider')
  return ctx
}
