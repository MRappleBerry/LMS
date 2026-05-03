import { memo, useEffect, useMemo, useState } from 'react'
import { explainWithAi } from '../lib/readerAi'
import { useReaderState } from './ReaderStateContext'

function AIAssistantPanelBase({ subject, chapterId, sectionId, request, onQuickExplain }) {
  const { getSectionNote, setSectionNote } = useReaderState()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Select text from the chapter and press Explain with AI. I will break it down for law school study.'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const sectionKey = `${subject}:${chapterId}:${sectionId || 'unknown'}`
  const note = getSectionNote(sectionKey)

  useEffect(() => {
    if (!request?.context) return

    let mounted = true
    async function runExplain() {
      setLoading(true)
      setError('')
      setMessages(prev => [...prev, { role: 'user', text: request.context }])
      try {
        const data = await explainWithAi({
          context: request.context,
          instruction: request.instruction,
        })
        if (!mounted) return
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
      } catch (err) {
        if (!mounted) return
        const msg = err.response?.data?.error || 'AI explanation failed. Please retry.'
        setError(msg)
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${msg}` }])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    runExplain()
    setMobileOpen(true)
    return () => { mounted = false }
  }, [request])

  const lastMode = useMemo(() => {
    return messages.length > 1 ? 'Context-aware explain mode' : 'Ready'
  }, [messages])

  const panelContent = (
    <>
      <div className="px-4 py-3 border-b border-md-outline/50 shrink-0">
        <div className="text-sm font-semibold text-md-onsurf">AI Assistant</div>
        <div className="text-xs text-md-onsurfvar mt-0.5">{lastMode}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`rounded-2xl px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === 'assistant'
                ? 'bg-md-surf3 text-md-onsurf border border-md-outline/40'
                : 'bg-md-primarycon text-md-onprimarycon border border-md-primary/30'
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-md-surf3 border border-md-outline/40 rounded-2xl px-3 py-2.5 flex gap-1.5 items-center">
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-md-primary" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-md-primary" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-md-primary" />
          </div>
        )}

        {error && <p className="text-[11px] text-md-error">{error}</p>}
      </div>

      <div className="p-3 border-t border-md-outline/50 space-y-2 shrink-0">
        <div className="text-[11px] font-semibold text-md-onsurfvar uppercase tracking-widest">Quick Actions</div>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => onQuickExplain('Summarize the key doctrine in this section.')} className="ripple-root text-left px-3 py-2 rounded-xl text-xs bg-md-surf3 text-md-onsurfvar hover:text-md-onsurf border border-md-outline/50">
            Summarize key doctrine
          </button>
          <button onClick={() => onQuickExplain('Convert this section into bar exam issue-spotting pointers.')} className="ripple-root text-left px-3 py-2 rounded-xl text-xs bg-md-surf3 text-md-onsurfvar hover:text-md-onsurf border border-md-outline/50">
            Bar exam issue spotting
          </button>
        </div>
      </div>

      <div className="p-3 border-t border-md-outline/50 shrink-0">
        <label className="text-[11px] font-semibold text-md-onsurfvar uppercase tracking-widest block mb-2">Section Notes</label>
        <textarea
          value={note}
          onChange={e => setSectionNote(sectionKey, e.target.value)}
          placeholder="Write your legal notes for this section..."
          className="w-full h-28 resize-none rounded-xl bg-md-surf3 border border-md-outline/50 px-3 py-2 text-xs text-md-onsurf placeholder-md-onsurfvar/60 focus:outline-none focus:border-md-primary/60"
        />
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] shrink-0 border-l border-md-outline/50 bg-md-surf2/70 backdrop-blur h-full sticky top-0 flex-col">
        {panelContent}
      </aside>

      {/* Mobile launcher */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed z-40 right-4 bottom-20 h-12 px-4 rounded-2xl bg-md-primarydim text-white text-sm font-semibold shadow-fabshadow"
        >
          AI Assistant
        </button>
      )}

      {/* Mobile sheet */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-x-0 bottom-16 z-50 h-[72vh] bg-md-surf border-t border-md-outline/60 rounded-t-3xl shadow-elev3 flex flex-col animate-slide-up">
            <div className="px-4 py-2 border-b border-md-outline/50 flex items-center justify-between shrink-0">
              <div className="w-10 h-1 rounded-full bg-md-outline mx-auto absolute left-1/2 -translate-x-1/2" />
              <span className="text-xs font-semibold text-md-onsurfvar">AI Panel</span>
              <button onClick={() => setMobileOpen(false)} className="text-md-onsurfvar text-xs px-2 py-1 rounded-lg hover:bg-md-surf2">Close</button>
            </div>
            {panelContent}
          </div>
        </>
      )}
    </>
  )
}

const AIAssistantPanel = memo(AIAssistantPanelBase)
export default AIAssistantPanel
