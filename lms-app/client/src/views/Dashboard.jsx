import { useState } from 'react'

const YEAR_LEVELS = [
  {
    id: '1st-year', label: '1st Year', color: 'from-blue-600 to-cyan-500',
    focus: 'Foundations of legal method and core public law.',
    modules: [
      { name: 'Introduction to Philippine Law', subject: 'Legal Foundations', lessons: 12, progress: 68 },
      { name: 'Persons and Family Relations',   subject: 'Civil Law',          lessons: 18, progress: 74 },
      { name: 'Constitutional Law I',           subject: 'Public Law',         lessons: 16, progress: 81 },
      { name: 'Statutory Construction',         subject: 'Legal Method',       lessons: 10, progress: 59 },
    ],
  },
  {
    id: '2nd-year', label: '2nd Year', color: 'from-violet-600 to-indigo-500',
    focus: 'Doctrine depth across obligations, rights, and procedure.',
    modules: [
      { name: 'Obligations and Contracts', subject: 'Civil Law',        lessons: 22, progress: 77 },
      { name: 'Constitutional Law II',     subject: 'Public Law',       lessons: 15, progress: 71 },
      { name: 'Criminal Law I',            subject: 'Criminal Law',     lessons: 20, progress: 84 },
      { name: 'Legal Research & Writing',  subject: 'Skills Lab',       lessons: 9,  progress: 65 },
    ],
  },
  {
    id: '3rd-year', label: '3rd Year', color: 'from-emerald-600 to-teal-500',
    focus: 'Advanced litigation, commercial law, and evidence.',
    modules: [
      { name: 'Evidence',            subject: 'Remedial Law',    lessons: 14, progress: 72 },
      { name: 'Corporation Law',     subject: 'Commercial Law',  lessons: 17, progress: 63 },
      { name: 'Criminal Procedure',  subject: 'Remedial Law',    lessons: 13, progress: 79 },
      { name: 'Property',            subject: 'Civil Law',       lessons: 19, progress: 70 },
    ],
  },
  {
    id: '4th-year', label: '4th Year', color: 'from-amber-500 to-orange-500',
    focus: 'Bar-focused integration and practice readiness.',
    modules: [
      { name: 'Taxation Law Review',    subject: 'Tax Law',    lessons: 21, progress: 61 },
      { name: 'Labor Law Review',       subject: 'Labor Law',  lessons: 18, progress: 75 },
      { name: 'Practice Court',         subject: 'Advocacy',   lessons: 8,  progress: 88 },
      { name: 'Political Law Review',   subject: 'Bar Review', lessons: 24, progress: 67 },
    ],
  },
]

