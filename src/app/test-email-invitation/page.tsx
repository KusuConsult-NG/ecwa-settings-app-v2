"use client"
import { useState } from "react"
import { Mail, User, Building, Send, CheckCircle } from "lucide-react"

export default function TestEmailInvitationPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    organizationName: "ECWA Test Organization",
    inviterName: "Admin User"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        console.log('📧 Email invitation sent:', data)
      } else {
        setError(data.message || 'Failed to send invitation')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error sending invitation:', err)
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

  return (
    <div className="container" style={{maxWidth: "600px", margin: "2rem auto"}}>
      <div className="card">
        <div className="card-header">
          <h1 style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <Mail size={24} />
            Test Email Invitation
          </h1>
          <p className="muted">
            Test the email invitation system. In development mode, emails are logged to the console.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{marginBottom: "1rem"}}>
            {error}
          </div>
        )}

        {result && (
          <div className="alert alert-success" style={{marginBottom: "1rem"}}>
            <CheckCircle size={16} style={{marginRight: "0.5rem"}} />
            <strong>Invitation sent successfully!</strong>
            <div style={{marginTop: "0.5rem", fontSize: "0.875rem"}}>
              <p><strong>Email:</strong> {result.data.email}</p>
              <p><strong>Auth Code:</strong> {result.data.authCode}</p>
              <p><strong>Sent At:</strong> {new Date(result.data.sentAt).toLocaleString()}</p>
            </div>
            <div style={{marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "0.75rem"}}>
              <strong>Check the browser console for the full email details!</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{marginBottom: "1.5rem"}}>
            <label htmlFor="email">
              <Mail size={16} style={{marginRight: "0.5rem"}} />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group" style={{marginBottom: "1.5rem"}}>
            <label htmlFor="name">
              <User size={16} style={{marginRight: "0.5rem"}} />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group" style={{marginBottom: "1.5rem"}}>
            <label htmlFor="organizationName">
              <Building size={16} style={{marginRight: "0.5rem"}} />
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Enter organization name"
            />
          </div>

          <div className="form-group" style={{marginBottom: "1.5rem"}}>
            <label htmlFor="inviterName">
              <User size={16} style={{marginRight: "0.5rem"}} />
              Inviter Name
            </label>
            <input
              type="text"
              id="inviterName"
              name="inviterName"
              value={formData.inviterName}
              onChange={handleChange}
              placeholder="Enter inviter name"
            />
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={isLoading}
            style={{width: "100%"}}
          >
            {isLoading ? (
              <>
                <div className="loading" style={{marginRight: "0.5rem"}}></div>
                Sending Invitation...
              </>
            ) : (
              <>
                <Send size={16} style={{marginRight: "0.5rem"}} />
                Send Test Invitation
              </>
            )}
          </button>
        </form>

        <div style={{marginTop: "2rem", padding: "1rem", backgroundColor: "var(--bg)", borderRadius: "8px", border: "1px solid var(--line)"}}>
          <h4 style={{margin: "0 0 1rem 0"}}>How to Test:</h4>
          <ol style={{margin: "0", paddingLeft: "1.5rem"}}>
            <li>Fill in the form above with a real email address</li>
            <li>Click "Send Test Invitation"</li>
            <li>Check the recipient's email inbox for the invitation</li>
            <li>The auth code will be displayed in the success message</li>
            <li>Use the auth code to verify the invitation</li>
          </ol>
        </div>

        <div style={{marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)"}}>
          <h4 style={{margin: "0 0 0.5rem 0", color: "var(--success)"}}>✅ Real Email Sending Enabled!</h4>
          <p style={{margin: "0", fontSize: "0.875rem"}}>
            SendGrid API key is configured. Emails will be sent to the actual email addresses provided.
            Check the recipient's inbox for the invitation email.
          </p>
        </div>
      </div>
    </div>
  )
}
