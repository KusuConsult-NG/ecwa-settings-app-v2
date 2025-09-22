"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!email) return
    
    setIsVerifying(true)
    setError("")
    
    try {
      // Simulate resending verification email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`📧 Verification email resent to: ${email}`)
      console.log(`🔗 New verification link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/verify-email?token=verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
      
      // Show success message instead of auto-verifying
      alert(`Verification email resent to ${email}. Check the console for the verification link.`)
    } catch (error) {
      setError('Failed to resend verification email. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyWithCode = async () => {
    const code = prompt('Enter the 6-digit verification code sent to your email:')
    if (!code) return
    
    setIsVerifying(true)
    setError("")
    
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any 6-digit code
      if (code.length === 6 && /^\d+$/.test(code)) {
        setIsVerified(true)
        console.log(`✅ Email verified with code: ${code}`)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerified) {
    return (
      <div className="container" style={{maxWidth: "500px", margin: "2rem auto"}}>
        <div className="card" style={{textAlign: "center", padding: "3rem 2rem"}}>
          <CheckCircle size={64} className="text-success" style={{marginBottom: "1.5rem"}} />
          <h2 style={{margin: "0 0 1rem 0", color: "var(--success)"}}>Email Verified!</h2>
          <p style={{margin: "0 0 1.5rem 0", color: "var(--muted)", lineHeight: "1.6"}}>
            Your email address has been successfully verified. You can now access all features of the application.
          </p>
          <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
            <button 
              className="btn primary"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
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
          <h2 style={{margin: "0 0 0.5rem 0"}}>Verify Your Email</h2>
          <p className="muted" style={{margin: 0, lineHeight: "1.6"}}>
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your email and click the link to verify your account.
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

        <div style={{display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem"}}>
          <button
            className="btn primary"
            onClick={handleResendVerification}
            disabled={isVerifying}
          >
            {isVerifying ? "Sending..." : "Resend Verification Email"}
          </button>
          
          <button
            className="btn secondary"
            onClick={handleVerifyWithCode}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify with Code"}
          </button>
        </div>

        <div style={{textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)"}}>
          <p style={{margin: "0 0 1rem 0", fontSize: "0.875rem", color: "var(--muted)"}}>
            Didn't receive the email?
          </p>
          <a href="/login" className="btn ghost">
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
              The verification link will expire in 24 hours
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{maxWidth: "500px", margin: "2rem auto"}}>
        <div className="card" style={{textAlign: "center", padding: "3rem 2rem"}}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}