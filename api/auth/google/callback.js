const {
  buildAppUrl,
  createSignedToken,
  setSessionCookie,
  verifyGoogleState,
  redirect,
} = require('../../_auth')
const { upsertUserFromGoogle } = require('../../_users')

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

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
