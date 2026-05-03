import { useMemo, useState } from 'react'
import { startGoogleLogin } from '../lib/authApi'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

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
    return 'Login failed. Please try again.'
  }, [])

  function onGoogle() {
    setLoading(true)
    startGoogleLogin(returnTo)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(56,189,248,0.23),transparent),radial-gradient(900px_420px_at_90%_-10%,rgba(251,191,36,0.18),transparent)] flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-3xl border border-md-outline/50 bg-md-surf/90 backdrop-blur shadow-elev3 p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-md-onsurfvar">Law LMS</div>
        <h1 className="mt-2 text-3xl font-semibold text-md-onsurf">Welcome back</h1>
        <p className="mt-2 text-sm text-md-onsurfvar">Start your law journey</p>

        {error && (
          <div className="mt-4 rounded-xl border border-md-error/40 bg-md-error/10 text-md-error text-sm p-3">
            {error}
          </div>
        )}

        <button
          onClick={onGoogle}
          disabled={loading}
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
      </div>
    </div>
  )
}
