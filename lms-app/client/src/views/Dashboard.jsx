import { useState } from 'react'

const CARDS = [
  { icon: '🤖', title: 'AI Assistant',  subtitle: 'Ask legal questions',  view: 'chat',  desc: 'Get instant explanations of complex legal doctrines.' },
  { icon: '📚', title: 'Case Library',  subtitle: '1,245 cases',          view: 'cases', desc: 'Browse landmark legal cases by topic and date.' },
  { icon: '🧠', title: 'Study Mode',   subtitle: '82% mastery',           view: 'study', desc: 'Master legal concepts with flashcards and quizzes.' },
  { icon: '📝', title: 'My Notes',     subtitle: '28 notes',              view: 'notes', desc: 'Create and organise notes linked to cases.' },
]

const STATS = [
  { label: 'Cases Studied',   value: '87',   color: 'text-blue-400' },
  { label: 'Mastery Rate',    value: '82%',  color: 'text-emerald-400' },
  { label: 'Day Streak 🔥',   value: '12',   color: 'text-amber-400' },
  { label: 'This Week',       value: '4h 28m', color: 'text-cyan-400' },
]

const YEAR_LEVELS = [
  {
    id: '1st-year',
    label: '1st Year',
    focus: 'Foundations of legal method and core public law concepts.',
    modules: [
      { name: 'Introduction to Philippine Law', subject: 'Legal Foundations', lessons: 12, progress: 68 },
      { name: 'Persons and Family Relations', subject: 'Civil Law', lessons: 18, progress: 74 },
      { name: 'Constitutional Law I', subject: 'Public Law', lessons: 16, progress: 81 },
      { name: 'Statutory Construction', subject: 'Legal Method', lessons: 10, progress: 59 },
    ],
  },
  {
    id: '2nd-year',
    label: '2nd Year',
    focus: 'Building doctrine depth across obligations, rights, and procedure.',
    modules: [
      { name: 'Obligations and Contracts', subject: 'Civil Law', lessons: 22, progress: 77 },
      { name: 'Constitutional Law II', subject: 'Public Law', lessons: 15, progress: 71 },
      { name: 'Criminal Law I', subject: 'Criminal Law', lessons: 20, progress: 84 },
      { name: 'Legal Research and Writing', subject: 'Skills Lab', lessons: 9, progress: 65 },
    ],
  },
  {
    id: '3rd-year',
    label: '3rd Year',
    focus: 'Advanced litigation, commercial law, and evidence review.',
    modules: [
      { name: 'Evidence', subject: 'Remedial Law', lessons: 14, progress: 72 },
      { name: 'Corporation Law', subject: 'Commercial Law', lessons: 17, progress: 63 },
      { name: 'Criminal Procedure', subject: 'Remedial Law', lessons: 13, progress: 79 },
      { name: 'Property', subject: 'Civil Law', lessons: 19, progress: 70 },
    ],
  },
  {
    id: '4th-year',
    label: '4th Year',
    focus: 'Bar-focused integration, special laws, and practice readiness.',
    modules: [
      { name: 'Taxation Law Review', subject: 'Tax Law', lessons: 21, progress: 61 },
      { name: 'Labor Law Review', subject: 'Labor Law', lessons: 18, progress: 75 },
      { name: 'Practice Court', subject: 'Advocacy', lessons: 8, progress: 88 },
      { name: 'Political Law Review', subject: 'Bar Review', lessons: 24, progress: 67 },
    ],
  },
]

export default function Dashboard({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState(YEAR_LEVELS[0])

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Alex 👋</h1>
        <p className="text-slate-400 mt-1">May 2, 2026 • 3 new cases added today</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Year-Level Modules</h2>
            <p className="text-sm text-slate-400 mt-1">Pick a year level to see the subjects and modules available for that stage.</p>
          </div>
          <div className="w-full md:w-64">
            <label htmlFor="year-level" className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Year Level</label>
            <select
              id="year-level"
              value={selectedYear.id}
              onChange={event => setSelectedYear(YEAR_LEVELS.find(year => year.id === event.target.value) ?? YEAR_LEVELS[0])}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {YEAR_LEVELS.map(year => (
                <option key={year.id} value={year.id}>{year.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:p-5">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">{selectedYear.label} Curriculum Track</p>
              <p className="text-sm text-slate-400 mt-1">{selectedYear.focus}</p>
            </div>
            <button
              onClick={() => onNavigate('study')}
              className="mt-3 md:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Open Study Mode
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {selectedYear.modules.map(module => (
              <div key={module.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-400">{module.subject}</p>
                    <h3 className="text-base font-semibold text-slate-100 mt-2">{module.name}</h3>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{module.lessons} lessons</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Completion</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${module.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {CARDS.map(c => (
            <button
              key={c.view}
              onClick={() => onNavigate(c.view)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-blue-600 hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 group-hover:bg-blue-600/20 flex items-center justify-center text-xl transition-colors">
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{c.title}</div>
                  <div className="text-xs text-slate-400">{c.subtitle}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {[
            { icon: '📚', text: 'Read Marbury v. Madison', time: '2 hours ago' },
            { icon: '🧠', text: 'Completed Constitutional Law flashcards (92% mastery)', time: '5 hours ago' },
            { icon: '🤖', text: 'Asked AI about Miranda rights', time: 'Yesterday' },
            { icon: '📝', text: 'Added notes on Judicial Review', time: 'Yesterday' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className="text-xl">{a.icon}</span>
              <span className="flex-1 text-sm text-slate-300">{a.text}</span>
              <span className="text-xs text-slate-500">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