const QUICK_ACTIONS = [
  { icon: '🤖', label: 'AI Assistant', desc: 'Ask legal questions', view: 'chat',  grad: 'from-indigo-600/20 to-violet-600/20', border: 'border-indigo-500/20' },
  { icon: '📚', label: 'Case Library', desc: '1,245 cases',        view: 'cases', grad: 'from-blue-600/20 to-cyan-600/20',    border: 'border-blue-500/20'   },
  { icon: '🧠', label: 'Study Mode',   desc: '82% mastery',        view: 'study', grad: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/20'},
  { icon: '🎓', label: 'AI Modules',   desc: 'Generate curricula', view: 'modules',grad: 'from-violet-600/20 to-purple-600/20',border: 'border-violet-500/20' },
]

const STATS = [
  { label: 'Cases',   value: '87',     color: 'text-indigo-400', icon: '📖' },
  { label: 'Mastery', value: '82%',    color: 'text-emerald-400',icon: '🏆' },
  { label: 'Streak',  value: '12🔥',   color: 'text-amber-400',  icon: '⚡' },
  { label: 'Hours',   value: '4h 28m', color: 'text-cyan-400',   icon: '⏱' },
]

const RECENT = [
  { icon: '⚖️', title: 'Angara v. Electoral Commission', tag: 'Constitutional Law', time: '2h ago' },
  { icon: '📝', title: 'Notes: Judicial Review Doctrine', tag: 'Notes',             time: '5h ago' },
  { icon: '❓', title: 'Quiz: Criminal Law I — 9/10',     tag: 'Study Mode',        time: 'Yesterday' },
]

function StatCard({ label, value, color, icon }) {
  return (
    <div className="md-card bg-md-surf2 border border-md-outline/60 rounded-2xl p-4 flex flex-col gap-2">
      <span className="text-xl">{icon}</span>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[11px] text-md-onsurfvar font-medium">{label}</div>
    </div>
  )
}

function ProgressBar({ value, color = 'from-md-primary to-md-secondary' }) {
  return (
    <div className="h-1.5 bg-md-surf3 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} prog-bar`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState(YEAR_LEVELS[0])

  return (
    <div className="px-4 pb-6 space-y-5">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-5 pt-7 mt-2 shadow-elev3">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              May 3, 2026
            </span>
            <span className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              ● 3 new cases today
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">Welcome back, Alex 👋</h1>
          <p className="text-indigo-200 text-sm mt-1">You're on a 12-day streak. Keep it up!</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onNavigate('study')}
              className="ripple-root bg-white text-indigo-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow"
            >
              Continue Studying
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="ripple-root bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-2.5">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-md-onsurf">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_ACTIONS.map(a => (
            <button
              key={a.view}
              onClick={() => onNavigate(a.view)}
              className={`ripple-root md-card bg-gradient-to-br ${a.grad} border ${a.border} rounded-2xl p-4 text-left flex flex-col gap-3`}
            >
              <span className="text-3xl">{a.icon}</span>
              <div>
                <div className="text-sm font-semibold text-md-onsurf">{a.label}</div>
                <div className="text-xs text-md-onsurfvar mt-0.5">{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Year-level module track ── */}
      <div className="bg-md-surf2 border border-md-outline/60 rounded-3xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-md-outline/50 overflow-x-auto scrollbar-hide">
          {YEAR_LEVELS.map(yr => (
            <button
              key={yr.id}
              onClick={() => setSelectedYear(yr)}
              className={`flex-1 min-w-[70px] py-3 text-xs font-semibold transition-colors whitespace-nowrap px-3 ${
                selectedYear.id === yr.id
                  ? 'text-md-primary border-b-2 border-md-primary bg-md-primary/5'
                  : 'text-md-onsurfvar hover:text-md-onsurf'
              }`}
            >
              {yr.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <p className="text-xs text-md-onsurfvar mb-4">{selectedYear.focus}</p>

          <div className="space-y-3">
            {selectedYear.modules.map((mod, i) => (
              <div
                key={mod.name}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold text-md-primary uppercase tracking-wider">{mod.subject}</div>
                    <div className="text-sm font-medium text-md-onsurf mt-0.5 leading-snug">{mod.name}</div>
                  </div>
                  <span className="shrink-0 text-xs bg-md-surf3 border border-md-outline/60 text-md-onsurfvar px-2 py-0.5 rounded-full">
                    {mod.lessons}L
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ProgressBar value={mod.progress} color={`from-${selectedYear.color.split('-')[1]}-500 to-${selectedYear.color.split('-')[3]}`} />
                  <span className="text-[11px] font-semibold text-md-onsurfvar shrink-0 w-8 text-right">{mod.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('study')}
            className="ripple-root mt-4 w-full py-2.5 rounded-xl bg-md-primarydim hover:bg-md-primary/80 text-white text-sm font-semibold transition-colors"
          >
            Open Study Mode
          </button>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-md-onsurf">Recent Activity</h2>
          <button className="text-xs text-md-primary font-medium">See all</button>
        </div>
        <div className="space-y-2">
          {RECENT.map((r, i) => (
            <div
              key={i}
              className="md-card bg-md-surf2 border border-md-outline/50 rounded-2xl p-3.5 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-md-surf3 flex items-center justify-center text-xl shrink-0">
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-md-onsurf truncate">{r.title}</div>
                <div className="text-xs text-md-onsurfvar mt-0.5">{r.tag}</div>
              </div>
              <div className="text-[10px] text-md-onsurfvar shrink-0">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
