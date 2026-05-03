import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../lib/curriculumApi'

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
  const [access, setAccess]     = useState(null)
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
      const { data } = await axios.post(`${API_BASE}/api/chat`, { message: userText }, { headers: getAuthHeaders(), withCredentials: true })
      if (data?.access) setAccess(data.access)
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      if (err.response?.data?.access) setAccess(err.response.data.access)
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
        {access && (
          <p className="text-[10px] text-md-onsurfvar text-center mt-1">
            {access.tier === 'premium'
              ? 'Premium AI: unlimited prompts'
              : `Free AI usage: ${access.aiPromptsUsed}/${access.aiPromptLimit} prompts used this week • Resets in ${access.resetsInDays} day(s)`}
          </p>
        )}
      </div>
    </div>
  )
}
