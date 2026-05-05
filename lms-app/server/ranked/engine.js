const crypto = require('crypto')

const QUESTION_TIME_SECONDS = 35
const TOTAL_QUESTIONS = 20
const FIND_TIMEOUT_MS = 600000 // 10 minutes before bot fallback
const ELO_RANGE = 100

const userStore = new Map()
const queue = []
const matches = new Map()

const LAW_QUESTION_BANK = [
  {
    id: 'rq-001',
    content: 'Content-based restrictions on speech are generally tested under which standard?',
    choices: ['Rational basis', 'Strict scrutiny', 'Intermediate scrutiny', 'Substantial evidence test'],
    correctIndex: 1,
    irac: {
      issue: 'What standard applies to content-based speech restrictions?',
      rule: 'Content-based speech restrictions are presumptively unconstitutional and generally require strict scrutiny.',
      application: 'Because the regulation targets message content, the State must show a compelling interest and narrow tailoring.',
      conclusion: 'Strict scrutiny governs.',
    },
  },
  {
    id: 'rq-002',
    content: 'In Philippine criminal procedure, a valid waiver of right to counsel during custodial investigation must be:',
    choices: ['Oral and witnessed', 'Written only', 'Written and in the presence of counsel', 'Inferred from silence'],
    correctIndex: 2,
    irac: {
      issue: 'What makes waiver of counsel valid during custodial interrogation?',
      rule: 'Waiver must be in writing and made in the presence of counsel.',
      application: 'Any waiver lacking these safeguards is defective and can invalidate admissions.',
      conclusion: 'Written waiver with counsel present is required.',
    },
  },
  {
    id: 'rq-003',
    content: 'Venue in civil actions is generally:',
    choices: ['Jurisdictional and never waivable', 'A procedural matter that can be waived', 'Fixed by the plaintiff alone', 'Determined only by defendant residence'],
    correctIndex: 1,
    irac: {
      issue: 'Is improper venue always fatal?',
      rule: 'Venue is procedural and can be waived when not timely objected to.',
      application: 'Failure to raise improper venue seasonably usually allows the case to proceed.',
      conclusion: 'Venue is waivable.',
    },
  },
  {
    id: 'rq-004',
    content: 'Under labor law, the twin-notice rule primarily protects:',
    choices: ['Manager prerogative', 'Substantive due process only', 'Procedural due process in termination', 'Collective bargaining rights only'],
    correctIndex: 2,
    irac: {
      issue: 'What is the function of twin notice?',
      rule: 'Twin notice secures procedural due process in employee termination.',
      application: 'It gives notice of charges and notice of decision after opportunity to explain.',
      conclusion: 'It protects procedural due process.',
    },
  },
  {
    id: 'rq-005',
    content: 'Tax exemptions are interpreted:',
    choices: ['Liberally in favor of taxpayers', 'Strictly against taxpayers', 'As implied unless denied', 'Only through local ordinances'],
    correctIndex: 1,
    irac: {
      issue: 'How are tax exemption claims construed?',
      rule: 'Tax exemptions are strictly construed against the taxpayer.',
      application: 'Absent clear legal basis, exemption claims fail.',
      conclusion: 'Strict construction against taxpayer applies.',
    },
  },
  {
    id: 'rq-006',
    content: 'A co-owner may validly transfer:',
    choices: ['A specific segregated lot portion anytime', 'Only an undivided ideal share before partition', 'Nothing without unanimous approval', 'Entire property if in possession'],
    correctIndex: 1,
    irac: {
      issue: 'What may a co-owner alienate pre-partition?',
      rule: 'A co-owner may alienate only his undivided interest.',
      application: 'Specific portions generally require partition before exclusive transfer.',
      conclusion: 'Only ideal share is transferable before partition.',
    },
  },
  {
    id: 'rq-007',
    content: 'Hearsay is generally inadmissible because:',
    choices: ['It is always false', 'Declarant cannot be cross-examined on the statement', 'It is not written', 'It is made out of court'],
    correctIndex: 1,
    irac: {
      issue: 'Why is hearsay restricted?',
      rule: 'Hearsay is excluded because reliability cannot be tested through cross-examination of the declarant.',
      application: 'Out-of-court assertions offered for truth are barred absent exception.',
      conclusion: 'Cross-examination concern grounds the hearsay rule.',
    },
  },
  {
    id: 'rq-008',
    content: 'Search incident to lawful arrest requires first that:',
    choices: ['Arrest is lawful', 'Suspect consents', 'Officer has warrant', 'A prosecutor approves'],
    correctIndex: 0,
    irac: {
      issue: 'What condition validates search incident to arrest?',
      rule: 'The arrest itself must be lawful.',
      application: 'If arrest is invalid, derivative search evidence can be excluded.',
      conclusion: 'Lawful arrest is the foundational requirement.',
    },
  },
  {
    id: 'rq-009',
    content: 'Under the Revised Corporation Code, default corporate term is:',
    choices: ['25 years', '50 years', 'Perpetual unless otherwise provided', 'Until SEC renewal'],
    correctIndex: 2,
    irac: {
      issue: 'What is the default corporate term?',
      rule: 'Corporations generally have perpetual existence unless articles provide otherwise.',
      application: 'No fixed short term applies by default under updated statute.',
      conclusion: 'Default term is perpetual.',
    },
  },
  {
    id: 'rq-010',
    content: 'A buyer in good faith under Torrens doctrine must generally:',
    choices: ['Rely on title with no notice of defect and pay value', 'Inspect possession only', 'Purchase from any possessor', 'Wait 10 years before registering'],
    correctIndex: 0,
    irac: {
      issue: 'When is buyer protected as innocent purchaser for value?',
      rule: 'Protection generally requires reliance on title, payment of value, and absence of notice of defects.',
      application: 'Constructive or actual notice can defeat good faith.',
      conclusion: 'Title reliance plus good faith and value are required.',
    },
  },
]

