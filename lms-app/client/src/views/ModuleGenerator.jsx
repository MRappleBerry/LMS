import { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const SUBJECT_SUGGESTIONS = {
  '1st Year': ['Constitutional Law I', 'Persons and Family Relations', 'Introduction to Philippine Law', 'Statutory Construction', 'Obligations and Contracts I'],
  '2nd Year': ['Constitutional Law II', 'Criminal Law I', 'Criminal Law II', 'Obligations and Contracts II', 'Legal Research and Writing'],
  '3rd Year': ['Evidence', 'Corporation Law', 'Criminal Procedure', 'Property', 'Sales and Lease'],
  '4th Year': ['Taxation Law Review', 'Labor Law Review', 'Political Law Review', 'Practice Court', 'Remedial Law Review'],
}

const DIFFICULTY_COLOR = {
  Beginner:     'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  Intermediate: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  Advanced:     'bg-red-900/40 text-red-300 border-red-700/50',
}

const DIFF_DOT = {
  Beginner:     'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced:     'bg-red-400',
}

function Badge({ difficulty }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${DIFFICULTY_COLOR[difficulty] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DIFF_DOT[difficulty] ?? 'bg-slate-400'}`} />
      {difficulty}
    </span>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="text-lg font-bold text-slate-100">{title}</h2>
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function OverviewTab({ data }) {
  return (
    <div className="space-y-6">
      <Card>
        <SectionHeader icon="📖" title="Subject Overview" />
        <p className="text-slate-300 text-sm leading-relaxed">{data.subject_overview}</p>
      </Card>

      <Card>
        <SectionHeader icon="🎯" title="Learning Objectives" />
        <ol className="space-y-2">
          {data.learning_objectives.map((obj, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-bold border border-blue-700/40">{i + 1}</span>
              <span className="leading-relaxed">{obj}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionHeader icon="📋" title="References & Statutes" />
        <ul className="space-y-2">
          {data.references.map((ref, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-400">
              <span className="text-slate-600 shrink-0">•</span>
              <span>{ref}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

// ── TAB: Modules ──────────────────────────────────────────────────────────────
function ModulesTab({ modules }) {
  const [openIdx, setOpenIdx] = useState(0)
  const mod = modules[openIdx]

  return (
    <div className="flex gap-4 h-full" style={{ minHeight: 0 }}>
      {/* Module list */}
      <div className="w-56 shrink-0 flex flex-col gap-1.5">
        {modules.map((m, i) => (
          <button
            key={i}
            onClick={() => setOpenIdx(i)}
            className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              i === openIdx
                ? 'bg-blue-600/20 border-blue-600/50 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-slate-500 text-[10px]">Module {i + 1}</span>
              <Badge difficulty={m.difficulty} />
            </div>
            <div className="leading-snug">{m.title}</div>
            <div className="text-slate-500 text-[10px] mt-1">{m.lessons} lessons</div>
          </button>
        ))}
      </div>

      {/* Module detail */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-4 pr-1">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-bold text-slate-100 leading-snug">{mod.title}</h3>
            <Badge difficulty={mod.difficulty} />
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{mod.description}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-700">{mod.lessons} lessons</span>
            <span className="bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-700">{mod.topics.length} topics</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {mod.topics.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">{t}</span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">📝 Quiz Questions</h4>
          <div className="space-y-4">
            {mod.quiz.map((q, qi) => (
              <div key={qi} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-slate-200 font-medium mb-3">{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${opt.startsWith(q.answer) ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' : 'text-slate-400'}`}>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-medium">✓ Answer: {q.answer}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">✍️ Essay Question</h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">{mod.essay}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">⚖️ Bar Exam-Style Question</h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-amber-900/10 rounded-xl p-4 border border-amber-800/30">{mod.bar_question}</p>
        </div>
      </div>
    </div>
  )
}

