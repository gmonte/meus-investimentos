import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { ModalsProvider } from './hooks/useModal'
import { ToastsProvider } from './hooks/useToast'
import { StoreProvider } from './store'

import '~/styles/globals.css'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <StoreProvider>
      <ToastsProvider>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </ToastsProvider>
    </StoreProvider>
  </StrictMode>
)
