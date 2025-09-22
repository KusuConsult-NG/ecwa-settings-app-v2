'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

function AcceptPageContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [inviteId, setInviteId] = useState('')
  const [code, setCode] = useState('')
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setEmail(params.get('email') || '')
    setInviteId(params.get('inviteId') || '')
  }, [params])

  async function verifyCode() {
    if (!code || code.length !== 6) {
      setMsg('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setMsg('Verifying code…')
    
    try {
      // Verify the code using the new magic link system
      const r = await fetch('/api/verify-invite-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const j = await r.json()
      
      if (!r.ok) {
        setMsg(j.message || 'Invalid code')
        return
      }
      
      setMsg('Code verified successfully! Redirecting to profile setup...')

      // Redirect to profile setup with invite data
      setTimeout(() => {
        router.replace(`/onboarding/profile?email=${encodeURIComponent(email)}&name=${encodeURIComponent(j.invite.name)}&org=${encodeURIComponent(j.invite.organizationName)}`)
      }, 1500)
    } catch (error) {
      setMsg('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "420px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <Mail size={48} className="text-primary" style={{marginBottom: "1rem"}} />
            <h2>Accept Invite</h2>
            <p className="muted">Enter the 6-digit code sent to your email</p>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              style={{backgroundColor: "#f5f5f5"}}
            />
          </div>

          <div className="form-group">
            <label>Verification Code</label>
            <input
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              maxLength={6}
              style={{textAlign: "center", fontSize: "1.2rem", letterSpacing: "0.5rem"}}
            />
          </div>

          <button
            onClick={verifyCode}
            className="btn primary block"
            disabled={isLoading || code.length !== 6}
            style={{marginBottom: "1rem"}}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          {msg && (
            <div className={`alert ${msg.includes('error') || msg.includes('Invalid') || msg.includes('failed') ? 'alert-error' : 'alert-success'}`}>
              {msg.includes('error') || msg.includes('Invalid') || msg.includes('failed') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span>{msg}</span>
            </div>
          )}

          <div style={{textAlign: "center", marginTop: "1rem"}}>
            <a href="/" className="btn ghost">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AcceptPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "420px", margin: "2rem auto"}}>
            <div style={{textAlign: "center"}}>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <AcceptPageContent />
    </Suspense>
  )
}
