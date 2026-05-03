import { useEffect, useMemo, useState } from 'react'
import { fetchSubjectPage, subscribeToSubject } from '../lib/curriculumApi'

const READER_STATE_KEY = 'lexisai.reader.state.v1'

function getProgress(subjectId, chapters) {
  try {
    const raw = localStorage.getItem(READER_STATE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const completed = parsed.completedSections || {}

    const allKeys = []
    for (const chapter of chapters || []) {
      for (const sec of chapter.sections || []) {
        allKeys.push(`${subjectId}:${chapter.id}:${sec.id}`)
      }
    }

    if (!allKeys.length) return 0
    const done = allKeys.filter(key => Boolean(completed[key])).length
    return Math.round((done / allKeys.length) * 100)
  } catch {
    return 0
  }
}

export default function SubjectPage({ subjectId, onOpenChapter, onBackYear }) {
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    fetchSubjectPage(subjectId)
      .then(data => {
        if (mounted) setPayload(data)
      })
      .catch(() => {
        if (mounted) setError('Unable to load this subject right now.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [subjectId])

  const subject = payload?.subject
  const chapters = payload?.chapters || []
  const access = payload?.access
  const isSubscribed = Boolean(subject?.isSubscribed)
  const progress = useMemo(() => getProgress(subjectId, chapters), [subjectId, chapters, isSubscribed])

  async function handleSubscribe() {
    try {
      setSubmitting(true)
      await subscribeToSubject(subjectId)
      const updated = await fetchSubjectPage(subjectId)
      setPayload(updated)
      setShowSubscribeModal(false)
    } catch {
      setError('Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full overflow-y-auto p-4 md:p-7 lg:p-8 bg-[radial-gradient(1000px_420px_at_0%_-8%,rgba(249,115,22,0.22),transparent),radial-gradient(800px_420px_at_100%_0%,rgba(37,99,235,0.2),transparent)]">
      <section className="max-w-6xl mx-auto space-y-6 pb-24">
        {loading && (
          <div className="rounded-3xl border border-md-outline/50 bg-md-surf p-6 md:p-8 space-y-4">
            <div className="skeleton h-8 w-72" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        )}

        {!loading && subject && (
          <header className="rounded-3xl border border-md-outline/50 bg-md-surf/85 backdrop-blur p-6 md:p-8 shadow-elev2">
            <button
              onClick={() => onBackYear?.(subject.year)}
              className="text-xs px-2.5 py-1 rounded-lg bg-md-surf2 border border-md-outline/40 text-md-onsurfvar hover:text-md-onsurf"
            >
              Back to Year {subject.year}
            </button>
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-md-onsurfvar">Premium Subject</div>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold leading-tight text-md-onsurf">{subject.title}</h1>
            <p className="mt-3 max-w-3xl text-sm md:text-base text-md-onsurfvar">{subject.description}</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-md-surf2 border border-md-outline/50 p-3">
                <div className="text-[11px] text-md-onsurfvar">Year</div>
                <div className="mt-1 text-sm text-md-onsurf font-semibold">{subject.yearLevel}</div>
              </div>
              <div className="rounded-xl bg-md-surf2 border border-md-outline/50 p-3">
                <div className="text-[11px] text-md-onsurfvar">Price</div>
                <div className="mt-1 text-sm text-amber-300 font-semibold">PHP {Number(subject.price || 0).toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-md-surf2 border border-md-outline/50 p-3">
                <div className="text-[11px] text-md-onsurfvar">Progress</div>
                <div className="mt-1 text-sm text-md-onsurf font-semibold">{progress}% Complete</div>
              </div>
            </div>

            {access && (
              <div className="mt-4 rounded-xl border border-md-outline/40 bg-md-surf2 px-3 py-2 text-xs text-md-onsurfvar">
                {access.tier === 'premium'
                  ? 'Premium active: all chapters, quiz mode, bar simulation, and unlimited AI unlocked.'
                  : `Free tier: preview of 1 subject/week, first ${access.previewChapterLimit} chapter(s), AI ${access.aiPromptsUsed}/${access.aiPromptLimit} used • Resets in ${access.resetsInDays} day(s)`}
              </div>
            )}

            <div className="mt-4 h-2 rounded-full bg-md-surf2 overflow-hidden border border-md-outline/40">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${progress}%` }} />
            </div>
          </header>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-md-error/40 bg-md-error/10 p-4 text-sm text-md-error">{error}</div>
        )}

        {!loading && subject && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map(chapter => {
              const locked = Boolean(chapter.isLocked)
              return (
                <article key={chapter.id} className="relative rounded-2xl border border-md-outline/50 bg-md-surf/90 p-5 overflow-hidden">
                  <div className={locked ? 'blur-[2px] select-none pointer-events-none' : ''}>
                    <div className="text-xs text-md-onsurfvar">Chapter {chapter.id}</div>
                    <h3 className="mt-1 text-lg font-semibold text-md-onsurf">{chapter.title}</h3>
                    <p className="mt-2 text-xs text-md-onsurfvar">{(chapter.sections || []).length} lessons</p>
                    {(chapter.previewSection?.heading || chapter.sections?.[0]?.heading) && (
                      <p className="mt-3 text-sm text-md-onsurfvar">
                        Preview: {chapter.previewSection?.heading || chapter.sections?.[0]?.heading}
                      </p>
                    )}
                  </div>

                  {locked ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="px-4 py-2 rounded-xl bg-md-surf2/95 border border-md-outline/50 text-xs text-md-onsurf flex items-center gap-2">
                        <span>🔒</span>
                        <span>Locked chapter</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenChapter?.(subjectId, chapter.id)}
                      className="mt-4 w-full h-10 rounded-xl bg-md-primarycon text-md-onprimarycon text-sm font-semibold hover:bg-md-primarycon/80"
                    >
                      Open Chapter
                    </button>
                  )}
                </article>
              )
            })}
          </section>
        )}
      </section>

      {!isSubscribed && subject && (
        <div className="fixed z-40 bottom-20 left-1/2 -translate-x-1/2 w-[min(92vw,760px)]">
          <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-3 shadow-elev3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest">Upgrade To Premium</div>
              <div className="text-sm font-semibold">Unlock all subjects, all chapters, quiz mode, bar exam simulation, and unlimited AI.</div>
            </div>
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="h-9 px-4 rounded-xl bg-black/90 text-white text-xs font-semibold hover:bg-black"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSubscribeModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-md-outline/50 bg-md-surf p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-md-onsurf">Upgrade To Premium</h3>
            <p className="mt-2 text-sm text-md-onsurfvar">Unlock every subject, all chapters, quiz mode, bar exam simulation, and unlimited AI usage.</p>
            <div className="mt-4 rounded-xl bg-md-surf2 border border-md-outline/40 p-3 text-sm text-md-onsurf flex items-center justify-between">
              <span>Premium access</span>
              <span className="font-semibold text-amber-300">PHP {Number(subject?.price || 0).toLocaleString()}</span>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="flex-1 h-10 rounded-xl border border-md-outline/50 text-sm text-md-onsurfvar hover:text-md-onsurf"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleSubscribe}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-sm disabled:opacity-70"
              >
                {submitting ? 'Processing...' : 'Pay and Unlock Premium'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
