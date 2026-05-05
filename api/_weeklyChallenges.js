const crypto = require('crypto')
const { createSignedToken, verifySignedToken } = require('./_auth')

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DEFAULT_DURATION_SECONDS = 12 * 60
const ATTEMPT_TOKEN_TTL_SECONDS = 30 * 60
const SUBJECT_ROTATION = [
  'Constitutional Law',
  'Remedial Law',
  'Labor Law',
  'Taxation Law',
  'Criminal Law',
  'Civil Law',
]

const submissionStore = new Map()

const QUESTION_BANK = [
  {
    id: 'q-consti-001',
    type: 'bar',
    difficulty: 'medium',
    prompt: 'Congress passes a statute that limits online criticism of public officials during election season to avoid misinformation. A petition is filed alleging violation of free speech. What is the best constitutional analysis?',
    choices: [
      { id: 'A', text: 'The statute is valid because election regulation always prevails over speech rights.', wrongReason: 'Election regulation is not automatically superior to free speech protections.' },
      { id: 'B', text: 'The statute is presumed unconstitutional as a content-based speech restriction and must pass strict scrutiny.', wrongReason: null },
      { id: 'C', text: 'The statute is valid if enacted by majority vote in both houses of Congress.', wrongReason: 'Procedural passage does not cure constitutional defects in content-based speech regulation.' },
      { id: 'D', text: 'The statute is valid if challenged only after elections.', wrongReason: 'Timing does not remove the constitutional issue if a prior restraint or content-based burden exists.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether the law impermissibly restricts protected speech by targeting content.',
      rule: 'Content-based restrictions on expression are presumptively invalid and must satisfy strict scrutiny.',
      application: 'The statute directly limits criticism of officials based on message content, so the State must show a compelling interest and narrow tailoring.',
      conclusion: 'Absent strict scrutiny compliance, the law is unconstitutional.',
    },
  },
  {
    id: 'q-case-001',
    type: 'case',
    difficulty: 'hard',
    prompt: 'In Ople v. Torres, the Supreme Court invalidated the national ID system primarily because:',
    choices: [
      { id: 'A', text: 'It imposed taxes without congressional approval.', wrongReason: 'The case was not centered on taxation power.' },
      { id: 'B', text: 'It violated the right to privacy due to overbroad executive implementation without sufficient safeguards.', wrongReason: null },
      { id: 'C', text: 'It abolished local government autonomy.', wrongReason: 'Local autonomy was not the core constitutional defect in that ruling.' },
      { id: 'D', text: 'It amended the Constitution by executive order.', wrongReason: 'The ruling focused on privacy and due process concerns, not constitutional amendment.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether executive implementation of a national ID framework infringed privacy rights.',
      rule: 'Government data collection must respect privacy and provide lawful, proportionate safeguards.',
      application: 'The challenged framework delegated broad power without adequate protections for informational privacy.',
      conclusion: 'The Court struck the measure for constitutional infirmities tied to privacy and due process.',
    },
  },
  {
    id: 'q-civpro-001',
    type: 'concept',
    difficulty: 'medium',
    prompt: 'A complaint is filed in the wrong venue, but jurisdiction over the subject matter exists. Which statement is most accurate?',
    choices: [
      { id: 'A', text: 'The court automatically loses jurisdiction and must dismiss motu proprio.', wrongReason: 'Venue generally concerns convenience and can be waived.' },
      { id: 'B', text: 'Improper venue is waivable if not timely raised in a motion to dismiss or answer.', wrongReason: null },
      { id: 'C', text: 'Improper venue makes the judgment void even after finality.', wrongReason: 'Judgments are not void solely due to waivable venue defects.' },
      { id: 'D', text: 'Venue objections can be raised for the first time on appeal.', wrongReason: 'Venue objections must be seasonably raised, otherwise deemed waived.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether improper venue defeats jurisdiction and mandates dismissal at any stage.',
      rule: 'Venue is procedural and generally waivable, unlike subject matter jurisdiction.',
      application: 'Where jurisdiction exists and defendant fails to timely object, the case may proceed.',
      conclusion: 'Improper venue is waived if not raised seasonably.',
    },
  },
  {
    id: 'q-crim-001',
    type: 'bar',
    difficulty: 'medium',
    prompt: 'Police arrest a suspect without a warrant and recover prohibited drugs from a bag after the arrest. Which is the strongest defense argument?',
    choices: [
      { id: 'A', text: 'The search is valid because all arrests justify any search of nearby belongings.', wrongReason: 'Search incident to arrest has scope limits and requires lawful arrest.' },
      { id: 'B', text: 'The search is invalid if the arrest itself does not fall under recognized warrantless arrest exceptions.', wrongReason: null },
      { id: 'C', text: 'Drug evidence is always admissible in dangerous drugs cases.', wrongReason: 'Constitutional exclusionary rules still apply in drug prosecutions.' },
      { id: 'D', text: 'A warrantless search is valid whenever the suspect appears nervous.', wrongReason: 'Nervousness alone is insufficient for broad warrantless search authority.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether evidence from a warrantless search after arrest is admissible.',
      rule: 'A search incident to arrest is valid only if the arrest is lawful under constitutional exceptions.',
      application: 'If the arrest lacked legal basis, derivative evidence may be excluded as fruit of an unlawful act.',
      conclusion: 'The defense can suppress evidence if the warrantless arrest was invalid.',
    },
  },
  {
    id: 'q-oblicon-001',
    type: 'concept',
    difficulty: 'easy',
    prompt: 'In obligations, what best distinguishes a determinate prestation from a generic prestation?',
    choices: [
      { id: 'A', text: 'Determinate prestation refers to a specific object; generic prestation refers to a class or genus.', wrongReason: null },
      { id: 'B', text: 'Determinate prestation is always impossible to perform.', wrongReason: 'Determinate obligations are not inherently impossible.' },
      { id: 'C', text: 'Generic prestation is extinguished by loss of any one item in the class.', wrongReason: 'Genus never perishes; loss of one generic item does not extinguish the obligation.' },
      { id: 'D', text: 'Both are identical and interchangeable under civil law.', wrongReason: 'The distinction has consequences for loss, risk, and remedies.' },
    ],
    correctChoiceId: 'A',
    irac: {
      issue: 'Whether the prestation is specific or generic in kind.',
      rule: 'Determinate obligations involve a uniquely designated object; generic obligations involve a class.',
      application: 'Civil law consequences differ in risk of loss and enforceability depending on designation.',
      conclusion: 'The proper distinction is specific object versus genus-defined object.',
    },
  },
  {
    id: 'q-evidence-001',
    type: 'bar',
    difficulty: 'hard',
    prompt: 'A witness testifies that a bystander told him the accused confessed. The testimony is offered to prove the confession happened. How should the court treat this?',
    choices: [
      { id: 'A', text: 'Admit it as direct evidence because the witness personally heard the bystander.', wrongReason: 'The statement is still offered for truth and is hearsay absent exception.' },
      { id: 'B', text: 'Exclude it as hearsay unless a recognized exception applies.', wrongReason: null },
      { id: 'C', text: 'Admit it automatically in criminal cases.', wrongReason: 'Criminal cases do not create a blanket hearsay exception.' },
      { id: 'D', text: 'Exclude it only if objected to before trial.', wrongReason: 'Admissibility depends on proper objection at offer stage and hearsay rules.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether an out-of-court assertion offered for its truth is admissible.',
      rule: 'Hearsay is inadmissible unless covered by a specific exception.',
      application: 'The witness relays another person\'s statement to prove the confession itself.',
      conclusion: 'The testimony is hearsay and must be excluded absent exception.',
    },
  },
  {
    id: 'q-corp-001',
    type: 'case',
    difficulty: 'medium',
    prompt: 'A parent company uses its subsidiary to evade liabilities and transfer assets. Which doctrine is most likely invoked by the court?',
    choices: [
      { id: 'A', text: 'Doctrine of primary jurisdiction', wrongReason: 'That doctrine allocates authority between courts and agencies, not fraud through corporate form.' },
      { id: 'B', text: 'Piercing the corporate veil under alter ego or fraud theory', wrongReason: null },
      { id: 'C', text: 'Doctrine of operative fact', wrongReason: 'Operative fact concerns effects of invalid laws, not parent-subsidiary abuse.' },
      { id: 'D', text: 'Doctrine of mootness', wrongReason: 'Mootness concerns justiciability, not corporate liability evasion.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether separate juridical personality should be disregarded to prevent injustice.',
      rule: 'Courts may pierce the corporate veil when the entity is used to defeat public convenience, justify wrong, or protect fraud.',
      application: 'Use of a subsidiary as a conduit to avoid obligations supports alter ego findings.',
      conclusion: 'Piercing the veil is a proper remedy.',
    },
  },
  {
    id: 'q-tax-001',
    type: 'concept',
    difficulty: 'medium',
    prompt: 'Which statement about tax exemptions is doctrinally accurate?',
    choices: [
      { id: 'A', text: 'Tax exemptions are presumed and broadly implied for equity.', wrongReason: 'Exemptions are not presumed; they are strictly construed.' },
      { id: 'B', text: 'Tax exemptions are construed strictly against the taxpayer.', wrongReason: null },
      { id: 'C', text: 'Tax exemptions cannot be granted by statute.', wrongReason: 'Legislature may grant exemptions subject to constitutional limits.' },
      { id: 'D', text: 'Religious institutions are exempt from all kinds of taxes automatically.', wrongReason: 'Constitutional exemptions are limited in scope and context.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'How courts interpret claims of exemption from tax liabilities.',
      rule: 'Tax exemptions are strictly construed against the taxpayer and in favor of taxing authority.',
      application: 'Absent clear statutory or constitutional basis, exemption claims fail.',
      conclusion: 'The strict construction rule governs.',
    },
  },
  {
    id: 'q-labor-001',
    type: 'bar',
    difficulty: 'hard',
    prompt: 'An employee is dismissed for alleged serious misconduct but receives no written notice and no hearing. Which is the most defensible legal position?',
    choices: [
      { id: 'A', text: 'Dismissal is valid if misconduct is true, regardless of process.', wrongReason: 'Substantive and procedural due process requirements both matter in termination.' },
      { id: 'B', text: 'Dismissal may be substantively justified but procedurally defective for violating twin-notice and hearing requirements.', wrongReason: null },
      { id: 'C', text: 'Due process applies only to government employers, not private employment.', wrongReason: 'Labor Code procedural due process applies in private dismissals.' },
      { id: 'D', text: 'No notice is needed when the employee is probationary.', wrongReason: 'Even probationary terminations require observance of legal standards and process.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether failure to observe procedural requirements affects legality of dismissal.',
      rule: 'Termination for just cause requires both substantive basis and procedural due process.',
      application: 'Absence of first notice, opportunity to explain, and final notice creates procedural defect.',
      conclusion: 'Employer may incur liability for due process violation despite substantive grounds.',
    },
  },
  {
    id: 'q-consti-002',
    type: 'case',
    difficulty: 'medium',
    prompt: 'In David v. Arroyo, the Court discussed emergency powers and constitutional limits. Which principle is most relevant?',
    choices: [
      { id: 'A', text: 'Emergency declarations automatically suspend all Bill of Rights protections.', wrongReason: 'Constitutional rights remain enforceable even during emergencies absent lawful suspension.' },
      { id: 'B', text: 'Executive emergency measures remain subject to judicial review and constitutional constraints.', wrongReason: null },
      { id: 'C', text: 'Only Congress can review emergency executive acts.', wrongReason: 'Judicial review remains available for constitutional challenges.' },
      { id: 'D', text: 'State necessity bars all constitutional petitions.', wrongReason: 'Necessity is not a blanket defense to constitutional violations.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether emergency acts are immune from constitutional scrutiny.',
      rule: 'Executive measures, including emergency responses, remain bounded by the Constitution and reviewable by courts.',
      application: 'Courts can strike overbroad actions that infringe rights without sufficient legal basis.',
      conclusion: 'Emergency powers do not eliminate constitutional accountability.',
    },
  },
  {
    id: 'q-crimpro-001',
    type: 'concept',
    difficulty: 'easy',
    prompt: 'When does the right to counsel under custodial investigation primarily attach?',
    choices: [
      { id: 'A', text: 'Only after formal filing of information in court.', wrongReason: 'The right attaches earlier, during custodial interrogation.' },
      { id: 'B', text: 'When questioning by law enforcement shifts to an accused in custody and seeks incriminating answers.', wrongReason: null },
      { id: 'C', text: 'Only during trial testimony.', wrongReason: 'Trial rights are distinct from custodial investigation protections.' },
      { id: 'D', text: 'Only if the accused asks for a lawyer first.', wrongReason: 'Authorities must inform the person of rights; attachment is not conditional on request.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Point at which constitutional custodial rights become operative.',
      rule: 'Custodial rights attach once law enforcement questioning focuses on a person in custody for criminal interrogation.',
      application: 'Interrogation setting and coercive circumstances trigger mandatory rights advisories and counsel access.',
      conclusion: 'The right attaches during custodial interrogation, not only at trial.',
    },
  },
  {
    id: 'q-property-001',
    type: 'bar',
    difficulty: 'medium',
    prompt: 'Two co-owners disagree on use of a parcel of land. One sells a specific physical portion without partition. What is the legal effect?',
    choices: [
      { id: 'A', text: 'Sale is fully valid as to the specific portion sold.', wrongReason: 'A co-owner generally sells only an undivided share, not a specific segregated part absent partition.' },
      { id: 'B', text: 'Sale is valid only as to the seller\'s undivided ideal share, subject to partition.', wrongReason: null },
      { id: 'C', text: 'Sale is void because co-owned property cannot be sold.', wrongReason: 'A co-owner may alienate his undivided interest.' },
      { id: 'D', text: 'Sale transfers full ownership if buyer is in good faith.', wrongReason: 'Good faith does not expand rights beyond what seller can transfer.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Whether a co-owner can unilaterally transfer a specific allocated area before partition.',
      rule: 'A co-owner may alienate only an undivided share, not a determinate physical part without partition.',
      application: 'The seller lacked exclusive title to any specific lot portion at the time of sale.',
      conclusion: 'Transfer binds only the seller\'s ideal share and remains subject to partition.',
    },
  },
  {
    id: 'q-remedial-001',
    type: 'concept',
    difficulty: 'hard',
    prompt: 'A party receives an adverse RTC judgment and files notice of appeal one day late. Which statement is most accurate?',
    choices: [
      { id: 'A', text: 'Appeal periods are generally mandatory and jurisdictional, so late filing usually forfeits the remedy.', wrongReason: null },
      { id: 'B', text: 'Late notice is always excused if counsel cites workload.', wrongReason: 'Workload alone is not a blanket basis for relaxation of procedural periods.' },
      { id: 'C', text: 'Court must accept the appeal to serve substantial justice in all cases.', wrongReason: 'Substantial justice exceptions are narrow and fact-sensitive, not automatic.' },
      { id: 'D', text: 'Only criminal appeals have mandatory timelines.', wrongReason: 'Civil appeal periods are also generally mandatory and jurisdictional.' },
    ],
    correctChoiceId: 'A',
    irac: {
      issue: 'Effect of belated filing of notice of appeal.',
      rule: 'Appeal is a statutory privilege and must be perfected within prescribed periods.',
      application: 'Failure to file on time generally prevents appellate jurisdiction from attaching.',
      conclusion: 'Late appeal is usually dismissible absent exceptional grounds.',
    },
  },
  {
    id: 'q-tax-002',
    type: 'bar',
    difficulty: 'easy',
    prompt: 'Under current Philippine law, estate tax on net taxable estate is generally computed at:',
    choices: [
      { id: 'A', text: 'Graduated rates from 1% to 20%', wrongReason: 'That reflects prior regimes, not current TRAIN-law baseline.' },
      { id: 'B', text: 'A flat 6%', wrongReason: null },
      { id: 'C', text: 'A flat 12%', wrongReason: '12% is generally associated with VAT, not estate tax.' },
      { id: 'D', text: 'A flat 25%', wrongReason: 'No general 25% estate tax rate applies under current baseline rules.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Applicable estate tax rate under current statutory framework.',
      rule: 'TRAIN-law framework generally imposes a 6% estate tax on net taxable estate.',
      application: 'Compute gross estate, deduct allowable deductions, then apply flat 6%.',
      conclusion: 'The general rate is 6%.',
    },
  },
  {
    id: 'q-labor-002',
    type: 'case',
    difficulty: 'medium',
    prompt: 'In illegal dismissal disputes, the twin-notice requirement primarily ensures:',
    choices: [
      { id: 'A', text: 'That employers never dismiss workers for any reason.', wrongReason: 'Employers may dismiss for lawful causes with due process.' },
      { id: 'B', text: 'Procedural due process by giving notice of charges and notice of decision after opportunity to be heard.', wrongReason: null },
      { id: 'C', text: 'Automatic reinstatement before any company investigation.', wrongReason: 'Reinstatement is a remedy issue, not the core function of twin notice.' },
      { id: 'D', text: 'Mandatory arbitration before all terminations.', wrongReason: 'Arbitration is not an across-the-board prerequisite to termination decisions.' },
    ],
    correctChoiceId: 'B',
    irac: {
      issue: 'Purpose of twin-notice procedural framework in dismissal.',
      rule: 'Labor due process requires first notice of charges, opportunity to explain, and final notice of decision.',
      application: 'The sequence protects employee participation and fairness in termination proceedings.',
      conclusion: 'Twin notice operationalizes procedural due process in private employment.',
    },
  },
]

function getHashNumber(input) {
  const digest = crypto.createHash('sha256').update(String(input)).digest()
  return digest.readUInt32BE(0)
}

function seededShuffle(items, seed) {
  return [...items]
    .map((item, index) => ({
      item,
      index,
      rank: getHashNumber(`${seed}:${item.id || index}`),
    }))
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank
      return a.index - b.index
    })
    .map((entry) => entry.item)
}

function toIso(value) {
  return new Date(value).toISOString()
}

function getWeekStartUtc(dateValue = Date.now()) {
  const date = new Date(dateValue)
  const day = (date.getUTCDay() + 6) % 7
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - day)
  return date.getTime()
}

function getWeekIndex(weekStartMs) {
  return Math.floor(weekStartMs / WEEK_MS)
}

function getCurrentChallengeMeta(now = Date.now()) {
  const weekStartMs = getWeekStartUtc(now)
  const weekEndMs = weekStartMs + WEEK_MS
  const weekIndex = getWeekIndex(weekStartMs)
  const ordinal = Math.max(1, weekIndex - getWeekIndex(getWeekStartUtc(Date.UTC(2025, 11, 29))) + 1)
  const difficultyCycle = ['easy', 'medium', 'hard']
  const difficulty = difficultyCycle[Math.abs(weekIndex) % difficultyCycle.length]
  const subject = SUBJECT_ROTATION[Math.abs(weekIndex) % SUBJECT_ROTATION.length]
  return {
    challengeId: `wc-${weekStartMs}`,
    weekStartMs,
    weekEndMs,
    weekIndex,
    difficulty,
    title: `${subject} Weekly Challenge #${ordinal}`,
    durationSeconds: DEFAULT_DURATION_SECONDS,
  }
}

function getChallengeQuestions(challengeId, difficulty) {
  const seeded = seededShuffle(QUESTION_BANK, `challenge:${challengeId}:${difficulty}`)
  const selected = seeded.slice(0, 8)
  return selected.map((question, index) => ({
    ...question,
    ordinal: index + 1,
  }))
}

function getCurrentChallenge(now = Date.now()) {
  const meta = getCurrentChallengeMeta(now)
  return {
    id: meta.challengeId,
    title: meta.title,
    difficulty: meta.difficulty,
    startDate: toIso(meta.weekStartMs),
    endDate: toIso(meta.weekEndMs),
    durationSeconds: meta.durationSeconds,
    questionCount: 8,
    questions: getChallengeQuestions(meta.challengeId, meta.difficulty),
  }
}

function getSubmissionBucket(challengeId) {
  if (!submissionStore.has(challengeId)) {
    submissionStore.set(challengeId, [])
  }
  return submissionStore.get(challengeId)
}

function findSubmission(challengeId, userId) {
  const bucket = getSubmissionBucket(challengeId)
  return bucket.find((entry) => String(entry.userId) === String(userId)) || null
}

function createAttemptTokenPayload(challenge, userId) {
  const questions = seededShuffle(challenge.questions, `attempt:q:${challenge.id}:${userId}:${Date.now()}`)
  const questionOrder = questions.map((q) => q.id)
  const choiceOrders = {}

  for (const question of questions) {
    const shuffledChoices = seededShuffle(question.choices, `attempt:c:${challenge.id}:${userId}:${question.id}:${Date.now()}`)
    choiceOrders[question.id] = shuffledChoices.map((choice) => choice.id)
  }

  return {
    type: 'weekly_attempt',
    challengeId: challenge.id,
    userId: String(userId),
    questionOrder,
    choiceOrders,
    startedAt: Date.now(),
    durationSeconds: challenge.durationSeconds,
  }
}

function sanitizeChallengeForClient(challenge, attemptPayload) {
  const questionMap = new Map(challenge.questions.map((q) => [q.id, q]))
  const questions = attemptPayload.questionOrder.map((questionId) => {
    const question = questionMap.get(questionId)
    if (!question) return null
    const choiceMap = new Map(question.choices.map((c) => [c.id, c]))
    const orderedChoices = (attemptPayload.choiceOrders[questionId] || [])
      .map((choiceId) => choiceMap.get(choiceId))
      .filter(Boolean)
      .map((choice) => ({
        id: choice.id,
        text: choice.text,
      }))

    return {
      id: question.id,
      ordinal: question.ordinal,
      type: question.type,
      difficulty: question.difficulty,
      prompt: question.prompt,
      choices: orderedChoices,
    }
  }).filter(Boolean)

  return {
    id: challenge.id,
    title: challenge.title,
    difficulty: challenge.difficulty,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    durationSeconds: challenge.durationSeconds,
    questionCount: challenge.questionCount,
    questions,
  }
}

function getPercentile(rank, total) {
  if (!total || !rank) return 100
  const better = rank - 1
  const percentile = Math.round(((total - better) / total) * 100)
  return Math.max(1, Math.min(100, percentile))
}

function sortSubmissions(entries) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.timeTakenSeconds !== b.timeTakenSeconds) return a.timeTakenSeconds - b.timeTakenSeconds
    return a.submittedAt - b.submittedAt
  })
}

function computeReward(rank, totalParticipants) {
  if (rank <= 10) {
    return {
      tier: 'elite',
      label: 'Top 10 Elite',
      badge: 'Elite Brief',
      xp: 250,
      streakBonus: 3,
      unlock: 'Premium challenge insights for 7 days',
    }
  }

  const percentile = getPercentile(rank, totalParticipants)
  if (percentile >= 50) {
    return {
      tier: 'silver',
      label: 'Top 50%',
      badge: 'Consistent Scholar',
      xp: 120,
      streakBonus: 1,
      unlock: null,
    }
  }

  return {
    tier: 'participant',
    label: 'Participant',
    badge: 'Challenge Participant',
    xp: 60,
    streakBonus: 0,
    unlock: null,
  }
}

function buildFallbackExplanation(question, selectedChoiceId) {
  const correctChoice = question.choices.find((c) => c.id === question.correctChoiceId)
  const selectedChoice = question.choices.find((c) => c.id === selectedChoiceId)
  const isCorrect = selectedChoiceId === question.correctChoiceId

  const wrongChoices = question.choices
    .filter((choice) => choice.id !== question.correctChoiceId)
    .map((choice) => ({
      choiceId: choice.id,
      text: choice.text,
      whyIncorrect: choice.wrongReason || 'This choice does not fully satisfy the governing legal standard in this fact pattern.',
    }))

  return {
    questionId: question.id,
    isCorrect,
    selectedChoiceId: selectedChoiceId || null,
    correctChoiceId: question.correctChoiceId,
    correctAnswerText: correctChoice ? correctChoice.text : '',
    selectedAnswerText: selectedChoice ? selectedChoice.text : null,
    explanation: {
      issue: question.irac.issue,
      rule: question.irac.rule,
      application: question.irac.application,
      conclusion: question.irac.conclusion,
    },
    wrongChoiceReview: wrongChoices,
  }
}

async function maybeGenerateAiExplanations(questionResults) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const payload = {
      items: questionResults.map((item) => ({
        questionId: item.question.id,
        prompt: item.question.prompt,
        selectedChoiceId: item.selectedChoiceId || null,
        selectedChoiceText: item.selectedChoice ? item.selectedChoice.text : null,
        correctChoiceId: item.question.correctChoiceId,
        correctChoiceText: item.correctChoice ? item.correctChoice.text : null,
      })),
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a Philippine law professor. Return strict JSON with key "feedback" as array. For each question, provide: questionId, issue, rule, application, conclusion, and concise whyWrong summary if user answer is wrong. Keep each field <= 2 sentences.',
          },
          {
            role: 'user',
            content: JSON.stringify(payload),
          },
        ],
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) return null
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed?.feedback)) return null

    const map = new Map(parsed.feedback.map((entry) => [entry.questionId, entry]))
    return map
  } catch {
    return null
  }
}

