"use client"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic';

export default function ResetPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Error sending reset email:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container" style={{maxWidth: "500px", margin: "2rem auto"}}>
        <div className="card" style={{textAlign: "center", padding: "3rem 2rem"}}>
          <CheckCircle size={64} className="text-success" style={{marginBottom: "1.5rem"}} />
          <h2 style={{margin: "0 0 1rem 0", color: "var(--success)"}}>Reset Email Sent</h2>
          <p style={{margin: "0 0 1.5rem 0", color: "var(--muted)", lineHeight: "1.6"}}>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your email and click the link to reset your password.
          </p>
          <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
            <button 
              className="btn primary"
              onClick={() => {
                setSubmitted(false)
                setEmail("")
              }}
            >
              Send Another Email
            </button>
            <a href="/login" className="btn secondary">
              <ArrowLeft size={16} style={{marginRight: "0.5rem"}} />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{maxWidth: "500px", margin: "2rem auto"}}>
      <div className="card" style={{padding: "2rem"}}>
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto"
          }}>
            <Mail size={32} style={{color: "white"}} />
          </div>
          <h2 style={{margin: "0 0 0.5rem 0"}}>Reset Your Password</h2>
          <p className="muted" style={{margin: 0, lineHeight: "1.6"}}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div style={{
            padding: "1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertCircle size={16} className="text-danger" />
            <span style={{color: "var(--danger)", fontSize: "0.875rem"}}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: "1.5rem"}}>
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
              style={{marginBottom: "0.5rem"}}
            />
            <p style={{margin: 0, fontSize: "0.875rem", color: "var(--muted)"}}>
              We'll send a password reset link to this email address.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn primary"
              disabled={loading || !email.trim()}
              style={{width: "100%"}}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <div style={{textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)"}}>
          <p style={{margin: "0 0 1rem 0", fontSize: "0.875rem", color: "var(--muted)"}}>
            Remember your password?
          </p>
          <a href="/login" className="btn secondary">
            <ArrowLeft size={16} style={{marginRight: "0.5rem"}} />
            Back to Login
          </a>
        </div>
      </div>

      {/* Help Section */}
      <div className="card" style={{marginTop: "1.5rem", padding: "1.5rem"}}>
        <h4 style={{margin: "0 0 1rem 0"}}>Need Help?</h4>
        <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)"
            }}></div>
            <span style={{fontSize: "0.875rem"}}>
              Check your spam folder if you don't see the email
            </span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)"
            }}></div>
            <span style={{fontSize: "0.875rem"}}>
              The reset link will expire in 24 hours
            </span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)"
            }}></div>
            <span style={{fontSize: "0.875rem"}}>
              Contact support if you continue to have issues
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
