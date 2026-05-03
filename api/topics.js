const { getTopic } = require('./_curriculumData')
const { requireTopicAccess } = require('./_access')
const { getWeeklyAccessStatus } = require('./_subscriptions')
const { getSessionFromRequest } = require('./_auth')

function sanitizeTopicForPreview(topic) {
  const sections = (topic.sections || []).map(section => {
    const clean = { ...section }
    delete clean.barExam
    delete clean.quiz
    return clean
  })

  return {
    ...topic,
    sections,
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const subject = req.query?.subject
  const chapter = req.query?.chapter
  if (!subject || !chapter) return res.status(400).json({ error: 'subject and chapter are required.' })

  const session = getSessionFromRequest(req)
  if (!session?.userId) {
    return res.status(401).json({ error: 'Authentication required.', redirectTo: '/login' })
  }

  const access = requireTopicAccess(req, res, subject, chapter)
  if (!access.ok) return

  const topic = getTopic(subject, chapter)
  if (!topic) return res.status(404).json({ error: 'Topic not found.' })

  const isPremium = access.entitlement?.isPremium
  const payload = isPremium ? topic : sanitizeTopicForPreview(topic)

  return res.json({
    ...payload,
    isSubscribed: isPremium,
    access: getWeeklyAccessStatus(access.userId),
    capabilities: {
      canUseQuiz: Boolean(isPremium),
      canUseBarExam: Boolean(isPremium),
      canUseAI: Boolean(isPremium || (access.entitlement?.aiPromptsRemaining > 0)),
    },
    previewMode: !isPremium,
  })
}
