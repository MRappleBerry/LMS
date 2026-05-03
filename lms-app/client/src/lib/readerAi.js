import axios from 'axios'
import { getAuthHeaders } from './curriculumApi'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function explainWithAi({ context, instruction }) {
  const payload = { context, instruction }
  try {
    const { data } = await axios.post(`${API_BASE}/api/explain`, payload, { headers: getAuthHeaders() })
    return data
  } catch (err) {
    // Fallback for older backend deployments.
    if (err.response?.status === 404) {
      const legacyPrompt = `${instruction}\n\nContext:\n${context}`
      const { data } = await axios.post(`${API_BASE}/api/chat`, { message: legacyPrompt }, { headers: getAuthHeaders() })
      return { reply: data.reply, mode: data.mode || 'legacy-chat' }
    }
    throw err
  }
}
