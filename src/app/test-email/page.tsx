"use client"
import { useState } from "react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Test Email Sending</h2>
        <p className="muted">Test if email invitations are working properly</p>

        {message && (
          <div className={`alert alert-${message.type}`} style={{marginBottom: '1rem'}}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleTestEmail}>
          <div className="form-group" style={{marginBottom: '1rem'}}>
            <label htmlFor="email">Test Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test"
              required
            />
          </div>

          <div className="form-group" style={{marginBottom: '1rem'}}>
            <label htmlFor="name">Test Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name to test"
              required
            />
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={isLoading}
          >
            {isLoading ? "Sending Test Email..." : "Send Test Email"}
          </button>
        </form>

        <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px'}}>
          <h4>Setup Instructions:</h4>
          <ol>
            <li><strong>Enable 2FA</strong> on your Google account</li>
            <li><strong>Generate App Password</strong> in Google Account settings</li>
            <li><strong>Update .env.local</strong> with your Gmail credentials:
              <pre style={{backgroundColor: '#1f2937', color: '#f9fafb', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem'}}>
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
              </pre>
            </li>
            <li><strong>Restart your development server</strong></li>
            <li><strong>Test email sending</strong> using the form above</li>
          </ol>
        </div>

        <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px'}}>
          <h4>Current Configuration:</h4>
          <p><strong>Gmail User:</strong> {process.env.GMAIL_USER || 'Not set'}</p>
          <p><strong>Gmail App Password:</strong> {process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Not set'}</p>
          <p><strong>SendGrid API Key:</strong> {process.env.SENDGRID_API_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </div>
    </div>
  )
}

