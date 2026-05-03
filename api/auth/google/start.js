const { buildAppUrl, buildGoogleState, sanitizeReturnTo, redirect } = require('../../_auth')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Google OAuth is not configured.' })
  }

  const returnTo = sanitizeReturnTo(req.query?.returnTo)
  const state = buildGoogleState(returnTo)
  const redirectUri = `${buildAppUrl(req)}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })

  return redirect(res, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
}
