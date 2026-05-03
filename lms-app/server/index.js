require('dotenv').config()
const express = require('express')
const cors = require('cors')
const OpenAI = require('openai')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json())

// Allow the deployed Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL, // e.g. https://your-app.vercel.app
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, curl, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST'],
}))

// ── OpenAI client (initialised lazily so server starts without a key) ─────────
let openai = null
function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) return null
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openai
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are LexisAI, an expert legal education assistant for law students.
Your role is to:
- Explain complex legal concepts clearly and accurately
- Summarise landmark cases and their significance
- Help students understand legal doctrines and principles
- Provide exam tips and study guidance
- Answer questions about constitutional law, criminal law, torts, contracts, and civil rights

Always:
- Be clear, concise, and educational
- Use proper legal terminology with plain-language explanations
- Reference relevant cases and statutes where appropriate
- Remind students that your answers are for educational purposes only, not legal advice
- Format responses with bullet points or numbered lists where helpful`

// ── Fallback mock responses when no API key is set ───────────────────────────
const MOCK_RESPONSES = [
  "**Judicial Review** is the power of courts to examine legislation and executive actions to determine whether they are constitutional. It was firmly established by Chief Justice John Marshall in *Marbury v. Madison* (1803).",
  "The **Miranda Warning** requires law enforcement to inform suspects of: (1) the right to remain silent, (2) that anything said can be used against them, (3) the right to an attorney, and (4) that an attorney will be appointed if they cannot afford one.",
  "**Stare decisis** means 'to stand by things decided.' It is the doctrine requiring courts to follow legal precedents established by prior decisions. This promotes consistency and predictability in the law.",
  "**Negligence** requires proving four elements: (1) Duty of care owed to the plaintiff, (2) Breach of that duty, (3) Causation (both actual and proximate), and (4) Damages suffered as a result.",
  "A valid **contract** requires: Offer, Acceptance, Consideration (something of value exchanged), Mutual intent to be bound, Capacity of the parties, and Legality of the subject matter.",
]
let mockIdx = 0

// ── Routes ─────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiMode: process.env.OPENAI_API_KEY ? 'openai' : 'mock',
  })
})

app.post('/api/chat', async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters).' })
  }

  const client = getOpenAI()

  // ── Mock mode ──────────────────────────────────────────────────────────────
  if (!client) {
    const reply = MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length]
    mockIdx++
    return res.json({
      reply: `${reply}\n\n*[Mock response — add your OPENAI_API_KEY to enable real AI responses]*`,
      mode: 'mock',
    })
  }

  // ── OpenAI mode ───────────────────────────────────────────────────────────
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.'
    res.json({ reply, mode: 'openai' })
  } catch (err) {
    console.error('OpenAI error:', err.message)

    // Surface a useful but safe error message
    const status = err.status ?? 500
    const message =
      status === 401 ? 'Invalid OpenAI API key.' :
      status === 429 ? 'Rate limit reached. Please try again in a moment.' :
      status === 503 ? 'OpenAI service is temporarily unavailable.' :
      'Failed to get AI response. Please try again.'

    res.status(status < 500 ? status : 500).json({ error: message })
  }
})

app.post('/api/explain', async (req, res) => {
  const { context, instruction } = req.body || {}

  if (!context || typeof context !== 'string' || context.trim().length < 8) {
    return res.status(400).json({ error: 'Context is required (at least 8 characters).' })
  }

  const safeInstruction =
    typeof instruction === 'string' && instruction.trim().length > 0
      ? instruction.trim()
      : 'Explain this in simple terms for a law student.'

  const prompt = [
    safeInstruction,
    '',
    'Context:',
    context.trim(),
    '',
    'Requirements:',
    '- Keep it concise but doctrinally accurate',
    '- Add one bar exam relevance point',
    '- End with one memory tip',
  ].join('\n')

  const client = getOpenAI()

  if (!client) {
    return res.json({
      reply: `Plain Explanation:\n${context.trim().slice(0, 300)}\n\nBar Relevance: Focus on elements, requisites, and exceptions likely tested in issue-spotting questions.\nMemory Tip: Build a 3-part recall cue: doctrine, requisites, exception.\n\n*[Mock explain response — add OPENAI_API_KEY for full AI mode]*`,
      mode: 'mock',
    })
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: 700,
      temperature: 0.5,
    })

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.'
    return res.json({ reply, mode: 'openai' })
  } catch (err) {
    console.error('Explain endpoint error:', err.message)
    return res.status(500).json({ error: 'Failed to generate explanation.' })
  }
})

// ── Module Generator system prompt ────────────────────────────────────────────
const MODULE_GEN_SYSTEM_PROMPT = `You are a legal education architect and Philippine law expert.
Generate a COMPLETE law school module for a given subject and year level.
You MUST respond with ONLY valid JSON — no markdown fences, no explanation, just raw JSON.
The JSON must match exactly this structure:
{
  "subject_overview": "string",
  "learning_objectives": ["string"],
  "modules": [
    {
      "title": "string",
      "description": "string",
      "topics": ["string"],
      "lessons": number,
      "difficulty": "Beginner|Intermediate|Advanced",
      "quiz": [{"question":"string","options":["A)...","B)...","C)...","D)..."],"answer":"string"}],
      "essay": "string",
      "bar_question": "string"
    }
  ],
  "cases": [
    {
      "title": "string",
      "facts": "string",
      "issue": "string",
      "ruling": "string",
      "doctrine": "string"
    }
  ],
  "references": ["string"],
  "ui_summary": {
    "subject_title": "string",
    "total_modules": number,
    "total_lessons": number,
    "tagline": "string"
  }
}
Rules:
- 8-12 modules
- 3-5 landmark Philippine Supreme Court cases
- Align with Philippine law curriculum
- Use Bloom's Taxonomy for learning objectives
- Reference 1987 Philippine Constitution, Civil Code, Revised Penal Code where applicable`

// ── Mock module for fallback (no API key) ────────────────────────────────────
function buildMockModule(yearLevel, subjectName) {
  return {
    subject_overview: `${subjectName} is a foundational subject in the Philippine law curriculum for ${yearLevel} students. It covers essential doctrines, landmark Supreme Court decisions, and statutory provisions that define this area of Philippine jurisprudence. Students will develop critical analytical skills necessary for bar examinations and legal practice.`,
    learning_objectives: [
      `Define and explain the core principles and doctrines of ${subjectName}`,
      `Analyze landmark Philippine Supreme Court decisions and identify the legal rules established`,
      `Apply relevant provisions of the 1987 Philippine Constitution and applicable statutes to hypothetical fact patterns`,
      `Evaluate the interplay between established doctrine and evolving jurisprudence`,
      `Construct well-reasoned legal arguments using IRAC (Issue, Rule, Application, Conclusion)`,
      `Distinguish conflicting precedents and articulate which rule governs a given situation`,
      `Synthesize principles across related doctrines to solve bar-exam style problems`,
    ],
    modules: [
      {
        title: 'Introduction and Historical Background',
        description: `Foundational overview of ${subjectName}, its historical development in the Philippine legal system, and its relationship to the 1987 Constitution.`,
        topics: ['Historical origins', 'Sources of law', 'Constitutional basis', 'Scope and limitations', 'Key definitions'],
        lessons: 4,
        difficulty: 'Beginner',
        quiz: [
          { question: `Which source of law is primary in the Philippine legal system?`, options: ['A) Jurisprudence', 'B) The 1987 Constitution', 'C) Executive Orders', 'D) Administrative regulations'], answer: 'B' },
          { question: 'Stare decisis requires courts to:', options: ['A) Ignore past decisions', 'B) Follow precedent', 'C) Overrule lower courts', 'D) Apply foreign law'], answer: 'B' },
          { question: 'The power of judicial review was established in the Philippines through:', options: ['A) The Civil Code', 'B) Act No. 136', 'C) Angara v. Electoral Commission', 'D) The 1899 Malolos Constitution'], answer: 'C' },
        ],
        essay: `Discuss the historical development of ${subjectName} in the Philippines and explain how it reflects the principles of the 1987 Constitution.`,
        bar_question: `Briefly explain the doctrine of constitutional supremacy and its significance in the Philippine legal system. (2023 Bar-style, 5 points)`,
      },
      {
        title: 'Core Doctrines and Principles',
        description: 'In-depth study of the fundamental doctrines that govern this subject, with analysis of how courts interpret and apply them.',
        topics: ['Primary doctrines', 'Exceptions and limitations', 'Landmark case applications', 'Policy rationale', 'Modern interpretations'],
        lessons: 5,
        difficulty: 'Intermediate',
        quiz: [
          { question: 'The "political question doctrine" holds that:', options: ['A) Courts can review all government acts', 'B) Some issues are beyond judicial review', 'C) Congress has final say on all matters', 'D) The President controls the judiciary'], answer: 'B' },
          { question: 'The principle of separation of powers means:', options: ['A) One branch holds all power', 'B) Powers are distributed among three branches', 'C) Courts override the legislature', 'D) The executive controls courts'], answer: 'B' },
          { question: 'Checks and balances prevents:', options: ['A) Efficient governance', 'B) Concentration of power', 'C) Judicial independence', 'D) Legislative supremacy'], answer: 'B' },
        ],
        essay: 'Critically analyze how Philippine courts balance doctrinal consistency with evolving social realities in this subject.',
        bar_question: 'X was charged under a newly passed law. The law had no IRR at the time of the charge. Discuss the validity of the charge. (Bar-style, 10 points)',
      },
      {
        title: 'Statutory Framework and Key Provisions',
        description: 'Systematic study of the primary statutes, codes, and rules governing this subject, including their interpretation by the Supreme Court.',
        topics: ['Relevant statutes', 'Key provisions', 'Rules of interpretation', 'Conflicts of law', 'Recent amendments'],
        lessons: 5,
        difficulty: 'Intermediate',
        quiz: [
          { question: 'Statutory construction primarily seeks to determine:', options: ['A) The most literal meaning', 'B) Legislative intent', 'C) The judge\'s preference', 'D) Foreign law equivalents'], answer: 'B' },
          { question: 'When a law is silent on a matter, courts should:', options: ['A) Dismiss the case', 'B) Apply analogous provisions', 'C) Refer to foreign law only', 'D) Refuse to decide'], answer: 'B' },
          { question: 'Penal statutes are construed:', options: ['A) Liberally in favor of the State', 'B) Strictly against the accused', 'C) Strictly against the State/liberally for accused', 'D) By majority vote of justices'], answer: 'C' },
        ],
        essay: 'Discuss how Philippine courts resolve conflicts between two statutes covering the same subject matter.',
        bar_question: 'Congress enacted a law that imposes criminal liability for an act considered lawful under an older law. May the new law be applied retroactively? Explain. (10 points)',
      },
      {
        title: 'Rights, Obligations, and Remedies',
        description: 'Examination of the rights conferred, obligations imposed, and remedies available under this body of law.',
        topics: ['Rights of parties', 'Correlative obligations', 'Civil remedies', 'Criminal liability', 'Equitable relief'],
        lessons: 6,
        difficulty: 'Intermediate',
        quiz: [
          { question: 'A right in personam is enforceable:', options: ['A) Against the whole world', 'B) Against a specific person', 'C) Only in criminal courts', 'D) Only in equity'], answer: 'B' },
          { question: 'Prescription of actions means:', options: ['A) The right is permanently granted', 'B) The right to sue has lapsed due to time', 'C) The court has no jurisdiction', 'D) The parties settled amicably'], answer: 'B' },
          { question: 'Moral damages are awarded when:', options: ['A) Actual loss is proven', 'B) There is physical suffering or social humiliation', 'C) The defendant is criminally convicted', 'D) Both parties are at fault'], answer: 'B' },
        ],
        essay: 'Distinguish between legal and equitable remedies and explain when each is available under Philippine law.',
        bar_question: 'A sues B for damages arising from a contractual breach. B raises prescription. A claims the period was interrupted. Discuss the rules on interruption of prescription under Philippine law. (10 points)',
      },
      {
        title: 'Procedural Aspects and Jurisdiction',
        description: 'Study of the procedural rules, jurisdiction, and venue applicable to disputes involving this subject.',
        topics: ['Subject-matter jurisdiction', 'Venue rules', 'Parties to proceedings', 'Pleadings and practice', 'Appellate review'],
        lessons: 4,
        difficulty: 'Intermediate',
        quiz: [
          { question: 'Jurisdiction over the subject matter is conferred by:', options: ['A) The parties\' agreement', 'B) Law', 'C) The judge\'s discretion', 'D) Filing of the complaint'], answer: 'B' },
          { question: 'Lack of jurisdiction over the subject matter may be raised:', options: ['A) Only at trial', 'B) At any stage, even on appeal', 'C) Only before filing answer', 'D) Only by the defendant'], answer: 'B' },
          { question: 'The rule on venue in civil cases is:', options: ['A) Mandatory and may not be waived', 'B) Generally waivable', 'C) Same as jurisdiction', 'D) Determined solely by the plaintiff'], answer: 'B' },
        ],
        essay: 'Explain the distinction between jurisdiction and venue and the consequences of improper venue in Philippine civil proceedings.',
        bar_question: 'X filed a case in RTC Manila when venue is proper only in RTC Quezon City. The defendant did not raise improper venue. May the court motu proprio dismiss the case? (5 points)',
      },
      {
        title: 'Special Topics and Emerging Issues',
        description: 'Analysis of special rules, emerging doctrines, and contemporary issues including digital developments and international law influences.',
        topics: ['Special rules', 'Recent Supreme Court rulings', 'International law intersections', 'Technology and the law', 'Policy debates'],
        lessons: 4,
        difficulty: 'Advanced',
        quiz: [
          { question: 'The doctrine of incorporation holds that:', options: ['A) Treaties override the Constitution', 'B) Generally accepted international law forms part of Philippine law', 'C) Congress must re-enact all treaties', 'D) The President alone ratifies treaties'], answer: 'B' },
          { question: 'E-commerce transactions in the Philippines are primarily governed by:', options: ['A) The Civil Code alone', 'B) R.A. 8792 (E-Commerce Act)', 'C) The Revised Penal Code', 'D) BSP circulars only'], answer: 'B' },
          { question: 'Cybercrime complaints are filed with:', options: ['A) Any RTC', 'B) Designated cybercrime courts', 'C) The Supreme Court directly', 'D) The DOJ only'], answer: 'B' },
        ],
        essay: 'Assess how Philippine courts have addressed the challenges posed by digital technology in this area of law.',
        bar_question: 'Discuss the "transformation doctrine" versus the "incorporation doctrine" in the context of international law and Philippine domestic law. (10 points)',
      },
      {
        title: 'Bar Examination Integration and Case Analysis',
        description: 'Comprehensive bar exam preparation: integrated problem-solving, case synthesis, and exam technique for this subject.',
        topics: ['IRAC methodology', 'Past bar questions analysis', 'Common pitfalls', 'Time management strategies', 'Synthesis of all modules'],
        lessons: 3,
        difficulty: 'Advanced',
        quiz: [
          { question: 'The IRAC method stands for:', options: ['A) Issue, Rule, Analysis, Conclusion', 'B) Issue, Research, Application, Court', 'C) Identify, Review, Argue, Close', 'D) Issue, Ruling, Analysis, Case'], answer: 'A' },
          { question: 'In bar exam essay writing, the most important element is:', options: ['A) Length of answer', 'B) Correct identification and application of the rule', 'C) Number of cases cited', 'D) Penmanship'], answer: 'B' },
          { question: 'A "no" answer in a bar question should be accompanied by:', options: ['A) No further explanation', 'B) The legal basis and reasoning', 'C) Only a case citation', 'D) A request for clarification'], answer: 'B' },
        ],
        essay: `Write a comprehensive essay on the most tested principles of ${subjectName} in Philippine bar examinations, citing key cases and statutes.`,
        bar_question: `(Comprehensive bar question) Analyze the following scenario applying the core principles of ${subjectName}: "A passed a law imposing liability. B challenges it as unconstitutional. The SC deliberates." Discuss all issues raised. (20 points)`,
      },
    ],
    cases: [
      {
        title: 'Angara v. Electoral Commission, G.R. No. L-45081 (1936)',
        facts: 'Jose Angara was proclaimed winner of the 1935 National Assembly elections. The Electoral Commission assumed jurisdiction to hear an election protest filed against him. Angara questioned the Commission\'s authority.',
        issue: 'Does the Electoral Commission have jurisdiction to take cognizance of the election protest, and does the Supreme Court have power to review the Commission\'s acts?',
        ruling: 'The Supreme Court upheld the Electoral Commission\'s jurisdiction and, in doing so, affirmed its own power of judicial review over acts of all branches of government.',
        doctrine: 'Established the doctrine of judicial review in the Philippines — the power of courts to determine whether acts of the other branches conform to the Constitution.',
      },
      {
        title: 'Marcos v. Manglapus, G.R. No. 88211 (1989)',
        facts: 'Former President Ferdinand Marcos, in exile in Hawaii, sought to return to the Philippines to die. President Aquino refused, citing national security concerns.',
        issue: 'Does the right to travel under the Constitution cover the right of a former President to return to the Philippines?',
        ruling: 'The Supreme Court upheld the President\'s power to bar the return of Marcos, ruling that residual powers of the President include the authority to protect national security.',
        doctrine: 'The President\'s residual powers — not enumerated in the Constitution — may be exercised when demanded by national interest. Rights may be limited by compelling state interests.',
      },
      {
        title: 'David v. Macapagal-Arroyo, G.R. No. 171396 (2006)',
        facts: 'President Arroyo issued Proclamation 1017 declaring a state of national emergency. Petitioners challenged its constitutionality after warrantless arrests and raids were conducted.',
        issue: 'Is Proclamation 1017 constitutional? Did it authorize the President to legislate or conduct warrantless arrests?',
        ruling: 'PP 1017 was partially constitutional insofar as it called the military. Its provisions authorizing the President to legislate and direct warrantless arrests were declared unconstitutional.',
        doctrine: 'The President\'s commander-in-chief powers do not include the power to legislate. Warrantless arrests require compliance with Rule 113 of the Rules of Court.',
      },
      {
        title: 'Oposa v. Factoran, G.R. No. 101083 (1993)',
        facts: 'Minor petitioners, through their parents, sued the DENR Secretary to cancel all existing timber license agreements (TLAs), claiming these violated their right to a balanced ecology.',
        issue: 'Do the petitioners have legal standing? Can minors sue on behalf of succeeding generations?',
        ruling: 'The Court upheld standing, recognizing that every generation has a responsibility to preserve the rhythm and harmony of nature for the enjoyment of the next generation.',
        doctrine: 'Intergenerational responsibility — the present generation holds the environment in trust for future generations. Recognized the constitutional right to a balanced and healthful ecology.',
      },
      {
        title: 'Chavez v. PEA and AMARI, G.R. No. 133250 (2002)',
        facts: 'Former Solicitor General Francisco Chavez sought to nullify the Joint Venture Agreement between PEA and AMARI for the development of reclaimed lands in Manila Bay.',
        issue: 'Can reclaimed lands be alienated to a private corporation? Does the right to information cover such government transactions?',
        ruling: 'Reclaimed lands are inalienable public lands that cannot be sold to private corporations. The right to information extends to matters of public concern including government contracts.',
        doctrine: 'Regalian doctrine — the State owns all lands not privately titled. Public lands may not be alienated except as authorized by law. Right to information on matters of public concern is self-executory.',
      },
    ],
    references: [
      '1987 Philippine Constitution (all provisions)',
      'Civil Code of the Philippines (R.A. 386)',
      'Revised Penal Code (Act No. 3815, as amended)',
      'Rules of Court (A.M. No. 19-10-20-SC)',
      'R.A. 8792 — E-Commerce Act of 2000',
      'R.A. 10175 — Cybercrime Prevention Act of 2012',
      'Cruz, I.A. (2014). Philippine Constitutional Law',
      'Bernas, J.G. (2011). The 1987 Philippine Constitution: A Comprehensive Reviewer',
      'Nachura, A.E.B. (2019). Outline Reviewer in Political Law',
      'Selected Supreme Court decisions from the Official Gazette of the Republic of the Philippines',
    ],
    ui_summary: {
      subject_title: subjectName,
      total_modules: 7,
      total_lessons: 31,
      tagline: `Master ${subjectName} through doctrine, case analysis, and bar-focused problem solving.`,
    },
  }
}

// ── Module generator route ─────────────────────────────────────────────────────
app.post('/api/generate-module', async (req, res) => {
  const { yearLevel, subjectName } = req.body

  if (!yearLevel || typeof yearLevel !== 'string' || yearLevel.trim().length === 0) {
    return res.status(400).json({ error: 'yearLevel is required.' })
  }
  if (!subjectName || typeof subjectName !== 'string' || subjectName.trim().length === 0) {
    return res.status(400).json({ error: 'subjectName is required.' })
  }
  if (subjectName.length > 200) {
    return res.status(400).json({ error: 'subjectName too long.' })
  }

  const client = getOpenAI()

  // ── Mock mode ──────────────────────────────────────────────────────────────
  if (!client) {
    return res.json({ module: buildMockModule(yearLevel.trim(), subjectName.trim()), mode: 'mock' })
  }

  // ── OpenAI mode ───────────────────────────────────────────────────────────
  try {
    const userPrompt = `Generate a complete law school module.\nYear Level: ${yearLevel.trim()}\nSubject Name: ${subjectName.trim()}\n\nReturn ONLY the JSON object. No markdown. No explanation.`

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: MODULE_GEN_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.' })
    }

    res.json({ module: parsed, mode: 'openai' })
  } catch (err) {
    console.error('OpenAI module gen error:', err.message)
    const status = err.status ?? 500
    const errMsg =
      status === 401 ? 'Invalid OpenAI API key.' :
      status === 429 ? 'Rate limit reached. Please try again in a moment.' :
      'Failed to generate module. Please try again.'
    res.status(status < 500 ? status : 500).json({ error: errMsg })
  }
})

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`LexisAI server running on port ${PORT}`)
  console.log(`AI mode: ${process.env.OPENAI_API_KEY ? '✓ OpenAI' : '⚠ Mock (set OPENAI_API_KEY to enable real AI)'}`)
})
