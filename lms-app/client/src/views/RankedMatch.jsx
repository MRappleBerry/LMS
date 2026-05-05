import { useEffect, useMemo, useRef, useState } from 'react'
import PlayerCard from '../components/ranked/PlayerCard'
import RankBadge, { getTierByRating } from '../components/ranked/RankBadge'
import LeaderboardItem from '../components/ranked/LeaderboardItem'
import AvatarView from '../components/ranked/AvatarView'
import { fetchRankedLeaderboard } from '../lib/rankedApi'
import { connectRankedSocket, disconnectRankedSocket, getRankedSocket } from '../lib/rankedSocket'

const QUESTION_LIMIT = 20
const QUESTION_TIME_MS = 35000
const MATCH_FALLBACK_MS = 600000
const CONNECT_TIMEOUT_MS = 20000
const DEFAULT_ELO = 800

const AVATAR_PRESETS = [
  { id: 'av-law-1', label: 'Justice', value: '⚖️' },
  { id: 'av-law-2', label: 'Barrister', value: '👩‍⚖️' },
  { id: 'av-law-3', label: 'Counsel', value: '👨‍⚖️' },
  { id: 'av-law-4', label: 'Codex', value: '📚' },
  { id: 'av-law-5', label: 'Forum', value: '🏛️' },
  { id: 'av-law-6', label: 'Minimal', value: '◉' },
]

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

function formatSearchEta(elapsedMs) {
  if (elapsedMs < 30000) return 'Estimated wait: 20-45s'
  if (elapsedMs < 120000) return 'Estimated wait: 45-90s'
  return 'Searching wider ELO range...'
}

async function warmRealtimeServer() {
  const baseUrl = (import.meta.env.VITE_MATCH_WS_URL || '').replace(/\/$/, '')
  if (!baseUrl) return
  try {
    await fetch(`${baseUrl}/health`, { method: 'GET' })
  } catch {
    // best-effort wake-up request only
  }
}

