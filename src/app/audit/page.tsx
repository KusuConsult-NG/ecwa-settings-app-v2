"use client"
import { useState, useEffect } from "react"
import { Search, Filter, Download, Eye, Calendar, User, Activity, Shield, AlertTriangle } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  user: string
  timestamp: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
  details: string
  category: string
}

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  useEffect(() => {
    // Simulate loading data
    const logsData: AuditLog[] = [
      {
        id: "1",
        action: "User Login",
        user: "john.doe@churchflow.com",
        timestamp: "2024-01-15T10:30:00Z",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "success",
        details: "Successful login from desktop",
        category: "Authentication"
      },
      {
        id: "2",
        action: "Expenditure Created",
        user: "jane.smith@churchflow.com",
        timestamp: "2024-01-15T09:15:00Z",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        status: "success",
        details: "Created expenditure: Church Renovation Materials - ₦150,000",
        category: "Financial"
      },
      {
        id: "3",
        action: "Failed Login Attempt",
        user: "unknown@example.com",
        timestamp: "2024-01-15T08:45:00Z",
        ipAddress: "192.168.1.200",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "failed",
        details: "Invalid credentials provided",
        category: "Security"
      },
      {
        id: "4",
        action: "User Role Updated",
        user: "admin@churchflow.com",
        timestamp: "2024-01-14T16:20:00Z",
        ipAddress: "192.168.1.50",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        status: "success",
        details: "Updated role for mike.johnson@churchflow.com to 'Youth Pastor'",
        category: "User Management"
      },
      {
        id: "5",
        action: "Data Export",
        user: "sarah.wilson@churchflow.com",
        timestamp: "2024-01-14T14:30:00Z",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "success",
        details: "Exported financial report for January 2024",
        category: "Data Export"
      },
      {
        id: "6",
        action: "Suspicious Activity",
        user: "unknown@example.com",
        timestamp: "2024-01-14T12:00:00Z",
        ipAddress: "192.168.1.300",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        status: "warning",
        details: "Multiple failed login attempts from same IP",
        category: "Security"
      }
    ]

    setAuditLogs(logsData)
  }, [])

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success'
      case 'failed': return 'danger'
      case 'warning': return 'warning'
      default: return 'muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Activity size={14} />
      case 'failed': return <AlertTriangle size={14} />
      case 'warning': return <AlertTriangle size={14} />
      default: return <Activity size={14} />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Authentication': 'var(--primary)',
      'Financial': 'var(--success)',
      'Security': 'var(--danger)',
      'User Management': 'var(--warning)',
      'Data Export': 'var(--secondary)'
    }
    return colors[category] || 'var(--muted)'
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalLogs = auditLogs.length
  const successLogs = auditLogs.filter(log => log.status === 'success').length
  const failedLogs = auditLogs.filter(log => log.status === 'failed').length
  const warningLogs = auditLogs.filter(log => log.status === 'warning').length

  return (
    <div className="container">
      <div className="section-title">
        <h2>Audit Logs</h2>
        <p>Monitor system activities and security events</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Events</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{totalLogs}</h3>
            </div>
            <Activity className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Successful</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{successLogs}</h3>
            </div>
            <Activity className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Failed</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{failedLogs}</h3>
            </div>
            <AlertTriangle className="text-danger" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Warnings</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{warningLogs}</h3>
            </div>
            <AlertTriangle className="text-warning" size={32} />
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
              placeholder="Search audit logs..."
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
            <option value="Authentication">Authentication</option>
            <option value="Financial">Financial</option>
            <option value="Security">Security</option>
            <option value="User Management">User Management</option>
            <option value="Data Export">Data Export</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="warning">Warning</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Category</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{fontWeight: "500"}}>{log.action}</div>
                  </td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                      <User size={14} />
                      {log.user}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{backgroundColor: getCategoryColor(log.category), color: "white"}}>
                      {log.category}
                    </span>
                  </td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                      {getStatusIcon(log.status)}
                      <span className={`status ${getStatusColor(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                      <Calendar size={14} />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </td>
                  <td style={{fontFamily: "monospace", fontSize: "0.875rem"}}>{log.ipAddress}</td>
                  <td>
                    <div style={{maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                      {log.details}
                    </div>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-sm btn-secondary" title="View Details">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Shield size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No audit logs found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "No audit events have been recorded yet"
            }
          </p>
        </div>
      )}
    </div>
  )
}
