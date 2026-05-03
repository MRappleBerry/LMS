const DRAWER_ITEMS = [
  {
    id: 'notes',
    label: 'My Notes',
    desc: '28 notes',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3 18h12v-2H3v2zm0-5h12v-2H3v2zm0-7v2h12V6H3zm14 9.43V17h1.57L21 14.57l-1.57-1.57L17 15.43zm2.85-2.85l.72.72-4.85 4.85H14.5v-1.22l4.85-4.85.5-.5z" />
      </svg>
    ),
    color: 'bg-amber-500/15 text-amber-400',
  },
  {
    id: 'modules',
    label: 'Module Generator',
    desc: 'AI-powered curriculum',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
    color: 'bg-violet-500/15 text-violet-400',
  },
  {
    id: 'settings',
    label: 'Settings',
    desc: 'Preferences & account',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
    color: 'bg-slate-500/15 text-slate-400',
  },
]

export default function Drawer({ open, onClose, onNavigate, activeView }) {
  if (!open) return null

  function nav(id) {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-md-surf border-r border-white/[0.05] flex flex-col animate-drawer-in shadow-elev3">
        {/* Header */}
        <div className="p-5 pt-14 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-900/40">
              AJ
            </div>
            <div>
              <div className="font-semibold text-md-onsurf">Alex Johnson</div>
              <div className="text-xs text-md-onsurfvar">3rd Year • Law Student</div>
            </div>
          </div>

          {/* Progress pill */}
          <div className="mt-4 bg-md-surf2 rounded-xl p-3 border border-md-outline/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-md-onsurfvar">Overall Progress</span>
              <span className="text-xs font-semibold text-md-primary">74%</span>
            </div>
            <div className="h-1.5 bg-md-surf3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-md-primary to-md-secondary rounded-full" style={{ width: '74%' }} />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-semibold text-md-onsurfvar uppercase tracking-widest px-3 py-2">Tools</p>
          {DRAWER_ITEMS.map(item => {
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => nav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors text-left ${
                  active ? 'bg-md-primarycon' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-md-primary/20 text-md-primary' : item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <div className={`text-sm font-medium ${active ? 'text-md-onprimarycon' : 'text-md-onsurf'}`}>{item.label}</div>
                  <div className="text-xs text-md-onsurfvar">{item.desc}</div>
                </div>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-md-primary" />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.05]">
          <div className="text-[10px] text-md-onsurfvar text-center">LexisAI v1.0 • May 2026</div>
        </div>
      </div>
    </>
  )
}
