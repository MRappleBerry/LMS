import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

async function get(path, params = {}) {
  const { data } = await axios.get(`${API_BASE}${path}`, {
    params,
    withCredentials: true,
  })
  return data
}

async function post(path, body = {}) {
  const { data } = await axios.post(`${API_BASE}${path}`, body, {
    withCredentials: true,
  })
  return data
}

export function fetchWeeklyChallenge() {
  return get('/api/weekly-challenge')
}

export function submitWeeklyChallenge(body) {
  return post('/api/submit-challenge', body)
}

export function fetchWeeklyLeaderboard(challengeId) {
  return get('/api/leaderboard', challengeId ? { challengeId } : {})
}

export function fetchWeeklyUserRank(challengeId) {
  return get('/api/user-rank', challengeId ? { challengeId } : {})
}
