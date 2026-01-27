import { getDefaultStore, Provider as JotaiProvider } from 'jotai'
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { EVENTS } from '@/configs/events'
import { track } from '@/utils/events'
import App from './App'
import '@/assets/tailwind/theme.css'

document.documentElement.classList.toggle(
  'dark',
  localStorage.theme === 'dark'
  || (!('theme' in localStorage)
    && window.matchMedia('(prefers-color-scheme: dark)').matches),
)

async function initApp() {
  const root = document.getElementById('root')!
  root.className = 'antialiased bg-background'

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <JotaiProvider store={getDefaultStore()}>
        <App />
      </JotaiProvider>
    </React.StrictMode>,
  )
  track(EVENTS.OPTIONS.OPEN_OPTIONS)
}

initApp()
