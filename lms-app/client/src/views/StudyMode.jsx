import { useState } from 'react'

const FLASHCARDS = [
  { q: 'What is the principle of judicial review?', a: 'Judicial review is the power of courts to determine constitutionality of laws and invalidate unconstitutional acts. Established in Marbury v. Madison (1803).' },
  { q: 'Define stare decisis.', a: 'Stare decisis means "to stand by things decided." Courts must follow established precedents for consistency and predictability in the legal system.' },
  { q: 'What did Miranda v. Arizona establish?', a: 'Police must inform suspects of their constitutional rights (right to silence, right to attorney) before custodial interrogation. Failure renders statements inadmissible.' },
  { q: 'Significance of Brown v. Board of Education?', a: 'Overturned "separate but equal" doctrine, establishing that racial segregation in public schools violates the Equal Protection Clause of the 14th Amendment.' },
  { q: 'What is Due Process?', a: 'Constitutional guarantee ensuring the government cannot deprive a person of life, liberty, or property without fair procedures. Has both procedural and substantive dimensions.' },
  { q: 'Explain implied powers.', a: 'Powers not explicitly stated in the Constitution but necessary to execute enumerated powers. Rooted in the Necessary and Proper Clause (McCulloch v. Maryland).' },
  { q: 'What is strict liability?', a: 'Liability without proof of fault or negligence. Applies to abnormally dangerous activities and defective products. Defendant is liable regardless of intent or care.' },
  { q: 'Four elements of negligence?', a: '1. Duty of care, 2. Breach of that duty, 3. Causation (actual and proximate), 4. Damages. All four must be proven by the plaintiff.' },
  { q: 'What makes a valid contract?', a: 'Offer, acceptance, consideration, mutual intent to be bound, capacity of the parties, and legality of the subject matter.' },
  { q: 'What is consideration?', a: 'Something of value exchanged by both parties. Each party must give up something. Mere promises are generally not sufficient without consideration.' },
  { q: 'What is the exclusionary rule?', a: 'Evidence obtained through unconstitutional searches or seizures cannot be used in court. Established to deter police misconduct and protect 4th Amendment rights.' },
  { q: 'What is promissory estoppel?', a: 'Enforces a promise without consideration when: a promise was made, the promisor should expect reliance, the promisee detrimentally relied, injustice can only be avoided by enforcement.' },
]

const QUIZ = [
  { q: 'What was the primary purpose of the Miranda warning?', options: ['To inform suspects of their constitutional rights', 'To prevent suspects from remaining silent', 'To allow police to interrogate without a lawyer', 'To guarantee a speedy trial'], correct: 0 },
  { q: 'Which case established the power of judicial review?', options: ['McCulloch v. Maryland', 'Marbury v. Madison', 'Brown v. Board', 'Miranda v. Arizona'], correct: 1 },
  { q: 'What does stare decisis require?', options: ['Equal protection under law', 'Courts to follow established precedents', 'Right to legal counsel', 'Supreme Court review of all cases'], correct: 1 },
  { q: 'Which element is NOT required for negligence?', options: ['Duty', 'Intent', 'Causation', 'Damages'], correct: 1 },
  { q: 'What is "consideration" in contract law?', options: ['A court order', 'Something of value exchanged by parties', 'A written document', 'Government approval'], correct: 1 },
  { q: 'The exclusionary rule primarily protects which amendment?', options: ['1st Amendment', '5th Amendment', '4th Amendment', '6th Amendment'], correct: 2 },
  { q: 'What type of liability does NOT require proof of fault?', options: ['Negligence', 'Strict liability', 'Intentional tort', 'Vicarious liability'], correct: 1 },
  { q: 'Brown v. Board overturned which doctrine?', options: ['Implied consent', 'Separate but equal', 'Clear and present danger', 'Substantive due process'], correct: 1 },
]

const CATEGORIES = [
  { name: 'Constitutional Law', mastery: 92, total: 25, icon: '🏛️' },
  { name: 'Criminal Law',       mastery: 78, total: 24, icon: '⚖️' },
  { name: 'Civil Rights',       mastery: 65, total: 20, icon: '✊' },
  { name: 'Torts',              mastery: 88, total: 24, icon: '🔨' },
  { name: 'Contracts',          mastery: 72, total: 25, icon: '📄' },
  { name: 'Tax Law',            mastery: 58, total: 24, icon: '💰' },
]

