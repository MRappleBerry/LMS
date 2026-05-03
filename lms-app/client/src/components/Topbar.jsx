export default function Topbar({ onToggleDark, darkMode, onMenuToggle }) {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 shrink-0 gap-3">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden text-slate-400 hover:text-slate-100 text-xl p-1 shrink-0"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="flex items-center gap-2 flex-1 max-w-md">
        <span className="text-slate-500">🔍</span>
        <input
          type="text"
          placeholder="Search cases, notes, topics..."
          className="bg-slate-800 text-sm text-slate-300 placeholder-slate-500 rounded-lg px-3 py-1.5 w-full border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors hidden sm:block"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-slate-100 text-xl transition-colors">🔔</button>
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
          title="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
          AJ
        </div>
      </div>
    </header>
  )
}
