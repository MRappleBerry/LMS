const { getSubjectSummary, getChapters } = require('./_curriculumData')
const { getUserId, isSubscribed } = require('./_subscriptions')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const subjectId = req.query?.subject
  if (!subjectId) return res.status(400).json({ error: 'subject is required.' })

  const subject = getSubjectSummary(subjectId)
  if (!subject) return res.status(404).json({ error: 'Subject not found.' })

  const userId = getUserId(req)
  const subscribed = isSubscribed(userId, subjectId)
  const chapterData = getChapters(subjectId)

  const chapters = (chapterData?.chapters || []).map(ch => ({
    ...ch,
    isLocked: !subscribed,
    previewSection: ch.sections?.[0] || null,
  }))

  return res.json({
    subject: {
      ...subject,
      isSubscribed: subscribed,
    },
    chapters,
  })
}
