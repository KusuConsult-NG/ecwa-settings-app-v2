"use client"
import { useState, useEffect } from "react"
import { Receipt, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react"

interface Expenditure {
  id: string
  title: string
  amount: number
  category: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  description: string
  submittedBy: string
}

export default function ExpendituresPage() {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Simulate loading data
    setExpenditures([
      {
        id: "1",
        title: "Church Renovation Materials",
        amount: 150000,
        category: "Maintenance",
        date: "2024-01-15",
        status: "approved",
        description: "Purchase of paint, tiles, and other renovation materials",
        submittedBy: "John Doe"
      },
      {
        id: "2",
        title: "Sound System Upgrade",
        amount: 250000,
        category: "Equipment",
        date: "2024-01-12",
        status: "pending",
        description: "New microphones and speakers for better audio quality",
        submittedBy: "Jane Smith"
      },
      {
        id: "3",
        title: "Youth Ministry Event",
        amount: 75000,
        category: "Events",
        date: "2024-01-10",
        status: "approved",
        description: "Food and materials for youth conference",
        submittedBy: "Mike Johnson"
      },
      {
        id: "4",
        title: "Office Supplies",
        amount: 45000,
        category: "Administrative",
        date: "2024-01-08",
        status: "rejected",
        description: "Stationery and office equipment",
        submittedBy: "Sarah Wilson"
      }
    ])
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'danger'
      default: return 'muted'
    }
  }

  const filteredExpenditures = expenditures.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || exp.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container">
      <div className="section-title">
        <h2>Expenditures</h2>
        <p>Manage and track church expenses</p>
      </div>

      {/* Controls */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{position: "relative", flex: "1", minWidth: "300px"}}>
            <Search size={20} style={{position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)"}} />
            <input
              type="text"
              placeholder="Search expenditures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{paddingLeft: "40px", width: "100%"}}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <a href="/expenditures/new" className="btn primary">
            <Plus size={16} />
            Add Expenditure
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Expenditures Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenditures.map((expenditure) => (
                <tr key={expenditure.id}>
                  <td>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{expenditure.title}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>{expenditure.description}</div>
                    </div>
                  </td>
                  <td style={{fontWeight: "600"}}>{formatCurrency(expenditure.amount)}</td>
                  <td>
                    <span className="badge" style={{backgroundColor: "var(--primary)", color: "white"}}>
                      {expenditure.category}
                    </span>
                  </td>
                  <td>{formatDate(expenditure.date)}</td>
                  <td>
                    <span className={`status ${getStatusColor(expenditure.status)}`}>
                      {expenditure.status.charAt(0).toUpperCase() + expenditure.status.slice(1)}
                    </span>
                  </td>
                  <td>{expenditure.submittedBy}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-sm btn-secondary" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="btn-sm btn-secondary" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="btn-sm btn-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredExpenditures.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Receipt size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No expenditures found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterStatus !== 'all' 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first expenditure"
            }
          </p>
          <a href="/expenditures/new" className="btn primary">
            <Plus size={16} />
            Add Expenditure
          </a>
        </div>
      )}
    </div>
  )
}