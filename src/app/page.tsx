"use client"
import { useState, useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Enhanced validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Use the actual signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('auth-token', data.user.id)
        
        // Dispatch custom event for topbar update
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }))
        
        setSuccess("Account created successfully! Redirecting to dashboard...")
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map((err: any) => err.message).join(', '))
        } else {
          setError(data.message || 'Signup failed')
        }
      }

    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, router])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      // Use the actual login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('auth-token', data.user.id)
        
        // Dispatch custom event for topbar update
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }))
        
        setSuccess("Login successful! Redirecting to dashboard...")
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.message || 'Invalid email or password')
      }

    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, router])

  if (showSignup) {
    return (
      <section id="signup" className="card hero">
        <div className="container" style={{maxWidth: "600px"}}>
          <h1 style={{fontSize:"2rem",margin:".25rem 0",textAlign:"center"}}>Create Account</h1>
          <p className="muted" style={{textAlign:"center"}}>Join ChurchFlow to manage your church operations</p>
          
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>
            </div>
            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn primary"
              style={{width: "100%", marginBottom: "1rem"}}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <div style={{textAlign: "center"}}>
            <p style={{color: "var(--muted)", margin: "0"}}>
              Already have an account?{" "}
              <button 
                onClick={() => {setShowSignup(false); setShowLogin(true); setError(""); setSuccess("")}}
                style={{color: "var(--primary)", textDecoration: "none", background: "none", border: "none", cursor: "pointer"}}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (showLogin) {
    return (
      <section id="login" className="card hero">
        <div className="container" style={{maxWidth: "400px"}}>
          <h1 style={{fontSize:"2rem",margin:".25rem 0",textAlign:"center"}}>Welcome Back</h1>
          <p className="muted" style={{textAlign:"center"}}>Sign in to your ChurchFlow account</p>
          
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{marginBottom: "1.5rem"}}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group" style={{marginBottom: "1.5rem"}}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn primary"
              style={{width: "100%", marginBottom: "1rem"}}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div style={{textAlign: "center"}}>
            <p style={{color: "var(--muted)", margin: "0"}}>
              Don't have an account?{" "}
              <button 
                onClick={() => {setShowLogin(false); setShowSignup(true); setError(""); setSuccess("")}}
                style={{color: "var(--primary)", textDecoration: "none", background: "none", border: "none", cursor: "pointer"}}
              >
                Create one here
              </button>
            </p>
          </div>
          <div style={{marginTop: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "0.375rem"}}>
            <h3 style={{margin: "0 0 0.5rem 0", fontSize: "1rem"}}>Demo Credentials:</h3>
            <p style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>
              <strong>Email:</strong> admin@churchflow.com<br/>
              <strong>Password:</strong> admin123
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="card hero">
      <div className="container">
        <h1 style={{fontSize:"2.2rem",margin:".25rem 0"}}>Comprehensive Church Management System</h1>
        <p className="muted">Financial management, member tracking, event planning, and administration—all in one integrated platform.</p>
        <div style={{marginTop:"1rem",display:"flex",gap:".5rem",justifyContent:"center"}}>
          <button className="btn primary" onClick={() => setShowSignup(true)}>Get Started</button>
          <button className="btn secondary" onClick={() => setShowLogin(true)}>Log In</button>
        </div>
        <div style={{marginTop:"2rem"}} className="grid cols-3">
          <div className="card" style={{padding:"1rem"}}><small className="muted">Transparency</small><h3>Financial Tracking</h3><div className="muted">Complete offering and expense management</div></div>
          <div className="card" style={{padding:"1rem"}}><small className="muted">Efficiency</small><h3>Member Management</h3><div className="muted">Organized member database and communication</div></div>
          <div className="card" style={{padding:"1rem"}}><small className="muted">Growth</small><h3>Event Planning</h3><div className="muted">Schedule services and track attendance</div></div>
        </div>
      </div>
    </section>
  )
}