while (LAW_QUESTION_BANK.length < 30) {
  const base = LAW_QUESTION_BANK[LAW_QUESTION_BANK.length % 10]
  LAW_QUESTION_BANK.push({
    ...base,
    id: `${base.id}-x${LAW_QUESTION_BANK.length}`,
  })
}

function hash(input) {
  const digest = crypto.createHash('sha256').update(String(input)).digest()
  return digest.readUInt32BE(0)
}

function seededShuffle(items, seed) {
  return [...items]
    .map((item, idx) => ({ item, idx, score: hash(`${seed}:${item.id || idx}`) }))
    .sort((a, b) => (a.score === b.score ? a.idx - b.idx : a.score - b.score))
    .map((x) => x.item)
}

function getOrCreateUser(profile = {}) {
  const id = String(profile.id || profile.userId || profile.googleId || `guest-${crypto.randomBytes(4).toString('hex')}`)
  if (!userStore.has(id)) {
    userStore.set(id, {
      id,
      name: profile.name || 'Law Learner',
      avatar: profile.avatar || null,
      rating: 1000,
      rank: 'Scholar I',
      wins: 0,
      losses: 0,
      draws: 0,
      matches: 0,
    })
  }
  const user = userStore.get(id)
  if (profile.name) user.name = profile.name
  if (profile.avatar) user.avatar = profile.avatar
  return user
}

function ratingToRank(rating) {
  if (rating >= 1800) return 'Justice Tier'
  if (rating >= 1600) return 'Counsel Tier'
  if (rating >= 1400) return 'Bar Ace Tier'
  if (rating >= 1200) return 'Advocate Tier'
  return 'Scholar I'
}

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function computeEloDelta(playerRating, opponentRating, result) {
  const expected = expectedScore(playerRating, opponentRating)
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0
  const raw = Math.round(28 * (score - expected))
  if (result === 'draw') return clamp(raw, -8, 8)
  if (result === 'win') return clamp(raw, 20, 30)
  return clamp(raw, -25, -15)
}

