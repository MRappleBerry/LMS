import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchRankedLeaderboard } from '../lib/rankedApi'
import { connectRankedSocket, disconnectRankedSocket, getRankedSocket } from '../lib/rankedSocket'

const QUESTION_LIMIT = 20
const QUESTION_TIME_MS = 35000

const OFFLINE_QUESTIONS = [
  {
    id: 'off-1',
    content: 'Content-based speech restrictions are usually reviewed under what standard?',
    choices: [{ id: 'C1', text: 'Rational basis' }, { id: 'C2', text: 'Strict scrutiny' }, { id: 'C3', text: 'Intermediate scrutiny' }, { id: 'C4', text: 'Substantial evidence' }],
    correctChoiceId: 'C2',
    explanation: { issue: 'Applicable review test for content-based regulation.', rule: 'Content-based restrictions are presumptively invalid and face strict scrutiny.', application: 'The law targets message content directly.', conclusion: 'Strict scrutiny applies.' },
  },
  {
    id: 'off-2',
    content: 'A valid waiver of counsel during custodial investigation is generally:',
    choices: [{ id: 'C1', text: 'Oral in presence of police only' }, { id: 'C2', text: 'Written and in the presence of counsel' }, { id: 'C3', text: 'Implied from silence' }, { id: 'C4', text: 'Recorded by barangay captain' }],
    correctChoiceId: 'C2',
    explanation: { issue: 'Waiver validity requirements.', rule: 'Waiver must be in writing and made with counsel present.', application: 'Other forms fail constitutional safeguards.', conclusion: 'Written waiver with counsel present is valid.' },
  },
  {
    id: 'off-3',
    content: 'Improper venue in a civil case is typically:',
    choices: [{ id: 'C1', text: 'Jurisdictional and never waivable' }, { id: 'C2', text: 'Procedural and waivable if not timely raised' }, { id: 'C3', text: 'Always fatal' }, { id: 'C4', text: 'Curable only by appeal' }],
    correctChoiceId: 'C2',
    explanation: { issue: 'Effect of venue defects.', rule: 'Venue is procedural and can be waived.', application: 'Failure to object seasonably generally waives venue objection.', conclusion: 'Improper venue is usually waivable.' },
  },
  {
    id: 'off-4',
    content: 'Tax exemptions are construed:',
    choices: [{ id: 'C1', text: 'Liberally in favor of taxpayer' }, { id: 'C2', text: 'Strictly against taxpayer' }, { id: 'C3', text: 'As presumed rights' }, { id: 'C4', text: 'Only through custom' }],
    correctChoiceId: 'C2',
    explanation: { issue: 'Interpretation standard for tax exemptions.', rule: 'Exemptions are strictly construed against the taxpayer.', application: 'No clear basis means exemption is denied.', conclusion: 'Strict construction applies.' },
  },
]

