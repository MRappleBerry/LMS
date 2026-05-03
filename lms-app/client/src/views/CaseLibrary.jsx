import { useState } from 'react'

const CASES = [
  { id: 1, name: 'Marbury v. Madison',          year: 1803, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Landmark case establishing judicial review — the power to invalidate laws that conflict with the Constitution.' },
  { id: 2, name: 'Miranda v. Arizona',           year: 1966, court: 'Supreme Court', category: 'Criminal Procedure', summary: 'Established the requirement that police inform suspects of their constitutional rights before custodial interrogation.' },
  { id: 3, name: 'Brown v. Board of Education',  year: 1954, court: 'Supreme Court', category: 'Civil Rights',       summary: 'Declared racial segregation in public schools unconstitutional, overturning "separate but equal" doctrine.' },
  { id: 4, name: 'Roe v. Wade',                  year: 1973, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Established a constitutional right to abortion under the Due Process Clause of the 14th Amendment.' },
  { id: 5, name: 'McCulloch v. Maryland',        year: 1819, court: 'Supreme Court', category: 'Constitutional Law', summary: 'Established the doctrine of implied powers and that states cannot tax federal institutions.' },
  { id: 6, name: 'Gideon v. Wainwright',         year: 1963, court: 'Supreme Court', category: 'Criminal Procedure', summary: 'Established that defendants in criminal trials have the right to an attorney even if they cannot afford one.' },
  { id: 7, name: 'Loving v. Virginia',           year: 1967, court: 'Supreme Court', category: 'Civil Rights',       summary: 'Struck down anti-miscegenation laws, ruling that the freedom to marry is protected under the 14th Amendment.' },
  { id: 8, name: 'Tinker v. Des Moines',         year: 1969, court: 'Supreme Court', category: 'Civil Rights',       summary: 'Established that students do not shed their constitutional rights at the schoolhouse gate.' },
]

const CATEGORIES = ['All', 'Constitutional Law', 'Criminal Procedure', 'Civil Rights', 'Tax Law']

const CAT_STYLE = {
  'Constitutional Law': { pill: 'bg-blue-500/15 text-blue-300 border-blue-500/30',   dot: 'bg-blue-400'    },
  'Criminal Procedure': { pill: 'bg-red-500/15 text-red-300 border-red-500/30',       dot: 'bg-red-400'     },
  'Civil Rights':       { pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  'Tax Law':            { pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400'   },
}

function CasePill({ category }) {
  const s = CAT_STYLE[category] || { pill: 'bg-slate-800 text-slate-400 border-slate-700', dot: 'bg-slate-500' }
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {category}
    </span>
  )
}

export default function CaseLibrary() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = CASES.filter(c =>
    (category === 'All' || c.category === category) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.summary.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="pb-6">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-md-bg/80 backdrop-blur-lg px-4 pt-3 pb-3 border-b border-md-outline/30">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-md-onsurfvar">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-md-surf2 border border-md-outline/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-md-onsurf placeholder-md-onsurfvar focus:outline-none focus:border-md-primary/60 transition-colors"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`ripple-root whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === cat
                ? 'bg-md-primary text-white border-md-primary shadow-sm shadow-indigo-900/40'
                : 'bg-md-surf2 border-md-outline/60 text-md-onsurfvar hover:border-md-primary/40 hover:text-md-onsurf'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-4 pb-2">
        <span className="text-xs text-md-onsurfvar">{filtered.length} case{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Case list */}
      <div className="px-4 space-y-2.5">
        {filtered.map((c, i) => {
          const isOpen = expanded === c.id
          return (
            <div
              key={c.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className={`bg-md-surf2 border rounded-2xl overflow-hidden transition-colors cursor-pointer ${
                  isOpen ? 'border-md-primary/40' : 'border-md-outline/50 hover:border-md-outline'
                }`}
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                {/* Header */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-md-surf3 flex items-center justify-center text-base shrink-0 mt-0.5">⚖️</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <CasePill category={c.category} />
                        <span className="text-[10px] text-md-onsurfvar">{c.year}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-md-onsurf leading-snug">{c.name}</h3>
                    </div>
                    <svg
                      viewBox="0 0 24 24" fill="currentColor"
                      className={`w-4 h-4 text-md-onsurfvar shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </div>

                  <p className="text-xs text-md-onsurfvar leading-relaxed mt-2 line-clamp-2">{c.summary}</p>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-md-outline/30 pt-3 animate-fade-in">
                    <p className="text-xs text-md-onsurfvar leading-relaxed mb-3">{c.summary}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="ripple-root text-xs bg-md-primarycon text-md-onprimarycon border border-md-primary/30 rounded-xl px-3 py-2 font-medium hover:bg-md-primary/20 transition-colors">
                        📖 Full Case
                      </button>
                      <button className="ripple-root text-xs bg-md-surf3 text-md-onsurfvar border border-md-outline/50 rounded-xl px-3 py-2 font-medium hover:text-md-onsurf transition-colors">
                        🤖 Ask AI
                      </button>
                      <button className="ripple-root text-xs bg-md-surf3 text-md-onsurfvar border border-md-outline/50 rounded-xl px-3 py-2 font-medium hover:text-md-onsurf transition-colors">
                        📝 Add Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-md-onsurfvar">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No cases match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
