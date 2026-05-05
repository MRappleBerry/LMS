import { useEffect, useMemo, useState } from 'react'
import { fetchSubjectsByYearWithAccess } from '../lib/curriculumApi'
import { saveOnboardingProfile } from '../lib/onboardingProfile'

const QUESTION_SET = [
  {
    id: 'q1',
    prompt: 'How comfortable are you with constitutional structure and separation of powers?',
    options: [
      { text: 'I am just starting and need foundations.', score: 1 },
      { text: 'I know core ideas but miss details.', score: 2 },
      { text: 'I can explain it confidently with examples.', score: 3 },
    ],
  },
  {
    id: 'q2',
    prompt: 'When reading a bar question, how often can you identify the legal issue quickly?',
    options: [
      { text: 'Rarely, I need guidance.', score: 1 },
      { text: 'About half the time.', score: 2 },
      { text: 'Most of the time.', score: 3 },
    ],
  },
  {
    id: 'q3',
    prompt: 'How familiar are you with case doctrine application (issue-rule-application-conclusion)?',
    options: [
      { text: 'Beginner level.', score: 1 },
      { text: 'Intermediate level.', score: 2 },
      { text: 'Advanced and exam-ready.', score: 3 },
    ],
  },
  {
    id: 'q4',
    prompt: 'How confident are you in answering multiple-choice law questions under time pressure?',
    options: [
      { text: 'Not confident yet.', score: 1 },
      { text: 'Moderately confident.', score: 2 },
      { text: 'Very confident.', score: 3 },
    ],
  },
  {
    id: 'q5',
    prompt: 'How often do you review weak areas after quizzes?',
    options: [
      { text: 'I am building the habit.', score: 1 },
      { text: 'Sometimes, when I have time.', score: 2 },
      { text: 'After every quiz/session.', score: 3 },
    ],
  },
  {
    id: 'q6',
    prompt: 'Your current stage in bar preparation feels closest to:',
    options: [
      { text: 'Foundation building', score: 1 },
      { text: 'Structured review', score: 2 },
      { text: 'Final polishing and timing', score: 3 },
    ],
  },
]

function getLevel(totalScore) {
  if (totalScore <= 9) return 'Beginner'
  if (totalScore <= 14) return 'Intermediate'
  return 'Advanced'
}

function subjectMatch(level, yearLevel) {
  const text = String(yearLevel || '').toLowerCase()
  const is1 = text.includes('1')
  const is2 = text.includes('2')
  const is3 = text.includes('3')
  const is4 = text.includes('4')

  if (level === 'Beginner') return is1 || is2
  if (level === 'Intermediate') return is2 || is3
  return is3 || is4
}

