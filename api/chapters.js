const { getChapters } = require('./_curriculumData')
const { getUserId, getSubjectEntitlement, getChapterEntitlement, getWeeklyAccessStatus } = require('./_subscriptions')
const { getSessionFromRequest } = require('./_auth')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const subject = req.query?.subject
  if (!subject) return res.status(400).json({ error: 'subject is required.' })

  const session = getSessionFromRequest(req)
  if (!session?.userId) {
    return res.status(401).json({ error: 'Authentication required.', redirectTo: '/login' })
  }

  const data = getChapters(subject)
  if (!data) return res.status(404).json({ error: 'Subject not found.' })

  const userId = getUserId(req)
  const subjectAccess = getSubjectEntitlement(userId, subject, { claimPreview: true })

  return res.json({
    ...data,
    isSubscribed: subjectAccess.isPremium,
    isPreviewSubject: subjectAccess.isPreviewSubject,
    access: getWeeklyAccessStatus(userId),
    capabilities: {
      canUseQuiz: subjectAccess.isPremium,
      canUseBarExam: subjectAccess.isPremium,
      canUseAI: subjectAccess.isPremium || subjectAccess.aiPromptsRemaining > 0,
    },
    chapters: data.chapters.map(ch => ({
      ...(() => {
        const chapterAccess = getChapterEntitlement(userId, subject, ch.id, { claimPreview: true })
        return {
          isLocked: chapterAccess.isLocked,
        }
      })(),
      ...ch,
    })),
  })
}
