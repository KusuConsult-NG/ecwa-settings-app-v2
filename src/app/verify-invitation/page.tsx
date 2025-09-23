"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle, Mail, Lock, User } from "lucide-react"

function VerifyInvitationContent() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email and code from URL parameters
    const urlCode = searchParams.get('code')
    const urlEmail = searchParams.get('email')
    
    if (urlCode) setCode(urlCode)
    if (urlEmail) setEmail(urlEmail)
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/verify-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setUser(data.user)
        
        // Redirect to profile setup after 3 seconds
        setTimeout(() => {
          router.push('/update-profile')
        }, 3000)
      } else {
        setError(data.message || 'Invalid verification code')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    try {
      const response = await fetch('/api/resend-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        alert('New verification code sent to your email!')
      } else {
        setError(data.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Resend error:', error)
      setError('Failed to resend code. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto"}}>
            <div style={{textAlign: "center", marginBottom: "2rem"}}>
              <CheckCircle size={64} className="text-success" style={{marginBottom: "1rem"}} />
              <h2>Verification Successful!</h2>
              <p className="muted">Welcome to ChurchFlow, {user?.name || 'User'}!</p>
            </div>

            <div className="alert alert-success" style={{marginBottom: "1.5rem"}}>
              <CheckCircle size={20} />
              <span>Your invitation has been verified successfully. You will be redirected to complete your profile setup.</span>
            </div>

            <div style={{textAlign: "center"}}>
              <p className="muted">Redirecting to profile setup in 3 seconds...</p>
              <button 
                onClick={() => router.push('/update-profile')}
                className="btn primary"
                style={{marginTop: "1rem"}}
              >
                Go to Profile Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <Mail size={48} className="text-primary" style={{marginBottom: "1rem"}} />
            <h2>Verify Your Invitation</h2>
            <p className="muted">Enter the 6-digit code sent to your email</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{marginBottom: "1rem"}}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={!!searchParams.get('email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                style={{textAlign: "center", fontSize: "1.2rem", letterSpacing: "0.5rem"}}
              />
            </div>

            <button
              type="submit"
              className="btn primary block"
              disabled={isLoading || code.length !== 6}
              style={{marginBottom: "1rem"}}
            >
              {isLoading ? "Verifying..." : "Verify Invitation"}
            </button>
          </form>

          <div style={{textAlign: "center"}}>
            <p className="muted" style={{margin: "0 0 1rem 0"}}>
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                Resend Code
              </button>
            </p>
            <a href="/" className="btn ghost">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyInvitationPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto"}}>
            <div style={{textAlign: "center"}}>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyInvitationContent />
    </Suspense>
  )
}

