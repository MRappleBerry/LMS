import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchSession() {
  const { data } = await axios.get(`${API_BASE}/api/auth?mode=session`, {
    withCredentials: true,
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
  })
  return data
}
