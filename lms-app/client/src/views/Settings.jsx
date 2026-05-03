import { useState } from 'react'

function Toggle({ label, sub, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked ?? true)
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <div className="text-sm font-medium text-md-onsurf">{label}</div>
        {sub && <div className="text-xs text-md-onsurfvar mt-0.5">{sub}</div>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`ripple-root relative w-12 h-6.5 rounded-full transition-colors ${on ? 'bg-md-primary' : 'bg-md-surf3'}`}
        style={{ width: 44, height: 26 }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ left: 3, transform: on ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="bg-md-surf2 border border-md-outline/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-md-outline/50">
        <h2 className="text-sm font-bold text-md-onsurfvar uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export default function Settings() {
  return (
    <div className="px-4 pb-8 pt-2 max-w-xl mx-auto space-y-4">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-indigo-800/60 to-violet-800/40 border border-md-outline/50 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
          AJ
        </div>
        <div>
          <div className="font-bold text-md-onsurf text-base">Alex Johnson</div>
          <div className="text-sm text-md-onsurfvar">alex.johnson@lawschool.edu</div>
          <div className="text-xs text-emerald-400 mt-1 font-semibold">● Free Plan</div>
        </div>
      </div>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="divide-y divide-md-outline/40">
          <Toggle label="Dark Mode" sub="Always use dark colour scheme" defaultChecked={true} />
          <Toggle label="Reduce Motion" sub="Fewer animations and transitions" defaultChecked={false} />
        </div>
      </Section>

      {/* Features */}
      <Section title="Features">
        <div className="divide-y divide-md-outline/40">
          <Toggle label="AI Assistant"       sub="Enable AI chat and generation"      defaultChecked={true}  />
          <Toggle label="Case Highlighting"  sub="Highlight key legal terms"          defaultChecked={true}  />
          <Toggle label="Study Reminders"    sub="Daily study streak notifications"   defaultChecked={false} />
          <Toggle label="Auto-save Notes"    sub="Automatically save your notes"      defaultChecked={true}  />
        </div>
      </Section>

      {/* Study */}
      <Section title="Study Preferences">
        <div className="divide-y divide-md-outline/40">
          <Toggle label="Spaced Repetition"  sub="Smart flashcard scheduling"         defaultChecked={true}  />
          <Toggle label="Show Explanations"  sub="Show answer explanations in quiz"   defaultChecked={true}  />
        </div>
      </Section>

      {/* API Status */}
      <Section title="AI Configuration">
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-md-onsurfvar leading-relaxed">
            The AI assistant uses the OpenAI API. Configure your API key on the server side via environment variables.
          </p>
          <div className="flex items-center gap-2.5 bg-md-surf3 border border-emerald-800/40 rounded-xl px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-sm text-emerald-300 font-medium">Backend API connected</span>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section title="About">
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-md-onsurfvar">App</span>
            <span className="text-md-onsurf font-medium">LexisAI LMS</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-md-onsurfvar">Version</span>
            <span className="text-md-onsurf font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-md-onsurfvar">Platform</span>
            <span className="text-md-onsurf font-medium">Philippine Law School</span>
          </div>
        </div>
      </Section>
    </div>
  )
}

