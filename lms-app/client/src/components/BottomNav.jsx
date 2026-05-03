import { useRef } from 'react'

const ITEMS = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'AI Chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
  },
  {
    id: 'cases',
    label: 'Library',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
      </svg>
    ),
  },
  {
    id: 'study',
    label: 'Study',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 3L1 9l4 2.18V15c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.82L21 9l-9-6zM17 15H7v-3.18l5 2.73 5-2.73V15zm-5-4.27L5.2 9 12 5.27 18.8 9l-6.8 1.73z" />
      </svg>
    ),
  },
  {
    id: 'more',
    label: 'More',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
      </svg>
    ),
  },
]

function addRipple(e, btn) {
  const rect = btn.getBoundingClientRect()
  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  const size = Math.max(rect.width, rect.height) * 2
  wave.style.width = wave.style.height = `${size}px`
  wave.style.marginTop = wave.style.marginLeft = `${-size / 2}px`
  wave.style.left = `${e.clientX - rect.left}px`
  wave.style.top  = `${e.clientY - rect.top}px`
  btn.appendChild(wave)
  wave.addEventListener('animationend', () => wave.remove())
}

export default function BottomNav({ activeView, onNavigate }) {
  const refs = useRef({})

  function handleClick(e, id) {
    const btn = refs.current[id]
    if (btn) addRipple(e, btn)
    onNavigate(id)
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t border-white/[0.04] nav-safe">
      <div className="flex items-stretch h-16">
        {ITEMS.map(item => {
          const active = activeView === item.id || (item.id === 'more' && ['notes','modules','settings'].includes(activeView))
          return (
            <button
              key={item.id}
              ref={el => refs.current[item.id] = el}
              onClick={e => handleClick(e, item.id)}
              className="ripple-root flex-1 flex flex-col items-center justify-center gap-0.5 relative no-select"
            >
              {/* Indicator pill */}
              <div className={`nav-pill absolute top-1.5 rounded-full transition-all ${active ? 'w-14 h-8 bg-md-primarycon' : 'w-0 h-8 bg-transparent'}`} />

              {/* Icon */}
              <div className={`relative z-10 transition-colors duration-200 ${active ? 'text-md-onprimarycon' : 'text-md-onsurfvar'}`}>
                {item.icon}
              </div>

              {/* Label */}
              <span className={`relative z-10 text-[10px] font-medium leading-none transition-colors duration-200 ${active ? 'text-md-onprimarycon' : 'text-md-onsurfvar'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
