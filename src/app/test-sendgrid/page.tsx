"use client"
import { useState } from "react"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"

export default function TestSendGridPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [config, setConfig] = useState<any>(null)

  const handleTestSendGrid = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponseMessage(null)

    try {
      const res = await fetch('/api/test-sendgrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        setResponseMessage({ 
          type: 'success', 
          message: data.message 
        })
        setConfig(data.config)
      } else {
        setResponseMessage({ type: 'error', message: data.message || 'Failed to test SendGrid.' })
      }
    } catch (error: any) {
      setResponseMessage({ type: 'error', message: `Network error: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{maxWidth: "600px", margin: "2rem auto"}}>
      <div className="card">
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <Mail size={48} className="text-primary" style={{marginBottom: "1rem"}} />
          <h2 style={{margin: "0 0 0.5rem 0"}}>Test SendGrid Configuration</h2>
          <p className="muted">Debug SendGrid email sending issues</p>
        </div>

        {responseMessage && (
          <div className={`alert alert-${responseMessage.type}`} style={{marginBottom: "1.5rem"}}>
            {responseMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{responseMessage.message}</span>
          </div>
        )}

        {config && (
          <div style={{marginBottom: "1.5rem", padding: "1rem", backgroundColor: "var(--bg)", borderRadius: "8px", border: "1px solid var(--line)"}}>
            <h4 style={{margin: "0 0 1rem 0"}}>Configuration Status:</h4>
            <div style={{display: "grid", gap: "0.5rem"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>SendGrid API Key:</span>
                <span style={{color: config.sendgridApiKey === 'Set' ? 'var(--success)' : 'var(--error)'}}>
                  {config.sendgridApiKey}
                </span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>SendGrid From Email:</span>
                <span style={{color: config.sendgridFromEmail !== 'Not set' ? 'var(--success)' : 'var(--warning)'}}>
                  {config.sendgridFromEmail}
                </span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>Node Environment:</span>
                <span>{config.nodeEnv}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleTestSendGrid}>
          <div className="form-group">
            <label htmlFor="email">Test Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., test@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="btn primary block"
            disabled={isLoading}
            style={{marginTop: "1.5rem"}}
          >
            {isLoading ? (
              <>
                <Send size={16} style={{marginRight: "0.5rem"}} />
                Testing...
              </>
            ) : (
              <>
                <Send size={16} style={{marginRight: "0.5rem"}} />
                Test SendGrid
              </>
            )}
          </button>
        </form>

        <div style={{marginTop: "2rem", padding: "1rem", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.2)"}}>
          <h4 style={{margin: "0 0 1rem 0", color: "var(--primary)"}}>🔧 Debug Information:</h4>
          <ol style={{margin: "0", paddingLeft: "1.5rem"}}>
            <li>Check the browser console for detailed logs</li>
            <li>Verify SendGrid API key is set in environment variables</li>
            <li>Check if the email appears in your SendGrid dashboard</li>
            <li>Look for any error messages in the server logs</li>
          </ol>
        </div>

        <div style={{marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(251, 191, 36, 0.1)", borderRadius: "8px", border: "1px solid rgba(251, 191, 36, 0.2)"}}>
          <h4 style={{margin: "0 0 0.5rem 0", color: "var(--warning)"}}>⚠️ Common Issues:</h4>
          <ul style={{margin: "0", paddingLeft: "1.5rem"}}>
            <li>SendGrid API key not set in environment variables</li>
            <li>From email not verified in SendGrid dashboard</li>
            <li>Rate limiting or account restrictions</li>
            <li>Invalid email format or blocked recipient</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
