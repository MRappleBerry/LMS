const OpenAI = require('openai')
const { getUserId, consumeAiPrompt } = require('./_subscriptions')

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

const MOCK_RESPONSES = [
  "**Judicial Review** is the power of courts to examine legislation and executive actions to determine whether they are constitutional. It was firmly established by Chief Justice John Marshall in *Marbury v. Madison* (1803).",
  "The **Miranda Warning** requires law enforcement to inform suspects of: (1) the right to remain silent, (2) that anything said can be used against them, (3) the right to an attorney, and (4) that an attorney will be appointed if they cannot afford one.",
  "**Stare decisis** means 'to stand by things decided.' It is the doctrine requiring courts to follow legal precedents established by prior decisions. This promotes consistency and predictability in the law.",
  "**Negligence** requires proving four elements: (1) Duty of care owed to the plaintiff, (2) Breach of that duty, (3) Causation (both actual and proximate), and (4) Damages suffered as a result.",
  "A valid **contract** requires: Offer, Acceptance, Consideration (something of value exchanged), Mutual intent to be bound, Capacity of the parties, and Legality of the subject matter.",
]
let mockIdx = 0

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { message } = req.body || {}

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' })
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters).' })
  }

  const userId = getUserId(req)
  const aiUsage = consumeAiPrompt(userId)
  if (!aiUsage.ok) {
    return res.status(402).json({
      error: `Free AI prompt limit reached (${aiUsage.aiPromptLimit}/week). Upgrade to Premium for unlimited AI usage.`,
      access: aiUsage,
    })
  }

  // Mock mode (no API key)
  if (!process.env.OPENAI_API_KEY) {
    const reply = MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length]
    mockIdx++
    return res.json({
      reply: `${reply}\n\n*[Mock response — add your OPENAI_API_KEY to Vercel environment variables to enable real AI]*`,
      mode: 'mock',
      access: aiUsage,
    })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.'
    return res.json({ reply, mode: 'openai', access: aiUsage })
  } catch (err) {
    const status = err.status ?? 500
    const errMsg =
      status === 401 ? 'Invalid OpenAI API key.' :
      status === 429 ? 'Rate limit reached. Please try again in a moment.' :
      status === 503 ? 'OpenAI service is temporarily unavailable.' :
      'Failed to get AI response. Please try again.'
    return res.status(status < 500 ? status : 500).json({ error: errMsg })
  }
}