export default function OnboardingAssessment({ user, onFinish }) {
  const [step, setStep] = useState('welcome')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(90)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const question = QUESTION_SET[index]
  const progress = Math.round(((index + 1) / QUESTION_SET.length) * 100)

  const timerPct = useMemo(() => Math.max(0, Math.round((secondsLeft / 90) * 100)), [secondsLeft])

  useEffect(() => {
    if (step !== 'questions') return undefined
    const timer = window.setInterval(() => {
      setSecondsLeft(v => Math.max(0, v - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step])

  useEffect(() => {
    if (step !== 'questions') return
    if (secondsLeft > 0) return
    finalizeAssessment(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, step])

  function startAssessment() {
    setStep('questions')
    setIndex(0)
    setSelected(null)
  }

  function selectAnswer(choiceIndex) {
    setSelected(choiceIndex)
    const option = question.options[choiceIndex]
    setAnswers(prev => ({ ...prev, [question.id]: option.score }))

    window.setTimeout(() => {
      if (index + 1 >= QUESTION_SET.length) {
        finalizeAssessment({ ...answers, [question.id]: option.score })
        return
      }
      setIndex(v => v + 1)
      setSelected(null)
    }, 180)
  }

  async function finalizeAssessment(finalAnswers) {
    setStep('analyzing')
    setBusy(true)

    const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + Number(score || 0), 0)
    const level = getLevel(totalScore)

    let subjects = []
    try {
      const data = await fetchSubjectsByYearWithAccess(null)
      subjects = data?.subjects || []
    } catch {
      subjects = []
    }

    const matched = subjects.filter(s => subjectMatch(level, s.yearLevel))
    const fallback = subjects[0]
    const starter = matched[0] || fallback
    const starterPath = starter ? `/subject/${starter.id}` : '/dashboard'

    const recommendation = {
      level,
      score: totalScore,
      recommendedSubjectId: starter?.id || null,
      recommendedSubjectTitle: starter?.title || 'Constitutional Law',
      recommendedPath: starterPath,
      answers: finalAnswers,
      completedAt: Date.now(),
    }

    saveOnboardingProfile(user?.id, recommendation)

    window.setTimeout(() => {
      setResult(recommendation)
      setStep('result')
      setBusy(false)
    }, 1300)
  }

  function startStudying() {
    onFinish?.('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_380px_at_10%_-10%,rgba(245,158,11,0.15),transparent),radial-gradient(1000px_420px_at_90%_-20%,rgba(37,99,235,0.2),transparent)] flex items-center justify-center p-5">
      <div className="w-full max-w-xl rounded-3xl border border-md-outline/50 bg-md-surf/95 backdrop-blur shadow-elev3 p-6 md:p-8">
        {step === 'welcome' && (
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-3xl font-reader font-bold text-md-onsurf">Welcome to Lexis AI</h1>
            <p className="text-sm text-md-onsurfvar">Let's personalize your study path</p>
            <p className="text-xs text-md-onsurfvar max-w-md mx-auto">
              Answer a few quick questions so we can tailor your learning experience.
            </p>
            <button
              onClick={startAssessment}
              className="mt-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-bold text-sm"
            >
              Start Assessment
            </button>
          </div>
        )}

        {step === 'questions' && question && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-md-onsurfvar">
              <span>Question {index + 1} of {QUESTION_SET.length}</span>
              <span>{secondsLeft}s</span>
            </div>
            <div className="h-1.5 rounded-full bg-md-surf3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-md-primary to-orange-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="h-1 rounded-full bg-md-surf3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400/60 to-transparent transition-all" style={{ width: `${timerPct}%` }} />
            </div>

            <h2 className="text-xl font-reader font-bold text-md-onsurf leading-snug">{question.prompt}</h2>

            <div className="space-y-2.5">
              {question.options.map((option, idx) => (
                <button
                  key={option.text}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                    selected === idx
                      ? 'bg-md-primarycon border-md-primary/60 text-md-onprimarycon'
                      : 'bg-md-surf2 border-md-outline/50 text-md-onsurfvar hover:text-md-onsurf hover:border-md-primary/50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="text-center space-y-4 py-6 animate-fade-in">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-orange-400/50 border-t-orange-300 animate-spin" />
            <h2 className="text-xl font-reader font-bold text-md-onsurf">Analyzing your answers...</h2>
            <p className="text-sm text-md-onsurfvar">Creating your personalized study path</p>
            {busy && <p className="text-xs text-orange-300/80">Optimizing subject sequence</p>}
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-reader font-bold text-md-onsurf">You're at {result.level} Level</h2>
            <p className="text-sm text-md-onsurfvar">
              Based on your answers, we recommend starting with {result.recommendedSubjectTitle}.
            </p>

            <div className="rounded-2xl border border-md-outline/50 bg-md-surf2 p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-md-onsurfvar">Suggested Path</div>
              <div className="text-sm text-md-onsurf">Subject: {result.recommendedSubjectTitle}</div>
              <div className="text-sm text-md-onsurf">Starting lesson: Chapter 1 Fundamentals</div>
            </div>

            <button
              onClick={startStudying}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-bold text-sm"
            >
              Start Studying
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
