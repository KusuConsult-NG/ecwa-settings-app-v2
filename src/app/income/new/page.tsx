"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, FileText, User, Building, ArrowLeft, Plus } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const INCOME_SOURCES = [
  "Tithe",
  "Offering", 
  "Donation",
  "Special Offering",
  "Building Fund",
  "Mission Fund",
  "Youth Fund",
  "Women Fund",
  "Men Fund",
  "Children Fund",
  "Other"
]

export default function NewIncomePage() {
  const [formData, setFormData] = useState({
    ref: "",
    source: "Tithe",
    giver: "",
    narration: "",
    amount: "",
    bankRef: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const generateRef = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INC-${year}${month}${day}${random}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.ref || !formData.source || !formData.giver || !formData.narration || !formData.amount || !formData.bankRef) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: formData.ref.trim(),
          source: formData.source.trim(),
          giver: formData.giver.trim(),
          narration: formData.narration.trim(),
          amount: Number(formData.amount),
          bankRef: formData.bankRef.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record income')
      }

      setSuccess("Income recorded successfully!")
      
      // Reset form
      setFormData({
        ref: generateRef(),
        source: "Tithe",
        giver: "",
        narration: "",
        amount: "",
        bankRef: ""
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/income')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="hero">
        <div className="card">
          <div style={{display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem"}}>
            <button 
              onClick={() => router.back()}
              className="btn ghost"
              style={{padding: "0.5rem"}}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{margin: 0, display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Plus size={24} />
                Record New Income
              </h1>
              <p className="muted" style={{margin: "0.25rem 0 0 0"}}>
                Record a new income entry for the church
              </p>
            </div>
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
            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="ref">
                  <FileText size={16} style={{marginRight: "0.5rem"}} />
                  Reference Number *
                </label>
                <input
                  type="text"
                  id="ref"
                  name="ref"
                  value={formData.ref}
                  onChange={handleChange}
                  placeholder="e.g., INC-20240918001"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, ref: generateRef()}))}
                  className="btn ghost"
                  style={{marginTop: "0.5rem", fontSize: "0.875rem"}}
                >
                  Generate New Ref
                </button>
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="source">
                  <Building size={16} style={{marginRight: "0.5rem"}} />
                  Source *
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  {INCOME_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="giver">
                  <User size={16} style={{marginRight: "0.5rem"}} />
                  Giver *
                </label>
                <input
                  type="text"
                  id="giver"
                  name="giver"
                  value={formData.giver}
                  onChange={handleChange}
                  placeholder="e.g., John A."
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="amount">
                  <DollarSign size={16} style={{marginRight: "0.5rem"}} />
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="narration">Narration *</label>
                <input
                  type="text"
                  id="narration"
                  name="narration"
                  value={formData.narration}
                  onChange={handleChange}
                  placeholder="e.g., September tithe"
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="bankRef">Bank Reference *</label>
                <input
                  type="text"
                  id="bankRef"
                  name="bankRef"
                  value={formData.bankRef}
                  onChange={handleChange}
                  placeholder="e.g., TRX-71011"
                  required
                />
              </div>
            </div>

            <div className="btn-group" style={{justifyContent: "flex-end"}}>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={isLoading}
              >
                {isLoading ? "Recording..." : "Record Income"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

