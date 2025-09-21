"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, CreditCard, Calendar, MapPin, ArrowLeft, Plus } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function NewBankAccountPage() {
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: '',
    accountType: 'current' as 'savings' | 'current' | 'fixed_deposit' | 'investment',
    currency: 'NGN',
    openingDate: new Date().toISOString().split('T')[0],
    branch: '',
    swiftCode: '',
    iban: '',
    currentBalance: 0,
    authorizedSignatories: [] as string[],
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

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
    if (!formData.accountName || !formData.accountNumber || !formData.bankName || !formData.openingDate) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess("Bank account created successfully!")
        
        // Reset form
        setFormData({
          accountName: '',
          accountNumber: '',
          bankName: '',
          bankCode: '',
          accountType: 'current',
          currency: 'NGN',
          openingDate: new Date().toISOString().split('T')[0],
          branch: '',
          swiftCode: '',
          iban: '',
          currentBalance: 0,
          authorizedSignatories: [],
          notes: ''
        })

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/bank')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create bank account')
      }
    } catch (err) {
      setError('Failed to create bank account')
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
                Add New Bank Account
              </h1>
              <p className="muted" style={{margin: "0.25rem 0 0 0"}}>
                Register a new bank account for the church
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
                <label htmlFor="accountName">
                  <Building size={16} style={{marginRight: "0.5rem"}} />
                  Account Name *
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="e.g., ECWA Church Main Account"
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="accountNumber">
                  <CreditCard size={16} style={{marginRight: "0.5rem"}} />
                  Account Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="e.g., 1234567890"
                  required
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="bankName">Bank Name *</label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., First Bank of Nigeria"
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="bankCode">Bank Code</label>
                <input
                  type="text"
                  id="bankCode"
                  name="bankCode"
                  value={formData.bankCode}
                  onChange={handleChange}
                  placeholder="e.g., 011"
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="accountType">Account Type *</label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  required
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                  <option value="fixed_deposit">Fixed Deposit</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="currency">Currency *</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="openingDate">
                  <Calendar size={16} style={{marginRight: "0.5rem"}} />
                  Opening Date *
                </label>
                <input
                  type="date"
                  id="openingDate"
                  name="openingDate"
                  value={formData.openingDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="branch">
                  <MapPin size={16} style={{marginRight: "0.5rem"}} />
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g., Wuse 2 Branch"
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="swiftCode">SWIFT Code</label>
                <input
                  type="text"
                  id="swiftCode"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  placeholder="e.g., FBNINGLA"
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="iban">IBAN</label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                  placeholder="e.g., NG1234567890123456789012"
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="currentBalance">Current Balance *</label>
                <input
                  type="number"
                  id="currentBalance"
                  name="currentBalance"
                  value={formData.currentBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group" style={{flex: 1}}></div>
            </div>

            <div className="form-group" style={{marginBottom: "2rem"}}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about this account"
                rows={3}
              />
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
                {isLoading ? "Creating..." : "Create Bank Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

