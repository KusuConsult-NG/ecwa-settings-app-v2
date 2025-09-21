"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, Calendar, FileText, Building, User, Plus, ArrowLeft } from "lucide-react"

export default function NewExpenditurePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0], // Today's date
    vendor: "",
    department: "",
    paymentMethod: "cash",
    receiptNumber: "",
    notes: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const categories = [
    "Worship & Music",
    "Facilities & Maintenance", 
    "Outreach & Missions",
    "Administration",
    "Youth & Children",
    "Pastoral Care",
    "Technology",
    "Utilities",
    "Insurance",
    "Other"
  ]

  const departments = [
    "Pastoral",
    "Administration", 
    "Worship",
    "Youth",
    "Children",
    "Outreach",
    "Facilities",
    "Finance",
    "Other"
  ]

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "transfer", label: "Bank Transfer" },
    { value: "other", label: "Other" }
  ]

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
    if (!formData.title || !formData.amount || !formData.category) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call - in a real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Expenditure recorded successfully!")
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        vendor: "",
        department: "",
        paymentMethod: "cash",
        receiptNumber: "",
        notes: ""
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/expenditures')
      }, 2000)

    } catch (err) {
      setError('Failed to record expenditure. Please try again.')
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
                New Expenditure
              </h1>
              <p className="muted" style={{margin: "0.25rem 0 0 0"}}>
                Record a new church expenditure
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
              <div className="form-group" style={{flex: 2}}>
                <label htmlFor="title">
                  <FileText size={16} style={{marginRight: "0.5rem"}} />
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter expenditure title"
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="amount">
                  <DollarSign size={16} style={{marginRight: "0.5rem"}} />
                  Amount *
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
                <label htmlFor="category">
                  <Building size={16} style={{marginRight: "0.5rem"}} />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="date">
                  <Calendar size={16} style={{marginRight: "0.5rem"}} />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="vendor">Vendor/Supplier</label>
                <input
                  type="text"
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row" style={{marginBottom: "1.5rem"}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="receiptNumber">Receipt Number</label>
                <input
                  type="text"
                  id="receiptNumber"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  placeholder="Enter receipt number"
                />
              </div>
            </div>

            <div className="form-group" style={{marginBottom: "1.5rem"}}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description"
                rows={3}
              />
            </div>

            <div className="form-group" style={{marginBottom: "2rem"}}>
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes or comments"
                rows={2}
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
                {isLoading ? "Recording..." : "Record Expenditure"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

