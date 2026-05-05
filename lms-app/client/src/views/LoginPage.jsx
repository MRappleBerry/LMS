import { useEffect, useMemo, useState } from 'react'
import { fetchGoogleAuthConfig, startGoogleLogin } from '../lib/authApi'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [googleEnabled, setGoogleEnabled] = useState(true)
  const [configError, setConfigError] = useState('')

  const isConcurrent = useMemo(() => {
    return new URLSearchParams(window.location.search).get('concurrent') === '1'
  }, [])

  const pendingToken = useMemo(() => {
    return new URLSearchParams(window.location.search).get('pending') || ''
  }, [])

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get('returnTo')
    if (!value || !value.startsWith('/')) return '/dashboard'
    if (value.startsWith('/api/')) return '/dashboard'
    return value
  }, [])

  const error = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('error')
    if (!code) return ''
    if (code === 'oauth_not_configured') {
      return 'Google sign-in is not configured on the server.'
    }
    return 'Login failed. Please try again.'
  }, [])

  useEffect(() => {
    let cancelled = false

    async function checkGoogleAuth() {
      try {
        const config = await fetchGoogleAuthConfig()
        if (cancelled) return
        const configured = Boolean(config?.configured)
        setGoogleEnabled(configured)
        if (!configured) {
          const missing = Array.isArray(config?.missing) ? config.missing : []
          setConfigError(
            missing.length
              ? `Missing environment variables: ${missing.join(', ')}`
              : 'Google sign-in is not configured on the server.'
          )
        }
      } catch {
        if (cancelled) return
        setGoogleEnabled(false)
        setConfigError('Unable to verify Google sign-in configuration.')
      }
    }

    checkGoogleAuth()
    return () => {
      cancelled = true
    }
  }, [])

  function onGoogle() {
    if (!googleEnabled) return
    setLoading(true)
    startGoogleLogin(returnTo)
  }

  function onConfirmOwnership() {
    setLoading(true)
    window.location.href = `${API_BASE}/api/auth?mode=confirm_session&pending=${encodeURIComponent(pendingToken)}`
  }

  function onDenyOwnership() {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(56,189,248,0.23),transparent),radial-gradient(900px_420px_at_90%_-10%,rgba(251,191,36,0.18),transparent)] flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-3xl border border-md-outline/50 bg-md-surf/90 backdrop-blur shadow-elev3 p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-md-onsurfvar">Law LMS</div>

        {isConcurrent ? (
          <>
            <h1 className="mt-2 text-2xl font-semibold text-md-onsurf">Account already active</h1>
            <p className="mt-2 text-sm text-md-onsurfvar">
              This account is currently signed in on another device or browser.
            </p>

            <div className="mt-5 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-800">Are you the account owner?</p>
              <p className="mt-1 text-xs text-amber-700">
                If you sign in here, the other session will be signed out automatically.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={onConfirmOwnership}
                disabled={loading || !pendingToken}
                className="w-full h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 text-sm font-semibold"
              >
                {loading ? 'Signing in...' : 'Yes, sign me in here'}
              </button>
              <button
                onClick={onDenyOwnership}
                disabled={loading}
                className="w-full h-11 rounded-xl border border-md-outline text-md-onsurf hover:bg-md-surf text-sm font-semibold"
              >
                No, cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-md-onsurf">Welcome back</h1>
            <p className="mt-2 text-sm text-md-onsurfvar">Start your law journey</p>

            {error && (
              <div className="mt-4 rounded-xl border border-md-error/40 bg-md-error/10 text-md-error text-sm p-3">
                {error}
              </div>
            )}

            {!error && configError && (
              <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-800 text-sm p-3">
                {configError}
              </div>
            )}

            <button
              onClick={onGoogle}
              disabled={loading || !googleEnabled}
              className="mt-6 w-full h-11 rounded-xl bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 3.2 14.6 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12z"/>
              </svg>
              {loading ? 'Redirecting to Google...' : 'Continue with Google'}
            </button>

            <p className="mt-4 text-[11px] text-md-onsurfvar text-center">
              Secure sign-in powered by Google OAuth. Email/password fallback can be added later.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
