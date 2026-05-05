import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_MATCH_WS_URL || import.meta.env.VITE_MATCH_API_URL || ''

let socket = null

export function connectRankedSocket(profile = {}) {
  if (socket && socket.connected) return socket
  if (!SOCKET_URL) return null

  socket = io(SOCKET_URL, {
    transports: ['polling', 'websocket'], // polling first for mobile network compatibility
    query: {
      userId: String(profile.userId || ''),
      name: profile.name || 'Law Learner',
      avatar: profile.avatar || '',
    },
  })

  return socket
}

export function getRankedSocket() {
  return socket
}

export function disconnectRankedSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}
