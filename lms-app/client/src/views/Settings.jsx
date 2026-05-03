export default function Settings({ darkMode, onToggleDark }) {
  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold">Appearance</h2>
          </div>
          <div className="divide-y divide-slate-800">
            <Toggle label="Dark Mode" sub="Use dark colour scheme" checked={darkMode} onChange={onToggleDark} />
          </div>
        </section>

        {/* Features */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold">Features</h2>
          </div>
          <div className="divide-y divide-slate-800">
            <Toggle label="AI Assistant" sub="Enable AI chat responses" checked={true} />
            <Toggle label="Case Highlighting" sub="Highlight key legal terms" checked={true} />
            <Toggle label="Study Reminders" sub="Daily study streak notifications" checked={false} />
            <Toggle label="Auto-save Notes" sub="Automatically save your notes" checked={true} />
          </div>
        </section>

        {/* Account */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold">Account</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">AJ</div>
              <div>
                <div className="font-semibold">Alex Johnson</div>
                <div className="text-sm text-slate-400">alex.johnson@lawschool.edu</div>
                <div className="text-xs text-emerald-400 mt-1">Free Plan</div>
              </div>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold">AI Configuration</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <p className="text-sm text-slate-400">The AI assistant uses the OpenAI API. Configure your API key on the server side via environment variables.</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-300">Backend API connected</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
      </button>
    </div>
  )
}
