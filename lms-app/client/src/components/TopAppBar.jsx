const VIEW_TITLES = {
  reader: 'Law Book Reader',
  dashboard: 'LexisAI',
  chat:      'AI Assistant',
  cases:     'Case Library',
  study:     'Study Mode',
  notes:     'My Notes',
  modules:   'Module Generator',
  settings:  'Settings',
}

function formatSubject(subject) {
  if (!subject) return ''
  return subject
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function TopAppBar({ activeView, onSearch, onNotif, subject, chapterId, onReaderMenu }) {
  const title = VIEW_TITLES[activeView] ?? 'LexisAI'
  const isHome = activeView === 'dashboard'
  const isReader = activeView === 'reader'
  const readerTitle = isReader
    ? `${formatSubject(subject) || 'Law Reader'} • Chapter ${chapterId || '-'}`
    : title

  return (
    <header className="fixed top-0 inset-x-0 z-40 glass border-b border-white/[0.04] h-14 flex items-center justify-between px-4 gap-3">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {isReader && (
          <button
            onClick={onReaderMenu}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-md-onsurfvar hover:text-md-onsurf hover:bg-white/[0.06] transition-colors"
            aria-label="Open chapter navigation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
            </svg>
          </button>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
          </svg>
        </div>
        <span className="font-bold text-[17px] tracking-tight text-md-onsurf truncate">
          {isHome ? 'LexisAI' : readerTitle}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onSearch}
          className="w-9 h-9 rounded-full flex items-center justify-center text-md-onsurfvar hover:text-md-onsurf hover:bg-white/[0.06] transition-colors"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>

        <button
          onClick={onNotif}
          className="w-9 h-9 rounded-full flex items-center justify-center text-md-onsurfvar hover:text-md-onsurf hover:bg-white/[0.06] transition-colors relative"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-md-primary rounded-full border-2 border-md-bg" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold ml-0.5 cursor-pointer hover:opacity-90 transition-opacity shadow shadow-indigo-900/40">
          AJ
        </div>
      </div>
    </header>
  )
}
