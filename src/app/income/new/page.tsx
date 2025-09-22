"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, FileText, User, Building, ArrowLeft, Plus, AlertTriangle, CheckCircle, Building2, CreditCard } from "lucide-react"

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

interface BankAccount {
  id: string
  name: string
  bank: string
  accountNumber: string
  balance: number
}

interface BankTransaction {
  id: string
  accountId: string
  reference: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  date: string
  status: 'pending' | 'verified' | 'rejected'
}

export default function NewIncomePage() {
  const [step, setStep] = useState(1) // 1: Select Bank Transaction, 2: Add Income Details
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null)
  const [formData, setFormData] = useState({
    source: "Tithe",
    giver: "",
    narration: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadBankData()
  }, [])

  const loadBankData = async () => {
    try {
      setIsLoading(true)
      // Simulate loading bank accounts and transactions
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock bank accounts
      const accounts: BankAccount[] = [
        {
          id: "1",
          name: "Main Church Account",
          bank: "First Bank of Nigeria",
          accountNumber: "****1234",
          balance: 2500000
        },
        {
          id: "2",
          name: "Building Fund Account",
          bank: "Access Bank",
          accountNumber: "****5678",
          balance: 1800000
        }
      ]
      
      // Mock bank transactions (credit transactions that could be income)
      const transactions: BankTransaction[] = [
        {
          id: "1",
          accountId: "1",
          reference: "TRX-71011",
          amount: 50000,
          type: "credit",
          description: "Transfer from John A.",
          date: "2024-01-20",
          status: "pending"
        },
        {
          id: "2",
          accountId: "1",
          reference: "TRX-71012",
          amount: 25000,
          type: "credit",
          description: "Cash deposit - Tithe",
          date: "2024-01-20",
          status: "pending"
        },
        {
          id: "3",
          accountId: "2",
          reference: "TRX-71013",
          amount: 100000,
          type: "credit",
          description: "Building fund donation",
          date: "2024-01-19",
          status: "pending"
        },
        {
          id: "4",
          accountId: "1",
          reference: "TRX-71014",
          amount: 15000,
          type: "credit",
          description: "Youth offering",
          date: "2024-01-19",
          status: "verified"
        }
      ]
      
      setBankAccounts(accounts)
      setBankTransactions(transactions.filter(t => t.status === 'pending'))
    } catch (error) {
      console.error('Error loading bank data:', error)
      setError('Failed to load bank data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionSelect = (transaction: BankTransaction) => {
    setSelectedTransaction(transaction)
    setStep(2)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTransaction) return
    
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.source || !formData.giver || !formData.narration) {
      setError("All fields are required")
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
          bankTransactionId: selectedTransaction.id,
          source: formData.source.trim(),
          giver: formData.giver.trim(),
          narration: formData.narration.trim(),
          amount: selectedTransaction.amount,
          bankRef: selectedTransaction.reference
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record income')
      }

      setSuccess("Income recorded successfully and bank transaction verified!")
      
      // Reset form
      setFormData({
        source: "Tithe",
        giver: "",
        narration: ""
      })
      setSelectedTransaction(null)
      setStep(1)

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
                {step === 1 
                  ? "Select a bank transaction to record as income"
                  : "Add income details for the selected transaction"
                }
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="alert" style={{
            backgroundColor: "rgba(234, 179, 8, 0.1)",
            border: "1px solid var(--warning)",
            color: "var(--warning)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Security Notice:</strong> Income can only be recorded from verified bank transactions to prevent fraud. 
              All income must be backed by actual bank deposits.
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

          {/* Step 1: Select Bank Transaction */}
          {step === 1 && (
            <div>
              <h3 style={{marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Building2 size={20} />
                Select Bank Transaction
              </h3>
              <p className="muted" style={{marginBottom: "1.5rem"}}>
                Choose a pending credit transaction from your bank accounts to record as income.
              </p>

              {isLoading ? (
                <div style={{textAlign: "center", padding: "2rem"}}>
                  <div className="loading">Loading bank transactions...</div>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bank Account</th>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankTransactions.map((transaction) => {
                        const account = bankAccounts.find(a => a.id === transaction.accountId)
                        return (
                          <tr key={transaction.id}>
                            <td>
                              <div style={{fontWeight: "500"}}>{account?.name}</div>
                              <small className="muted">{account?.bank} - {account?.accountNumber}</small>
                            </td>
                            <td style={{fontFamily: "monospace"}}>{transaction.reference}</td>
                            <td style={{fontWeight: "600", color: "var(--success)"}}>
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td>{transaction.description}</td>
                            <td>{formatDate(transaction.date)}</td>
                            <td>
                              <button
                                className="btn btn-sm primary"
                                onClick={() => handleTransactionSelect(transaction)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {bankTransactions.length === 0 && !isLoading && (
                <div style={{textAlign: "center", padding: "2rem"}}>
                  <CreditCard size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
                  <h3 style={{margin: "0 0 0.5rem 0"}}>No Pending Transactions</h3>
                  <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
                    There are no pending credit transactions available for income recording.
                  </p>
                  <button 
                    className="btn secondary"
                    onClick={loadBankData}
                  >
                    Refresh Transactions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Add Income Details */}
          {step === 2 && selectedTransaction && (
            <div>
              <h3 style={{marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <CheckCircle size={20} />
                Add Income Details
              </h3>
              
              {/* Selected Transaction Summary */}
              <div className="card" style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--line)",
                marginBottom: "1.5rem"
              }}>
                <h4 style={{margin: "0 0 0.5rem 0"}}>Selected Transaction</h4>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem"}}>
                  <div>
                    <small className="muted">Reference</small>
                    <div style={{fontFamily: "monospace", fontWeight: "500"}}>{selectedTransaction.reference}</div>
                  </div>
                  <div>
                    <small className="muted">Amount</small>
                    <div style={{fontWeight: "600", color: "var(--success)"}}>
                      {formatCurrency(selectedTransaction.amount)}
                    </div>
                  </div>
                  <div>
                    <small className="muted">Date</small>
                    <div>{formatDate(selectedTransaction.date)}</div>
                  </div>
                  <div>
                    <small className="muted">Description</small>
                    <div>{selectedTransaction.description}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row" style={{marginBottom: "1.5rem"}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label htmlFor="source">
                      <Building size={16} style={{marginRight: "0.5rem"}} />
                      Income Source *
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

                  <div className="form-group" style={{flex: 1}}>
                    <label htmlFor="giver">
                      <User size={16} style={{marginRight: "0.5rem"}} />
                      Giver/Donor *
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
                </div>

                <div className="form-group" style={{marginBottom: "1.5rem"}}>
                  <label htmlFor="narration">Additional Details/Narration *</label>
                  <textarea
                    id="narration"
                    name="narration"
                    value={formData.narration}
                    onChange={handleChange}
                    placeholder="e.g., September tithe from John A."
                    rows={3}
                    required
                  />
                </div>

                <div className="btn-group" style={{justifyContent: "space-between"}}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn secondary"
                    disabled={isLoading}
                  >
                    Back to Transactions
                  </button>
                  <div style={{display: "flex", gap: "0.5rem"}}>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn ghost"
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
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

