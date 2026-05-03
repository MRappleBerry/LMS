import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const SUGGESTIONS = [
  'Explain judicial review',
  'What are Miranda rights?',
  'Summarise Marbury v. Madison',
  'Explain promissory estoppel',
  'What is stare decisis?',
]

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: "Hello! I'm your AI legal assistant. I can explain legal concepts, analyse cases, and guide your bar exam prep. What would you like to explore today?",
  },
  {
    role: 'user',
    text: 'Can you explain the concept of judicial review?',
  },
  {
    role: 'assistant',
    text: "Judicial review is the power of courts — particularly the Supreme Court — to determine whether laws and government actions comply with the Constitution.\n\n**Key points:**\n• Established in *Marbury v. Madison* (1803)\n• Creates a crucial check on legislative and executive power\n• Chief Justice Marshall: *\"It is emphatically the province and duty of the judicial department to say what the law is.\"*\n\nWould you like to go deeper into any aspect of this doctrine?",
  },
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
        isUser
          ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
          : 'bg-gradient-to-br from-md-surf3 to-md-surf2 text-md-primary border border-md-outline/60'
      }`}>
        {isUser ? 'AJ' : '⚖️'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-md shadow-md shadow-indigo-900/30'
          : 'bg-md-surf2 border border-md-outline/50 text-md-onsurf rounded-tl-md'
      }`}>
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-md-surf3 to-md-surf2 border border-md-outline/60 flex items-center justify-center text-sm shrink-0">
        ⚖️
      </div>
      <div className="bg-md-surf2 border border-md-outline/50 rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-md-primary rounded-full" />
        <span className="typing-dot w-2 h-2 bg-md-primary rounded-full" />
        <span className="typing-dot w-2 h-2 bg-md-primary rounded-full" />
      </div>
    </div>
  )
}

export default function ChatView() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/api/chat`, { message: userText })
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100vh - 56px - 64px)' }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length <= 3 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="ripple-root whitespace-nowrap text-xs bg-md-surf2 hover:bg-md-surf3 border border-md-outline/60 rounded-full px-3.5 py-2 text-md-onsurfvar hover:text-md-onsurf transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex gap-2 bg-md-surf2 border border-md-outline/60 rounded-2xl focus-within:border-md-primary/60 transition-colors px-3 py-2.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a legal question…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-md-onsurf placeholder-md-onsurfvar resize-none focus:outline-none max-h-28 overflow-y-auto scrollbar-hide"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="ripple-root w-8 h-8 rounded-xl bg-md-primarydim disabled:bg-md-surf3 disabled:text-md-onsurfvar text-white flex items-center justify-center shrink-0 transition-colors hover:bg-md-primary"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-md-onsurfvar text-center mt-1.5">For educational purposes only — not legal advice</p>
      </div>
    </div>
  )
}


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
