import { useEffect, useMemo, useState } from 'react'

const QUIZ_TIME_SEC = 35

const FLASHCARDS = [
  { q: 'What is the principle of judicial review?', a: 'Judicial review is the power of courts to determine the constitutionality of laws and invalidate unconstitutional acts.' },
  { q: 'Define stare decisis.', a: 'Stare decisis means courts should follow established precedents to keep legal outcomes consistent and predictable.' },
  { q: 'What did Miranda v. Arizona establish?', a: 'Police must inform suspects of rights before custodial interrogation, including right to silence and counsel.' },
  { q: 'Significance of Brown v. Board of Education?', a: 'It invalidated segregation in public schools and rejected the separate-but-equal doctrine.' },
]

const QUIZ = [
  {
    q: 'Primary purpose of Miranda warning?',
    options: ['Inform suspects of constitutional rights', 'Prevent suspects from remaining silent', 'Allow interrogation without a lawyer', 'Guarantee a speedy trial'],
    correct: 0,
    explanation: 'Miranda protects constitutional rights during custodial interrogation, especially silence and counsel rights.',
  },
  {
    q: 'Which case established judicial review?',
    options: ['McCulloch v. Maryland', 'Marbury v. Madison', 'Brown v. Board', 'Miranda v. Arizona'],
    correct: 1,
    explanation: 'Marbury v. Madison is the classic source of judicial review in constitutional law.',
  },
  {
    q: 'What does stare decisis require?',
    options: ['Equal protection under law', 'Courts follow established precedents', 'Right to legal counsel', 'SC review of all cases'],
    correct: 1,
    explanation: 'Stare decisis requires courts to follow precedent, unless there is a strong legal reason to depart.',
  },
  {
    q: 'Which element is NOT required for negligence?',
    options: ['Duty', 'Intent', 'Causation', 'Damages'],
    correct: 1,
    explanation: 'Negligence focuses on duty, breach, causation, and damages; intent is not an element.',
  },
]

const MASTERY = [
  { name: 'Constitutional Law', progress: 84 },
  { name: 'Criminal Law', progress: 69 },
  { name: 'Remedial Law', progress: 62 },
  { name: 'Civil Law', progress: 73 },
]

function masteryLabel(progress) {
  if (progress >= 80) return 'Advanced'
  if (progress >= 50) return 'Intermediate'
  return 'Beginner'
}

