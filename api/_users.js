const crypto = require('crypto')

const memoryUsersByEmail = new Map()
const memoryUsersById = new Map()

function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function mapRowToUser(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    googleId: row.google_id,
    avatarUrl: row.avatar_url,
    subscriptionStatus: row.subscription_status || 'free',
    activeSubjects: Array.isArray(row.active_subjects) ? row.active_subjects : [],
    createdAt: row.created_at,
  }
}

async function supabaseFetch(path, options = {}) {
  const url = `${process.env.SUPABASE_URL}${path}`
  const headers = {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase error: ${response.status} ${text}`)
  }

  return response
}

async function upsertUserFromGoogle(profile) {
  const record = {
    name: profile.name,
    email: profile.email.toLowerCase(),
    google_id: profile.googleId,
    avatar_url: profile.avatarUrl || null,
    subscription_status: 'free',
    active_subjects: [],
  }

  if (!hasSupabase()) {
    const existing = memoryUsersByEmail.get(record.email)
    const user = existing || {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    const merged = {
      ...user,
      ...record,
    }
    memoryUsersByEmail.set(record.email, merged)
    memoryUsersById.set(merged.id, merged)
    return mapRowToUser(merged)
  }

  const response = await supabaseFetch('/rest/v1/users?on_conflict=email', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([record]),
  })

  const rows = await response.json()
  return mapRowToUser(rows?.[0])
}

async function findUserById(userId) {
  if (!userId) return null

  if (!hasSupabase()) {
    return mapRowToUser(memoryUsersById.get(String(userId)))
  }

  const response = await supabaseFetch(`/rest/v1/users?id=eq.${encodeURIComponent(String(userId))}&select=*`)
  const rows = await response.json()
  return mapRowToUser(rows?.[0])
}

module.exports = {
  upsertUserFromGoogle,
  findUserById,
}
