import axios from 'axios'

const API_BASE = import.meta.env.VITE_MATCH_API_URL || import.meta.env.VITE_API_URL || ''

export async function fetchRankedLeaderboard() {
  const { data } = await axios.get(`${API_BASE}/leaderboard`, { withCredentials: true })
  return data
}

export async function findRankedMatchHttp(profile) {
  const { data } = await axios.post(`${API_BASE}/match/find`, profile || {}, { withCredentials: true })
  return data
}

export async function fetchMatchById(matchId) {
  const { data } = await axios.get(`${API_BASE}/match/${encodeURIComponent(matchId)}`, { withCredentials: true })
  return data
}

export async function submitMatchAnswerHttp(payload) {
  const { data } = await axios.post(`${API_BASE}/match/submit`, payload || {}, { withCredentials: true })
  return data
}
