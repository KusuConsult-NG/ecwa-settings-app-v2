"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function WorkingSignupPage() {
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

    // Validate all fields
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call with local storage
      const userData = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: "Member",
        organization: "ChurchFlow",
        created_at: new Date().toISOString(),
        is_email_verified: true
      }

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('auth-token', userData.id)
      
      // Dispatch custom event for topbar update
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }))
      
      setSuccess("Account created successfully! Redirecting to dashboard...")
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Signup error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{maxWidth: "600px", margin: "2rem auto", padding: "0 1rem"}}>
      <div className="card">
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <h1 style={{fontSize: "2rem", margin: "0 0 0.5rem 0", color: "var(--text)"}}>Create Account</h1>
          <p style={{color: "var(--muted)", margin: "0"}}>Join ChurchFlow to manage your church operations</p>
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
            <a href="/login-working" style={{color: "var(--primary)", textDecoration: "none"}}>
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}