const { getSubjectSummary } = require('./_curriculumData')
const { getUserId, subscribeToSubject } = require('./_subscriptions')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const subjectId = req.body?.subjectId
  if (!subjectId) return res.status(400).json({ error: 'subjectId is required.' })

  const subject = getSubjectSummary(subjectId)
  if (!subject) return res.status(404).json({ error: 'Subject not found.' })

  const userId = getUserId(req)

  // Simulated successful payment capture for demo mode.
  subscribeToSubject(userId, subjectId)

  return res.json({
    success: true,
    paymentStatus: 'paid',
    userSubscription: {
      user_id: userId,
      subject_id: String(subjectId),
      status: 'active',
    },
  })
}