function calculateTimeAnomaly(elapsedSeconds, questionCount) {
  const tooFastThreshold = Math.max(35, questionCount * 7)
  return {
    flagged: elapsedSeconds > 0 && elapsedSeconds < tooFastThreshold,
    reason: elapsedSeconds > 0 && elapsedSeconds < tooFastThreshold
      ? `Completed in ${elapsedSeconds}s, faster than threshold ${tooFastThreshold}s.`
      : null,
  }
}

async function submitWeeklyChallenge({ userId, attemptToken, answers }) {
  const challenge = getCurrentChallenge(Date.now())
  const tokenPayload = verifySignedToken(attemptToken)

  if (!tokenPayload || tokenPayload.type !== 'weekly_attempt') {
    return { ok: false, status: 400, error: 'Invalid or expired attempt token.' }
  }

  if (String(tokenPayload.userId) !== String(userId)) {
    return { ok: false, status: 403, error: 'Attempt token does not belong to this user.' }
  }

  if (tokenPayload.challengeId !== challenge.id) {
    return { ok: false, status: 400, error: 'Attempt token is not for the active weekly challenge.' }
  }

  const prior = findSubmission(challenge.id, userId)
  if (prior) {
    return { ok: false, status: 409, error: 'Weekly challenge already submitted. One attempt per user per week.' }
  }

  const safeAnswers = answers && typeof answers === 'object' ? answers : {}
  const now = Date.now()
  const elapsedSeconds = Math.max(1, Math.round((now - Number(tokenPayload.startedAt || now)) / 1000))
  const timeTakenSeconds = Math.min(elapsedSeconds, challenge.durationSeconds)

  const questionMap = new Map(challenge.questions.map((q) => [q.id, q]))
  const questionResults = tokenPayload.questionOrder
    .map((questionId) => {
      const question = questionMap.get(questionId)
      if (!question) return null
      const selectedChoiceId = safeAnswers[questionId] || null
      const selectedChoice = question.choices.find((c) => c.id === selectedChoiceId) || null
      const correctChoice = question.choices.find((c) => c.id === question.correctChoiceId) || null
      const isCorrect = selectedChoiceId === question.correctChoiceId
      return {
        question,
        selectedChoiceId,
        selectedChoice,
        correctChoice,
        isCorrect,
      }
    })
    .filter(Boolean)

  const correctCount = questionResults.filter((result) => result.isCorrect).length
  const score = Math.round((correctCount / challenge.questionCount) * 100)

  const anomaly = calculateTimeAnomaly(timeTakenSeconds, challenge.questionCount)
  const aiMap = await maybeGenerateAiExplanations(questionResults)

  const explanations = questionResults.map((result) => {
    const fallback = buildFallbackExplanation(result.question, result.selectedChoiceId)
    const aiEntry = aiMap ? aiMap.get(result.question.id) : null

    if (!aiEntry) return fallback

    return {
      ...fallback,
      explanation: {
        issue: aiEntry.issue || fallback.explanation.issue,
        rule: aiEntry.rule || fallback.explanation.rule,
        application: aiEntry.application || fallback.explanation.application,
        conclusion: aiEntry.conclusion || fallback.explanation.conclusion,
      },
      aiSource: 'openai',
    }
  })

  const submission = {
    userId: String(userId),
    challengeId: challenge.id,
    score,
    correctCount,
    totalQuestions: challenge.questionCount,
    timeTakenSeconds,
    answers: safeAnswers,
    submittedAt: now,
    anomaly,
    explanations,
  }

  const bucket = getSubmissionBucket(challenge.id)
  bucket.push(submission)

  const ranked = sortSubmissions(bucket)
  const rank = ranked.findIndex((entry) => entry.userId === String(userId)) + 1
  const percentile = getPercentile(rank, ranked.length)
  const reward = computeReward(rank, ranked.length)

  return {
    ok: true,
    status: 200,
    challenge,
    submission,
    rank,
    percentile,
    reward,
    leaderboardPreview: ranked.slice(0, 10).map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      score: entry.score,
      timeTakenSeconds: entry.timeTakenSeconds,
      badge: computeReward(index + 1, ranked.length).badge,
    })),
  }
}

