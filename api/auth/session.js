const { getSessionFromRequest } = require('../_auth')
const { findUserById } = require('../_users')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const session = getSessionFromRequest(req)
  if (!session || session.type !== 'session' || !session.userId) {
    return res.json({ authenticated: false, user: null })
  }

  const user = await findUserById(session.userId)
  if (!user) {
    return res.json({ authenticated: false, user: null })
  }

  return res.json({
    authenticated: true,
    user,
  })
}
