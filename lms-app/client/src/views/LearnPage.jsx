import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchSubjectsByYearWithAccess } from '../lib/curriculumApi'

const READER_STATE_KEY = 'lexisai.reader.state.v1'
const LAST_READER_KEY  = 'lexisai.last.reader'
const DAILY_GOAL       = 5

const YEAR_OPTIONS = [
  { value: null, label: 'All Years' },
  { value: 1,    label: '1st Year'  },
  { value: 2,    label: '2nd Year'  },
  { value: 3,    label: '3rd Year'  },
  { value: 4,    label: '4th Year'  },
]

function readReaderState() {
  try {
    const raw = localStorage.getItem(READER_STATE_KEY)
    return raw ? JSON.parse(raw) : { completedSections: {} }
  } catch {
    return { completedSections: {} }
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

function getSubjectStats(subjectId, completedSections) {
  const prefix = `${subjectId}:`
  const keys   = Object.keys(completedSections).filter(k => k.startsWith(prefix))
  const count  = keys.length
  const lastTs = keys.reduce((max, k) => {
    const ts = completedSections[k]
    return typeof ts === 'number' ? Math.max(max, ts) : max
  }, 0)
  return { count, lastTs }
}

function getTodayCount(completedSections) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return Object.values(completedSections).filter(
    ts => typeof ts === 'number' && ts >= start.getTime()
  ).length
}

function relativeTime(ts) {
  if (!ts) return null
  const diff = Date.now() - ts
  const min  = Math.floor(diff / 60000)
  const hr   = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (min < 1)  return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr  < 24) return `${hr}h ago`
  if (day < 7)  return `${day}d ago`
  return null
}

