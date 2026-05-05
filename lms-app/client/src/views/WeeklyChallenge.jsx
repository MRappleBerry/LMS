import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchWeeklyChallenge,
  submitWeeklyChallenge,
  fetchWeeklyLeaderboard,
} from '../lib/weeklyChallengeApi'

function formatCountdown(msRemaining) {
  const safe = Math.max(0, msRemaining)
  const days = Math.floor(safe / (24 * 60 * 60 * 1000))
  const hours = Math.floor((safe % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((safe % (60 * 60 * 1000)) / (60 * 1000))
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatSeconds(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function Badge({ text, tone = 'default' }) {
  const toneClass = {
    default: 'bg-md-surf3 text-md-onsurfvar border-md-outline/50',
    gold: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
    red: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  }

  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${toneClass[tone] || toneClass.default}`}>
      {text}
    </span>
  )
}

function LeaderboardTable({ rows = [] }) {
  if (!rows.length) {
    return <div className="text-sm text-md-onsurfvar">No submissions yet. Be the first to take this challenge.</div>
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={`${row.rank}-${row.userId}`} className="flex items-center gap-3 bg-md-surf2 border border-md-outline/60 rounded-2xl px-3 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-md-surf3 border border-md-outline/50 flex items-center justify-center text-xs font-bold text-md-onsurf">
            {row.rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-md-onsurf truncate">{row.userId}</div>
            <div className="text-[11px] text-md-onsurfvar">{row.badge}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-emerald-300">{row.score}%</div>
            <div className="text-[11px] text-md-onsurfvar">{row.timeTakenSeconds}s</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WeeklyChallenge({ onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [attemptToken, setAttemptToken] = useState('')
  const [answers, setAnswers] = useState({})
  const [inProgress, setInProgress] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [eventNow, setEventNow] = useState(Date.now())
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0)

  const autoSubmittedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchWeeklyChallenge()
      .then((data) => {
        if (!mounted) return

        if (data?.hasSubmitted) {
          setChallenge(data.challenge)
          setResult({
            challenge: data.challenge,
            submission: data.submission,
            rank: data.rank,
            percentile: data.percentile,
            reward: data.reward,
            leaderboardPreview: data.leaderboardPreview || [],
          })
          setLeaderboard(data.leaderboardPreview || [])
          return
        }

        setChallenge(data?.challenge || null)
        setAttemptToken(data?.attemptToken || '')
        setTimeLeftSeconds(Number(data?.challenge?.durationSeconds || 0))
      })
      .catch((err) => {
        if (!mounted) return
        setError(err?.response?.data?.error || 'Failed to load weekly challenge.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setEventNow(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!inProgress) return undefined
    if (timeLeftSeconds <= 0) return undefined

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        const next = Math.max(0, prev - 1)
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [inProgress, timeLeftSeconds])

  useEffect(() => {
    if (!inProgress) return
    if (timeLeftSeconds > 0) return
    if (autoSubmittedRef.current) return
    autoSubmittedRef.current = true
    handleSubmit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProgress, timeLeftSeconds])

  const eventRemaining = useMemo(() => {
    if (!challenge?.endDate) return 0
    return Math.max(0, new Date(challenge.endDate).getTime() - eventNow)
  }, [challenge?.endDate, eventNow])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const progressPct = challenge?.questionCount ? Math.round((answeredCount / challenge.questionCount) * 100) : 0

  function handleStart() {
    setInProgress(true)
    setTimeLeftSeconds(Number(challenge?.durationSeconds || 0))
  }

  function selectAnswer(questionId, choiceId) {
    if (!inProgress || submitting) return
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }))
  }

  async function refreshLeaderboard(challengeId) {
    try {
      const data = await fetchWeeklyLeaderboard(challengeId)
      setLeaderboard(data?.top10 || [])
    } catch {
      // noop
    }
  }

  async function handleSubmit(isAuto = false) {
    if (submitting || !attemptToken) return

    setSubmitting(true)
    setError('')

    try {
      const data = await submitWeeklyChallenge({
        attemptToken,
        answers,
        autoSubmitted: Boolean(isAuto),
      })

      setResult(data)
      setLeaderboard(data?.leaderboardPreview || [])
      setInProgress(false)
      await refreshLeaderboard(data?.challenge?.id)
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not submit challenge.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-sm text-md-onsurfvar">Loading weekly challenge...</div>
  }

  if (error && !challenge && !result) {
    return <div className="p-4 text-sm text-rose-300">{error}</div>
  }

  if (result) {
    const score = result?.submission?.score || 0
    const rank = result?.rank || null
    const percentile = result?.percentile || null
    const reward = result?.reward || null

    return (
      <div className="px-4 pb-6 space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 p-5 mt-2 border border-white/10 shadow-elev3">
          <div className="text-xs text-cyan-100/90">Weekly Law Challenge Complete</div>
          <h1 className="text-xl font-bold text-white mt-1">{result?.challenge?.title || 'Challenge Results'}</h1>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-2.5">
              <div className="text-[11px] text-cyan-100">Score</div>
              <div className="text-lg font-bold text-white">{score}%</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <div className="text-[11px] text-cyan-100">Rank</div>
              <div className="text-lg font-bold text-white">{rank ? `#${rank}` : '-'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <div className="text-[11px] text-cyan-100">Percentile</div>
              <div className="text-lg font-bold text-white">{percentile ? `${percentile}%` : '-'}</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {reward?.badge && <Badge text={`Badge: ${reward.badge}`} tone="gold" />}
            {reward?.xp != null && <Badge text={`+${reward.xp} XP`} tone="green" />}
            {reward?.streakBonus ? <Badge text={`Streak +${reward.streakBonus}`} tone="violet" /> : null}
          </div>
        </div>

        <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-md-onsurf">Leaderboard Preview</h2>
            <button onClick={() => onNavigate('dashboard')} className="text-xs text-md-primary">Back to Dashboard</button>
          </div>
          <LeaderboardTable rows={leaderboard} />
        </div>

        <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
          <h2 className="text-base font-semibold text-md-onsurf">AI Feedback and Explanations</h2>
          {(result?.submission?.explanations || []).map((item, index) => (
            <div key={item.questionId} className="bg-md-surf2 border border-md-outline/50 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-md-onsurf">Question {index + 1}</div>
                <Badge text={item.isCorrect ? 'Correct' : 'Incorrect'} tone={item.isCorrect ? 'green' : 'red'} />
              </div>
              <div className="text-xs text-md-onsurfvar">Correct answer: {item.correctAnswerText}</div>
              {item.selectedAnswerText ? (
                <div className="text-xs text-md-onsurfvar">Your answer: {item.selectedAnswerText}</div>
              ) : (
                <div className="text-xs text-rose-300">No answer selected.</div>
              )}

              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <div><span className="text-md-primary font-semibold">Issue:</span> <span className="text-md-onsurfvar">{item.explanation.issue}</span></div>
                <div><span className="text-md-primary font-semibold">Rule:</span> <span className="text-md-onsurfvar">{item.explanation.rule}</span></div>
                <div><span className="text-md-primary font-semibold">Application:</span> <span className="text-md-onsurfvar">{item.explanation.application}</span></div>
                <div><span className="text-md-primary font-semibold">Conclusion:</span> <span className="text-md-onsurfvar">{item.explanation.conclusion}</span></div>
              </div>

              {!item.isCorrect && item.wrongChoiceReview?.length ? (
                <div className="pt-1">
                  <div className="text-[11px] text-md-onsurfvar mb-1">Why the wrong choices are incorrect:</div>
                  <div className="space-y-1">
                    {item.wrongChoiceReview.map((w) => (
                      <div key={w.choiceId} className="text-[11px] text-md-onsurfvar bg-md-surf3 rounded-lg px-2 py-1.5">
                        <span className="font-semibold text-rose-300">{w.choiceId}.</span> {w.whyIncorrect}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-8 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-md-primary to-cyan-600 p-5 mt-2 border border-white/10 shadow-elev3">
        <div className="text-xs text-cyan-50/90">Weekly Event</div>
        <h1 className="text-xl font-bold text-white mt-1">{challenge?.title || 'Weekly Law Challenge'}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge text={`${challenge?.questionCount || 0} questions`} tone="default" />
          <Badge text={`${challenge?.difficulty || 'medium'} difficulty`} tone="violet" />
          <Badge text={`Ends in ${formatCountdown(eventRemaining)}`} tone="gold" />
        </div>
      </div>

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      {!inProgress ? (
        <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
          <div className="text-sm text-md-onsurfvar">
            One attempt only. Ranking is based on highest score, then fastest completion time.
          </div>
          <div className="text-sm text-md-onsurfvar">
            Timer: {formatSeconds(challenge?.durationSeconds || 0)} total.
          </div>
          <button
            onClick={handleStart}
            className="w-full h-11 rounded-xl bg-md-primary text-white text-sm font-semibold hover:bg-md-primary/90 transition-colors"
          >
            Start Challenge
          </button>
        </div>
      ) : (
        <>
          <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-md-onsurf">Progress</div>
              <div className="text-sm font-semibold text-md-onsurf">{answeredCount}/{challenge?.questionCount}</div>
            </div>
            <div className="h-2 bg-md-surf3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-md-onsurfvar">
              <span>One attempt this week</span>
              <span className="font-semibold text-amber-300">Time left: {formatSeconds(timeLeftSeconds)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {(challenge?.questions || []).map((question, idx) => {
              const selected = answers[question.id]
              return (
                <div key={question.id} className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-md-onsurf">Q{idx + 1}. {question.prompt}</div>
                    <Badge text={question.type.toUpperCase()} tone="default" />
                  </div>
                  <div className="space-y-2">
                    {question.choices.map((choice) => {
                      const active = selected === choice.id
                      return (
                        <button
                          key={choice.id}
                          onClick={() => selectAnswer(question.id, choice.id)}
                          className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-colors ${active
                            ? 'border-cyan-400 bg-cyan-500/10 text-white'
                            : 'border-md-outline/50 bg-md-surf2 text-md-onsurfvar hover:text-md-onsurf hover:border-md-outline'
                          }`}
                        >
                          <span className="font-semibold mr-2">{choice.id}.</span>
                          {choice.text}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Challenge'}
          </button>
        </>
      )}
    </div>
  )
}
