"use client"
import { useState, useEffect } from "react"
import { DollarSign, Users, Calendar, Download, Upload, Plus, Eye, Edit, Trash2, Search, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic';

type PayrollRecord = {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  payPeriod: string
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  processedDate?: string
  paymentDate?: string
  bankAccount: string
  bankName: string
}

type PayrollSummary = {
  totalEmployees: number
  totalGrossSalary: number
  totalDeductions: number
  totalNetSalary: number
  pendingPayments: number
  approvedPayments: number
  paidPayments: number
}

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [summary, setSummary] = useState<PayrollSummary>({
    totalEmployees: 0,
    totalGrossSalary: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    paidPayments: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("current")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadPayrollData()
  }, [])

  const loadPayrollData = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, fetch from API
      const mockRecords: PayrollRecord[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'Rev. John Doe',
          position: 'Pastor',
          department: 'Ministry',
          basicSalary: 150000,
          allowances: 25000,
          deductions: 15000,
          netSalary: 160000,
          payPeriod: '2024-01',
          status: 'paid',
          processedDate: '2024-01-15',
          paymentDate: '2024-01-31',
          bankAccount: '1234567890',
          bankName: 'First Bank'
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: 'Mrs. Jane Smith',
          position: 'Secretary',
          department: 'Administration',
          basicSalary: 80000,
          allowances: 10000,
          deductions: 8000,
          netSalary: 82000,
          payPeriod: '2024-01',
          status: 'paid',
          processedDate: '2024-01-15',
          paymentDate: '2024-01-31',
          bankAccount: '0987654321',
          bankName: 'GTBank'
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: 'Mr. Mike Johnson',
          position: 'Treasurer',
          department: 'Finance',
          basicSalary: 120000,
          allowances: 15000,
          deductions: 12000,
          netSalary: 123000,
          payPeriod: '2024-01',
          status: 'approved',
          processedDate: '2024-01-15',
          bankAccount: '1122334455',
          bankName: 'Access Bank'
        },
        {
          id: '4',
          employeeId: 'EMP004',
          employeeName: 'Mrs. Sarah Wilson',
          position: 'Youth Coordinator',
          department: 'Ministry',
          basicSalary: 70000,
          allowances: 8000,
          deductions: 7000,
          netSalary: 71000,
          payPeriod: '2024-01',
          status: 'pending',
          bankAccount: '5566778899',
          bankName: 'Zenith Bank'
        }
      ]
      setPayrollRecords(mockRecords)

      // Calculate summary
      const totalGrossSalary = mockRecords.reduce((sum, record) => sum + record.basicSalary + record.allowances, 0)
      const totalDeductions = mockRecords.reduce((sum, record) => sum + record.deductions, 0)
      const totalNetSalary = mockRecords.reduce((sum, record) => sum + record.netSalary, 0)
      
      setSummary({
        totalEmployees: mockRecords.length,
        totalGrossSalary,
        totalDeductions,
        totalNetSalary,
        pendingPayments: mockRecords.filter(r => r.status === 'pending').length,
        approvedPayments: mockRecords.filter(r => r.status === 'approved').length,
        paidPayments: mockRecords.filter(r => r.status === 'paid').length
      })
    } catch (error) {
      console.error('Error loading payroll data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', icon: Clock },
      approved: { color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.1)', icon: CheckCircle },
      paid: { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
      cancelled: { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', icon: AlertCircle }
    }
    const style = styles[status as keyof typeof styles] || styles.pending
    const Icon = style.icon
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: style.color,
        backgroundColor: style.bg,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
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

  const handleStatusChange = (recordId: string, newStatus: string) => {
    setPayrollRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            status: newStatus as any,
            processedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : record.processedDate,
            paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : record.paymentDate
          }
        : record
    ))
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading payroll data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Payroll Management</h2>
        <p className="muted">Manage employee salaries, allowances, and deductions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Employees</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{summary.totalEmployees}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Gross Salary</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(summary.totalGrossSalary)}</h3>
            </div>
            <DollarSign className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Deductions</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(summary.totalDeductions)}</h3>
            </div>
            <DollarSign className="text-warning" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Net Salary</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(summary.totalNetSalary)}</h3>
            </div>
            <DollarSign className="text-info" size={32} />
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid cols-3" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--warning)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {summary.pendingPayments}
          </div>
          <p className="muted" style={{margin: 0}}>Pending Payments</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--info)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {summary.approvedPayments}
          </div>
          <p className="muted" style={{margin: 0}}>Approved Payments</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--success)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {summary.paidPayments}
          </div>
          <p className="muted" style={{margin: 0}}>Paid Payments</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{flex: "1", minWidth: "300px"}}>
            <div style={{position: "relative"}}>
              <Search size={16} style={{position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)"}} />
              <input
                type="text"
                placeholder="Search employees, positions, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{paddingLeft: "2.5rem"}}
              />
            </div>
          </div>
          <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
            <Filter size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="current">Current Period</option>
              <option value="previous">Previous Period</option>
              <option value="all">All Periods</option>
            </select>
          </div>
          <div style={{display: "flex", gap: "0.5rem"}}>
            <button className="btn secondary">
              <Download size={16} style={{marginRight: "0.5rem"}} />
              Export
            </button>
            <button className="btn secondary">
              <Upload size={16} style={{marginRight: "0.5rem"}} />
              Import
            </button>
            <button 
              className="btn primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} style={{marginRight: "0.5rem"}} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="card">
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)"}}>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Employee</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Position</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Basic Salary</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Allowances</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Deductions</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Net Salary</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Status</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Pay Period</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{record.employeeName}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>ID: {record.employeeId}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>{record.department}</div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{record.position}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500"}}>{formatCurrency(record.basicSalary)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500", color: "var(--success)"}}>{formatCurrency(record.allowances)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500", color: "var(--danger)"}}>{formatCurrency(record.deductions)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "700", fontSize: "1.1rem"}}>{formatCurrency(record.netSalary)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getStatusBadge(record.status)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{record.payPeriod}</div>
                    {record.paymentDate && (
                      <div style={{fontSize: "0.75rem", color: "var(--muted)"}}>
                        Paid: {formatDate(record.paymentDate)}
                      </div>
                    )}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button className="btn secondary btn-sm">
                        <Eye size={14} />
                      </button>
                      <button className="btn secondary btn-sm">
                        <Edit size={14} />
                      </button>
                      {record.status === 'pending' && (
                        <button 
                          className="btn success btn-sm"
                          onClick={() => handleStatusChange(record.id, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      {record.status === 'approved' && (
                        <button 
                          className="btn primary btn-sm"
                          onClick={() => handleStatusChange(record.id, 'paid')}
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div style={{textAlign: "center", padding: "3rem", color: "var(--muted)"}}>
            <DollarSign size={48} style={{marginBottom: "1rem", opacity: 0.5}} />
            <p>No payroll records found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Payroll Record Modal */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="card" style={{width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
              <h3>Add Payroll Record</h3>
              <button 
                className="btn secondary btn-sm"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
              <div className="row">
                <div>
                  <label>Employee *</label>
                  <select required>
                    <option value="">Select Employee</option>
                    <option value="EMP001">Rev. John Doe - Pastor</option>
                    <option value="EMP002">Mrs. Jane Smith - Secretary</option>
                    <option value="EMP003">Mr. Mike Johnson - Treasurer</option>
                  </select>
                </div>
                <div>
                  <label>Pay Period *</label>
                  <input
                    type="month"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Basic Salary *</label>
                  <input
                    type="number"
                    placeholder="150000"
                    required
                  />
                </div>
                <div>
                  <label>Allowances</label>
                  <input
                    type="number"
                    placeholder="25000"
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Deductions</label>
                  <input
                    type="number"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label>Bank Account *</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Bank Name *</label>
                  <input
                    type="text"
                    placeholder="First Bank"
                    required
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
