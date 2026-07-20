import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  level?: 'app' | 'route' | 'feature'
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary that catches rendering errors and shows a recovery UI.
 * Three levels: app (full page), route (section), feature (card).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.level || 'feature'}]`, error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-[13px] text-gray-500 mt-1 max-w-sm text-center">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={this.handleRetry}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
