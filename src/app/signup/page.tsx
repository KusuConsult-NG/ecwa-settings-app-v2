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
    role: "Member",
    organization: ""
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

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
        setError(data.message || 'Signup failed')
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

          <form onSubmit={handleSubmit}>
            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div style={{position: "relative"}}>
                  <User 
                    size={20} 
                    style={{
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--muted)",
                      zIndex: 1
                    }} 
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    style={{paddingLeft: "40px", position: "relative"}}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div style={{position: "relative"}}>
                  <Mail 
                    size={20} 
                    style={{
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--muted)",
                      zIndex: 1
                    }} 
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={{paddingLeft: "40px", position: "relative"}}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Member">Member</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Elder">Elder</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <div style={{position: "relative"}}>
                  <Building 
                    size={20} 
                    style={{
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--muted)",
                      zIndex: 1
                    }} 
                  />
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Church or organization name"
                    required
                    style={{paddingLeft: "40px", position: "relative"}}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div style={{position: "relative"}}>
                  <Lock 
                    size={20} 
                    style={{
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--muted)",
                      zIndex: 1
                    }} 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    style={{paddingLeft: "40px", paddingRight: "40px", position: "relative"}}
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
                  <Lock 
                    size={20} 
                    style={{
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--muted)",
                      zIndex: 1
                    }} 
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    style={{paddingLeft: "40px", paddingRight: "40px", position: "relative"}}
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
