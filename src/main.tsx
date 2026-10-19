import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { Providers } from './app/providers'
import './i18n'
import './styles/index.css'
import './styles/fonts.css'

// F10.9: vite-ssg (ViteReactSSG) entry'ga almashtiriladi
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
