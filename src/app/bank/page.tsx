"use client"
import { useState, useEffect } from "react"
import { Building2, Plus, Search, Filter, Download, Eye, Edit, Trash2, TrendingUp, CreditCard } from "lucide-react"

interface BankAccount {
  id: string
  name: string
  bank: string
  accountNumber: string
  balance: number
  accountType: string
  status: 'active' | 'inactive' | 'suspended'
  lastTransaction: string
}

export default function BankPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    // Simulate loading data
    const accountsData: BankAccount[] = [
      {
        id: "1",
        name: "Main Church Account",
        bank: "First Bank of Nigeria",
        accountNumber: "****1234",
        balance: 2500000,
        accountType: "Current",
        status: "active",
        lastTransaction: "2024-01-15"
      },
      {
        id: "2",
        name: "Building Fund Account",
        bank: "Access Bank",
        accountNumber: "****5678",
        balance: 1800000,
        accountType: "Savings",
        status: "active",
        lastTransaction: "2024-01-14"
      },
      {
        id: "3",
        name: "Youth Ministry Account",
        bank: "GTBank",
        accountNumber: "****9012",
        balance: 450000,
        accountType: "Current",
        status: "active",
        lastTransaction: "2024-01-12"
      },
      {
        id: "4",
        name: "Emergency Fund",
        bank: "Zenith Bank",
        accountNumber: "****3456",
        balance: 320000,
        accountType: "Savings",
        status: "inactive",
        lastTransaction: "2023-12-20"
      }
    ]

    setAccounts(accountsData)
    setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0))
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
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'suspended': return 'danger'
      default: return 'muted'
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bank.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container">
      <div className="section-title">
        <h2>Bank Management</h2>
        <p>Manage church bank accounts and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Balance</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(totalBalance)}</h3>
            </div>
            <Building2 className="text-success" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+12% this month</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Accounts</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{accounts.filter(a => a.status === 'active').length}</h3>
            </div>
            <CreditCard className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Accounts</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{accounts.length}</h3>
            </div>
            <Building2 className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Banks</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(accounts.map(a => a.bank))].length}</h3>
            </div>
            <Building2 className="text-primary" size={32} />
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
              placeholder="Search bank accounts..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <a href="/bank/new" className="btn primary">
            <Plus size={16} />
            Add Account
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Bank</th>
                <th>Account Number</th>
                <th>Balance</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Transaction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <div style={{fontWeight: "500"}}>{account.name}</div>
                  </td>
                  <td>{account.bank}</td>
                  <td style={{fontFamily: "monospace"}}>{account.accountNumber}</td>
                  <td style={{fontWeight: "600", color: "var(--success)"}}>{formatCurrency(account.balance)}</td>
                  <td>
                    <span className="badge" style={{backgroundColor: "var(--primary)", color: "white"}}>
                      {account.accountType}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${getStatusColor(account.status)}`}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(account.lastTransaction)}</td>
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

      {filteredAccounts.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Building2 size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No bank accounts found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterStatus !== 'all' 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first bank account"
            }
          </p>
          <a href="/bank/new" className="btn primary">
            <Plus size={16} />
            Add Bank Account
          </a>
        </div>
      )}
    </div>
  )
}

