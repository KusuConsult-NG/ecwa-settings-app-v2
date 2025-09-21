"use client"
import { useState } from "react"
import { Key, Mail, ArrowLeft } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email')
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage("Please enter your email address")
      return
    }

    try {
      setLoading(true)
      // In a real app, this would send reset email
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Reset code sent to your email address")
      setStep('code')
    } catch (error) {
      setMessage("Failed to send reset code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetCode) {
      setMessage("Please enter the reset code")
      return
    }

    try {
      setLoading(true)
      // In a real app, this would verify the code
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Code verified successfully")
      setStep('password')
    } catch (error) {
      setMessage("Invalid reset code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      // In a real app, this would reset the password
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Password reset successfully! You can now log in with your new password.")
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      setMessage("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <h2>Reset Password</h2>
            <p className="muted">Enter your email to receive a reset code</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: "1rem"}}>
              {message}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} style={{marginRight: "0.5rem"}} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn primary"
                disabled={loading}
                style={{width: "100%", marginBottom: "1rem"}}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div style={{textAlign: "center"}}>
                <a href="/login" className="btn ghost">
                  <ArrowLeft size={16} style={{marginRight: "0.5rem"}} />
                  Back to Login
                </a>
              </div>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit}>
              <div className="form-group">
                <label htmlFor="code">
                  <Key size={16} style={{marginRight: "0.5rem"}} />
                  Reset Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter the 6-digit code sent to your email"
                  required
                />
                <p style={{fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.5rem"}}>
                  Check your email for the reset code. It may take a few minutes to arrive.
                </p>
              </div>

              <button
                type="submit"
                className="btn primary"
                disabled={loading}
                style={{width: "100%", marginBottom: "1rem"}}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <div style={{textAlign: "center"}}>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="btn ghost"
                >
                  <ArrowLeft size={16} style={{marginRight: "0.5rem"}} />
                  Back to Email
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">
                  <Key size={16} style={{marginRight: "0.5rem"}} />
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn primary"
                disabled={loading}
                style={{width: "100%", marginBottom: "1rem"}}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div style={{textAlign: "center"}}>
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="btn ghost"
                >
                  <ArrowLeft size={16} style={{marginRight: "0.5rem"}} />
                  Back to Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

