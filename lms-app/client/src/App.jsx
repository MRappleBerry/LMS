import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './views/Dashboard'
import ChatView from './views/ChatView'
import CaseLibrary from './views/CaseLibrary'
import StudyMode from './views/StudyMode'
import Notes from './views/Notes'
import Settings from './views/Settings'
import ModuleGenerator from './views/ModuleGenerator'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const views = {
    dashboard: <Dashboard onNavigate={setActiveView} />,
    chat: <ChatView />,
    cases: <CaseLibrary />,
    study: <StudyMode />,
    notes: <Notes />,
    modules: <ModuleGenerator />,
    settings: <Settings darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />,
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar
            onToggleDark={() => setDarkMode(d => !d)}
            darkMode={darkMode}
            onMenuToggle={() => setSidebarOpen(o => !o)}
          />
          <main className="flex-1 overflow-y-auto">
            {views[activeView] ?? views.dashboard}
          </main>
        </div>
      </div>
    </div>
  )
}
