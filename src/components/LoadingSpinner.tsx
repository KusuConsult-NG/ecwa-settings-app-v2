"use client"
import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
}

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className = ''
}: LoadingSpinnerProps) {
  const spinnerSize = sizeMap[size]
  
  const spinner = (
    <div className={`loading-spinner ${className}`} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem'
    }}>
      <Loader2 
        size={spinnerSize} 
        style={{
          animation: 'spin 1s linear infinite',
          color: 'var(--primary)'
        }} 
      />
      {text && (
        <p className="muted" style={{
          margin: 0,
          fontSize: size === 'sm' ? '0.875rem' : '1rem'
        }}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {spinner}
      </div>
    )
  }

  return spinner
}

// Button loading state component
interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function LoadingButton({ 
  loading, 
  children, 
  disabled, 
  className = '',
  style,
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  )
}

// Page loading component
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "400px", margin: "2rem auto", textAlign: "center"}}>
          <LoadingSpinner size="lg" text={text} />
        </div>
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoading({ text }: { text?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '0.75rem'
    }}>
      <LoadingSpinner size="sm" text={text} />
    </div>
  )
}

// Card loading skeleton
export function CardSkeleton() {
  return (
    <div className="card" style={{padding: "1.5rem"}}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem"
      }}>
        <div style={{
          width: "60%",
          height: "1.5rem",
          backgroundColor: "var(--bg)",
          borderRadius: "4px",
          animation: "pulse 1.5s ease-in-out infinite"
        }}></div>
        <div style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "var(--bg)",
          borderRadius: "50%",
          animation: "pulse 1.5s ease-in-out infinite"
        }}></div>
      </div>
      <div style={{
        width: "40%",
        height: "1rem",
        backgroundColor: "var(--bg)",
        borderRadius: "4px",
        animation: "pulse 1.5s ease-in-out infinite"
      }}></div>
    </div>
  )
}

// Table loading skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="table">
        <thead>
          <tr>
            {Array.from({ length: 4 }).map((_, i) => (
              <th key={i}>
                <div style={{
                  width: "80%",
                  height: "1rem",
                  backgroundColor: "var(--bg)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div style={{
                    width: "90%",
                    height: "1rem",
                    backgroundColor: "var(--bg)",
                    borderRadius: "4px",
                    animation: "pulse 1.5s ease-in-out infinite"
                  }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  )
}
