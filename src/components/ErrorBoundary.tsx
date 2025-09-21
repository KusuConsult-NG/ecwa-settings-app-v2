"use client"
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="container">
          <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
            <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto", textAlign: "center"}}>
              <AlertTriangle size={64} style={{color: "var(--error)", margin: "0 auto 1rem"}} />
              <h2 style={{color: "var(--error)", marginBottom: "1rem"}}>Something went wrong</h2>
              <p className="muted" style={{marginBottom: "2rem"}}>
                We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details style={{marginBottom: "2rem", textAlign: "left"}}>
                  <summary style={{cursor: "pointer", marginBottom: "1rem"}}>
                    <strong>Error Details (Development)</strong>
                  </summary>
                  <div style={{
                    backgroundColor: "var(--bg)",
                    padding: "1rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    overflow: "auto"
                  }}>
                    <div><strong>Error:</strong> {this.state.error.message}</div>
                    <div><strong>Stack:</strong></div>
                    <pre style={{whiteSpace: "pre-wrap", margin: "0.5rem 0"}}>
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <>
                        <div><strong>Component Stack:</strong></div>
                        <pre style={{whiteSpace: "pre-wrap", margin: "0.5rem 0"}}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
              
              <div style={{display: "flex", gap: "1rem", justifyContent: "center"}}>
                <button 
                  onClick={this.handleRetry}
                  className="btn primary"
                  style={{display: "flex", alignItems: "center", gap: "0.5rem"}}
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <button 
                  onClick={this.handleGoHome}
                  className="btn secondary"
                  style={{display: "flex", alignItems: "center", gap: "0.5rem"}}
                >
                  <Home size={16} />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for error reporting
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo })
    }
  }
}

