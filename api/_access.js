const { getUserId, getChapterEntitlement } = require('./_subscriptions')

function requireTopicAccess(req, res, subjectId, chapterId) {
  const userId = getUserId(req)
  const entitlement = getChapterEntitlement(userId, subjectId, chapterId, { claimPreview: true })

  if (entitlement.canAccessChapter) {
    return {
      ok: true,
      userId,
      entitlement,
    }
  }

  const reason = entitlement.isPreviewSubject
    ? 'Chapter locked in free preview. Upgrade to Premium for full chapter access.'
    : entitlement.weeklyPreviewUsed
      ? 'Weekly free subject preview already used. Upgrade to Premium for full access.'
      : 'Start your free weekly preview on this subject to continue.'

  res.status(402).json({
    error: reason,
    redirectTo: `/subject/${subjectId}`,
    access: entitlement,
  })

  return { ok: false, userId }
}

module.exports = {
  requireTopicAccess,
}
