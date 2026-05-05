import { useEffect, useMemo, useState } from 'react'
import { fetchSubjectsByYearWithAccess } from '../lib/curriculumApi'

const READER_STATE_KEY = 'lexisai.reader.state.v1'
const LAST_READER_KEY = 'lexisai.last.reader'

function readReaderState() {
  try {
    const raw = localStorage.getItem(READER_STATE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed.completedSections || {}
  } catch {
    return {}
  }
}

function readLastReader() {
  try {
    const raw = localStorage.getItem(LAST_READER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function masteryLabel(progress) {
  if (progress >= 80) return 'Advanced'
  if (progress >= 50) return 'Intermediate'
  return 'Beginner'
}

export default function Dashboard({ onNavigate, onNavigatePath, user }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSubjectsByYearWithAccess(null)
      .then(data => {
        if (!mounted) return
        setSubjects(data?.subjects || [])
      })
      .catch(() => {
        if (mounted) setSubjects([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const computed = useMemo(() => {
    const completed = readReaderState()
    return subjects.map(subject => {
      const prefix = `${subject.id}:`
      const keys = Object.keys(completed).filter(k => k.startsWith(prefix))
      const completedCount = keys.length
      const estimatedLessons = Math.max(6, Number(subject.chapterCount || 1) * 3)
      const progress = Math.min(100, Math.round((completedCount / estimatedLessons) * 100))
      const remaining = Math.max(0, estimatedLessons - completedCount)
      return {
        ...subject,
        completedCount,
        estimatedLessons,
        remaining,
        progress,
      }
    })
      .sort((a, b) => {
        if (a.completedCount > 0 && b.completedCount === 0) return -1
        if (b.completedCount > 0 && a.completedCount === 0) return 1
        return b.progress - a.progress
      })
  }, [subjects])

  const lastReader = useMemo(() => readLastReader(), [])
  const continueSubject = useMemo(() => {
    if (!computed.length) return null
    if (lastReader?.subjectId) {
      const match = computed.find(s => s.id === lastReader.subjectId)
      if (match) return match
    }
    return computed[0]
  }, [computed, lastReader])

  const continuePath = lastReader?.path || (continueSubject ? `/subject/${continueSubject.id}` : '/year/1')
  const nextLesson = continueSubject ? `Chapter ${lastReader?.chapterId || 1}` : 'No lesson yet'
  const heroRemaining = Math.max(0, continueSubject?.remaining || 0)
  const todayGoalRemaining = Math.min(6, continueSubject?.remaining || 0)
  const todayGoalMins = Math.max(20, todayGoalRemaining * 12)
  const todayGoalPct = Math.max(10, Math.min(100, Math.round(((6 - todayGoalRemaining) / 6) * 100)))

  return (
    <div className="px-4 pb-6 pt-3 bg-[radial-gradient(900px_350px_at_50%_-8%,rgba(245,158,11,0.12),transparent),radial-gradient(1200px_420px_at_10%_0%,rgba(15,23,42,0.78),transparent)] space-y-5">
      <div className="text-[11px] uppercase tracking-[0.24em] text-orange-300/70">Lexis AI • Focus Dashboard</div>

      <section className="relative overflow-hidden rounded-3xl border border-[#27406f] bg-gradient-to-br from-[#0c1930] via-[#0a2340] to-[#10284c] p-6 shadow-[0_20px_50px_rgba(2,12,27,0.65)]">
        <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative">
          <h1 className="mt-1 text-3xl md:text-4xl font-reader font-bold text-white leading-tight">
            Continue Study
          </h1>
          <p className="mt-2 text-sm text-blue-100/80">
            {continueSubject?.title || 'Load your first subject'} • Last lesson: {nextLesson}
          </p>
          <p className="mt-1 text-xs text-orange-200/80">{heroRemaining} lessons remaining</p>

          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-700"
              style={{ width: `${continueSubject?.progress || 0}%` }}
            />
          </div>

          <button
            onClick={() => onNavigatePath?.(continuePath)}
            className="mt-5 h-11 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-[#111827] text-sm font-bold hover:brightness-105 transition"
          >
            Resume Now
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-md-outline/50 bg-[#111a2d]/80 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-reader font-bold text-white">Today's Goal</h2>
          <span className="text-[11px] text-orange-300">{todayGoalMins} mins</span>
        </div>
        <div className="mt-2 text-xs text-white/70">
          {continueSubject?.title || 'Constitutional Law'} • {todayGoalRemaining} lessons remaining
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" style={{ width: `${todayGoalPct}%` }} />
        </div>
      </section>

      <section className="rounded-2xl border border-md-outline/50 bg-[#0f172a]/85 p-4">
        <h2 className="text-sm font-reader font-bold text-white mb-3">Progress Overview</h2>
        <div className="space-y-3">
          {loading && [1, 2, 3].map(idx => (
            <div key={idx} className="skeleton h-11 w-full" />
          ))}

          {!loading && computed.slice(0, 5).map(subject => (
            <button
              key={subject.id}
              onClick={() => onNavigatePath?.(`/subject/${subject.id}`)}
              className="w-full text-left rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white truncate">{subject.title}</span>
                <span className="text-[10px] text-orange-300">{masteryLabel(subject.progress)}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" style={{ width: `${subject.progress}%` }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-md-outline/50 bg-[#111827]/80 p-4">
        <h2 className="text-sm font-reader font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button onClick={() => onNavigate('study')} className="h-11 rounded-xl bg-blue-600/20 border border-blue-400/35 text-blue-100 text-xs font-semibold">Practice Quiz</button>
          <button disabled className="h-11 rounded-xl bg-orange-500/10 border border-orange-400/25 text-orange-200/70 text-xs font-semibold cursor-not-allowed">Battle Mode • Coming Soon</button>
          <button onClick={() => onNavigate('study')} className="h-11 rounded-xl bg-rose-500/20 border border-rose-400/35 text-rose-100 text-xs font-semibold">Review Weak Areas</button>
        </div>
      </section>

      <div className="text-center text-[11px] text-white/35">
        Welcome back, {user?.name?.split(' ')[0] || 'Counsel'}. One focused session at a time.
      </div>
    </div>
  )
}
