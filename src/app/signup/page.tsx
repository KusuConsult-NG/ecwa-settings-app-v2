"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User, Building } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      console.log('🚀 FRONTEND SIGNUP ATTEMPT:', formData)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('📡 FRONTEND SIGNUP RESPONSE:', data)

      if (data.success) {
        if (data.emailSent && !data.user.isEmailVerified) {
          // Redirect to email verification page
          router.push(`/verify-email?email=${encodeURIComponent(data.user.email)}`)
        } else {
          // Store user data in localStorage for client-side access
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Dispatch custom event for topbar update
          window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }))
          
          // Redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map((err: any) => err.message).join(', '))
        } else {
          setError(data.message || 'Signup failed')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "500px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <h2>Join ChurchFlow</h2>
            <p className="muted">Create your account to get started</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{marginBottom: "1rem"}}>
              {error}
            </div>
          )}

          {/* Debug: Show current form data - Client only to avoid hydration issues */}
          {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (
            <div style={{marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "4px", fontSize: "12px"}}>
              <strong>Debug - Form Data:</strong>
              <pre style={{margin: "0.25rem 0 0 0", fontSize: "11px"}}>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                <div style={{position: "relative"}}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    style={{paddingRight: "40px"}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted)",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{position: "relative"}}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    style={{paddingRight: "40px"}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted)",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn primary block"
              disabled={isLoading}
              style={{marginBottom: "1rem"}}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{textAlign: "center"}}>
            <p className="muted" style={{margin: "0 0 1rem 0"}}>
              Already have an account?{" "}
              <a href="/login" style={{color: "var(--primary)", textDecoration: "none"}}>
                Sign in here
              </a>
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
