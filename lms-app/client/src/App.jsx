import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import TopAppBar   from './components/TopAppBar'
import BottomNav   from './components/BottomNav'
import Drawer      from './components/Drawer'
import Dashboard   from './views/Dashboard'
import ChatView    from './views/ChatView'
import CaseLibrary from './views/CaseLibrary'
import StudyMode   from './views/StudyMode'
import Notes       from './views/Notes'
import Settings    from './views/Settings'
import ModuleGenerator from './views/ModuleGenerator'
import RankedMatch from './views/RankedMatch'
import ReaderPage from './views/ReaderPage'
import YearPage from './views/YearPage'
import SubjectPage from './views/SubjectPage'
import LearnPage from './views/LearnPage'
import LoginPage from './views/LoginPage'
import WeeklyChallenge from './views/WeeklyChallenge'
import { getSubjectMeta } from './data/books/catalog'
import { fetchSession, logoutSession } from './lib/authApi'
import { clearPreferredUserId, setPreferredUserId } from './lib/curriculumApi'

/* FAB config per view -------------------------------------------------- */
const FAB_CONFIG = {
  reader:    { icon: '✦', label: 'AI Explain', color: 'from-indigo-600 to-violet-600' },
  dashboard: { icon: '✨', label: 'Generate',  color: 'from-violet-600 to-indigo-600' },
  chat:      { icon: '＋', label: 'New Chat',   color: 'from-indigo-600 to-blue-600'  },
  cases:     { icon: '＋', label: 'Add Case',   color: 'from-indigo-600 to-cyan-600'  },
  study:     { icon: '▶',  label: 'Quick Quiz', color: 'from-emerald-600 to-teal-600' },
  notes:     { icon: '＋', label: 'New Note',   color: 'from-amber-500 to-orange-600' },
}

/* Ripple helper --------------------------------------------------------- */
function addRipple(e, el) {
  const rect = el.getBoundingClientRect()
  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  const size = Math.max(rect.width, rect.height) * 2
  wave.style.width = wave.style.height = `${size}px`
  wave.style.marginTop = wave.style.marginLeft = `${-size / 2}px`
  wave.style.left = `${e.clientX - rect.left}px`
  wave.style.top  = `${e.clientY - rect.top}px`
  el.appendChild(wave)
  wave.addEventListener('animationend', () => wave.remove())
}

function parsePath(pathname) {
  if (pathname === '/login') {
    return {
      type: 'login',
      pathname,
    }
  }

  const yearMatch = pathname.match(/^\/year\/([^/]+)$/)
  if (yearMatch) {
    return {
      type: 'year',
      yearId: decodeURIComponent(yearMatch[1]),
      pathname,
    }
  }

  const readerMatch = pathname.match(/^\/subject\/([^/]+)\/chapter\/([^/]+)$/)
  if (readerMatch) {
    return {
      type: 'reader',
      subject: decodeURIComponent(readerMatch[1]),
      chapterId: decodeURIComponent(readerMatch[2]),
      pathname,
    }
  }

  const subjectMatch = pathname.match(/^\/subject\/([^/]+)$/)
  if (subjectMatch) {
    return {
      type: 'subject',
      subject: decodeURIComponent(subjectMatch[1]),
      pathname,
    }
  }

  const legacyMatch = pathname.match(/^\/course\/([^/]+)\/chapter\/([^/]+)$/)
  if (legacyMatch) {
    return {
      type: 'legacy-reader',
      subject: decodeURIComponent(legacyMatch[1]),
      chapterId: decodeURIComponent(legacyMatch[2]),
      pathname,
    }
  }

  if (pathname === '/learn') {
    return { type: 'learn', pathname }
  }

  const viewRoutes = {
    '/dashboard': 'dashboard',
    '/chat': 'chat',
    '/cases': 'cases',
    '/study': 'study',
    '/ranked': 'ranked',
    '/weekly-challenge': 'weekly',
    '/notes': 'notes',
    '/modules': 'modules',
    '/settings': 'settings',
  }

  return {
    type: 'view',
    view: viewRoutes[pathname] || 'reader',
    pathname,
  }
}

function buildPathFromView(id) {
  const route = {
    dashboard: '/dashboard',
    chat: '/chat',
    cases: '/cases',
    study: '/study',
    ranked: '/ranked',
    weekly: '/weekly-challenge',
    notes: '/notes',
    modules: '/modules',
    settings: '/settings',
  }
  return route[id] || '/dashboard'
}

