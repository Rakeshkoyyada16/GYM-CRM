import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Providers } from './app/Providers'
import { router } from './app/Router'
import { ErrorBoundary } from './components/feedback/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary level="app">
      <Providers>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{ style: { fontFamily: 'var(--font-sans)', fontSize: '13px' } }}
          richColors
          closeButton
        />
      </Providers>
    </ErrorBoundary>
  )
}