// ── TAB: Cases ────────────────────────────────────────────────────────────────
function CasesTab({ cases }) {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="space-y-3">
      {cases.map((c, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors text-left gap-4"
          >
            <div>
              <div className="text-xs text-blue-400 font-medium mb-0.5">Case {i + 1}</div>
              <div className="text-sm font-semibold text-slate-100">{c.title}</div>
            </div>
            <span className={`text-slate-500 transition-transform text-sm ${openIdx === i ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {openIdx === i && (
            <div className="px-5 pb-5 space-y-4 border-t border-slate-800">
              <div className="pt-4">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Facts</h5>
                <p className="text-sm text-slate-300 leading-relaxed">{c.facts}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Issue</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.issue}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Ruling</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.ruling}</p>
                </div>
                <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-4">
                  <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Doctrine</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.doctrine}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── TAB: Study Plan ───────────────────────────────────────────────────────────
function StudyPlanTab({ modules }) {
  return (
    <div className="space-y-3">
      <Card>
        <SectionHeader icon="🗺️" title="Recommended Progression" />
        <p className="text-sm text-slate-400 mb-4">Complete modules in order — each builds on the previous. Earlier modules are prerequisites for advanced topics.</p>
        <div className="space-y-2">
          {modules.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.difficulty === 'Beginner' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' :
                  m.difficulty === 'Advanced' ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                  'bg-amber-900/40 text-amber-300 border border-amber-700/50'
                }`}>{i + 1}</div>
                {i < modules.length - 1 && <div className="w-px h-4 bg-slate-700 mt-1" />}
              </div>
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-200">{m.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.lessons} lessons</div>
                </div>
                <Badge difficulty={m.difficulty} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader icon="📊" title="Difficulty Distribution" />
        <div className="flex gap-4">
          {['Beginner', 'Intermediate', 'Advanced'].map(d => {
            const count = modules.filter(m => m.difficulty === d).length
            return (
              <div key={d} className={`flex-1 rounded-xl p-4 border text-center ${DIFFICULTY_COLOR[d]}`}>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs mt-1 opacity-80">{d}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <SectionHeader icon="💡" title="Study Tips" />
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">→</span>Start with Beginner modules even if you have prior knowledge — they set the doctrinal foundation.</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">→</span>After each module, attempt the essay and bar-style question before checking sample answers.</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">→</span>Read each case in full at least once — don't rely solely on digests for bar preparation.</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">→</span>Use the IRAC method religiously: Issue → Rule → Application → Conclusion.</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">→</span>Cross-reference topics with your Notes view and link cases to your personal summaries.</li>
        </ul>
      </Card>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Modules', 'Case Digests', 'Study Plan']
const TAB_ICONS = ['📖', '🗂️', '⚖️', '🗺️']

export default function ModuleGenerator() {
  const [yearLevel, setYearLevel] = useState('1st Year')
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [mode, setMode] = useState(null)

  const suggestions = SUBJECT_SUGGESTIONS[yearLevel] ?? []

  async function handleGenerate(e) {
    e.preventDefault()
    const sub = subjectName.trim()
    if (!sub) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data } = await axios.post(`${API_BASE}/api/generate-module`, {
        yearLevel,
        subjectName: sub,
      })
      setResult(data.module)
      setMode(data.mode)
      setActiveTab(0)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate module. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header / Form ── */}
      <div className="shrink-0 bg-slate-950 border-b border-slate-800 px-4 md:px-8 py-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🎓 Module Generator
              {mode && (
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full border ${mode === 'openai' ? 'text-violet-300 bg-violet-900/30 border-violet-700/50' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  {mode === 'openai' ? '✨ AI-Powered' : '⚡ Demo Mode'}
                </span>
              )}
            </h1>
            <p className="text-slate-400 text-sm mt-1">Generate a complete Philippine law school curriculum module with case digests, quizzes, and bar questions.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Year Level</label>
            <select
              value={yearLevel}
              onChange={e => setYearLevel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors min-w-[130px]"
            >
              {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Name</label>
            <input
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              placeholder="e.g. Constitutional Law I"
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !subjectName.trim()}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : '✨ Generate Module'}
          </button>
        </form>

        {/* Quick suggestions */}
        {!result && !loading && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">Suggestions:</span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setSubjectName(s)}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-900/30">
              🎓
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Build a Complete Law Module</h2>
              <p className="text-slate-400 text-sm max-w-md">
                Select a year level, enter a Philippine law subject, and generate a full curriculum module — complete with case digests, MCQs, essay questions, and bar exam scenarios.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 max-w-2xl w-full">
              {[
                { icon: '🗂️', label: 'Up to 12 Modules' },
                { icon: '⚖️', label: '5 Case Digests' },
                { icon: '📝', label: 'Quiz Questions' },
                { icon: '📊', label: 'Bar Exam Questions' },
              ].map(f => (
                <div key={f.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-xs text-slate-400">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-violet-600/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">⚖️</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Generating Module…</h2>
              <p className="text-slate-400 text-sm">Building curriculum, case digests, and exam questions for <strong className="text-slate-200">{subjectName}</strong></p>
            </div>
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="text-4xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold mb-1 text-red-400">Generation Failed</h2>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-5 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Summary banner */}
            <div className="shrink-0 mx-4 md:mx-8 mt-4 bg-gradient-to-r from-violet-900/30 to-blue-900/30 border border-violet-700/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-base font-bold text-slate-100">{result.ui_summary?.subject_title}</div>
                <div className="text-sm text-slate-400 mt-0.5">{result.ui_summary?.tagline}</div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-violet-300">{result.ui_summary?.total_modules}</div>
                  <div className="text-xs text-slate-400">Modules</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-300">{result.ui_summary?.total_lessons}</div>
                  <div className="text-xs text-slate-400">Lessons</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-300">{result.cases?.length ?? 0}</div>
                  <div className="text-xs text-slate-400">Cases</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 mx-4 md:mx-8 mt-4 flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === i ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{TAB_ICONS[i]}</span>
                  <span className="hidden sm:inline">{tab}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
              {activeTab === 0 && <OverviewTab data={result} />}
              {activeTab === 1 && <ModulesTab modules={result.modules ?? []} />}
              {activeTab === 2 && <CasesTab cases={result.cases ?? []} />}
              {activeTab === 3 && <StudyPlanTab modules={result.modules ?? []} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
