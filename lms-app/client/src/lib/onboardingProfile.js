const ONBOARDING_KEY = 'lexisai.onboarding.profile.v1'

function readStore() {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(payload) {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(payload))
  } catch {
    // noop
  }
}

export function readOnboardingProfile(userId) {
  if (!userId) return null
  const all = readStore()
  return all[String(userId)] || null
}

export function hasCompletedOnboarding(userId) {
  const profile = readOnboardingProfile(userId)
  return Boolean(profile?.completedAt)
}

export function saveOnboardingProfile(userId, profile) {
  if (!userId || !profile) return
  const all = readStore()
  all[String(userId)] = {
    ...(all[String(userId)] || {}),
    ...profile,
  }
  writeStore(all)
}