/* ── SubjectCard ─────────────────────────────────────────────────────── */
function SubjectCard({ subject, isHero, isPremium, onOpen, index }) {
  const hasProgress = subject.completedCount > 0
  const timeAgo     = relativeTime(subject.lastTs)

  return (
    <div
      className={`animate-slide-up rounded-2xl border p-4 transition-all duration-200 ${
        isHero
          ? 'bg-indigo-600/10 border-indigo-500/25 hover:bg-indigo-600/15'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Status dot */}
        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          isHero      ? 'bg-indigo-400 shadow-[0_0_8px_3px_rgba(99,102,241,0.45)]' :
          hasProgress ? 'bg-emerald-400' :
                        'bg-white/15'
        }`} />

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className={`text-sm font-semibold leading-snug truncate ${isHero ? 'text-white' : 'text-white/80'}`}>
                {subject.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-white/30">{subject.yearLevel}</span>
                <span className="text-white/15">·</span>
                <span className="text-[10px] text-white/30">{subject.chapterCount} ch</span>
                {timeAgo && (
                  <>
                    <span className="text-white/15">·</span>
                    <span className="text-[10px] text-indigo-400/60">{timeAgo}</span>
                  </>
                )}
              </div>
            </div>

            {!isPremium && (
              <span className="shrink-0 text-[10px] font-semibold text-amber-400/70">
                PHP {Number(subject.price || 0).toLocaleString()}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {hasProgress && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/30">{subject.completedCount} sections done</span>
                <span className="text-[10px] font-semibold text-white/40">{subject.pct}%</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHero ? 'bg-gradient-to-r from-indigo-500 to-violet-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${subject.pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => onOpen(subject.id)}
          className={`shrink-0 self-center h-8 px-3.5 rounded-xl text-xs font-semibold transition-all ${
            isHero
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-900/50'
              : hasProgress
              ? 'bg-white/[0.06] text-emerald-300 hover:bg-emerald-600/20'
              : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.09] hover:text-white/70'
          }`}
        >
          {isHero ? 'Continue' : hasProgress ? 'Resume' : 'Start'}
        </button>
      </div>
    </div>
  )
}

/* ── LearnPage ───────────────────────────────────────────────────────── */
export default function LearnPage({ onOpenSubject, onResumeSession }) {
  const [subjects,       setSubjects]       = useState([])
  const [access,         setAccess]         = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [yearFilter,     setYearFilter]     = useState(null)
  const [showYearFilter, setShowYearFilter] = useState(false)
  const heroRef = useRef(null)

  // Read local progress state once on mount
  const { completedSections } = useMemo(() => readReaderState(), [])
  const todayCount = useMemo(() => getTodayCount(completedSections), [completedSections])
  const lastReader = useMemo(() => readLastReader(), [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSubjectsByYearWithAccess(yearFilter)
      .then(data => {
        if (!mounted) return
        setSubjects(data?.subjects || [])
        setAccess(data?.access || null)
      })
      .catch(() => { if (mounted) { setSubjects([]); setAccess(null) } })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [yearFilter])

  // Enrich with local stats and sort (in-progress first → last accessed → natural)
  const enriched = useMemo(() => {
    return subjects
      .map(s => {
        const { count, lastTs } = getSubjectStats(s.id, completedSections)
        const estimated = Math.max(1, (s.chapterCount || 1) * 3)
        const pct       = count > 0 ? Math.min(100, Math.round((count / estimated) * 100)) : 0
        return { ...s, completedCount: count, lastTs, pct }
      })
      .sort((a, b) => {
        if (a.completedCount > 0 && b.completedCount === 0) return -1
        if (b.completedCount > 0 && a.completedCount === 0) return 1
        return b.lastTs - a.lastTs
      })
  }, [subjects, completedSections])

  const heroSubject   = enriched.find(s => s.lastTs > 0) || enriched[0] || null
  const isPremium     = access?.tier === 'premium'
  const dailyPct      = Math.min(100, Math.round((todayCount / DAILY_GOAL) * 100))
  const goalMet       = todayCount >= DAILY_GOAL

  const hasLastSession = lastReader?.path && lastReader?.subjectId === heroSubject?.id

  return (
    <div className="min-h-full bg-[#09090e]">
      <div className="max-w-xl mx-auto px-4 pt-5 pb-28 space-y-4">

        {/* ── Daily goal strip ── */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.05]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-white/45">Daily Study Goal</span>
              <span className={`text-[11px] font-bold ${goalMet ? 'text-emerald-400' : 'text-indigo-300'}`}>
                {todayCount} / {DAILY_GOAL} sections
              </span>
            </div>
            <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  goalMet ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-violet-400'
                }`}
                style={{ width: `${dailyPct}%` }}
              />
            </div>
          </div>
          <span className="text-xl">{goalMet ? '🔥' : '📖'}</span>
        </div>

        {/* ── Hero resume card ── */}
        {heroSubject && (
          <div
            ref={heroRef}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#120e25] border border-indigo-500/20 p-5 shadow-xl shadow-indigo-950/60"
          >
            {/* Ambient glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-300/80 bg-indigo-500/15 border border-indigo-400/20 px-2.5 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {heroSubject.completedCount > 0 ? 'Continue Learning' : 'Start Here'}
              </div>

              <h2 className="text-xl font-bold text-white leading-tight">{heroSubject.title}</h2>
              <p className="text-xs text-white/35 mt-1">{heroSubject.yearLevel} · {heroSubject.chapterCount} chapters</p>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-white/35">
                    {heroSubject.completedCount > 0 ? `${heroSubject.completedCount} sections completed` : 'Not started'}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-300">{heroSubject.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700"
                    style={{ width: `${Math.max(heroSubject.pct, heroSubject.completedCount > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onOpenSubject?.(heroSubject.id)}
                  className="flex-1 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2"
                >
                  {heroSubject.completedCount > 0 ? 'Continue' : 'Start Learning'}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                {hasLastSession && (
                  <button
                    onClick={() => onResumeSession?.(lastReader.path)}
                    className="h-11 px-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.09] text-white/80 text-sm font-medium transition-all"
                    title="Resume last chapter"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Section header + filter toggle ── */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-sm font-semibold text-white/50 tracking-wide">All Subjects</h3>

          <button
            onClick={() => setShowYearFilter(v => !v)}
            className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl transition-all ${
              yearFilter
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-transparent text-white/35 hover:text-white/60'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
            </svg>
            {yearFilter ? YEAR_OPTIONS.find(o => o.value === yearFilter)?.label : 'Filter by Year'}
          </button>
        </div>

        {/* ── Year filter pills ── */}
        {showYearFilter && (
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => { setYearFilter(opt.value); setShowYearFilter(false) }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  yearFilter === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.05] text-white/45 hover:bg-white/[0.09] hover:text-white/75'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Subject list ── */}
        <div className="space-y-2">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-2xl bg-white/[0.03] border border-white/[0.04] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}

          {!loading && enriched.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-3xl mb-2">📭</div>
              <div className="text-sm text-white/30">No subjects found.</div>
            </div>
          )}

          {!loading && enriched.map((s, i) => (
            <SubjectCard
              key={s.id}
              subject={s}
              isHero={s.id === heroSubject?.id}
              isPremium={isPremium}
              onOpen={onOpenSubject}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
