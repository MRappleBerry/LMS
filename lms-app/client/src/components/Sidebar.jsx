const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'chat',      icon: '🤖', label: 'AI Assistant' },
  { id: 'cases',     icon: '📚', label: 'Case Library' },
  { id: 'study',     icon: '🧠', label: 'Study Mode' },
  { id: 'notes',     icon: '📝', label: 'Notes' },
  { id: 'modules',   icon: '🎓', label: 'Module Generator' },
  { id: 'settings',  icon: '⚙️',  label: 'Settings' },
]

export default function Sidebar({ activeView, onNavigate, open, onClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-60 md:shrink-0
      `}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-lg">
              ⚖️
            </div>
            <span className="font-bold text-lg tracking-tight">LexisAI</span>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-slate-100 text-xl p-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <span className="text-base">❓</span>
            Help & Docs
          </button>
        </div>
      </aside>
    </>
  )
}
