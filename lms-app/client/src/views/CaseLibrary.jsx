import { useState } from 'react'

const CASES = [
  { id: 1, name: 'Marbury v. Madison',       year: 1803, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Landmark case establishing the principle of judicial review, allowing the Supreme Court to invalidate legislative acts that conflict with the Constitution.' },
  { id: 2, name: 'Miranda v. Arizona',        year: 1966, court: 'Supreme Court', category: 'Criminal Procedure', summary: 'Established the requirement that police inform suspects of their constitutional rights before custodial interrogation.' },
  { id: 3, name: 'Brown v. Board of Education', year: 1954, court: 'Supreme Court', category: 'Civil Rights', summary: 'Landmark decision declaring racial segregation in public schools unconstitutional, overturning "separate but equal" doctrine.' },
  { id: 4, name: 'Roe v. Wade',               year: 1973, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Established a constitutional right to abortion under the Due Process Clause of the Fourteenth Amendment.' },
  { id: 5, name: 'McCulloch v. Maryland',     year: 1819, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Established the doctrine of implied powers and that states cannot tax federal institutions.' },
  { id: 6, name: 'Gideon v. Wainwright',      year: 1963, court: 'Supreme Court', category: 'Criminal Procedure', summary: 'Established that defendants in criminal trials have the right to an attorney even if they cannot afford one.' },
  { id: 7, name: 'Loving v. Virginia',        year: 1967, court: 'Supreme Court', category: 'Civil Rights', summary: 'Struck down anti-miscegenation laws, ruling that the freedom to marry is protected under the 14th Amendment.' },
  { id: 8, name: 'Tinker v. Des Moines',      year: 1969, court: 'Supreme Court', category: 'Civil Rights', summary: 'Established that students do not shed their constitutional rights at the schoolhouse gate.' },
]

const CATEGORIES = ['All', 'Constitutional Law', 'Criminal Procedure', 'Civil Rights', 'Tax Law']

const CATEGORY_COLORS = {
  'Constitutional Law': 'bg-blue-900/50 text-blue-300 border-blue-700',
  'Criminal Procedure': 'bg-red-900/50 text-red-300 border-red-700',
  'Civil Rights': 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  'Tax Law': 'bg-amber-900/50 text-amber-300 border-amber-700',
}

export default function CaseLibrary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = CASES.filter(c =>
    (category === 'All' || c.category === category) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Case Library</h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">+ New Case</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by case name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors flex-1 min-w-48"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{c.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{c.year}</span>
                  <span className="text-xs text-slate-500">{c.court}</span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${CATEGORY_COLORS[c.category] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {c.category}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{c.summary}</p>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-700 rounded-lg px-3 py-1.5 transition-colors">
                Read Full Case
              </button>
              <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors">
                Ask AI
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-slate-500 py-12">No cases match your search.</div>
        )}
      </div>
    </div>
  )
}
