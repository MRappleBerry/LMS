import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''
const CACHE_KEY = 'lexisai.curriculum.cache.v1'
const mem = new Map()

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
  const { data } = await axios.get(`${API_BASE}${path}`, { params })
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
