const {
  buildAppUrl,
  buildGoogleState,
  createSignedToken,
  getSessionFromRequest,
  sanitizeReturnTo,
  setSessionCookie,
  clearSessionCookie,
  verifyGoogleState,
  redirect,
} = require('./_auth')
const { upsertUserFromGoogle, findUserById } = require('./_users')

async function handleGoogleStart(req, res) {
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

async function handleGoogleCallback(req, res) {
  const code = req.query?.code
  const stateRaw = req.query?.state
  const state = verifyGoogleState(stateRaw)

  if (!code || !state) {
    return redirect(res, '/login?error=oauth_failed')
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return redirect(res, '/login?error=oauth_not_configured')
  }

  try {
    const redirectUri = `${buildAppUrl(req)}/api/auth/google/callback`
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      return redirect(res, '/login?error=oauth_token_exchange_failed')
    }

    const tokenJson = await tokenResponse.json()
    const accessToken = tokenJson?.access_token
    if (!accessToken) {
      return redirect(res, '/login?error=oauth_missing_access_token')
    }

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!profileResponse.ok) {
      return redirect(res, '/login?error=oauth_profile_failed')
    }

    const profile = await profileResponse.json()
    if (!profile?.sub || !profile?.email) {
      return redirect(res, '/login?error=oauth_invalid_profile')
    }

    const user = await upsertUserFromGoogle({
      googleId: profile.sub,
      email: profile.email,
      name: profile.name || profile.email,
      avatarUrl: profile.picture || null,
    })

    const token = createSignedToken({
      type: 'session',
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      googleId: user.googleId,
    })

    setSessionCookie(res, token)
    return redirect(res, state.returnTo || '/dashboard')
  } catch {
    return redirect(res, '/login?error=oauth_unexpected')
  }
}

async function handleSession(req, res) {
  const session = getSessionFromRequest(req)
  if (!session || session.type !== 'session' || !session.userId) {
    return res.json({ authenticated: false, user: null })
  }

  const user = await findUserById(session.userId)
  if (!user) {
    return res.json({ authenticated: false, user: null })
  }

  return res.json({ authenticated: true, user })
}

async function handleLogout(req, res) {
  clearSessionCookie(res)
  return res.json({ success: true })
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const mode = req.query?.mode
  const isCallback = Boolean(req.query?.code && req.query?.state)

  if (req.method === 'GET' && mode === 'google_start') return handleGoogleStart(req, res)
  if (req.method === 'GET' && isCallback) return handleGoogleCallback(req, res)
  if (req.method === 'GET' && mode === 'session') return handleSession(req, res)
  if (req.method === 'POST' && mode === 'logout') return handleLogout(req, res)

  return res.status(405).json({ error: 'Method not allowed.' })
}
