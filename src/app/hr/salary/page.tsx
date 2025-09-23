"use client"
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, DollarSign, Users, Calendar, Building } from 'lucide-react'

interface SalaryRecord {
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
  createdAt: string
  updatedAt: string
  agency?: string
}

const SALARY_STATUSES = ['pending', 'approved', 'paid', 'cancelled']
const DEPARTMENTS = ['Finance', 'Health', 'Education', 'ESM', 'Evangelism', 'Media']

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    position: '',
    department: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payPeriod: '',
    agency: ''
  })

  useEffect(() => {
    loadSalaries()
    loadAgencies()
  }, [])

  const loadSalaries = async () => {
    try {
      const response = await fetch('/api/salary')
      if (response.ok) {
        const data = await response.json()
        setSalaries(data.salaries || [])
      } else {
        setError('Failed to load salary records')
      }
    } catch (err) {
      setError('Failed to load salary records')
    } finally {
      setLoading(false)
    }
  }

  const loadAgencies = async () => {
    try {
      const response = await fetch('/api/agencies')
      if (response.ok) {
        const data = await response.json()
        setAgencies(data.agencies || [])
      }
    } catch (err) {
      console.error('Failed to load agencies:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const netSalary = formData.basicSalary + formData.allowances - formData.deductions
      const salaryData = {
        ...formData,
        netSalary,
        status: 'pending'
      }

      const url = editingId ? `/api/salary/${editingId}` : '/api/salary'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryData)
      })

      if (response.ok) {
        await loadSalaries()
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save salary record')
      }
    } catch (err) {
      setError('Failed to save salary record')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      position: '',
      department: '',
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
      payPeriod: '',
      agency: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (salary: SalaryRecord) => {
    setFormData({
      employeeId: salary.employeeId,
      employeeName: salary.employeeName,
      position: salary.position,
      department: salary.department,
      basicSalary: salary.basicSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      payPeriod: salary.payPeriod,
      agency: salary.agency || ''
    })
    setEditingId(salary.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this salary record?')) {
      try {
        const response = await fetch(`/api/salary/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadSalaries()
        } else {
          setError('Failed to delete salary record')
        }
      } catch (err) {
        setError('Failed to delete salary record')
      }
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/salary/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await loadSalaries()
      } else {
        setError('Failed to update status')
      }
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch = salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || salary.status === statusFilter
    const matchesDepartment = !departmentFilter || salary.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const totalNetSalary = filteredSalaries.reduce((sum, salary) => sum + salary.netSalary, 0)
  const pendingCount = salaries.filter(s => s.status === 'pending').length
  const paidCount = salaries.filter(s => s.status === 'paid').length

  if (loading) {
    return (
      <div className="p-6">
        <div className="section-title">
          <h1>Salary Management</h1>
          <p className="muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="section-title">
        <h1>Salary Management</h1>
        <p className="muted">Manage employee salaries, allowances, and deductions</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{marginBottom: '1rem'}}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid cols-3" style={{marginBottom: '2rem'}}>
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{fontSize: '2rem'}}>💰</div>
            <div>
              <h3 style={{margin: 0, fontSize: '1.5rem'}}>₦{totalNetSalary.toLocaleString()}</h3>
              <p style={{margin: 0, color: 'var(--muted)'}}>Total Net Salary</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{fontSize: '2rem'}}>⏳</div>
            <div>
              <h3 style={{margin: 0, fontSize: '1.5rem'}}>{pendingCount}</h3>
              <p style={{margin: 0, color: 'var(--muted)'}}>Pending Approvals</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{fontSize: '2rem'}}>✅</div>
            <div>
              <h3 style={{margin: 0, fontSize: '1.5rem'}}>{paidCount}</h3>
              <p style={{margin: 0, color: 'var(--muted)'}}>Paid This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{marginBottom: '1rem'}}>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px'}}>
            <Search size={20} style={{color: 'var(--muted)'}} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{flex: 1}}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{minWidth: '150px'}}
          >
            <option value="">All Status</option>
            {SALARY_STATUSES.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{minWidth: '150px'}}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn primary"
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Add Salary Record
          </button>
        </div>
      </div>

      {/* Salary Records Table */}
      {filteredSalaries.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
          <DollarSign size={48} style={{color: 'var(--muted)', marginBottom: '1rem'}} />
          <h3>No Salary Records Found</h3>
          <p className="muted">Start by adding salary records for your employees</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn primary"
            style={{marginTop: '1rem'}}
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Add First Salary Record
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Pay Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>
                      <div>
                        <div style={{fontWeight: '500'}}>{salary.employeeName}</div>
                        <div style={{fontSize: '0.875rem', color: 'var(--muted)'}}>ID: {salary.employeeId}</div>
                      </div>
                    </td>
                    <td>{salary.position}</td>
                    <td>{salary.department}</td>
                    <td>₦{salary.basicSalary.toLocaleString()}</td>
                    <td>₦{salary.allowances.toLocaleString()}</td>
                    <td>₦{salary.deductions.toLocaleString()}</td>
                    <td style={{fontWeight: '600', color: 'var(--primary)'}}>₦{salary.netSalary.toLocaleString()}</td>
                    <td>{salary.payPeriod}</td>
                    <td>
                      <span className={`badge badge-${salary.status}`}>
                        {salary.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(salary)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(salary.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                        <select
                          value={salary.status}
                          onChange={(e) => handleStatusChange(salary.id, e.target.value)}
                          style={{fontSize: '12px', padding: '2px 4px'}}
                        >
                          {SALARY_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '1rem'}}>
              {editingId ? 'Edit Salary Record' : 'Add Salary Record'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Basic Salary *</label>
                  <input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: Number(e.target.value)})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Allowances</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Deductions</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Pay Period *</label>
                  <input
                    type="month"
                    value={formData.payPeriod}
                    onChange={(e) => setFormData({...formData, payPeriod: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Agency (Optional)</label>
                <select
                  value={formData.agency}
                  onChange={(e) => setFormData({...formData, agency: e.target.value})}
                >
                  <option value="">Select Agency</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.name}>{agency.name}</option>
                  ))}
                </select>
              </div>

              <div className="btn-group" style={{justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update Record' : 'Add Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