function buildQuestionSet(matchId) {
  const shuffled = seededShuffle(LAW_QUESTION_BANK, `match-q:${matchId}`)
  return shuffled.slice(0, TOTAL_QUESTIONS).map((q, index) => {
    const choiceOrder = seededShuffle(
      q.choices.map((text, choiceIndex) => ({ text, choiceIndex })),
      `match-c:${matchId}:${q.id}`
    )
    const correctChoiceId = choiceOrder.findIndex((c) => c.choiceIndex === q.correctIndex)
    return {
      id: q.id,
      order: index + 1,
      content: q.content,
      choices: choiceOrder.map((choice, idx) => ({ id: `C${idx + 1}`, text: choice.text })),
      correctChoiceId: `C${correctChoiceId + 1}`,
      irac: q.irac,
    }
  })
}

function getPublicQuestion(question) {
  return {
    id: question.id,
    order: question.order,
    content: question.content,
    choices: question.choices,
  }
}

function getQueueCandidate(user) {
  const index = queue.findIndex((entry) => {
    if (entry.userId === user.id) return false
    return Math.abs(entry.rating - user.rating) <= ELO_RANGE
  })
  if (index < 0) return null
  return queue.splice(index, 1)[0]
}

function removeQueueUser(userId) {
  const idx = queue.findIndex((entry) => entry.userId === userId)
  if (idx >= 0) return queue.splice(idx, 1)[0]
  return null
}

function clearQueueEntry(entry) {
  if (entry?.timeoutId) clearTimeout(entry.timeoutId)
}

function cancelQueuedUser(userId) {
  const entry = removeQueueUser(userId)
  if (entry) clearQueueEntry(entry)
  return entry
}

