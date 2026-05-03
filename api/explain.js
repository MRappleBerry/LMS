const OpenAI = require('openai')

const SYSTEM_PROMPT = `You are LexisAI, an expert legal education assistant for law students.
Always explain legal concepts accurately with plain-language clarity.
Keep answers educational and concise. Include doctrine, bar relevance, and one memory cue.`

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

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

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      reply: `Plain Explanation:\n${context.trim().slice(0, 300)}\n\nBar Relevance: Focus on elements, requisites, and exceptions likely tested in issue-spotting questions.\nMemory Tip: Build a 3-part recall cue: doctrine, requisites, exception.\n\n*[Mock explain response — add OPENAI_API_KEY to Vercel environment variables for full AI mode]*`,
      mode: 'mock',
    })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
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
  } catch {
    return res.status(500).json({ error: 'Failed to generate explanation.' })
  }
}
