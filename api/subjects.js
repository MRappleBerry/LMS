const { getSubjects } = require('./_curriculumData')
const { getUserId, getSubjectEntitlement, getWeeklyAccessStatus } = require('./_subscriptions')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const year = req.query?.year
  const userId = getUserId(req)
  const subjects = getSubjects(year).map(subject => {
    const access = getSubjectEntitlement(userId, subject.id)
    return {
      ...subject,
      isSubscribed: access.isPremium,
      isPreviewSubject: access.isPreviewSubject,
      isLocked: !access.isPremium && access.weeklyPreviewUsed && !access.isPreviewSubject,
    }
  })
  return res.json({
    subjects,
    access: getWeeklyAccessStatus(userId),
  })
}
