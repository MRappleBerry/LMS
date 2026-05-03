const { getTopic } = require('./_curriculumData')
const { requireSubjectSubscription } = require('./_access')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const subject = req.query?.subject
  const chapter = req.query?.chapter
  if (!subject || !chapter) return res.status(400).json({ error: 'subject and chapter are required.' })

  const access = requireSubjectSubscription(req, res, subject)
  if (!access.ok) return

  const topic = getTopic(subject, chapter)
  if (!topic) return res.status(404).json({ error: 'Topic not found.' })

  return res.json({ ...topic, isSubscribed: true })
}
