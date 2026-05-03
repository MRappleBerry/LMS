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
import ReaderPage from './views/ReaderPage'
import { getDefaultRoute } from './data/books/catalog'

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
  const readerMatch = pathname.match(/^\/course\/([^/]+)\/chapter\/([^/]+)$/)
  if (readerMatch) {
    return {
      type: 'reader',
      subject: decodeURIComponent(readerMatch[1]),
      chapterId: decodeURIComponent(readerMatch[2]),
      pathname,
    }
  }

  const viewRoutes = {
    '/dashboard': 'dashboard',
    '/chat': 'chat',
    '/cases': 'cases',
    '/study': 'study',
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
  const fabRef = useRef(null)

  useEffect(() => {
    if (window.location.pathname === '/') {
      const fallback = getDefaultRoute()
      const defaultPath = `/course/${fallback.subject}/chapter/${fallback.chapterId}`
      window.history.replaceState({}, '', defaultPath)
      setRoute(parsePath(defaultPath))
    }

    function onPopstate() {
      setRoute(parsePath(window.location.pathname))
      setViewKey(k => k + 1)
    }

    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  const activeView = route.type === 'reader' ? 'reader' : route.view

  const navigatePath = useCallback((path) => {
    if (window.location.pathname === path) return
    window.history.pushState({}, '', path)
    setRoute(parsePath(path))
    setViewKey(k => k + 1)
    setReaderNavOpen(false)
  }, [])

  /* Navigate with a re-key so view-enter animation fires every time */
  const navigate = useCallback((id) => {
    if (id === 'more') { setDrawerOpen(true); return }
    if (id === 'reader') {
      const fallback = getDefaultRoute()
      navigatePath(`/course/${fallback.subject}/chapter/${fallback.chapterId}`)
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
    dashboard: <Dashboard onNavigate={navigate} />,
    chat:      <ChatView />,
    cases:     <CaseLibrary />,
    study:     <StudyMode />,
    notes:     <Notes />,
    modules:   <ModuleGenerator />,
    settings:  <Settings />,
  }), [navigate])

  return (
    <div className="fixed inset-0 bg-md-bg text-md-onsurf overflow-hidden">
      {/* Top App Bar */}
      <TopAppBar
        activeView={activeView}
        subject={route.subject}
        chapterId={route.chapterId}
        onReaderMenu={() => setReaderNavOpen(true)}
      />

      {/* Scrollable content between top bar and bottom nav */}
      <main
        className={`absolute inset-x-0 scrollbar-hide ${route.type === 'reader' ? 'overflow-hidden' : 'overflow-y-auto'}`}
        style={{ top: 56, bottom: 64 }}
      >
        <div key={viewKey} className={`animate-view-in ${route.type === 'reader' ? 'h-full min-h-0' : 'min-h-full'}`}>
          {route.type === 'reader'
            ? (
              <ReaderPage
                subject={route.subject}
                chapterId={route.chapterId}
                onNavigatePath={navigatePath}
                mobileNavOpen={readerNavOpen}
                onCloseMobileNav={() => setReaderNavOpen(false)}
              />
            )
            : (views[activeView] ?? views.dashboard)
          }
        </div>
      </main>

      {/* FAB — only for views that have one */}
      {fab && (
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
      <BottomNav activeView={activeView} onNavigate={navigate} />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={navigate}
        activeView={activeView}
      />
    </div>
  )
}