function getRankedDeviceId() {
  const key = 'lexisai.ranked.deviceId'
  let value = localStorage.getItem(key)
  if (!value) {
    value = Math.random().toString(36).slice(2, 10)
    localStorage.setItem(key, value)
  }
  return value
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
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [streak, setStreak] = useState(0)
  const [searchStartedAt, setSearchStartedAt] = useState(0)
  const [searchElapsedMs, setSearchElapsedMs] = useState(0)
  const [preMatchLeftMs, setPreMatchLeftMs] = useState(0)
  const [toast, setToast] = useState(null)
  const [disconnectNotice, setDisconnectNotice] = useState('')

  const questionStartedAtRef = useRef(0)
  const tabSwitchCountRef = useRef(0)
  const fallbackTimerRef = useRef(null)
  const connectTimerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const offlineRef = useRef(null)
  const modeRef = useRef(mode)
  const audioCtxRef = useRef(null)
  const searchMusicRef = useRef(null)

  const myId = profile?.id || user?.id || null
  const meScore = result?.score?.[myId] ?? null
  const themScore = result?.score?.[result?.opponent?.userId] ?? null

  function stopSearchMusic() {
    const music = searchMusicRef.current
    if (!music) return

    if (music.intervalId) window.clearInterval(music.intervalId)
    if (music.oscA) music.oscA.stop()
    if (music.oscB) music.oscB.stop()

    if (music.gainA) music.gainA.disconnect()
    if (music.gainB) music.gainB.disconnect()
    if (music.master) music.master.disconnect()

    searchMusicRef.current = null
  }

  function showToast(message, tone = 'info') {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    setToast({ message, tone })
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 3200)
  }

  async function startSearchMusic() {
    if (searchMusicRef.current) return true

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return false

    const ctx = audioCtxRef.current || new AudioCtx()
    audioCtxRef.current = ctx

    // Explicitly unlock audio on mobile browsers (iOS Safari especially)
    if (ctx.state !== 'running') {
      try {
        await ctx.resume()
      } catch {
        return false
      }
    }

    // Tiny one-shot unlock pulse to guarantee output route activation
    try {
      const unlockGain = ctx.createGain()
      unlockGain.gain.value = 0.0001
      unlockGain.connect(ctx.destination)
      const unlockOsc = ctx.createOscillator()
      unlockOsc.frequency.value = 440
      unlockOsc.connect(unlockGain)
      unlockOsc.start()
      unlockOsc.stop(ctx.currentTime + 0.02)
      window.setTimeout(() => unlockGain.disconnect(), 40)
    } catch {
      // continue; not fatal if unlock pulse fails
    }

    const master = ctx.createGain()
    master.gain.value = 0.12
    master.connect(ctx.destination)

    const oscA = ctx.createOscillator()
    oscA.type = 'sawtooth'
    oscA.frequency.value = 392
    const gainA = ctx.createGain()
    gainA.gain.value = 0.09
    oscA.connect(gainA)
    gainA.connect(master)

    const oscB = ctx.createOscillator()
    oscB.type = 'triangle'
    oscB.frequency.value = 523
    const gainB = ctx.createGain()
    gainB.gain.value = 0.05
    oscB.connect(gainB)
    gainB.connect(master)

    oscA.start()
    oscB.start()

    const notes = [392, 440, 494, 523]
    let noteIdx = 0
    const intervalId = window.setInterval(() => {
      if (!searchMusicRef.current) return
      noteIdx = (noteIdx + 1) % notes.length
      const next = notes[noteIdx]
      oscA.frequency.setTargetAtTime(next, ctx.currentTime, 0.08)
      oscB.frequency.setTargetAtTime(next * 1.25, ctx.currentTime, 0.08)

      // subtle rhythmic pulse to make it clearly audible on small speakers
      gainA.gain.cancelScheduledValues(ctx.currentTime)
      gainA.gain.setValueAtTime(0.055, ctx.currentTime)
      gainA.gain.linearRampToValueAtTime(0.11, ctx.currentTime + 0.08)
      gainA.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.24)
    }, 520)

    searchMusicRef.current = { oscA, oscB, gainA, gainB, master, intervalId }
    return true
  }

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const deviceId = getRankedDeviceId()
    const accountId = user?.id || localStorage.getItem('lexisai.user.id') || 'guest'

    const safeProfile = {
      // device-scoped ID allows same account on two phones to still match each other
      userId: `${accountId}:${deviceId}`,
      name: user?.name || 'Law Learner',
      avatar: localStorage.getItem('lexisai.user.avatar') || user?.avatarUrl || '⚖️',
    }

    setProfile(safeProfile)
    setStreak(Number(localStorage.getItem(`lexisai.ranked.streak.${safeProfile.userId}`) || 0))

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
      setIsOfflineMode(false)
    }

    function onQueue(payload) {
      if (payload?.searching === false) {
        stopSearchMusic()
        setMode('idle')
        setQueueMeta(null)
        setSearchStartedAt(0)
        setSearchElapsedMs(0)
        setStatusText(payload?.cancelled ? 'Matchmaking cancelled.' : 'Ready for ranked battle.')
        return
      }

      setMode('searching')
      setQueueMeta(payload)
      setSearchStartedAt(Date.now())
      setSearchElapsedMs(0)
      setStatusText('Searching for opponent… A bot will fill in after 10 minutes if no one joins.')
      startSearchMusic()
    }

    function onFound(payload) {
      stopSearchMusic()
      setMatchId(payload.matchId)
      setOpponent({
        ...payload.opponent,
        avatar: payload?.opponent?.avatar || (payload.botMatch ? '🤖' : '⚖️'),
      })
      setMode('found')
      setStatusText(payload.botMatch ? 'Bot fallback match found.' : 'Opponent found.')
      setProgress(`0/${payload.questionCount || QUESTION_LIMIT}`)
      setSubmittedQuestionIds({})
      setSelectedChoiceId(null)
      setResult(null)
      setError('')
    }

    function onStart(payload) {
      stopSearchMusic()
      const startsAt = Number(payload?.startsAt || Date.now() + 2200)
      setMode('countdown')
      setStatusText('Arena lock-in... prepare your first answer.')
      setDeadlineAt(startsAt)
      setPreMatchLeftMs(Math.max(0, startsAt - Date.now()))
    }

    function onQuestion(payload) {
      setMode('live')
      setQuestion(payload.question)
      setProgress(payload.progress || `0/${QUESTION_LIMIT}`)
      setDeadlineAt(Number(payload.deadlineAt || 0))
      setTimeLeftMs(Math.max(0, Number(payload.deadlineAt || 0) - Date.now()))
      setSelectedChoiceId(null)
      questionStartedAtRef.current = Date.now()
      tabSwitchCountRef.current = 0
    }

    function onMatchEnd(payload) {
      stopSearchMusic()
      setMode('result')
      setResult(payload)
      setStatusText(payload.isDraw ? 'Draw game.' : payload.winnerId === payload.me ? 'You won.' : 'You lost.')
      setQuestion(null)
      setDeadlineAt(0)
      setTimeLeftMs(0)
      setSearchStartedAt(0)

      const didWin = payload.winnerId && payload.winnerId === payload.me
      const nextStreak = didWin ? streak + 1 : 0
      setStreak(nextStreak)
      localStorage.setItem(`lexisai.ranked.streak.${String(payload.me || profile?.userId || 'guest')}`, String(nextStreak))

      const myRating = payload?.rating?.[payload.me]
      if (myRating?.after) {
        setProfile((prev) => ({ ...(prev || {}), rating: myRating.after }))
      }

      loadLeaderboard()
    }

    function onMatchAborted(payload) {
      stopSearchMusic()
      setMode('idle')
      setQueueMeta(null)
      setSearchStartedAt(0)
      setSearchElapsedMs(0)
      setMatchId('')
      setQuestion(null)
      setDeadlineAt(0)
      setTimeLeftMs(0)
      setSelectedChoiceId(null)
      setSubmittedQuestionIds({})
      setOpponent(null)
      const msg = payload?.message || 'Player has disconnected. Match aborted.'
      setStatusText(msg)
      showToast(msg, 'warning')
      setDisconnectNotice(msg)
      setError('')
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
    socket.on('match:aborted', onMatchAborted)
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
      socket.off('match:aborted', onMatchAborted)
      socket.off('match:error', onMatchError)
      socket.off('connect_error', onConnectError)
      document.removeEventListener('visibilitychange', onVisibility)
      stopSearchMusic()
      disconnectRankedSocket()
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
      if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current)
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
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
    if (mode !== 'countdown' || !deadlineAt) return undefined
    const timer = setInterval(() => {
      setPreMatchLeftMs(Math.max(0, deadlineAt - Date.now()))
    }, 80)
    return () => clearInterval(timer)
  }, [mode, deadlineAt])

  useEffect(() => {
    if (mode !== 'searching' || !searchStartedAt) return undefined
    const timer = setInterval(() => {
      setSearchElapsedMs(Math.max(0, Date.now() - searchStartedAt))
    }, 300)
    return () => clearInterval(timer)
  }, [mode, searchStartedAt])

  useEffect(() => {
    if (mode !== 'live' || !deadlineAt) return undefined
    const timer = setInterval(() => {
      setTimeLeftMs(Math.max(0, deadlineAt - Date.now()))
    }, 250)
    return () => clearInterval(timer)
  }, [mode, deadlineAt])

  useEffect(() => {
    if (mode !== 'live' && mode !== 'countdown') return undefined

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
      setLeaderboard(data?.leaderboard || [])
    } catch {
      setLeaderboard([])
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function handleFindMatch() {
    const socket = getRankedSocket()

    // No server configured at all — go straight to offline bot
    if (!socket) {
      startOfflineMatch()
      return
    }

    setError('')
    setMode('searching')
    setSearchStartedAt(Date.now())
    setSearchElapsedMs(0)
    setQueueMeta({ searching: true, timeoutMs: MATCH_FALLBACK_MS })
    await startSearchMusic()
    await warmRealtimeServer()

    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    // 10-minute overall fallback (server bot or offline bot)
    fallbackTimerRef.current = window.setTimeout(() => {
      if (modeRef.current === 'searching') startOfflineMatch()
    }, MATCH_FALLBACK_MS)

    if (socket.connected) {
      setStatusText('Finding match… bot fallback in 10 minutes if no opponent found.')
      socket.emit('match:find')
    } else {
      // Server is waking up (Render free tier cold start ~50s) — wait for connection
      setStatusText('Connecting to server… this may take up to 60 seconds on first load.')
      setError('')

      if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current)
      connectTimerRef.current = window.setTimeout(() => {
        if (modeRef.current !== 'searching' || socket.connected) return
        setError('Still connecting to realtime server... keep this screen open for a few seconds.')
      }, CONNECT_TIMEOUT_MS)

      socket.connect()

      socket.once('connect', () => {
        if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current)
        if (modeRef.current !== 'searching') return
        setIsOfflineMode(false)
        setError('')
        setStatusText('Finding match… bot fallback in 10 minutes if no opponent found.')
        socket.emit('match:find')
      })

      socket.once('connect_error', () => {
        if (modeRef.current !== 'searching') return
        setError('Realtime server not ready yet. Retrying automatically...')
      })
    }
  }

  function handleCancelMatch() {
    stopSearchMusic()
    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current)
    const socket = getRankedSocket()
    if (socket?.connected) socket.emit('match:cancel')
    setMode('idle')
    setQueueMeta(null)
    setSearchStartedAt(0)
    setSearchElapsedMs(0)
    setStatusText('Matchmaking cancelled.')
  }

  function handleAvatarSelect(value) {
    setProfile((prev) => ({ ...(prev || {}), avatar: value }))
    localStorage.setItem('lexisai.user.avatar', value)
    setShowAvatarPicker(false)
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
    stopSearchMusic()
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
    setOpponent({ userId: 'lexis-bot', name: 'Lexis Bot', avatar: '🤖', rating: Number(profile?.rating || DEFAULT_ELO) + 20 })
    setMode('found')
    setStatusText('Bot fallback match found.')
    setProgress(`0/${QUESTION_LIMIT}`)
    setSelectedChoiceId(null)
    setSubmittedQuestionIds({})
    setResult(null)
    setError('')

    window.setTimeout(() => {
      setMode('countdown')
      setDeadlineAt(Date.now() + 2000)
      setPreMatchLeftMs(2000)
      setStatusText('Offline ranked battle started.')
      window.setTimeout(() => {
        setMode('live')
        nextOfflineQuestion()
      }, 2000)
    }, 300)
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

  const topTen = useMemo(() => leaderboard.slice(0, 10), [leaderboard])
  const currentUserEntry = useMemo(() => {
    if (!myId) return null
    return leaderboard.find((entry) => String(entry.id) === String(myId)) || null
  }, [leaderboard, myId])

  const preMatchCountdown = Math.max(1, Math.ceil(preMatchLeftMs / 1000))
  const myRatingAfter = result?.rating?.[myId]?.after
  const myRatingBefore = result?.rating?.[myId]?.before
  const didRankUp = Number.isFinite(myRatingAfter) && Number.isFinite(myRatingBefore)
    ? getTierByRating(myRatingAfter).key !== getTierByRating(myRatingBefore).key
    : false

  return (
    <div className="px-4 pb-8 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-[#181247] via-[#174677] to-[#0f6963] p-5 mt-2 border border-white/10 shadow-elev3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-cyan-100/90">Ranked 1v1 Law Arena</div>
            <h1 className="text-xl font-black text-white mt-1 tracking-tight">Enter The Competitive Bench</h1>
          </div>
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="h-11 w-11 rounded-2xl border border-white/25 bg-white/10 text-xl grid place-items-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Open avatar picker"
          >
            <AvatarView
              avatar={profile?.avatar}
              className="h-11 w-11 rounded-2xl overflow-hidden grid place-items-center"
              textClassName="text-xl"
              alt="Current avatar"
            />
          </button>
        </div>
        <div className="mt-3 text-sm text-cyan-100">{statusText}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">20 questions</span>
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">35s each</span>
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100">ELO +-100</span>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/30 text-emerald-100">+20 first win today</span>
          <span className="px-2 py-1 rounded-full bg-violet-500/20 border border-violet-300/30 text-violet-100">Weekly rank rewards active</span>
        </div>
      </div>

      <PlayerCard profile={profile} streak={streak} onAvatarClick={() => setShowAvatarPicker(true)} />

      {toast ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
          <div className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${toast.tone === 'warning'
            ? 'bg-amber-500/15 border-amber-300/40 text-amber-100'
            : 'bg-cyan-500/15 border-cyan-300/40 text-cyan-100'}`}>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Notification</div>
            <div className="text-sm mt-0.5">{toast.message}</div>
          </div>
        </div>
      ) : null}

      {disconnectNotice ? (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm px-4 grid place-items-center">
          <div className="w-full max-w-sm rounded-3xl border border-amber-300/45 bg-[#171224] p-4 shadow-xl">
            <div className="text-[11px] uppercase tracking-wide text-amber-200/85">Match Alert</div>
            <h3 className="text-base font-bold text-amber-100 mt-1">Player Disconnected</h3>
            <p className="text-sm text-amber-50/90 mt-2">{disconnectNotice}</p>
            <button
              onClick={() => setDisconnectNotice('')}
              className="mt-4 w-full h-10 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-100 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      {(mode === 'idle' || mode === 'searching') ? (
        <div className="bg-md-surf border border-md-outline/60 rounded-3xl p-4 space-y-3">
          <div className="text-sm text-md-onsurfvar leading-relaxed">
            Match with players near your rank. If none found, AI will take over.
          </div>
          {mode === 'searching' ? (
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2.5">
              <div className="text-sm text-cyan-100 flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="typing-dot">•</span>
                  <span className="typing-dot">•</span>
                  <span className="typing-dot">•</span>
                </span>
                Searching for opponent...
              </div>
              <div className="mt-1 text-xs text-cyan-100/80">{formatSearchEta(searchElapsedMs)}</div>
              <div className="text-xs text-cyan-100/70 mt-0.5">Fallback bot in {Math.round((queueMeta?.timeoutMs || MATCH_FALLBACK_MS) / 60000)} minutes.</div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleFindMatch}
              disabled={mode === 'searching'}
              className="h-11 rounded-xl bg-md-primary text-white font-semibold disabled:opacity-60 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {mode === 'searching' ? 'Searching...' : 'Find Match'}
            </button>
            <button
              onClick={handleCancelMatch}
              disabled={mode !== 'searching'}
              className="h-11 rounded-xl bg-md-surf2 border border-md-outline/60 text-md-onsurf font-semibold disabled:opacity-60 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>

          {isOfflineMode && mode === 'searching' ? <div className="text-xs text-amber-300">No realtime server yet. Waiting for fallback.</div> : null}
        </div>
      ) : null}

      {(mode === 'found' || mode === 'countdown') && opponent ? (
        <div className="rounded-3xl border border-cyan-300/35 bg-gradient-to-br from-[#11193a] to-[#19234b] p-4 space-y-4 shadow-[0_20px_40px_rgba(14,116,144,0.15)]">
          <div className="text-xs uppercase tracking-wide text-cyan-200/80">Match Found</div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center">
              <AvatarView
                avatar={profile?.avatar}
                className="h-14 w-14 mx-auto rounded-2xl border border-white/20 bg-white/5 overflow-hidden grid place-items-center"
                textClassName="text-2xl"
                alt="Your avatar"
              />
              <div className="text-sm font-bold text-cyan-200 mt-2 truncate">{profile?.name || 'You'}</div>
              <div className="text-xs text-cyan-100/70">ELO {profile?.rating || DEFAULT_ELO}</div>
              <div className="mt-1"><RankBadge rating={profile?.rating || DEFAULT_ELO} compact /></div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-black text-amber-300 animate-pulse">VS</div>
              <div className="text-xs text-cyan-100/70 mt-1">{mode === 'countdown' ? `Starting in ${preMatchCountdown}` : 'Locking arena...'}</div>
            </div>

            <div className="text-center">
              <AvatarView
                avatar={opponent?.avatar}
                className="h-14 w-14 mx-auto rounded-2xl border border-white/20 bg-white/5 overflow-hidden grid place-items-center"
                textClassName="text-2xl"
                alt="Opponent avatar"
              />
              <div className="text-sm font-bold text-rose-200 mt-2 truncate">{opponent?.name || 'Opponent'}</div>
              <div className="text-xs text-rose-100/70">ELO {opponent?.rating || '???'}</div>
              <div className="mt-1"><RankBadge rating={opponent?.rating || DEFAULT_ELO} compact /></div>
            </div>
          </div>
        </div>
      ) : null}

      {mode === 'live' && question ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-md-surf border border-md-outline/60 rounded-2xl px-4 py-2.5">
            <div className="text-center flex-1">
              <AvatarView
                avatar={profile?.avatar}
                className="h-8 w-8 mx-auto rounded-lg border border-white/15 bg-white/5 overflow-hidden grid place-items-center"
                textClassName="text-base"
                alt="Your avatar"
              />
              <div className="text-sm font-bold text-cyan-300 truncate mt-1">{profile?.name || 'You'}</div>
            </div>
            <div className="text-xs font-black text-amber-400 px-3">VS</div>
            <div className="text-center flex-1">
              <AvatarView
                avatar={opponent?.avatar}
                className="h-8 w-8 mx-auto rounded-lg border border-white/15 bg-white/5 overflow-hidden grid place-items-center"
                textClassName="text-base"
                alt="Opponent avatar"
              />
              <div className="text-sm font-bold text-rose-300 truncate mt-1">{opponent?.name || 'Opponent'}</div>
            </div>
          </div>

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
          <div className={`relative overflow-hidden bg-md-surf border border-md-outline/60 rounded-3xl p-4 ${result.winnerId === result.me ? 'shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_0_40px_rgba(52,211,153,0.18)]' : ''}`}>
            {result.winnerId === result.me ? (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute left-6 top-3 text-xl animate-bounce">✨</div>
                <div className="absolute right-8 top-5 text-xl animate-bounce">🎉</div>
                <div className="absolute left-1/3 bottom-5 text-lg animate-bounce">🏆</div>
              </div>
            ) : null}
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
            <div className={`mt-3 text-lg font-black animate-pulse ${ratingDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {ratingDelta >= 0 ? '+' : ''}{ratingDelta} ELO
            </div>
            {didRankUp ? <div className="mt-1 text-xs font-semibold text-amber-300 animate-pulse">Rank Up Unlocked</div> : null}
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
          {topTen.map((entry) => (
            <LeaderboardItem
              key={entry.id}
              entry={entry}
              highlighted={String(entry.id) === String(myId)}
            />
          ))}
          {currentUserEntry && !topTen.find((item) => String(item.id) === String(currentUserEntry.id)) ? (
            <>
              <div className="text-[11px] text-md-onsurfvar py-1">Your Position</div>
              <LeaderboardItem entry={currentUserEntry} highlighted />
            </>
          ) : null}

          {!leaderboard.length ? (
            <div className="rounded-2xl border border-md-outline/60 bg-md-surf2 p-3 text-center">
              <div className="text-sm text-md-onsurfvar">Play your first match to get ranked.</div>
              <button onClick={handleFindMatch} className="mt-2 h-9 px-4 rounded-xl bg-md-primary text-white text-sm font-semibold">Start Match</button>
            </div>
          ) : null}
        </div>
      </div>

      {showAvatarPicker ? (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm px-4 grid place-items-center" onClick={() => setShowAvatarPicker(false)}>
          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0d1228] p-4" onClick={(event) => event.stopPropagation()}>
            <div className="text-sm text-cyan-100/80">Choose Avatar</div>
            <h3 className="text-base font-bold text-white mt-0.5">Set your arena identity</h3>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {AVATAR_PRESETS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.value)}
                  className="rounded-2xl border border-white/15 bg-white/5 py-3 hover:scale-[1.03] active:scale-95 transition-transform"
                >
                  <div className="text-2xl">{avatar.value}</div>
                  <div className="text-[11px] text-white/80 mt-1">{avatar.label}</div>
                </button>
              ))}
            </div>
            <button
              disabled
              className="mt-3 w-full h-10 rounded-xl border border-dashed border-white/20 text-xs text-white/50"
            >
              Custom upload (coming soon)
            </button>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="mt-2 w-full h-10 rounded-xl bg-md-surf2 border border-md-outline/60 text-sm text-md-onsurf"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
