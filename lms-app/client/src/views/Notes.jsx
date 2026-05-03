import { useState } from 'react'

const INITIAL_NOTES = [
  {
    id: 1,
    title: 'Judicial Review & Constitutional Authority',
    body: `Key Principle: Marbury v. Madison established the Supreme Court's power to determine constitutionality of laws.

Implications:
• Court has final authority on constitutional interpretation
• "It is emphatically the province and duty of the judicial department to say what the law is"
• Creates checks & balances between branches

Historical Context:
• 1803 decision during Jefferson administration
• Political tension between executive and judiciary
• Marshall's brilliant reasoning limited immediate power while establishing long-term authority

Related Doctrine: Stare Decisis
• Future courts must follow this precedent
• Vertical stare decisis applies nationwide
• Defines relationship between federal courts

Study Notes:
- Connect to Federalist 10 & 51 on separation of powers
- Contrast with Dred Scott v. Sanford (flawed judicial review)
- Compare international approaches to constitutional review`,
  },
]

let nextId = 2

const AI_TEMPLATES = [
  {
    label: 'Case Brief',
    prompt: 'Generate a structured case brief',
    generate: (topic) => ({
      title: `Case Brief: ${topic || 'New Case'}`,
      body: `CASE BRIEF: ${topic || 'New Case'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FACTS:
• [Describe the key facts here]
• Parties involved: Plaintiff vs. Defendant
• Jurisdiction: [Court & year]

ISSUE:
• What is the central legal question?

HOLDING:
• The court held that...

REASONING:
• [Explain the court's rationale]
• Key legal principles applied:
  - [Principle 1]
  - [Principle 2]

RULE OF LAW:
• [State the rule established or applied]

SIGNIFICANCE:
• Impact on future cases:
• Related doctrines:

STUDY TIPS:
- Compare with similar cases
- Note any dissenting opinions
- Identify policy implications`,
    }),
  },
  {
    label: 'Concept Summary',
    prompt: 'Summarize a legal concept',
    generate: (topic) => ({
      title: `Concept: ${topic || 'Legal Concept'}`,
      body: `LEGAL CONCEPT SUMMARY: ${topic || 'Legal Concept'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEFINITION:
• [Define the concept in plain language]

ELEMENTS / REQUIREMENTS:
1. [Element one]
2. [Element two]
3. [Element three]

KEY CASES:
• [Landmark case 1] — established...
• [Landmark case 2] — clarified...

EXCEPTIONS & LIMITATIONS:
• [Exception 1]
• [Exception 2]

PRACTICAL APPLICATION:
• How courts apply this today:
• Common exam scenarios:

RELATED CONCEPTS:
• [Related doctrine 1]
• [Related doctrine 2]

MEMORY AIDS:
• Mnemonic: [...]
• Key phrase: "..."`,
    }),
  },
  {
    label: 'Study Outline',
    prompt: 'Create a study outline',
    generate: (topic) => ({
      title: `Study Outline: ${topic || 'Topic'}`,
      body: `STUDY OUTLINE: ${topic || 'Topic'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I. OVERVIEW
   A. Core principle
   B. Historical development
   C. Policy rationale

II. KEY RULES
   A. General rule
   B. Exceptions
   C. Modern interpretations

III. LANDMARK CASES
   A. [Case 1] — rule established
   B. [Case 2] — rule applied/extended
   C. [Case 3] — rule limited

IV. ANALYSIS FRAMEWORK
   A. Step 1: Identify the issue
   B. Step 2: State the rule
   C. Step 3: Apply to facts
   D. Step 4: Conclude

V. EXAM TIPS
   • Common fact patterns
   • Tricky distinctions
   • Points to always mention

VI. CONNECTIONS
   • Related to: [topic]
   • Conflicts with: [topic]`,
    }),
  },
]

export default function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [activeId, setActiveId] = useState(1)
  const [saved, setSaved] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const activeNote = notes.find(n => n.id === activeId)

  function updateActive(field, value) {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, [field]: value } : n))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleNewNote() {
    const id = nextId++
    const newNote = { id, title: 'Untitled Note', body: '' }
    setNotes(prev => [...prev, newNote])
    setActiveId(id)
  }

  function handleDeleteNote() {
    if (notes.length === 1) {
      // Replace with blank instead of deleting last note
      setNotes([{ id: activeId, title: 'Untitled Note', body: '' }])
      setShowDeleteConfirm(false)
      return
    }
    const remaining = notes.filter(n => n.id !== activeId)
    setNotes(remaining)
    setActiveId(remaining[0].id)
    setShowDeleteConfirm(false)
  }

  function handleGenerateAi() {
    const template = AI_TEMPLATES[selectedTemplate]
    const generated = template.generate(aiTopic.trim())
    const id = nextId++
    setNotes(prev => [...prev, { id, ...generated }])
    setActiveId(id)
    setShowAiModal(false)
    setAiTopic('')
    setSelectedTemplate(0)
  }

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      {/* Sidebar */}
      <div className="w-56 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</span>
          <button
            onClick={handleNewNote}
            title="New Note"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`w-full text-left px-3 py-2.5 text-sm truncate transition-colors border-b border-slate-800/50 ${
                note.id === activeId
                  ? 'bg-blue-600/20 text-blue-300 border-l-2 border-l-blue-500'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {note.title || 'Untitled Note'}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center justify-center gap-1.5"
          >
            ✨ Generate with AI
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
          >
            🗑 Delete Note
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
            📎 Linked to: Marbury v. Madison
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4">Notion-style editor — type freely and save when ready.</p>

        {activeNote && (
          <>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-blue-600 transition-colors flex flex-col">
              <input
                value={activeNote.title}
                onChange={e => updateActive('title', e.target.value)}
                placeholder="Note title..."
                className="w-full bg-transparent text-xl font-bold text-slate-100 placeholder-slate-600 px-6 pt-6 pb-3 focus:outline-none border-b border-slate-800 shrink-0"
              />
              <textarea
                value={activeNote.body}
                onChange={e => updateActive('body', e.target.value)}
                placeholder="Start typing your notes here..."
                className="flex-1 w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 px-6 py-4 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex gap-3 mt-4 shrink-0">
              <button
                onClick={handleSave}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                {saved ? '✓ Saved!' : 'Save Note'}
              </button>
              <button
                onClick={handleNewNote}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              >
                + New Note
              </button>
              <button className="px-5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700">
                🔗 Link to Case
              </button>
            </div>
          </>
        )}
      </div>

      {/* AI Generate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-1">✨ Generate Note with AI</h2>
              <p className="text-slate-400 text-sm mb-5">Choose a template and enter a topic to generate a structured note.</p>

              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Template</label>
                <div className="grid grid-cols-3 gap-2">
                  {AI_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTemplate(i)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        selectedTemplate === i
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Topic / Case Name</label>
                <input
                  autoFocus
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerateAi()}
                  placeholder="e.g. Marbury v. Madison, Promissory Estoppel..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGenerateAi}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                >
                  ✨ Generate Note
                </button>
                <button
                  onClick={() => { setShowAiModal(false); setAiTopic('') }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h2 className="text-lg font-bold mb-2">Delete Note?</h2>
            <p className="text-slate-400 text-sm mb-6">
              "<span className="text-slate-200">{activeNote?.title || 'Untitled Note'}</span>" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteNote}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
