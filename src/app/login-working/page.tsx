"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function WorkingLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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
    setSuccess("")

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      // Check for demo credentials
      if (formData.email === "admin@churchflow.com" && formData.password === "admin123") {
        const userData = {
          id: "admin_1",
          name: "Admin User",
          email: "admin@churchflow.com",
          role: "Admin",
          organization: "ChurchFlow",
          created_at: new Date().toISOString(),
          is_email_verified: true
        }

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('auth-token', userData.id)
        
        // Dispatch custom event for topbar update
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }))
        
        setSuccess("Login successful! Redirecting to dashboard...")
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        // Check if user exists in localStorage (from signup)
        const existingUser = localStorage.getItem('user')
        if (existingUser) {
          const user = JSON.parse(existingUser)
          if (user.email === formData.email) {
            // Store auth token
            localStorage.setItem('auth-token', user.id)
            
            // Dispatch custom event for topbar update
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }))
            
            setSuccess("Login successful! Redirecting to dashboard...")
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            setError("Invalid email or password")
          }
        } else {
          setError("Invalid email or password")
        }
      }

    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
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
            <a href="/signup-working" style={{color: "var(--primary)", textDecoration: "none"}}>
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