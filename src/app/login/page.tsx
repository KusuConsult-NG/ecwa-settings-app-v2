"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log('🚀 FRONTEND LOGIN ATTEMPT:', formData)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('📡 FRONTEND LOGIN RESPONSE:', data)

      if (data.success) {
        setSuccess("Login successful! Redirecting to dashboard...")
        
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('auth-token', data.user.id)
        
        // Dispatch custom event for topbar update
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }))
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDemoLogin = () => {
    setFormData({
      email: "admin@churchflow.com",
      password: "admin123"
    })
  }

  return (
    <div className="container">
      <div className="hero" style={{minHeight: "calc(100vh - 56px)"}}>
        <div className="auth card" style={{maxWidth: "400px", margin: "2rem auto"}}>
          <div style={{textAlign: "center", marginBottom: "2rem"}}>
            <h2>Welcome Back</h2>
            <p className="muted">Sign in to your ChurchFlow account</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{marginBottom: "1rem"}}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{marginBottom: "1rem"}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <div style={{position: "relative"}}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="btn primary block"
              disabled={isLoading}
              style={{marginBottom: "1rem"}}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn secondary"
              style={{marginBottom: "1rem"}}
            >
              Use Demo Credentials
            </button>
            <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>
              <p><strong>Demo Login:</strong></p>
              <p>Email: admin@churchflow.com</p>
              <p>Password: admin123</p>
            </div>
          </div>

          <div style={{textAlign: "center"}}>
            <p className="muted" style={{margin: "0 0 1rem 0"}}>
              Don't have an account?{" "}
              <a href="/signup" style={{color: "var(--primary)", textDecoration: "none"}}>
                Sign up here
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
