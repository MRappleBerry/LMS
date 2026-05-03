const { getUserId, isSubscribed } = require('./_subscriptions')

function requireSubjectSubscription(req, res, subjectId) {
  const userId = getUserId(req)
  const allowed = isSubscribed(userId, subjectId)

  if (allowed) {
    return { ok: true, userId }
  }

  res.status(402).json({
    error: 'Subject subscription required.',
    redirectTo: `/subject/${subjectId}`,
    isSubscribed: false,
  })

  return { ok: false, userId }
}

module.exports = {
  requireSubjectSubscription,
}