export default function App() {
  const [route,      setRoute]      = useState(() => parsePath(window.location.pathname))
  const [viewKey,    setViewKey]    = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [readerNavOpen, setReaderNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const fabRef = useRef(null)

  function isProtectedRoute(nextRoute) {
    if (!nextRoute) return false
    if (nextRoute.type === 'reader' || nextRoute.type === 'subject') return true
    return nextRoute.type === 'view' && nextRoute.view === 'dashboard'
  }

  useEffect(() => {
    if (window.location.pathname === '/') {
      const defaultPath = '/learn'
      window.history.replaceState({}, '', defaultPath)
      setRoute(parsePath(defaultPath))
    }

    if (window.location.pathname.match(/^\/course\/[^/]+\/chapter\/[^/]+$/)) {
      const current = parsePath(window.location.pathname)
      const next = `/subject/${current.subject}/chapter/${current.chapterId}`
      window.history.replaceState({}, '', next)
      setRoute(parsePath(next))
    }

    function onPopstate() {
      const next = parsePath(window.location.pathname)
      if (next.type === 'legacy-reader') {
        const migrated = `/subject/${next.subject}/chapter/${next.chapterId}`
        window.history.replaceState({}, '', migrated)
        setRoute(parsePath(migrated))
      } else {
        setRoute(next)
      }
      setViewKey(k => k + 1)
    }

    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  useEffect(() => {
    let mounted = true
    const bootFallback = window.setTimeout(() => {
      if (!mounted) return
      setAuthLoading(false)
    }, 10000)

    fetchSession()
      .then(data => {
        if (!mounted) return
        if (data?.authenticated && data?.user) {
          setUser(data.user)
          setPreferredUserId(data.user.id)
        } else {
          setUser(null)
          clearPreferredUserId()
        }
      })
      .catch(() => {
        if (!mounted) return
        setUser(null)
        clearPreferredUserId()
      })
      .finally(() => {
        if (mounted) setAuthLoading(false)
        window.clearTimeout(bootFallback)
      })

    return () => {
      mounted = false
      window.clearTimeout(bootFallback)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!user && isProtectedRoute(route) && route.type !== 'login') {
      const returnTo = encodeURIComponent(route.pathname || '/dashboard')
      const next = `/login?returnTo=${returnTo}`
      window.history.replaceState({}, '', next)
      setRoute(parsePath('/login'))
      setViewKey(k => k + 1)
      return
    }

    if (user && route.type === 'login') {
      const params = new URLSearchParams(window.location.search)
      const returnTo = params.get('returnTo')
      const nextPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('/api/')
        ? returnTo
        : '/dashboard'
      window.history.replaceState({}, '', nextPath)
      setRoute(parsePath(nextPath))
      setViewKey(k => k + 1)
    }
  }, [authLoading, user, route])

  const activeView = ['reader', 'year', 'subject', 'legacy-reader'].includes(route.type) ? 'reader' : route.view
  const subjectMeta = route.type === 'reader' ? getSubjectMeta(route.subject) : null
  const isAuthRoute = route.type === 'login'

    // Persist last reader session for the "Resume" button in LearnPage
    useEffect(() => {
      if (route.type !== 'reader') return
      try {
        localStorage.setItem('lexisai.last.reader', JSON.stringify({
          path:      route.pathname,
          subjectId: route.subject,
          chapterId: route.chapterId,
          timestamp: Date.now(),
        }))
      } catch { /* noop */ }
    }, [route.type, route.pathname, route.subject, route.chapterId])

  const navigatePath = useCallback((path) => {
    if (window.location.pathname === path) return
    window.history.pushState({}, '', path)
    setRoute(parsePath(path))
    setViewKey(k => k + 1)
    setReaderNavOpen(false)
    setSearchOpen(false)
    setSearchText('')
  }, [])

  async function handleLogout() {
    try {
      await logoutSession()
    } catch {
      // noop
    }
    setUser(null)
    clearPreferredUserId()
    navigatePath('/login')
  }

  const handleSearch = useCallback(() => {
    setSearchOpen(true)
  }, [])

  /* Navigate with a re-key so view-enter animation fires every time */
  const navigate = useCallback((id) => {
    if (id === 'more') { setDrawerOpen(true); return }
    if (id === 'reader') {
      navigatePath('/learn')
    } else {
      navigatePath(buildPathFromView(id))
    }
    setDrawerOpen(false)
  }, [navigatePath])

  function handleFab(e) {
    if (fabRef.current) addRipple(e, fabRef.current)
    if (activeView === 'dashboard') navigate('modules')
    else if (activeView === 'study') navigate('study')
    else if (activeView === 'reader') navigate('chat')
  }

  const fab = FAB_CONFIG[activeView]

  const views = useMemo(() => ({
    dashboard: <Dashboard onNavigate={navigate} user={user} />,
    chat:      <ChatView />,
    cases:     <CaseLibrary />,
    study:     <StudyMode />,
    ranked:    <RankedMatch user={user} onNavigate={navigate} />,
    weekly:    <WeeklyChallenge onNavigate={navigate} />,
    notes:     <Notes />,
    modules:   <ModuleGenerator />,
    settings:  <Settings user={user} onLogout={handleLogout} />,
  }), [navigate, user, handleLogout])

  const quickRoutes = useMemo(() => ([
    { id: 'dashboard', label: 'Home' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'cases', label: 'Case Library' },
    { id: 'study', label: 'Study Mode' },
    { id: 'ranked', label: 'Ranked Match' },
    { id: 'weekly', label: 'Weekly Challenge' },
    { id: 'notes', label: 'My Notes' },
    { id: 'modules', label: 'Module Generator' },
    { id: 'settings', label: 'Settings' },
  ]), [])

  const readerMatches = useMemo(() => {
    if (!subjectMeta) return []
    const q = searchText.trim().toLowerCase()
    if (!q) return subjectMeta.chapters.map(ch => ({
      type: 'chapter',
      chapterId: ch.id,
      label: `Chapter ${ch.id}: ${ch.title}`,
    }))

    const items = []
    for (const ch of subjectMeta.chapters) {
      if (ch.title.toLowerCase().includes(q)) {
        items.push({ type: 'chapter', chapterId: ch.id, label: `Chapter ${ch.id}: ${ch.title}` })
      }
      for (const sec of ch.sections || []) {
        if (sec.heading.toLowerCase().includes(q)) {
          items.push({ type: 'section', chapterId: ch.id, sectionId: sec.id, label: `Ch ${ch.id} · ${sec.heading}` })
        }
      }
    }
    return items.slice(0, 12)
  }, [subjectMeta, searchText])

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-md-bg text-md-onsurf overflow-hidden flex items-center justify-center">
        <div className="text-sm text-md-onsurfvar">Loading session...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-md-bg text-md-onsurf overflow-hidden">
      {/* Top App Bar */}
      {!isAuthRoute && (
        <TopAppBar
          activeView={activeView}
          routeType={route.type}
          onSearch={handleSearch}
          subject={route.subject}
          chapterId={route.type === 'reader' ? route.chapterId : null}
          onReaderMenu={() => setReaderNavOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Scrollable content between top bar and bottom nav */}
      <main
        className={`absolute inset-x-0 scrollbar-hide ${route.type === 'reader' ? 'overflow-hidden' : 'overflow-y-auto'}`}
        style={{ top: isAuthRoute ? 0 : 56, bottom: isAuthRoute ? 0 : 64 }}
      >
        <div key={viewKey} className={`animate-view-in ${route.type === 'reader' ? 'h-full min-h-0' : 'min-h-full'}`}>
          {route.type === 'login'
            ? <LoginPage />
            : route.type === 'reader'
            ? (
              <ReaderPage
                subject={route.subject}
                chapterId={route.chapterId}
                onNavigatePath={navigatePath}
                mobileNavOpen={readerNavOpen}
                onCloseMobileNav={() => setReaderNavOpen(false)}
              />
            )
            : route.type === 'year'
              ? <YearPage yearId={route.yearId} onOpenSubject={(subjectId) => navigatePath(`/subject/${subjectId}`)} />
              : route.type === 'subject'
                ? (
                  <SubjectPage
                    subjectId={route.subject}
                    onBackYear={(year) => navigatePath(`/year/${year || 1}`)}
                    onOpenChapter={(subjectId, nextChapterId) => navigatePath(`/subject/${subjectId}/chapter/${nextChapterId}`)}
                    onRequireAuth={() => navigatePath('/login')}
                  />
                )
            : (views[activeView] ?? views.dashboard)
          }
        </div>
      </main>

      {/* FAB — only for views that have one */}
      {!isAuthRoute && fab && (
        <button
          ref={fabRef}
          onClick={handleFab}
          className={`ripple-root fab fixed z-30 right-4 bg-gradient-to-br ${fab.color} text-white shadow-fabshadow animate-fab-in flex items-center gap-2 px-5 h-14 rounded-2xl font-semibold text-sm`}
          style={{ bottom: 80 }}
        >
          <span className="text-lg leading-none">{fab.icon}</span>
          <span>{fab.label}</span>
        </button>
      )}

      {/* Bottom Navigation */}
      {!isAuthRoute && <BottomNav activeView={activeView} onNavigate={navigate} />}

      {/* Drawer */}
      {!isAuthRoute && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={navigate}
          activeView={activeView}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Global Search */}
      {!isAuthRoute && searchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-start justify-center p-4 pt-16" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-md-surf border border-md-outline/60 rounded-2xl shadow-elev3 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-md-outline/50">
              <input
                autoFocus
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder={route.type === 'reader' ? 'Search chapters or sections...' : 'Search routes...'}
                className="w-full h-11 rounded-xl bg-md-surf2 border border-md-outline/60 px-3 text-sm text-md-onsurf placeholder-md-onsurfvar focus:outline-none focus:border-md-primary/60"
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {route.type === 'reader' ? (
                <div className="space-y-1">
                  {readerMatches.length === 0 && (
                    <div className="px-3 py-2 text-sm text-md-onsurfvar">No matches found.</div>
                  )}
                  {readerMatches.map((item, idx) => (
                    <button
                      key={`${item.type}-${idx}`}
                      onClick={() => navigatePath(`/subject/${route.subject}/chapter/${item.chapterId}`)}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-md-onsurfvar hover:text-md-onsurf hover:bg-md-surf2 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {quickRoutes
                    .filter(r => r.label.toLowerCase().includes(searchText.trim().toLowerCase()))
                    .map(r => (
                      <button
                        key={r.id}
                        onClick={() => navigate(r.id)}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-md-onsurfvar hover:text-md-onsurf hover:bg-md-surf2 transition-colors"
                      >
                        {r.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
