"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyLoginPage() {
  const [authCode, setAuthCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!authCode.trim()) {
      setError('Please enter the authentication code')
      setIsLoading(false)
      return
    }

    try {
      // Get email from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email') || localStorage.getItem('inviteEmail')
      
      if (!email) {
        setError('No email found. Please use the invitation link from your email.')
        setIsLoading(false)
        return
      }

      // Verify the auth code with the API
      const response = await fetch(`/api/invite?email=${encodeURIComponent(email)}&code=${authCode}`)
      const data = await response.json()

      if (data.success) {
        setSuccess('Authentication successful! Redirecting to profile setup...')
        
        // Store user data for profile setup
        localStorage.setItem('inviteEmail', email)
        localStorage.setItem('inviteName', data.data.name)
        
        setTimeout(() => {
          router.push('/update-profile')
        }, 2000)
      } else {
        setError(data.message || 'Invalid authentication code. Please check your email and try again.')
      }
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setIsLoading(true)
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('New authentication code sent to your email')
    } catch (error) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <img src="/logo.svg" alt="ChurchFlow" width="48" height="48" />
            <h1>ChurchFlow</h1>
          </div>
          <h2>Verify Your Access</h2>
          <p className="muted">
            Enter the authentication code sent to your email address to complete your login.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <strong>Success:</strong> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="authCode">Authentication Code</label>
            <input
              type="text"
              id="authCode"
              name="authCode"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="code-input"
              required
            />
            <small className="form-help">
              Check your email for the 6-digit authentication code
            </small>
          </div>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="muted">
            Didn't receive the code?{' '}
            <button
              type="button"
              className="link-button"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend Code
            </button>
          </p>
          
          <div className="demo-info">
            <h4>Demo Mode</h4>
            <p>For testing purposes, use any 6-digit code or "123456"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