function getLeaderboard({ challengeId, userId }) {
  const challenge = getCurrentChallenge(Date.now())
  const activeChallengeId = challengeId || challenge.id
  const ranked = sortSubmissions(getSubmissionBucket(activeChallengeId))
  const totalParticipants = ranked.length
  const userRankIndex = ranked.findIndex((entry) => String(entry.userId) === String(userId))
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null

  return {
    challengeId: activeChallengeId,
    totalParticipants,
    top10: ranked.slice(0, 10).map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      score: entry.score,
      timeTakenSeconds: entry.timeTakenSeconds,
      badge: computeReward(index + 1, ranked.length).badge,
    })),
    user: userRank
      ? {
          rank: userRank,
          percentile: getPercentile(userRank, totalParticipants),
          reward: computeReward(userRank, totalParticipants),
        }
      : null,
  }
}

function getUserRank({ challengeId, userId }) {
  const challenge = getCurrentChallenge(Date.now())
  const activeChallengeId = challengeId || challenge.id
  const ranked = sortSubmissions(getSubmissionBucket(activeChallengeId))
  const totalParticipants = ranked.length
  const userRankIndex = ranked.findIndex((entry) => String(entry.userId) === String(userId))

  if (userRankIndex < 0) {
    return {
      challengeId: activeChallengeId,
      attempted: false,
      rank: null,
      percentile: null,
      totalParticipants,
      reward: null,
    }
  }

  const rank = userRankIndex + 1
  return {
    challengeId: activeChallengeId,
    attempted: true,
    rank,
    percentile: getPercentile(rank, totalParticipants),
    totalParticipants,
    reward: computeReward(rank, totalParticipants),
  }
}