export default function StudyMode() {
  const [tab, setTab] = useState('quiz')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SEC)
  const [done, setDone] = useState(false)

  const currentQuiz = QUIZ[qIdx]

  useEffect(() => {
    if (tab !== 'quiz' || done || answered) return
    if (timeLeft <= 0) {
      setAnswered(true)
      return
    }
    const timer = window.setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [tab, done, answered, timeLeft])

  function submitAnswer() {
    if (selected === null || answered) return
    setAnswered(true)
    if (selected === currentQuiz.correct) setScore(v => v + 1)
  }

  function nextQuestion() {
    if (qIdx + 1 >= QUIZ.length) {
      setDone(true)
      return
    }
    setQIdx(v => v + 1)
    setSelected(null)
    setAnswered(false)
    setTimeLeft(QUIZ_TIME_SEC)
  }

  function restartQuiz() {
    setQIdx(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setTimeLeft(QUIZ_TIME_SEC)
    setDone(false)
  }

  const timerPct = useMemo(() => Math.round((timeLeft / QUIZ_TIME_SEC) * 100), [timeLeft])

  return (
    <div className="px-4 pb-6 pt-3 space-y-4 bg-[radial-gradient(900px_260px_at_50%_-5%,rgba(245,158,11,0.14),transparent)]">
      <div className="rounded-3xl border border-[#243b69] bg-gradient-to-br from-[#0d1b34] to-[#112a4e] p-5">
        <div className="text-[11px] uppercase tracking-[0.2em] text-orange-300/75">Lexis AI Study Mode</div>
        <h1 className="mt-2 text-2xl font-reader font-bold text-white">Focused Practice Studio</h1>
        <p className="mt-1 text-sm text-blue-100/75">Answer one question at a time. Learn from immediate explanations.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-md-surf2 border border-md-outline/50 p-1.5">
        {[
          { id: 'quiz', label: 'Quiz' },
          { id: 'flashcards', label: 'Flashcards' },
          { id: 'mastery', label: 'Mastery' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`h-9 rounded-xl text-xs font-semibold transition-colors ${tab === item.id ? 'bg-md-primarycon text-md-onprimarycon' : 'text-md-onsurfvar hover:text-md-onsurf'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'quiz' && (
        <section className="space-y-3">
          {done ? (
            <div className="rounded-3xl border border-md-outline/60 bg-md-surf p-6 text-center">
              <div className="text-5xl">🏛️</div>
              <h2 className="mt-2 text-xl font-reader font-bold text-white">Session Complete</h2>
              <p className="mt-1 text-sm text-md-onsurfvar">Score: {score}/{QUIZ.length} ({Math.round((score / QUIZ.length) * 100)}%)</p>
              <button onClick={restartQuiz} className="mt-4 h-10 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black text-sm font-bold">
                Start New Session
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-md-outline/60 bg-md-surf p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-md-onsurfvar">Question {qIdx + 1} / {QUIZ.length}</span>
                  <span className="text-orange-300 font-semibold">{timeLeft}s</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all" style={{ width: `${timerPct}%` }} />
                </div>
                <h3 className="text-base font-semibold text-md-onsurf leading-snug">{currentQuiz.q}</h3>
              </div>

              <div className="space-y-2.5">
                {currentQuiz.options.map((option, idx) => {
                  const optionKey = String.fromCharCode(65 + idx)
                  const isCorrect = idx === currentQuiz.correct
                  const isSelected = idx === selected
                  let cls = 'border-md-outline/50 bg-md-surf2 text-md-onsurfvar hover:text-md-onsurf hover:border-md-primary/40'

                  if (answered) {
                    if (isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                    else if (isSelected) cls = 'border-red-500/50 bg-red-500/10 text-red-200'
                    else cls = 'border-md-outline/30 bg-md-surf2/60 text-md-onsurfvar/70'
                  } else if (isSelected) {
                    cls = 'border-orange-400/60 bg-orange-500/10 text-orange-100'
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => !answered && setSelected(idx)}
                      disabled={answered}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${cls}`}
                    >
                      <span className="mr-2 text-xs font-bold opacity-70">{optionKey}.</span>
                      {option}
                    </button>
                  )
                })}
              </div>

              {answered && (
                <div className={`rounded-2xl border p-4 text-sm ${selected === currentQuiz.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100' : 'border-red-500/40 bg-red-500/10 text-red-100'}`}>
                  <div className="font-semibold mb-1">{selected === currentQuiz.correct ? 'Correct' : 'Incorrect'}</div>
                  <div className="text-xs leading-relaxed">{currentQuiz.explanation}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={answered || selected === null}
                  onClick={submitAnswer}
                  className="h-10 rounded-xl bg-md-primarydim text-white text-sm font-semibold disabled:opacity-40"
                >
                  Submit
                </button>
                <button
                  disabled={!answered}
                  onClick={nextQuestion}
                  className="h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black text-sm font-bold disabled:opacity-40"
                >
                  {qIdx + 1 === QUIZ.length ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {tab === 'flashcards' && (
        <section className="rounded-3xl border border-md-outline/60 bg-md-surf p-5">
          <div className="text-xs text-md-onsurfvar mb-3">Card {cardIdx + 1} / {FLASHCARDS.length}</div>
          <button
            onClick={() => setFlipped(v => !v)}
            className="w-full rounded-2xl border border-md-outline/50 bg-md-surf2 p-5 text-left min-h-[180px]"
          >
            <div className="text-[11px] uppercase tracking-widest text-orange-300/75">{flipped ? 'Answer' : 'Question'}</div>
            <p className="mt-3 text-base text-md-onsurf leading-relaxed">{flipped ? FLASHCARDS[cardIdx].a : FLASHCARDS[cardIdx].q}</p>
            <div className="mt-4 text-xs text-md-onsurfvar">Tap card to flip</div>
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => { setCardIdx(v => Math.max(0, v - 1)); setFlipped(false) }} className="h-9 rounded-xl border border-md-outline/60 bg-md-surf2 text-xs text-md-onsurfvar">Previous</button>
            <button onClick={() => { setCardIdx(v => Math.min(FLASHCARDS.length - 1, v + 1)); setFlipped(false) }} className="h-9 rounded-xl bg-md-primarydim text-white text-xs font-semibold">Next</button>
          </div>
        </section>
      )}

      {tab === 'mastery' && (
        <section className="space-y-2.5">
          {MASTERY.map(item => (
            <div key={item.name} className="rounded-2xl border border-md-outline/60 bg-md-surf p-3.5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-md-onsurf">{item.name}</span>
                <span className="text-orange-300">{masteryLabel(item.progress)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
