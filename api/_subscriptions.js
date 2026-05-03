const subscriptionStore = new Map()
const accessStore = new Map()
const { getSessionFromRequest } = require('./_auth')

const DEFAULT_USER_ID = 'demo-user'
const PREMIUM_SUBSCRIPTION_ID = 'premium-all-access'
const FREE_PREVIEW_CHAPTER_LIMIT = 2
const FREE_AI_PROMPT_LIMIT = 5
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function getUserId(req) {
  const session = getSessionFromRequest(req)
  if (session?.userId) return String(session.userId)

  const fromHeader = req.headers['x-user-id']
  const fromQuery = req.query?.userId
  const raw = fromHeader || fromQuery || DEFAULT_USER_ID
  return String(raw).trim() || DEFAULT_USER_ID
}

function getUserSubscriptions(userId) {
  if (!subscriptionStore.has(userId)) {
    subscriptionStore.set(userId, new Set())
  }
  return subscriptionStore.get(userId)
}

function getAccessState(userId) {
  if (!accessStore.has(userId)) {
    accessStore.set(userId, {
      windowStartedAt: Date.now(),
      weeklyPreviewUsed: false,
      previewSubjectId: null,
      aiPromptsUsed: 0,
    })
  }
  return accessStore.get(userId)
}

function normalizeAccessWindow(userId) {
  const state = getAccessState(userId)
  const now = Date.now()
  if (!state.windowStartedAt || now - state.windowStartedAt >= WEEK_MS) {
    state.windowStartedAt = now
    state.weeklyPreviewUsed = false
    state.previewSubjectId = null
    state.aiPromptsUsed = 0
  }
  return state
}

function getResetMeta(windowStartedAt) {
  const resetAt = windowStartedAt + WEEK_MS
  const msLeft = Math.max(0, resetAt - Date.now())
  const resetsInDays = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)))
  return {
    resetAt,
    resetsInDays,
  }
}

function hasPremium(userId) {
  const subs = getUserSubscriptions(userId)
  if (subs.has(PREMIUM_SUBSCRIPTION_ID)) return true
  // Backward compatibility: older subject-level purchases are treated as premium.
  return subs.size > 0
}

function claimPreviewSubject(userId, subjectId) {
  const state = normalizeAccessWindow(userId)
  const premium = hasPremium(userId)
  if (premium) {
    return {
      ok: true,
      state,
      premium,
      assigned: false,
    }
  }

  const sid = String(subjectId)
  if (!state.weeklyPreviewUsed) {
    state.weeklyPreviewUsed = true
    state.previewSubjectId = sid
    return {
      ok: true,
      state,
      premium,
      assigned: true,
    }
  }

  return {
    ok: state.previewSubjectId === sid,
    state,
    premium,
    assigned: false,
  }
}

function getSubjectEntitlement(userId, subjectId, options = {}) {
  const sid = String(subjectId)
  const claim = Boolean(options.claimPreview)
  const premium = hasPremium(userId)
  const claimResult = claim ? claimPreviewSubject(userId, sid) : null
  const state = claimResult?.state || normalizeAccessWindow(userId)
  const isPreviewSubject = state.previewSubjectId === sid
  const canAccess = premium || isPreviewSubject
  const { resetAt, resetsInDays } = getResetMeta(state.windowStartedAt)

  return {
    tier: premium ? 'premium' : 'free',
    isPremium: premium,
    isPreviewSubject,
    canAccess,
    canClaimPreview: !premium && !state.weeklyPreviewUsed,
    weeklyPreviewUsed: Boolean(state.weeklyPreviewUsed),
    previewSubjectId: state.previewSubjectId,
    previewChapterLimit: FREE_PREVIEW_CHAPTER_LIMIT,
    aiPromptLimit: premium ? null : FREE_AI_PROMPT_LIMIT,
    aiPromptsUsed: premium ? 0 : state.aiPromptsUsed,
    aiPromptsRemaining: premium ? null : Math.max(0, FREE_AI_PROMPT_LIMIT - state.aiPromptsUsed),
    resetAt,
    resetsInDays,
  }
}

