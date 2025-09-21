"use client"
import { useState, useEffect } from "react"
import { DollarSign, Plus, Search, Filter, Download, Eye, Edit, Trash2, TrendingUp } from "lucide-react"

interface Income {
  id: string
  title: string
  amount: number
  category: string
  date: string
  source: string
  description: string
  recordedBy: string
}

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    // Simulate loading data
    const incomeData: Income[] = [
      {
        id: "1",
        title: "Sunday Service Offering",
        amount: 45000,
        category: "Offering",
        date: "2024-01-15",
        source: "Main Service",
        description: "Regular Sunday service offering",
        recordedBy: "John Doe"
      },
      {
        id: "2",
        title: "Tithe Collection",
        amount: 32000,
        category: "Tithe",
        date: "2024-01-14",
        source: "Members",
        description: "Monthly tithe collection",
        recordedBy: "Jane Smith"
      },
      {
        id: "3",
        title: "Youth Ministry Donation",
        amount: 15000,
        category: "Donation",
        date: "2024-01-12",
        source: "Youth Ministry",
        description: "Special donation for youth activities",
        recordedBy: "Mike Johnson"
      },
      {
        id: "4",
        title: "Building Fund",
        amount: 75000,
        category: "Building Fund",
        date: "2024-01-10",
        source: "Special Collection",
        description: "Building fund contribution",
        recordedBy: "Sarah Wilson"
      }
    ]

    setIncome(incomeData)
    setTotalIncome(incomeData.reduce((sum, item) => sum + item.amount, 0))
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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Offering': 'var(--primary)',
      'Tithe': 'var(--success)',
      'Donation': 'var(--warning)',
      'Building Fund': 'var(--danger)',
      'Special': 'var(--secondary)'
    }
    return colors[category] || 'var(--muted)'
  }

  const filteredIncome = income.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container">
      <div className="section-title">
        <h2>Income Management</h2>
        <p>Track and manage church income sources</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Income</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(totalIncome)}</h3>
            </div>
            <DollarSign className="text-success" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+8% this month</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>This Month</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(167000)}</h3>
            </div>
            <TrendingUp className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Records</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{income.length}</h3>
            </div>
            <DollarSign className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Categories</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(income.map(i => i.category))].length}</h3>
            </div>
            <DollarSign className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{position: "relative", flex: "1", minWidth: "300px"}}>
            <Search size={20} style={{position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)"}} />
            <input
              type="text"
              placeholder="Search income records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{paddingLeft: "40px", width: "100%"}}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Categories</option>
            <option value="Offering">Offering</option>
            <option value="Tithe">Tithe</option>
            <option value="Donation">Donation</option>
            <option value="Building Fund">Building Fund</option>
          </select>
          <a href="/income/new" className="btn primary">
            <Plus size={16} />
            Add Income
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Income Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Source</th>
                <th>Date</th>
                <th>Recorded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncome.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{item.title}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>{item.description}</div>
                    </div>
                  </td>
                  <td style={{fontWeight: "600", color: "var(--success)"}}>{formatCurrency(item.amount)}</td>
                  <td>
                    <span className="badge" style={{backgroundColor: getCategoryColor(item.category), color: "white"}}>
                      {item.category}
                    </span>
                  </td>
                  <td>{item.source}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.recordedBy}</td>
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

      {filteredIncome.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <DollarSign size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No income records found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterCategory !== 'all' 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first income record"
            }
          </p>
          <a href="/income/new" className="btn primary">
            <Plus size={16} />
            Add Income Record
          </a>
        </div>
      )}
    </div>
  )
}

