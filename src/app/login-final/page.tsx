"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function FinalLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      console.log('🚀 Submitting login request...')
      const response = await fetch('/api/auth/login-final', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('📝 Login response:', data)

      if (data.success) {
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Dispatch custom event for topbar update
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }))
        
        // Show success message
        alert(`🎉 Login successful! Welcome back, ${data.user.name}!`)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('💥 Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{maxWidth: "400px", margin: "2rem auto", padding: "0 1rem"}}>
      <div className="card">
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <h1 style={{fontSize: "2rem", margin: "0 0 0.5rem 0", color: "var(--text)"}}>Welcome Back</h1>
          <p style={{color: "var(--muted)", margin: "0"}}>Sign in to your ChurchFlow account</p>
        </div>

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
            <a href="/signup-final" style={{color: "var(--primary)", textDecoration: "none"}}>
              Create one here
            </a>
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
    </div>
  )
}


