import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const SUGGESTIONS = [
  'Explain the principle of judicial review',
  'What are Miranda rights and why do they matter?',
  'Summarise Brown v. Board of Education',
  'What is the difference between civil and criminal law?',
  'Explain promissory estoppel with an example',
]

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: "Hello! I'm your AI legal assistant. I can help you understand legal concepts, analyse cases, and guide your studies. What would you like to explore today?",
  },
  {
    role: 'user',
    text: 'Can you explain the concept of judicial review?',
  },
  {
    role: 'assistant',
    text: "Judicial review is the power of courts—particularly the Supreme Court—to determine whether laws and government actions comply with the Constitution. If a law is found to be unconstitutional, the court can invalidate it.\n\n**Key points:**\n• Established in *Marbury v. Madison* (1803)\n• Creates a crucial check on legislative and executive power\n• Chief Justice Marshall's famous quote: *\"It is emphatically the province and duty of the judicial department to say what the law is.\"*\n\nWould you like me to go deeper into any aspect of this doctrine?",
  },
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-600 to-blue-600'}`}>
        {isUser ? 'AJ' : '⚖️'}
      </div>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shrink-0 flex items-center justify-center text-sm">⚖️</div>
      <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export default function ChatView() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    try {
      const { data } = await axios.post(`${API_BASE}/api/chat`, { message: userText })
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 3 && (
          <div className="px-6 pb-3 flex gap-2 flex-wrap">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 text-slate-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex gap-3 bg-slate-800 rounded-xl border border-slate-700 focus-within:border-blue-500 transition-colors p-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask a legal question... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="self-end w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg flex items-center justify-center transition-colors"
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">AI responses are for educational purposes only — not legal advice.</p>
        </div>
      </div>

      {/* Sidebar Context Panel */}
      <aside className="w-64 border-l border-slate-800 p-4 hidden lg:block">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Study Context</h3>
        <div className="space-y-3">
          {[
            { label: 'Current Topic', value: 'Constitutional Law' },
            { label: 'Active Case', value: 'Marbury v. Madison' },
            { label: 'Progress', value: '87 cards reviewed' },
          ].map(item => (
            <div key={item.label} className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">{item.label}</div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Prompts</h3>
          <div className="space-y-2">
            {['Summarise this case', 'Key legal principles', 'Related precedents', 'Exam tips'].map(p => (
              <button key={p} onClick={() => sendMessage(p)} className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-slate-300 transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
