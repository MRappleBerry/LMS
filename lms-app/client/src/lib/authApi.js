import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''
const AUTH_TIMEOUT_MS = 8000

export async function fetchSession() {
  try {
    const { data } = await axios.get(`${API_BASE}/api/auth?mode=session`, {
      withCredentials: true,
      timeout: AUTH_TIMEOUT_MS,
    })
    return data
  } catch {
    // Never block app boot on a hanging auth call.
    return { authenticated: false, user: null }
  }
}

export async function fetchGoogleAuthConfig() {
  const { data } = await axios.get(`${API_BASE}/api/auth?mode=google_config`, {
    withCredentials: true,
    timeout: AUTH_TIMEOUT_MS,
  })
  return data
}

export function startGoogleLogin(returnTo = '/dashboard') {
  const target = `/api/auth?mode=google_start&returnTo=${encodeURIComponent(returnTo)}`
  window.location.href = `${API_BASE}${target}`
}

export async function logoutSession() {
  const { data } = await axios.post(`${API_BASE}/api/auth?mode=logout`, {}, {
    withCredentials: true,
    timeout: AUTH_TIMEOUT_MS,
  })
  return data
}
