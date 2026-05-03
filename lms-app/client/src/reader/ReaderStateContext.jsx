import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ReaderStateContext = createContext(null)
const STORAGE_KEY = 'lexisai.reader.state.v1'

function readStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { highlights: {}, notes: {}, bookmarks: {} }
    return JSON.parse(raw)
  } catch {
    return { highlights: {}, notes: {}, bookmarks: {} }
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

  const value = useMemo(() => ({
    state,
    toggleBookmark,
    isBookmarked,
    addHighlight,
    getHighlights,
    setSectionNote,
    getSectionNote,
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
