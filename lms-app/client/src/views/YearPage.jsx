import { useEffect, useMemo, useState } from 'react'
import { fetchSubjectsByYearWithAccess, fetchYears } from '../lib/curriculumApi'

export default function YearPage({ yearId, onOpenSubject }) {
  const [years, setYears] = useState([])
  const [subjects, setSubjects] = useState([])
  const [access, setAccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const activeYear = useMemo(() => {
    if (!yearId) return null
    const numeric = Number(yearId)
    return Number.isFinite(numeric) ? numeric : null
  }, [yearId])

  useEffect(() => {
    let mounted = true
    fetchYears().then(data => {
      if (mounted) setYears(data)
    }).catch(() => {
      if (mounted) setYears([{ id: 1, label: '1st Year' }, { id: 2, label: '2nd Year' }, { id: 3, label: '3rd Year' }, { id: 4, label: '4th Year' }])
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSubjectsByYearWithAccess(activeYear || null)
      .then(data => {
        if (!mounted) return
        setSubjects(data?.subjects || [])
        setAccess(data?.access || null)
      })
      .catch(() => {
        if (mounted) {
          setSubjects([])
          setAccess(null)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [activeYear])

  return (
    <div className="min-h-full overflow-y-auto p-4 md:p-7 lg:p-8 bg-[radial-gradient(1200px_500px_at_8%_-10%,rgba(37,99,235,0.24),transparent),radial-gradient(900px_450px_at_88%_0%,rgba(245,158,11,0.16),transparent)]">
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl border border-md-outline/40 bg-md-surf/80 backdrop-blur p-6 md:p-8 shadow-elev2">
          <div className="text-xs uppercase tracking-[0.22em] text-md-onsurfvar">Law LMS</div>
          <h1 className="mt-2 text-2xl md:text-4xl font-semibold text-md-onsurf">Choose Your Year, Unlock Your Subjects</h1>
          <p className="mt-3 text-sm md:text-base text-md-onsurfvar max-w-3xl">
            Start with your year level. Every subject is a premium learning track with full chapter access, guided AI coaching, and progress analytics.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {years.map(y => (
              <a
                key={y.id}
                href={`/year/${y.id}`}
                className={`px-3 py-2 rounded-xl text-xs border transition-colors ${
                  Number(y.id) === activeYear
                    ? 'bg-md-primarycon text-md-onprimarycon border-md-primary/50'
                    : 'bg-md-surf2 text-md-onsurfvar border-md-outline/50 hover:text-md-onsurf'
                }`}
              >
                {y.label}
              </a>
            ))}
          </div>

          {access && (
            <div className="mt-4 rounded-xl border border-md-outline/40 bg-md-surf2 px-3 py-2 text-xs text-md-onsurfvar">
              {access.tier === 'premium'
                ? 'Premium active: all subjects unlocked, unlimited AI usage.'
                : `Weekly free preview: ${access.weeklyPreviewUsedCount}/${access.weeklyPreviewLimit} subject used this week • Resets in ${access.resetsInDays} day(s)`}
            </div>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading && [1, 2, 3].map(s => (
            <div key={s} className="rounded-2xl border border-md-outline/40 bg-md-surf2 p-5 space-y-3">
              <div className="skeleton h-6 w-36" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-9 w-32" />
            </div>
          ))}

          {!loading && subjects.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-md-outline/40 bg-md-surf2 p-6 text-sm text-md-onsurfvar">
              No subjects found for this year.
            </div>
          )}

          {!loading && subjects.map(subject => (
            <article key={subject.id} className="rounded-2xl border border-md-outline/40 bg-md-surf/90 backdrop-blur p-5 shadow-elev1">
              <p className="text-[11px] uppercase tracking-widest text-md-onsurfvar">{subject.yearLevel}</p>
              <h2 className="mt-2 text-lg font-semibold text-md-onsurf">{subject.title}</h2>
              <p className="mt-2 text-sm text-md-onsurfvar min-h-[44px]">{subject.description || 'Premium subject track with chapter-based lessons and AI guidance.'}</p>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-md-onsurfvar">{subject.chapterCount} chapters</span>
                <span className="font-semibold text-amber-300">PHP {Number(subject.price || 0).toLocaleString()}</span>
              </div>

              <button
                onClick={() => onOpenSubject?.(subject.id)}
                className="mt-4 w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-sm hover:brightness-105 transition"
              >
                Open Subject
              </button>
            </article>
          ))}
        </section>
      </section>
    </div>
  )
}
