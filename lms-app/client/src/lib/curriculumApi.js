import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''
const CACHE_KEY = 'lexisai.curriculum.cache.v2'
const USER_KEY = 'lexisai.user.id'
const mem = new Map()

export function getUserId() {
  try {
    const existing = localStorage.getItem(USER_KEY)
    if (existing) return existing
    const generated = `user-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(USER_KEY, generated)
    return generated
  } catch {
    return 'demo-user'
  }
}

export function getAuthHeaders() {
  return {
    'x-user-id': getUserId(),
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // noop
  }
}

function getCached(key) {
  if (mem.has(key)) return mem.get(key)
  const local = readCache()
  return local[key]
}

function setCached(key, value) {
  mem.set(key, value)
  const local = readCache()
  local[key] = value
  writeCache(local)
}

async function fetchJson(path, params = {}) {
  const { data } = await axios.get(`${API_BASE}${path}`, {
    params,
    headers: getAuthHeaders(),
  })
  return data
}

async function postJson(path, body = {}) {
  const { data } = await axios.post(`${API_BASE}${path}`, body, {
    headers: getAuthHeaders(),
  })
  return data
}

export async function fetchYears() {
  const key = 'years'
  const cached = getCached(key)
  if (cached) return cached
  const data = await fetchJson('/api/years')
  setCached(key, data.years)
  return data.years
}

export async function fetchSubjectsByYear(year) {
  const key = `subjects:${year || 'all'}`
  const cached = getCached(key)
  if (cached) return cached
  const data = await fetchJson('/api/subjects', year ? { year } : {})
  setCached(key, data.subjects)
  return data.subjects
}

export async function fetchSubjectsByYearWithAccess(year) {
  const data = await fetchJson('/api/subjects', year ? { year } : {})
  return data
}

export async function fetchChaptersBySubject(subject) {
  const key = `chapters:${subject}`
  const cached = getCached(key)
  if (cached) return cached
  const data = await fetchJson('/api/chapters', { subject })
  setCached(key, data)
  return data
}

export async function fetchTopic(subject, chapter) {
  const key = `topic:${subject}:${chapter}`
  const cached = getCached(key)
  if (cached) return cached
  const data = await fetchJson('/api/topics', { subject, chapter })
  setCached(key, data)
  return data
}

export async function fetchSubjectPage(subject) {
  const key = `subject:${subject}`
  const cached = getCached(key)
  if (cached) return cached
  const data = await fetchJson('/api/subject', { subject })
  setCached(key, data)
  return data
}

export async function subscribeToSubject(subjectId) {
  const data = await postJson('/api/subscribe', { subjectId })

  // Invalidate subject/subject-list/chapter caches so UI unlocks instantly.
  for (const key of [...mem.keys()]) {
    if (key.startsWith('subjects:') || key.startsWith('chapters:') || key.startsWith('subject:') || key.startsWith('topic:')) {
      mem.delete(key)
    }
  }
  const local = readCache()
  for (const key of Object.keys(local)) {
    if (key.startsWith('subjects:') || key.startsWith('chapters:') || key.startsWith('subject:') || key.startsWith('topic:')) {
      delete local[key]
    }
  }
  writeCache(local)

  return data
}