function createMatch(p1, p2, options = {}) {
  const matchId = `m-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
  const questions = buildQuestionSet(matchId)
  const now = Date.now()
  const match = {
    id: matchId,
    createdAt: now,
    startedAt: null,
    endedAt: null,
    player1Id: p1.id,
    player2Id: p2.id,
    isBotMatch: Boolean(options.isBotMatch),
    botMode: options.botMode || null,
    players: {
      [p1.id]: {
        userId: p1.id,
        name: p1.name,
        avatar: p1.avatar,
        ratingBefore: p1.rating,
        socketId: options.socketMap?.[p1.id] || null,
        score: 0,
        totalTimeMs: 0,
        answers: {},
      },
      [p2.id]: {
        userId: p2.id,
        name: p2.name,
        avatar: p2.avatar,
        ratingBefore: p2.rating,
        socketId: options.socketMap?.[p2.id] || null,
        score: 0,
        totalTimeMs: 0,
        answers: {},
      },
    },
    questions,
    questionIndex: -1,
    questionDeadlineAt: null,
    status: 'found',
  }
  matches.set(matchId, match)
  return match
}

function getOpponent(match, userId) {
  return match.player1Id === userId ? match.players[match.player2Id] : match.players[match.player1Id]
}

function getPlayer(match, userId) {
  return match.players[userId]
}

function moveToNextQuestion(match, io) {
  match.questionIndex += 1
  if (match.questionIndex >= match.questions.length) {
    finishMatch(match, io)
    return
  }

  const question = match.questions[match.questionIndex]
  const now = Date.now()
  match.questionDeadlineAt = now + QUESTION_TIME_SECONDS * 1000
  const payload = {
    matchId: match.id,
    question: getPublicQuestion(question),
    progress: `${match.questionIndex + 1}/${TOTAL_QUESTIONS}`,
    serverNow: now,
    deadlineAt: match.questionDeadlineAt,
    timeLimitSeconds: QUESTION_TIME_SECONDS,
  }

  ;[match.player1Id, match.player2Id].forEach((userId) => {
    const socketId = match.players[userId].socketId
    if (socketId) io.to(socketId).emit('question:send', payload)
  })

  setTimeout(() => {
    if (!matches.has(match.id) || match.status === 'ended') return
    if (match.questionIndex !== question.order - 1) return

    ;[match.player1Id, match.player2Id].forEach((userId) => {
      const player = getPlayer(match, userId)
      if (!player.answers[question.id]) {
        player.answers[question.id] = {
          questionId: question.id,
          choiceId: null,
          isCorrect: false,
          elapsedMs: QUESTION_TIME_SECONDS * 1000,
          autoSubmitted: true,
          tabSwitchCount: 0,
        }
        player.totalTimeMs += QUESTION_TIME_SECONDS * 1000
      }
    })

    moveToNextQuestion(match, io)
    // Ensure bot is triggered for the next question in bot matches
    if (match.isBotMatch) runBotForCurrentQuestion(match, io)
  }, QUESTION_TIME_SECONDS * 1000 + 120)
}

function allAnsweredCurrent(match) {
  if (match.questionIndex < 0 || match.questionIndex >= match.questions.length) return false
  const questionId = match.questions[match.questionIndex].id
  return Boolean(getPlayer(match, match.player1Id).answers[questionId]) && Boolean(getPlayer(match, match.player2Id).answers[questionId])
}

function submitAnswer(matchId, userId, payload, io) {
  const match = matches.get(matchId)
  if (!match || match.status !== 'live') return { ok: false, error: 'Match not active.' }

  const player = getPlayer(match, userId)
  if (!player) return { ok: false, error: 'Player not in match.' }

  const question = match.questions[match.questionIndex]
  if (!question) return { ok: false, error: 'No active question.' }

  const existing = player.answers[question.id]
  if (existing) return { ok: false, error: 'Answer already submitted for this question.' }

  const now = Date.now()
  const deadline = match.questionDeadlineAt || now
  const safeElapsed = clamp(Number(payload.elapsedMs || 0), 0, QUESTION_TIME_SECONDS * 1000)
  const forcedElapsed = clamp(deadline - now + safeElapsed, 0, QUESTION_TIME_SECONDS * 1000)
  const elapsedMs = clamp(Math.max(safeElapsed, QUESTION_TIME_SECONDS * 1000 - forcedElapsed), 0, QUESTION_TIME_SECONDS * 1000)

  const choiceId = typeof payload.choiceId === 'string' ? payload.choiceId : null
  const isCorrect = choiceId === question.correctChoiceId
  player.answers[question.id] = {
    questionId: question.id,
    choiceId,
    isCorrect,
    elapsedMs,
    autoSubmitted: false,
    tabSwitchCount: Number(payload.tabSwitchCount || 0),
  }

  if (isCorrect) player.score += 1
  player.totalTimeMs += elapsedMs

  if (allAnsweredCurrent(match)) {
    setTimeout(() => {
      if (!matches.has(match.id) || match.status !== 'live') return
      moveToNextQuestion(match, io)
    }, 350)
  }

  return { ok: true }
}

function runBotForCurrentQuestion(match, io) {
  if (!match.isBotMatch || match.status !== 'live') return
  const botId = match.player2Id
  const botPlayer = match.players[botId]
  const question = match.questions[match.questionIndex]
  if (!botPlayer || !question) return
  if (botPlayer.answers[question.id]) return

  const thinkDelay = 1200 + Math.floor(Math.random() * 2800)
  setTimeout(() => {
    if (!matches.has(match.id) || match.status !== 'live') return
    if (botPlayer.answers[question.id]) return

    const hitChance = 0.62
    const isCorrect = Math.random() < hitChance
    const choiceId = isCorrect
      ? question.correctChoiceId
      : question.choices[Math.floor(Math.random() * question.choices.length)].id

    submitAnswer(match.id, botId, {
      choiceId,
      elapsedMs: thinkDelay,
      tabSwitchCount: 0,
    }, io)
  }, thinkDelay)
}

function finalizeElo(match, winnerId) {
  const p1 = userStore.get(match.player1Id)
  const p2 = userStore.get(match.player2Id)
  if (!p1 || !p2) return

  const isDraw = !winnerId
  const p1Result = isDraw ? 'draw' : winnerId === p1.id ? 'win' : 'lose'
  const p2Result = isDraw ? 'draw' : winnerId === p2.id ? 'win' : 'lose'

  const delta1 = computeEloDelta(p1.rating, p2.rating, p1Result)
  const delta2 = computeEloDelta(p2.rating, p1.rating, p2Result)

  p1.rating += delta1
  p2.rating += delta2
  p1.rank = ratingToRank(p1.rating)
  p2.rank = ratingToRank(p2.rating)

  p1.matches += 1
  p2.matches += 1

  if (p1Result === 'win') p1.wins += 1
  if (p1Result === 'lose') p1.losses += 1
  if (p1Result === 'draw') p1.draws += 1

  if (p2Result === 'win') p2.wins += 1
  if (p2Result === 'lose') p2.losses += 1
  if (p2Result === 'draw') p2.draws += 1

  return {
    [p1.id]: { before: match.players[p1.id].ratingBefore, after: p1.rating, delta: delta1 },
    [p2.id]: { before: match.players[p2.id].ratingBefore, after: p2.rating, delta: delta2 },
  }
}

function finishMatch(match, io) {
  if (match.status === 'ended') return
  match.status = 'ended'
  match.endedAt = Date.now()

  const p1 = match.players[match.player1Id]
  const p2 = match.players[match.player2Id]

  let winnerId = null
  if (p1.score > p2.score) winnerId = p1.userId
  else if (p2.score > p1.score) winnerId = p2.userId
  else if (p1.totalTimeMs < p2.totalTimeMs) winnerId = p1.userId
  else if (p2.totalTimeMs < p1.totalTimeMs) winnerId = p2.userId

  const rating = finalizeElo(match, winnerId) || {}

  const baseResult = {
    matchId: match.id,
    winnerId,
    isDraw: !winnerId,
    score: {
      [p1.userId]: p1.score,
      [p2.userId]: p2.score,
    },
    totalTimeMs: {
      [p1.userId]: p1.totalTimeMs,
      [p2.userId]: p2.totalTimeMs,
    },
    rating,
  }

  ;[match.player1Id, match.player2Id].forEach((uid) => {
    const socketId = match.players[uid].socketId
    if (!socketId) return
    const result = {
      ...baseResult,
      me: uid,
      opponent: getOpponent(match, uid),
      review: match.questions.map((question) => {
        const answer = match.players[uid].answers[question.id]
        const myChoice = answer?.choiceId || null
        return {
          questionId: question.id,
          content: question.content,
          choices: question.choices,
          myChoice,
          correctChoiceId: question.correctChoiceId,
          isCorrect: myChoice === question.correctChoiceId,
          explanation: question.irac,
        }
      }),
    }
    io.to(socketId).emit('match:end', result)
  })
}

function getLeaderboard(limit = 50) {
  return [...userStore.values()]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((user, index) => ({
      rankPosition: index + 1,
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      rating: user.rating,
      rank: user.rank,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      matches: user.matches,
    }))
}

function initRankedEngine({ app, io }) {
  const socketByUser = new Map()

  io.on('connection', (socket) => {
    const user = getOrCreateUser({
      id: socket.handshake.query.userId,
      name: socket.handshake.query.name,
      avatar: socket.handshake.query.avatar,
    })

    socketByUser.set(user.id, socket.id)

    socket.emit('rank:sync', {
      id: user.id,
      name: user.name,
      rating: user.rating,
      rank: user.rank,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
    })

    socket.on('match:find', () => {
      cancelQueuedUser(user.id)

      const candidate = getQueueCandidate(user)
      if (candidate) {
        clearTimeout(candidate.timeoutId)
        const opponent = getOrCreateUser({ id: candidate.userId, name: candidate.name, avatar: candidate.avatar })

        const match = createMatch(user, opponent, {
          socketMap: {
            [user.id]: socket.id,
            [opponent.id]: socketByUser.get(opponent.id) || candidate.socketId,
          },
        })

        match.status = 'live'
        match.startedAt = Date.now()

        const p1Socket = match.players[user.id].socketId
        const p2Socket = match.players[opponent.id].socketId

        if (p1Socket) io.to(p1Socket).emit('match:found', {
          matchId: match.id,
          me: user,
          opponent,
          questionCount: TOTAL_QUESTIONS,
          questionTimeSeconds: QUESTION_TIME_SECONDS,
        })
        if (p2Socket) io.to(p2Socket).emit('match:found', {
          matchId: match.id,
          me: opponent,
          opponent: user,
          questionCount: TOTAL_QUESTIONS,
          questionTimeSeconds: QUESTION_TIME_SECONDS,
        })

        if (p1Socket) io.to(p1Socket).emit('match:start', { matchId: match.id, startsAt: Date.now() + 1200 })
        if (p2Socket) io.to(p2Socket).emit('match:start', { matchId: match.id, startsAt: Date.now() + 1200 })

        setTimeout(() => {
          if (!matches.has(match.id) || match.status !== 'live') return
          moveToNextQuestion(match, io)
        }, 1200)

        return
      }

      const timeoutId = setTimeout(() => {
        cancelQueuedUser(user.id)

        const bot = getOrCreateUser({
          id: `bot-${user.id}`,
          name: 'Lexis Bot',
          avatar: null,
        })
        bot.rating = user.rating + Math.floor((Math.random() * 80) - 40)

        const match = createMatch(user, bot, {
          isBotMatch: true,
          botMode: 'ai-bot',
          socketMap: {
            [user.id]: socket.id,
            [bot.id]: null,
          },
        })

        match.status = 'live'
        match.startedAt = Date.now()

        io.to(socket.id).emit('match:found', {
          matchId: match.id,
          me: user,
          opponent: { id: bot.id, name: bot.name, avatar: bot.avatar, rating: bot.rating },
          botMatch: true,
          questionCount: TOTAL_QUESTIONS,
          questionTimeSeconds: QUESTION_TIME_SECONDS,
        })

        io.to(socket.id).emit('match:start', { matchId: match.id, startsAt: Date.now() + 1000 })

        setTimeout(() => {
          if (!matches.has(match.id) || match.status !== 'live') return
          moveToNextQuestion(match, io)
          runBotForCurrentQuestion(match, io)
        }, 1000)
      }, FIND_TIMEOUT_MS)

      queue.push({
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating,
        socketId: socket.id,
        joinedAt: Date.now(),
        timeoutId,
      })

      socket.emit('match:queue', {
        searching: true,
        eloRange: ELO_RANGE,
        timeoutMs: FIND_TIMEOUT_MS,
      })
    })

    socket.on('match:cancel', () => {
      cancelQueuedUser(user.id)
      socket.emit('match:queue', {
        searching: false,
        cancelled: true,
      })
    })

    socket.on('answer:submit', (payload = {}) => {
      const matchId = payload.matchId
      const result = submitAnswer(matchId, user.id, payload, io)
      if (!result.ok) {
        socket.emit('match:error', { error: result.error })
        return
      }

      const match = matches.get(matchId)
      if (match && match.isBotMatch) runBotForCurrentQuestion(match, io)
    })

    socket.on('disconnect', () => {
      cancelQueuedUser(user.id)
      socketByUser.delete(user.id)
    })
  })

  app.post('/match/find', (req, res) => {
    const user = getOrCreateUser(req.body || {})
    return res.json({
      user,
      status: 'queued',
      note: 'Use socket event match:find for real-time pairing.',
      eloRange: ELO_RANGE,
      timeoutMs: FIND_TIMEOUT_MS,
    })
  })

  app.get('/match/:id', (req, res) => {
    const match = matches.get(String(req.params.id))
    if (!match) return res.status(404).json({ error: 'Match not found.' })

    return res.json({
      id: match.id,
      status: match.status,
      createdAt: match.createdAt,
      startedAt: match.startedAt,
      endedAt: match.endedAt,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      questionIndex: match.questionIndex,
      questionDeadlineAt: match.questionDeadlineAt,
    })
  })

  app.post('/match/submit', (req, res) => {
    const { matchId, userId, choiceId, elapsedMs, tabSwitchCount } = req.body || {}
    if (!matchId || !userId) return res.status(400).json({ error: 'matchId and userId are required.' })

    const result = submitAnswer(String(matchId), String(userId), {
      choiceId,
      elapsedMs,
      tabSwitchCount,
    }, io)

    if (!result.ok) return res.status(400).json({ error: result.error })
    const match = matches.get(String(matchId))
    if (match && match.isBotMatch) runBotForCurrentQuestion(match, io)

    return res.json({ ok: true })
  })

  app.get('/leaderboard', (req, res) => {
    return res.json({
      leaderboard: getLeaderboard(100),
    })
  })
}

module.exports = {
  initRankedEngine,
}