function MasteryBadge({ pct }) {
  const color = pct >= 80 ? 'bg-emerald-600' : pct >= 65 ? 'bg-amber-600' : 'bg-red-600'
  return <span className={`${color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{pct}%</span>
}

export default function StudyMode() {
  const [mode, setMode] = useState('flashcards')
  const [fcIdx, setFcIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  function fcNext() { setFcIdx(i => Math.min(i + 1, FLASHCARDS.length - 1)); setFlipped(false) }
  function fcPrev() { setFcIdx(i => Math.max(i - 1, 0)); setFlipped(false) }

  function submitAnswer() {
    if (selected === null) return
    setAnswered(true)
    if (selected === QUIZ[qIdx].correct) setScore(s => s + 1)
  }

  function nextQuestion() {
    if (qIdx + 1 >= QUIZ.length) { setQuizDone(true); return }
    setQIdx(i => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  function resetQuiz() { setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setQuizDone(false) }

  const TABS = ['flashcards', 'quiz', 'categories']

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Study Mode</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Cards Studied', val: '87', color: 'text-blue-400' }, { label: 'Mastery Rate', val: '82%', color: 'text-emerald-400' }, { label: 'Day Streak 🔥', val: '12', color: 'text-amber-400' }, { label: 'This Week', val: '4h 28m', color: 'text-cyan-400' }].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setMode(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${mode === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
            {{ flashcards: '📇 Flashcards', quiz: '❓ Quiz', categories: '🏷️ Categories' }[t]}
          </button>
        ))}
      </div>

      {/* FLASHCARDS */}
      {mode === 'flashcards' && (
        <div>
          <div className="text-xs text-slate-500 mb-3">Card {fcIdx + 1} of {FLASHCARDS.length}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${((fcIdx + 1) / FLASHCARDS.length) * 100}%` }} />
          </div>

          <div
            onClick={() => setFlipped(f => !f)}
            className="bg-slate-900 border border-slate-700 hover:border-blue-600 rounded-2xl p-8 min-h-52 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
          >
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">{flipped ? 'Answer' : 'Question'}</div>
            <p className="text-lg font-medium leading-relaxed text-slate-100">
              {flipped ? FLASHCARDS[fcIdx].a : FLASHCARDS[fcIdx].q}
            </p>
            <p className="text-xs text-slate-600 mt-6">Click to {flipped ? 'see question' : 'reveal answer'}</p>
          </div>

          <div className="flex gap-3 mt-5 justify-center">
            <button onClick={fcPrev} disabled={fcIdx === 0} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors">← Previous</button>
            <button onClick={fcNext} disabled={fcIdx === FLASHCARDS.length - 1} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors">Next →</button>
          </div>
          <div className="flex gap-3 mt-3 justify-center">
            <button onClick={fcNext} className="px-4 py-2 text-sm bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800 rounded-lg transition-colors">😞 Forgot</button>
            <button onClick={fcNext} className="px-4 py-2 text-sm bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800 rounded-lg transition-colors">😐 Medium</button>
            <button onClick={fcNext} className="px-4 py-2 text-sm bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 rounded-lg transition-colors">🎯 Mastered!</button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {mode === 'quiz' && (
        <div>
          {quizDone ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">{score >= 6 ? '🎉' : score >= 4 ? '👍' : '📚'}</div>
              <h2 className="text-xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-slate-400 mb-1">You scored <span className="text-white font-bold">{score} / {QUIZ.length}</span></p>
              <p className="text-slate-400 mb-6">({Math.round(score / QUIZ.length * 100)}% correct)</p>
              <button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">Try Again</button>
            </div>
          ) : (
            <div>
              <div className="text-xs text-slate-500 mb-3">Question {qIdx + 1} of {QUIZ.length} · Score: {score}</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${((qIdx + 1) / QUIZ.length) * 100}%` }} />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-lg mb-5">{QUIZ[qIdx].q}</h3>
                <div className="space-y-2.5">
                  {QUIZ[qIdx].options.map((opt, i) => {
                    let cls = 'border-slate-700 bg-slate-800 hover:border-blue-500 hover:bg-slate-700'
                    if (answered) {
                      if (i === QUIZ[qIdx].correct) cls = 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
                      else if (i === selected) cls = 'border-red-500 bg-red-900/30 text-red-300'
                      else cls = 'border-slate-700 bg-slate-800 opacity-50'
                    } else if (selected === i) {
                      cls = 'border-blue-500 bg-blue-900/30'
                    }
                    return (
                      <button key={i} disabled={answered} onClick={() => setSelected(i)} className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-colors ${cls}`}>
                        <span className="font-mono text-xs text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
              {!answered
                ? <button onClick={submitAnswer} disabled={selected === null} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-xl transition-colors font-medium">Submit Answer</button>
                : <button onClick={nextQuestion} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl transition-colors font-medium">{qIdx + 1 >= QUIZ.length ? 'See Results' : 'Next Question →'}</button>
              }
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES */}
      {mode === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </div>
                <MasteryBadge pct={cat.mastery} />
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${cat.mastery >= 80 ? 'bg-emerald-500' : cat.mastery >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${cat.mastery}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{Math.round(cat.total * cat.mastery / 100)} of {cat.total} mastered</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
