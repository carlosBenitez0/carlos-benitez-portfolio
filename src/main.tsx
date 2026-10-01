import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/scroll-utils.css' // Import the scroll utilities
import App from './App.tsx'
import { MotionConfig } from 'framer-motion'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* framer-motion respeta "reducir movimiento" del sistema */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
