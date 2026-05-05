const crypto = require('crypto')

const SESSION_COOKIE_NAME = 'lexisai_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const STATE_TTL_SECONDS = 10 * 60

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

function getSecret() {
  return process.env.AUTH_SESSION_SECRET || 'dev-auth-secret-change-me'
}

function signValue(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url')
}

function createSignedToken(payload, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + Number(ttlSeconds || SESSION_TTL_SECONDS)
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }))
  const sig = signValue(body)
  return `${body}.${sig}`
}

function verifySignedToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  const expected = signValue(body)
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null
    }
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body))
    if (!payload?.exp || Date.now() / 1000 >= payload.exp) return null
    return payload
  } catch {
    return null
  }
}

function parseCookies(req) {
  const raw = req.headers?.cookie || ''
  const out = {}
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (!k) continue
    out[k] = decodeURIComponent(rest.join('='))
  }
  return out
}

function buildAppUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host
  return `${proto}://${host}`
}

function sanitizeReturnTo(value) {
  if (!value || typeof value !== 'string') return '/dashboard'
  if (!value.startsWith('/')) return '/dashboard'
  if (value.startsWith('//')) return '/dashboard'
  if (value.startsWith('/api/')) return '/dashboard'
  return value
}

function appendSetCookie(res, cookieValue) {
  const current = res.getHeader('Set-Cookie')
  if (!current) {
    res.setHeader('Set-Cookie', cookieValue)
    return
  }
  if (Array.isArray(current)) {
    res.setHeader('Set-Cookie', [...current, cookieValue])
    return
  }
  res.setHeader('Set-Cookie', [current, cookieValue])
}

function setSessionCookie(res, token) {
  const secure = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production')
  const cookie = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
    secure ? 'Secure' : '',
  ].filter(Boolean).join('; ')

  appendSetCookie(res, cookie)
}

function clearSessionCookie(res) {
  const secure = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production')
  const cookie = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    secure ? 'Secure' : '',
  ].filter(Boolean).join('; ')

  appendSetCookie(res, cookie)
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req)
  const token = cookies[SESSION_COOKIE_NAME]
  return verifySignedToken(token)
}

function buildGoogleState(returnTo) {
  return createSignedToken({
    type: 'google_state',
    returnTo: sanitizeReturnTo(returnTo),
    nonce: crypto.randomBytes(12).toString('hex'),
  }, STATE_TTL_SECONDS)
}

function verifyGoogleState(state) {
  const payload = verifySignedToken(state)
  if (!payload || payload.type !== 'google_state') return null
  return {
    returnTo: sanitizeReturnTo(payload.returnTo),
  }
}

function redirect(res, location) {
  res.statusCode = 302
  res.setHeader('Location', location)
  res.end()
}

// Active session tracking (in-memory, best-effort for serverless).
// Tracks the latest sessionId per userId to detect concurrent logins.
const activeSessionStore = new Map()

function registerActiveSession(userId, sessionId) {
  activeSessionStore.set(String(userId), String(sessionId))
}

function getActiveSession(userId) {
  return activeSessionStore.get(String(userId)) || null
}

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSignedToken,
  verifySignedToken,
  parseCookies,
  buildAppUrl,
  sanitizeReturnTo,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromRequest,
  buildGoogleState,
  verifyGoogleState,
  redirect,
  registerActiveSession,
  getActiveSession,
}
