import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Application entry point.
 *
 * Renders the App component into the #root div with StrictMode enabled.
 * StrictMode activates additional development-only checks:
 * - Double-invokes effects to catch missing cleanup
 * - Warns about deprecated APIs
 * - Detects unexpected side effects
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
