const subscriptionStore = new Map()

const DEFAULT_USER_ID = 'demo-user'

function getUserId(req) {
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

function isSubscribed(userId, subjectId) {
  return getUserSubscriptions(userId).has(String(subjectId))
}

function subscribeToSubject(userId, subjectId) {
  getUserSubscriptions(userId).add(String(subjectId))
  return true
}

function listUserSubscriptions(userId) {
  return Array.from(getUserSubscriptions(userId))
}

module.exports = {
  getUserId,
  isSubscribed,
  subscribeToSubject,
  listUserSubscriptions,
}