function getChapterEntitlement(userId, subjectId, chapterId, options = {}) {
  const subjectEntitlement = getSubjectEntitlement(userId, subjectId, options)
  if (subjectEntitlement.isPremium) {
    return {
      ...subjectEntitlement,
      canAccessChapter: true,
      isLocked: false,
    }
  }

  const chapterNum = Number.parseInt(String(chapterId), 10)
  const canPreviewChapter = Number.isFinite(chapterNum) && chapterNum <= FREE_PREVIEW_CHAPTER_LIMIT
  const canAccessChapter = subjectEntitlement.canAccess && canPreviewChapter

  return {
    ...subjectEntitlement,
    canAccessChapter,
    isLocked: !canAccessChapter,
  }
}

function consumeAiPrompt(userId) {
  const state = normalizeAccessWindow(userId)
  const premium = hasPremium(userId)
  if (premium) {
    const { resetAt, resetsInDays } = getResetMeta(state.windowStartedAt)
    return {
      ok: true,
      tier: 'premium',
      aiPromptLimit: null,
      aiPromptsUsed: 0,
      aiPromptsRemaining: null,
      resetAt,
      resetsInDays,
    }
  }

  if (state.aiPromptsUsed >= FREE_AI_PROMPT_LIMIT) {
    const { resetAt, resetsInDays } = getResetMeta(state.windowStartedAt)
    return {
      ok: false,
      tier: 'free',
      aiPromptLimit: FREE_AI_PROMPT_LIMIT,
      aiPromptsUsed: state.aiPromptsUsed,
      aiPromptsRemaining: 0,
      resetAt,
      resetsInDays,
    }
  }

  state.aiPromptsUsed += 1
  const { resetAt, resetsInDays } = getResetMeta(state.windowStartedAt)
  return {
    ok: true,
    tier: 'free',
    aiPromptLimit: FREE_AI_PROMPT_LIMIT,
    aiPromptsUsed: state.aiPromptsUsed,
    aiPromptsRemaining: Math.max(0, FREE_AI_PROMPT_LIMIT - state.aiPromptsUsed),
    resetAt,
    resetsInDays,
  }
}

function getWeeklyAccessStatus(userId) {
  const state = normalizeAccessWindow(userId)
  const premium = hasPremium(userId)
  const { resetAt, resetsInDays } = getResetMeta(state.windowStartedAt)
  return {
    tier: premium ? 'premium' : 'free',
    isPremium: premium,
    weeklyPreviewUsed: premium ? true : Boolean(state.weeklyPreviewUsed),
    weeklyPreviewLimit: premium ? null : 1,
    weeklyPreviewUsedCount: premium ? null : (state.weeklyPreviewUsed ? 1 : 0),
    previewSubjectId: state.previewSubjectId,
    previewChapterLimit: FREE_PREVIEW_CHAPTER_LIMIT,
    aiPromptLimit: premium ? null : FREE_AI_PROMPT_LIMIT,
    aiPromptsUsed: premium ? 0 : state.aiPromptsUsed,
    aiPromptsRemaining: premium ? null : Math.max(0, FREE_AI_PROMPT_LIMIT - state.aiPromptsUsed),
    resetAt,
    resetsInDays,
  }
}

function isSubscribed(userId, subjectId) {
  const subs = getUserSubscriptions(userId)
  return subs.has(PREMIUM_SUBSCRIPTION_ID) || subs.has(String(subjectId)) || subs.size > 0
}

function subscribeToSubject(userId, subjectId) {
  const subs = getUserSubscriptions(userId)
  subs.add(PREMIUM_SUBSCRIPTION_ID)
  if (subjectId) subs.add(String(subjectId))
  return true
}

function listUserSubscriptions(userId) {
  return Array.from(getUserSubscriptions(userId))
}

module.exports = {
  PREMIUM_SUBSCRIPTION_ID,
  FREE_PREVIEW_CHAPTER_LIMIT,
  FREE_AI_PROMPT_LIMIT,
  getUserId,
  isSubscribed,
  subscribeToSubject,
  listUserSubscriptions,
  getWeeklyAccessStatus,
  getSubjectEntitlement,
  getChapterEntitlement,
  consumeAiPrompt,
}
