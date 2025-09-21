"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

function VerifyEmailContent() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Email verified successfully! Redirecting to dashboard...")
        setIsVerified(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setMessage(data.message || 'Verification failed')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setMessage("")

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Verification email sent successfully!")
      } else {
        setMessage(data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "400px", margin: "2rem auto", textAlign: "center"}}>
            <CheckCircle size={64} style={{color: "var(--success)", margin: "0 auto 1rem"}} />
            <h2 style={{color: "var(--success)", marginBottom: "1rem"}}>Email Verified!</h2>
            <p className="muted">Your email has been successfully verified. You will be redirected to the dashboard shortly.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "400px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <Mail size={48} style={{color: "var(--primary)", margin: "0 auto 1rem"}} />
            <h2>Verify Your Email</h2>
            <p className="muted">
              We've sent a 6-digit verification code to<br />
              <strong>{email || 'your email address'}</strong>
            </p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: "1rem"}}>
              {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="form-group" style={{marginBottom: "1.5rem"}}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={!!searchParams.get('email')}
              />
            </div>

            <div className="form-group" style={{marginBottom: "1.5rem"}}>
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                style={{textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem"}}
              />
            </div>

            <button
              type="submit"
              className="btn primary block"
              disabled={isLoading || code.length !== 6}
              style={{marginBottom: "1rem"}}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div style={{textAlign: "center"}}>
            <p className="muted" style={{margin: "0 0 1rem 0"}}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isResending || !email}
              className="btn ghost"
              style={{marginBottom: "1rem"}}
            >
              {isResending ? (
                <>
                  <RefreshCw size={16} style={{animation: "spin 1s linear infinite"}} />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </button>
            <br />
            <a href="/login" className="btn ghost">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "400px", margin: "2rem auto", textAlign: "center"}}>
            <div style={{padding: "2rem"}}>
              <RefreshCw size={48} style={{color: "var(--primary)", margin: "0 auto 1rem", animation: "spin 1s linear infinite"}} />
              <h2>Loading...</h2>
              <p className="muted">Please wait while we load the verification page.</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