function getActiveChallengeForUser(userId) {
  const challenge = getCurrentChallenge(Date.now())
  const existing = findSubmission(challenge.id, userId)

  if (existing) {
    const board = getLeaderboard({ challengeId: challenge.id, userId })
    return {
      challenge,
      hasSubmitted: true,
      submission: {
        score: existing.score,
        correctCount: existing.correctCount,
        totalQuestions: existing.totalQuestions,
        timeTakenSeconds: existing.timeTakenSeconds,
        submittedAt: toIso(existing.submittedAt),
        anomaly: existing.anomaly,
        explanations: existing.explanations,
      },
      rank: board.user?.rank || null,
      percentile: board.user?.percentile || null,
      reward: board.user?.reward || null,
      leaderboardPreview: board.top10,
    }
  }

  const payload = createAttemptTokenPayload(challenge, userId)
  const token = createSignedToken(payload, ATTEMPT_TOKEN_TTL_SECONDS)

  return {
    challenge: sanitizeChallengeForClient(challenge, payload),
    hasSubmitted: false,
    attemptToken: token,
  }
}

function getWeeklyChallengeSchemaSql() {
  return `
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weekly_challenge_questions (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bar', 'case', 'concept')),
  prompt TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ordinal INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_challenge_choices (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES weekly_challenge_questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS weekly_challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  answers JSONB NOT NULL,
  anomaly_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_weekly_submissions_challenge ON weekly_challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_user ON weekly_challenge_submissions(user_id);

CREATE VIEW weekly_leaderboard AS
SELECT
  challenge_id,
  user_id,
  score,
  time_taken_seconds,
  RANK() OVER (PARTITION BY challenge_id ORDER BY score DESC, time_taken_seconds ASC, created_at ASC) AS rank_position
FROM weekly_challenge_submissions;
`
}

module.exports = {
  getActiveChallengeForUser,
  submitWeeklyChallenge,
  getLeaderboard,
  getUserRank,
  getWeeklyChallengeSchemaSql,
}
