const OpenAI = require('openai')

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

function buildMockModule(yearLevel, subjectName) {
  return {
    subject_overview: `${subjectName} is a foundational subject in the Philippine law curriculum for ${yearLevel} students. It covers essential doctrines, landmark Supreme Court decisions, and statutory provisions that define this area of Philippine jurisprudence.`,
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
          { question: 'Which source of law is primary in the Philippine legal system?', options: ['A) Jurisprudence', 'B) The 1987 Constitution', 'C) Executive Orders', 'D) Administrative regulations'], answer: 'B' },
          { question: 'Stare decisis requires courts to:', options: ['A) Ignore past decisions', 'B) Follow precedent', 'C) Overrule lower courts', 'D) Apply foreign law'], answer: 'B' },
          { question: 'Judicial review in the Philippines was established in:', options: ['A) The Civil Code', 'B) Act No. 136', 'C) Angara v. Electoral Commission', 'D) The 1899 Malolos Constitution'], answer: 'C' },
        ],
        essay: `Discuss the historical development of ${subjectName} in the Philippines and explain how it reflects the principles of the 1987 Constitution.`,
        bar_question: `Briefly explain the doctrine of constitutional supremacy and its significance in the Philippine legal system. (5 points)`,
      },
      {
        title: 'Core Doctrines and Principles',
        description: 'In-depth study of the fundamental doctrines governing this subject, with analysis of how courts interpret and apply them.',
        topics: ['Primary doctrines', 'Exceptions and limitations', 'Landmark case applications', 'Policy rationale', 'Modern interpretations'],
        lessons: 5,
        difficulty: 'Intermediate',
        quiz: [
          { question: 'The "political question doctrine" holds that:', options: ['A) Courts can review all government acts', 'B) Some issues are beyond judicial review', 'C) Congress has final say on all matters', 'D) The President controls the judiciary'], answer: 'B' },
          { question: 'Separation of powers means:', options: ['A) One branch holds all power', 'B) Powers are distributed among three branches', 'C) Courts override the legislature', 'D) The executive controls courts'], answer: 'B' },
          { question: 'Checks and balances prevents:', options: ['A) Efficient governance', 'B) Concentration of power', 'C) Judicial independence', 'D) Legislative supremacy'], answer: 'B' },
        ],
        essay: `Critically analyze how Philippine courts balance doctrinal consistency with evolving social realities in ${subjectName}.`,
        bar_question: 'X was charged under a newly passed law with no IRR at the time of the charge. Discuss the validity of the charge. (10 points)',
      },
    ],
    cases: [
      {
        title: 'Angara v. Electoral Commission, G.R. No. L-45081 (1936)',
        facts: 'Jose Angara was proclaimed winner of the 1935 National Assembly elections. The Electoral Commission assumed jurisdiction over an election protest filed against him.',
        issue: 'Does the Electoral Commission have jurisdiction, and does the Supreme Court have power to review its acts?',
        ruling: 'The Supreme Court upheld the Electoral Commission\'s jurisdiction and affirmed its own power of judicial review over acts of all branches of government.',
        doctrine: 'Established the doctrine of judicial review in the Philippines — courts determine whether acts of other branches conform to the Constitution.',
      },
      {
        title: 'Oposa v. Factoran, G.R. No. 101083 (1993)',
        facts: 'Minor petitioners sued the DENR Secretary to cancel all existing timber license agreements, claiming violations of their right to a balanced ecology.',
        issue: 'Do the petitioners have legal standing? Can minors sue on behalf of succeeding generations?',
        ruling: 'The Court upheld standing, recognizing the right to a balanced and healthful ecology as a self-executory constitutional right.',
        doctrine: 'Intergenerational responsibility — the present generation holds the environment in trust for future generations.',
      },
      {
        title: 'David v. Macapagal-Arroyo, G.R. No. 171396 (2006)',
        facts: 'President Arroyo issued PP 1017 declaring a state of national emergency. Warrantless arrests and raids followed.',
        issue: 'Is PP 1017 constitutional? Did it authorize the President to legislate or conduct warrantless arrests?',
        ruling: 'PP 1017 was partially constitutional insofar as it called the military; provisions authorizing legislation and warrantless arrests were unconstitutional.',
        doctrine: 'The President\'s commander-in-chief powers do not include the power to legislate. Warrantless arrests must comply with Rule 113.',
      },
    ],
    references: [
      '1987 Philippine Constitution',
      'Civil Code of the Philippines (R.A. 386)',
      'Revised Penal Code (Act No. 3815, as amended)',
      'Rules of Court (A.M. No. 19-10-20-SC)',
      'Bernas, J.G. (2011). The 1987 Philippine Constitution: A Comprehensive Reviewer',
      'Nachura, A.E.B. (2019). Outline Reviewer in Political Law',
    ],
    ui_summary: {
      subject_title: subjectName,
      total_modules: 2,
      total_lessons: 9,
      tagline: `Master ${subjectName} through doctrine, case analysis, and bar-focused problem solving.`,
    },
  }
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { yearLevel, subjectName } = req.body || {}

  if (!yearLevel || typeof yearLevel !== 'string' || yearLevel.trim().length === 0) {
    return res.status(400).json({ error: 'yearLevel is required.' })
  }
  if (!subjectName || typeof subjectName !== 'string' || subjectName.trim().length === 0) {
    return res.status(400).json({ error: 'subjectName is required.' })
  }
  if (subjectName.length > 200) {
    return res.status(400).json({ error: 'subjectName too long.' })
  }

  // Mock mode
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ module: buildMockModule(yearLevel.trim(), subjectName.trim()), mode: 'mock' })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const userPrompt = `Generate a complete law school module.\nYear Level: ${yearLevel.trim()}\nSubject Name: ${subjectName.trim()}\n\nReturn ONLY the JSON object. No markdown. No explanation.`

    const completion = await openai.chat.completions.create({
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

    return res.json({ module: parsed, mode: 'openai' })
  } catch (err) {
    const status = err.status ?? 500
    const errMsg =
      status === 401 ? 'Invalid OpenAI API key.' :
      status === 429 ? 'Rate limit reached. Please try again in a moment.' :
      'Failed to generate module. Please try again.'
    return res.status(status < 500 ? status : 500).json({ error: errMsg })
  }
}
