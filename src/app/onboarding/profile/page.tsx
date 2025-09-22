'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react'

function ProfileSetupPageContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const t = params.get('token') || ''
    const e = params.get('email') || ''
    setToken(t)
    setEmail(e)
  }, [params])

  async function submit() {
    if (!name || !password) {
      setMsg('Name and password are required')
      return
    }
    if (password !== confirm) {
      setMsg('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setMsg('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setMsg('Saving profile…')
    
    try {
      const r = await fetch('/api/users/profile-setup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, name, password })
      })
      const j = await r.json()
      
      if (!r.ok) {
        setMsg(j.error || 'Failed to save profile')
        return
      }

      setMsg('Profile saved successfully! Redirecting...')
      
      // Redirect to dashboard after successful setup
      setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
    } catch (error) {
      setMsg('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "460px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <User size={48} className="text-primary" style={{marginBottom: "1rem"}} />
            <h2>Set up your profile</h2>
            <p className="muted">Complete your account setup</p>
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
            <label>Full Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            onClick={submit}
            className="btn primary block"
            disabled={isLoading || !name || !password || !confirm}
            style={{marginBottom: "1rem"}}
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </button>

          {msg && (
            <div className={`alert ${msg.includes('error') || msg.includes('Failed') || msg.includes('match') || msg.includes('required') ? 'alert-error' : 'alert-success'}`}>
              {msg.includes('error') || msg.includes('Failed') || msg.includes('match') || msg.includes('required') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
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

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
          <div className="auth card" style={{maxWidth: "460px", margin: "2rem auto"}}>
            <div style={{textAlign: "center"}}>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProfileSetupPageContent />
    </Suspense>
  )
}