function formatMs(ms) {
  const safe = Math.max(0, Number(ms || 0))
  const totalSec = Math.round(safe / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${String(sec).padStart(2, '0')}`
}

export default function RankedMatch({ user, onNavigate }) {
  const [profile, setProfile] = useState(null)
  const [mode, setMode] = useState('idle')
  const [statusText, setStatusText] = useState('Ready for ranked battle.')
  const [queueMeta, setQueueMeta] = useState(null)
  const [matchId, setMatchId] = useState('')
  const [opponent, setOpponent] = useState(null)
  const [progress, setProgress] = useState('0/20')
  const [question, setQuestion] = useState(null)
  const [selectedChoiceId, setSelectedChoiceId] = useState(null)
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState({})
  const [timeLeftMs, setTimeLeftMs] = useState(0)
  const [deadlineAt, setDeadlineAt] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const questionStartedAtRef = useRef(0)
  const tabSwitchCountRef = useRef(0)
  const fallbackTimerRef = useRef(null)
  const offlineRef = useRef(null)
  const modeRef = useRef(mode)

  const myId = profile?.id || user?.id || null
  const meScore = result?.score?.[myId] ?? null
  const themScore = result?.score?.[result?.opponent?.userId] ?? null

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const safeProfile = {
      userId: user?.id || localStorage.getItem('lexisai.user.id') || `guest-${Math.random().toString(36).slice(2, 8)}`,
      name: user?.name || 'Law Learner',
      avatar: user?.avatarUrl || '',
    }

    setProfile(safeProfile)

    const socket = connectRankedSocket(safeProfile)
    if (!socket) {
      setIsOfflineMode(true)
      setStatusText('Ready for ranked battle.')
      return () => {
        if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
      }
    }

    function onRankSync(payload) {
      setProfile((prev) => ({ ...prev, ...payload }))
    }

    function onQueue(payload) {
      setMode('searching')
      setQueueMeta(payload)
      setStatusText('Searching for opponent… A bot will fill in after 10 minutes if no one joins.')
    }

    function onFound(payload) {
      setMatchId(payload.matchId)
      setOpponent(payload.opponent)
      setMode('found')
      setStatusText(payload.botMatch ? 'Bot fallback match found.' : 'Opponent found.')
      setProgress(`0/${payload.questionCount || QUESTION_LIMIT}`)
      setSubmittedQuestionIds({})
      setSelectedChoiceId(null)
      setResult(null)
      setError('')
    }

    function onStart(payload) {
      setMode('live')
      setStatusText('Match started. Answer fast and accurately.')
      setDeadlineAt(payload?.startsAt || 0)
      setTimeLeftMs(Math.max(0, Number(payload?.startsAt || 0) - Date.now()))
    }

    function onQuestion(payload) {
      setQuestion(payload.question)
      setProgress(payload.progress || `0/${QUESTION_LIMIT}`)
      setDeadlineAt(Number(payload.deadlineAt || 0))
      setSelectedChoiceId(null)
      questionStartedAtRef.current = Date.now()
      tabSwitchCountRef.current = 0
    }

    function onMatchEnd(payload) {
      setMode('result')
      setResult(payload)
      setStatusText(payload.isDraw ? 'Draw game.' : payload.winnerId === payload.me ? 'You won.' : 'You lost.')
      setQuestion(null)
      setDeadlineAt(0)
      setTimeLeftMs(0)
      loadLeaderboard()
    }

    function onMatchError(payload) {
      setError(payload?.error || 'Match error occurred.')
    }

    function onConnectError() {
      // Don't permanently go offline — server may just be waking up (Render free tier)
      setStatusText('Connecting to server… please wait.')
    }

    socket.on('rank:sync', onRankSync)
    socket.on('match:queue', onQueue)
    socket.on('match:found', onFound)
    socket.on('match:start', onStart)
    socket.on('question:send', onQuestion)
    socket.on('match:end', onMatchEnd)
    socket.on('match:error', onMatchError)
    socket.on('connect_error', onConnectError)

    const onVisibility = () => {
      if (document.hidden && mode === 'live') tabSwitchCountRef.current += 1
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      socket.off('rank:sync', onRankSync)
      socket.off('match:queue', onQueue)
      socket.off('match:found', onFound)
      socket.off('match:start', onStart)
      socket.off('question:send', onQuestion)
      socket.off('match:end', onMatchEnd)
      socket.off('match:error', onMatchError)
      socket.off('connect_error', onConnectError)
      document.removeEventListener('visibilitychange', onVisibility)
      disconnectRankedSocket()
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    if (mode !== 'live' || !question) return
    if (timeLeftMs > 0) return
    if (submittedQuestionIds[question.id]) return
    submitChoice(null)
  }, [mode, timeLeftMs, question, submittedQuestionIds])

  useEffect(() => {
    if (mode !== 'live' || !deadlineAt) return undefined
    const timer = setInterval(() => {
      setTimeLeftMs(Math.max(0, deadlineAt - Date.now()))
    }, 250)
    return () => clearInterval(timer)
  }, [mode, deadlineAt])

  useEffect(() => {
    if (mode !== 'live') return undefined

    const preventBack = (event) => {
      event.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', preventBack)

    return () => window.removeEventListener('popstate', preventBack)
  }, [mode])

  async function loadLeaderboard() {
    try {
      const data = await fetchRankedLeaderboard()
      setLeaderboard(data?.leaderboard?.slice(0, 10) || [])
    } catch {
      setLeaderboard([])
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  function handleFindMatch() {
    const socket = getRankedSocket()

    // No server configured at all — go straight to offline bot
    if (!socket) {
      startOfflineMatch()
      return
    }

    setError('')
    setMode('searching')

    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    // 10-minute overall fallback (server bot or offline bot)
    fallbackTimerRef.current = window.setTimeout(() => {
      if (modeRef.current === 'searching') startOfflineMatch()
    }, 600000)

    if (socket.connected) {
      setStatusText('Finding match… bot fallback in 10 minutes if no opponent found.')
      socket.emit('match:find')
    } else {
      // Server is waking up (Render free tier cold start ~50s) — wait for connection
      setStatusText('Connecting to server… this may take up to 60 seconds on first load.')
      socket.once('connect', () => {
        if (modeRef.current !== 'searching') return
        setStatusText('Finding match… bot fallback in 10 minutes if no opponent found.')
        socket.emit('match:find')
      })
    }
  }

  function buildOfflineQuestions() {
    const out = []
    for (let i = 0; i < QUESTION_LIMIT; i += 1) {
      const base = OFFLINE_QUESTIONS[i % OFFLINE_QUESTIONS.length]
      out.push({
        ...base,
        id: `${base.id}-${i + 1}`,
      })
    }
    return out
  }

  function startOfflineMatch() {
    const generatedMatchId = `offline-${Date.now()}`
    const questions = buildOfflineQuestions()
    offlineRef.current = {
      matchId: generatedMatchId,
      questions,
      index: 0,
      myScore: 0,
      botScore: 0,
      myTimeMs: 0,
      botTimeMs: 0,
      answers: {},
    }

    setIsOfflineMode(true)
    setMatchId(generatedMatchId)
    setOpponent({ userId: 'lexis-bot', name: 'Lexis Bot', avatar: null })
    setMode('found')
    setStatusText('Bot fallback match found.')
    setProgress(`0/${QUESTION_LIMIT}`)
    setSelectedChoiceId(null)
    setSubmittedQuestionIds({})
    setResult(null)
    setError('')

    window.setTimeout(() => {
      setMode('live')
      setStatusText('Offline ranked battle started.')
      nextOfflineQuestion()
    }, 600)
  }

  function nextOfflineQuestion() {
    const state = offlineRef.current
    if (!state) return

    if (state.index >= state.questions.length) {
      finishOfflineMatch()
      return
    }

    const q = state.questions[state.index]
    state.index += 1
    setQuestion({ id: q.id, content: q.content, choices: q.choices })
    setProgress(`${state.index}/${QUESTION_LIMIT}`)
    setSelectedChoiceId(null)
    questionStartedAtRef.current = Date.now()
    tabSwitchCountRef.current = 0
    const deadline = Date.now() + QUESTION_TIME_MS
    setDeadlineAt(deadline)
    setTimeLeftMs(QUESTION_TIME_MS)
  }

  function finishOfflineMatch() {
    const state = offlineRef.current
    if (!state || !profile) return

    const meId = String(profile.id || profile.userId)
    const botId = 'lexis-bot'
    let winnerId = null
    if (state.myScore > state.botScore) winnerId = meId
    else if (state.botScore > state.myScore) winnerId = botId
    else if (state.myTimeMs < state.botTimeMs) winnerId = meId
    else if (state.botTimeMs < state.myTimeMs) winnerId = botId

    const ratingDelta = winnerId === meId ? 24 : winnerId === botId ? -18 : 2
    const review = state.questions.map((q) => {
      const myChoice = state.answers[q.id]
      return {
        questionId: q.id,
        content: q.content,
        choices: q.choices,
        myChoice,
        correctChoiceId: q.correctChoiceId,
        isCorrect: myChoice === q.correctChoiceId,
        explanation: q.explanation,
      }
    })

    const payload = {
      matchId: state.matchId,
      me: meId,
      opponent: { userId: botId, name: 'Lexis Bot' },
      winnerId,
      isDraw: !winnerId,
      score: { [meId]: state.myScore, [botId]: state.botScore },
      totalTimeMs: { [meId]: state.myTimeMs, [botId]: state.botTimeMs },
      rating: { [meId]: { delta: ratingDelta } },
      review,
    }

    setMode('result')
    setResult(payload)
    setQuestion(null)
    setDeadlineAt(0)
    setTimeLeftMs(0)
    setStatusText(payload.isDraw ? 'Draw game.' : payload.winnerId === payload.me ? 'You won.' : 'You lost.')
  }

  function submitChoice(choiceId) {
    if (mode !== 'live' || !question || !matchId) return
    if (submittedQuestionIds[question.id]) return

    setSelectedChoiceId(choiceId)

    if (isOfflineMode) {
      const state = offlineRef.current
      if (!state) return
      const base = state.questions.find((item) => item.id === question.id)
      if (!base) return

      const elapsedMs = Math.min(QUESTION_TIME_MS, Math.max(0, Date.now() - questionStartedAtRef.current))
      state.answers[question.id] = choiceId
      if (choiceId === base.correctChoiceId) state.myScore += 1
      state.myTimeMs += elapsedMs

      const botElapsed = 12000 + Math.floor(Math.random() * 15000)
      const botCorrect = Math.random() < 0.6
      if (botCorrect) state.botScore += 1
      state.botTimeMs += botElapsed

      setSubmittedQuestionIds((prev) => ({ ...prev, [question.id]: true }))
      window.setTimeout(() => {
        nextOfflineQuestion()
      }, 320)
      return
    }

    const socket = getRankedSocket()
    if (!socket) {
      setError('Realtime connection unavailable. Please try again.')
      return
    }

    const elapsedMs = Math.max(0, Date.now() - questionStartedAtRef.current)
    socket.emit('answer:submit', {
      matchId,
      questionId: question.id,
      choiceId,
      elapsedMs,
      tabSwitchCount: tabSwitchCountRef.current,
    })

    setSubmittedQuestionIds((prev) => ({ ...prev, [question.id]: true }))
  }

  const ratingDelta = useMemo(() => {
    if (!result || !myId) return 0
    const rating = result.rating?.[myId]
    return rating?.delta || 0
  }, [result, myId])

  return (
    <div className="px-4 pb-8 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-cyan-700 to-emerald-700 p-5 mt-2 border border-white/10 shadow-elev3">
        <div className="text-xs text-cyan-100">Ranked 1v1 Law Arena</div>
        <h1 className="text-xl font-bold text-white mt-1">Real-time Matchmaking</h1>
        <div className="mt-3 text-sm text-cyan-100">{statusText}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">20 questions</span>
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">35s each</span>
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">ELO +-100</span>
          {profile?.rating ? <span className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-300/30 text-amber-100">Rating {profile.rating}</span> : null}
        </div>
      </div>

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      {mode === 'idle' || mode === 'searching' || mode === 'found' ? (
        <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
          <div className="text-sm text-md-onsurfvar">
            Find an opponent close to your rank. If no match is found in 10 minutes, you will face an AI bot.
          </div>
          {isOfflineMode && mode === 'searching' ? <div className="text-xs text-amber-300">No realtime server — bot match will start shortly.</div> : null}
          {queueMeta?.searching ? <div className="text-xs text-md-onsurfvar">Queue timeout: {Math.round((queueMeta.timeoutMs || 0) / 1000)}s</div> : null}
          {opponent ? (
            <div className="bg-md-surf2 border border-md-outline/50 rounded-2xl p-3">
              <div className="text-xs text-md-onsurfvar">Opponent</div>
              <div className="text-sm font-semibold text-md-onsurf mt-0.5">{opponent.name}</div>
            </div>
          ) : null}
          <button
            onClick={handleFindMatch}
            disabled={mode === 'searching'}
            className="w-full h-11 rounded-xl bg-md-primary text-white font-semibold disabled:opacity-60"
          >
            {mode === 'searching' ? 'Searching...' : 'Find Match'}
          </button>
        </div>
      ) : null}

      {mode === 'live' && question ? (
        <div className="space-y-3">
          <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4">
            <div className="flex items-center justify-between text-xs text-md-onsurfvar mb-2">
              <span>{progress}</span>
              <span className="text-amber-300 font-semibold">{formatMs(timeLeftMs)}</span>
            </div>
            <div className="h-1.5 bg-md-surf3 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400"
                style={{ width: `${Math.max(0, Math.min(100, (timeLeftMs / 35000) * 100))}%` }}
              />
            </div>
            <div className="text-sm font-semibold text-md-onsurf">{question.content}</div>
          </div>

          <div className="space-y-2">
            {question.choices.map((choice) => {
              const active = selectedChoiceId === choice.id
              const locked = Boolean(submittedQuestionIds[question.id])
              return (
                <button
                  key={choice.id}
                  onClick={() => submitChoice(choice.id)}
                  disabled={locked}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-colors ${active
                    ? 'border-cyan-400 bg-cyan-500/10 text-white'
                    : 'border-md-outline/50 bg-md-surf2 text-md-onsurfvar hover:text-md-onsurf'} ${locked ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span className="font-semibold mr-2">{choice.id}</span>{choice.text}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {mode === 'result' && result ? (
        <div className="space-y-4">
          <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4">
            <div className="text-sm text-md-onsurfvar">Match Result</div>
            <div className="text-lg font-bold text-md-onsurf mt-1">
              {result.isDraw ? 'Draw' : result.winnerId === result.me ? 'Victory' : 'Defeat'}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div className="bg-md-surf2 rounded-xl p-2.5 border border-md-outline/50">
                <div className="text-xs text-md-onsurfvar">Your Score</div>
                <div className="text-base font-semibold text-md-onsurf">{meScore}</div>
                <div className="text-xs text-md-onsurfvar">Time {formatMs(result.totalTimeMs?.[result.me])}</div>
              </div>
              <div className="bg-md-surf2 rounded-xl p-2.5 border border-md-outline/50">
                <div className="text-xs text-md-onsurfvar">Opponent Score</div>
                <div className="text-base font-semibold text-md-onsurf">{themScore}</div>
                <div className="text-xs text-md-onsurfvar">Time {formatMs(result.totalTimeMs?.[result.opponent?.userId])}</div>
              </div>
            </div>
            <div className={`mt-3 text-sm font-semibold ${ratingDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              Rank Change: {ratingDelta >= 0 ? '+' : ''}{ratingDelta}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={handleFindMatch} className="h-10 rounded-xl bg-md-primary text-white text-sm font-semibold">Play Again</button>
              <button onClick={() => onNavigate('study')} className="h-10 rounded-xl bg-md-surf2 border border-md-outline/60 text-md-onsurf text-sm font-semibold">Review Answers</button>
            </div>
          </div>

          <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
            <h2 className="text-base font-semibold text-md-onsurf">Post-Match AI Learning Review</h2>
            {(result.review || []).slice(0, 8).map((item, index) => (
              <div key={item.questionId} className="bg-md-surf2 border border-md-outline/50 rounded-2xl p-3 text-xs space-y-1.5">
                <div className="text-md-onsurf font-semibold">Q{index + 1}: {item.content}</div>
                <div className="text-md-onsurfvar">Your answer: {item.myChoice || 'No answer'}</div>
                <div className="text-emerald-300">Correct: {item.correctChoiceId}</div>
                <div><span className="text-md-primary font-semibold">Issue:</span> <span className="text-md-onsurfvar">{item.explanation.issue}</span></div>
                <div><span className="text-md-primary font-semibold">Rule:</span> <span className="text-md-onsurfvar">{item.explanation.rule}</span></div>
                <div><span className="text-md-primary font-semibold">Application:</span> <span className="text-md-onsurfvar">{item.explanation.application}</span></div>
                <div><span className="text-md-primary font-semibold">Conclusion:</span> <span className="text-md-onsurfvar">{item.explanation.conclusion}</span></div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4">
        <h2 className="text-base font-semibold text-md-onsurf mb-3">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between bg-md-surf2 border border-md-outline/50 rounded-xl px-3 py-2 text-sm">
              <div className="text-md-onsurf">#{entry.rankPosition} {entry.name}</div>
              <div className="text-md-onsurfvar">{entry.rating}</div>
            </div>
          ))}
          {!leaderboard.length ? <div className="text-sm text-md-onsurfvar">No ranked data yet.</div> : null}
        </div>
      </div>
    </div>
  )
}
