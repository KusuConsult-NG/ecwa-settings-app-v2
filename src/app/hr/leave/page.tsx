"use client"
import { useState, useEffect } from "react"
import { Calendar, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Filter } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type LeaveRequest = {
  id: string
  employeeName: string
  employeeId: string
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'emergency'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  comments?: string
}

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null)
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    search: ''
  })
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    leaveType: 'annual' as 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'emergency',
    startDate: '',
    endDate: '',
    reason: '',
    comments: ''
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      const mockRequests: LeaveRequest[] = [
        {
          id: '1',
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          leaveType: 'annual',
          startDate: '2024-02-01',
          endDate: '2024-02-14',
          days: 14,
          reason: 'Family vacation',
          status: 'pending',
          submittedDate: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          leaveType: 'sick',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          days: 3,
          reason: 'Medical appointment',
          status: 'approved',
          submittedDate: '2024-01-19T14:20:00Z',
          approvedBy: 'HR Manager',
          approvedDate: '2024-01-19T16:45:00Z'
        },
        {
          id: '3',
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          leaveType: 'maternity',
          startDate: '2024-03-01',
          endDate: '2024-06-01',
          days: 90,
          reason: 'Maternity leave',
          status: 'approved',
          submittedDate: '2024-01-10T09:15:00Z',
          approvedBy: 'HR Manager',
          approvedDate: '2024-01-10T11:30:00Z'
        }
      ]
      setLeaveRequests(mockRequests)
    } catch (error) {
      setMessage("Failed to load leave requests")
    } finally {
      setLoading(false)
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const days = calculateDays(formData.startDate, formData.endDate)
      
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingRequest) {
        setLeaveRequests(prev => prev.map(req => 
          req.id === editingRequest.id ? { ...req, ...formData, days } : req
        ))
        setMessage("Leave request updated successfully!")
      } else {
        const newRequest: LeaveRequest = {
          id: Date.now().toString(),
          ...formData,
          days,
          status: 'pending',
          submittedDate: new Date().toISOString()
        }
        setLeaveRequests(prev => [...prev, newRequest])
        setMessage("Leave request submitted successfully!")
      }
      
      setShowForm(false)
      setEditingRequest(null)
      setFormData({
        employeeName: '',
        employeeId: '',
        leaveType: 'annual',
        startDate: '',
        endDate: '',
        reason: '',
        comments: ''
      })
    } catch (error) {
      setMessage("Failed to save leave request")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setLeaveRequests(prev => prev.map(req => 
        req.id === id ? { 
          ...req, 
          status: 'approved',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString()
        } : req
      ))
      setMessage("Leave request approved successfully!")
    } catch (error) {
      setMessage("Failed to approve leave request")
    }
  }

  const handleReject = async (id: string) => {
    try {
      setLeaveRequests(prev => prev.map(req => 
        req.id === id ? { 
          ...req, 
          status: 'rejected',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString()
        } : req
      ))
      setMessage("Leave request rejected successfully!")
    } catch (error) {
      setMessage("Failed to reject leave request")
    }
  }

  const handleEdit = (request: LeaveRequest) => {
    setEditingRequest(request)
    setFormData({
      employeeName: request.employeeName,
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      comments: request.comments || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      try {
        setLeaveRequests(prev => prev.filter(req => req.id !== id))
        setMessage("Leave request deleted successfully!")
      } catch (error) {
        setMessage("Failed to delete leave request")
      }
    }
  }

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'annual': return '🏖️'
      case 'sick': return '🏥'
      case 'maternity': return '👶'
      case 'paternity': return '👨‍👶'
      case 'personal': return '👤'
      case 'emergency': return '🚨'
      default: return '📋'
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'annual': return 'Annual Leave'
      case 'sick': return 'Sick Leave'
      case 'maternity': return 'Maternity Leave'
      case 'paternity': return 'Paternity Leave'
      case 'personal': return 'Personal Leave'
      case 'emergency': return 'Emergency Leave'
      default: return 'Other'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'approved': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const filteredRequests = leaveRequests.filter(req => {
    if (filters.status && req.status !== filters.status) return false
    if (filters.leaveType && req.leaveType !== filters.leaveType) return false
    if (filters.search && !req.employeeName.toLowerCase().includes(filters.search.toLowerCase()) && 
        !req.employeeId.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const pendingCount = leaveRequests.filter(req => req.status === 'pending').length
  const approvedCount = leaveRequests.filter(req => req.status === 'approved').length
  const rejectedCount = leaveRequests.filter(req => req.status === 'rejected').length

  if (loading && leaveRequests.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading leave requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Leave Management</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={() => {
              setShowForm(true)
              setEditingRequest(null)
              setFormData({
                employeeName: '',
                employeeId: '',
                leaveType: 'annual',
                startDate: '',
                endDate: '',
                reason: '',
                comments: ''
              })
            }}
            className="btn primary"
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            New Leave Request
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid cols-3" style={{marginBottom: '2rem'}}>
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⏳</div>
          <h3 style={{margin: '0 0 0.25rem 0', color: '#f59e0b'}}>{pendingCount}</h3>
          <p style={{margin: 0, color: 'var(--muted)'}}>Pending</p>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
          <h3 style={{margin: '0 0 0.25rem 0', color: '#10b981'}}>{approvedCount}</h3>
          <p style={{margin: 0, color: 'var(--muted)'}}>Approved</p>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>❌</div>
          <h3 style={{margin: '0 0 0.25rem 0', color: '#ef4444'}}>{rejectedCount}</h3>
          <p style={{margin: 0, color: 'var(--muted)'}}>Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Filter size={20} />
          Filters
        </h3>
        <div className="row">
          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label>Leave Type</label>
            <select
              value={filters.leaveType}
              onChange={(e) => setFilters({...filters, leaveType: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by employee name or ID..."
            />
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Calendar size={20} />
          Leave Requests ({filteredRequests.length})
        </h3>
        
        {filteredRequests.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📅</div>
            <p className="muted" style={{marginBottom: '1rem'}}>
              {filters.status || filters.leaveType || filters.search 
                ? 'No leave requests found matching your filters.' 
                : 'No leave requests found.'}
            </p>
            {!filters.status && !filters.leaveType && !filters.search && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn primary"
              >
                <Plus size={16} style={{marginRight: '0.5rem'}} />
                Submit First Leave Request
              </button>
            )}
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div>
                        <div style={{fontWeight: '500'}}>{request.employeeName}</div>
                        <div style={{fontSize: '0.875rem', color: 'var(--muted)'}}>{request.employeeId}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span style={{fontSize: '1.2rem'}}>{getLeaveTypeIcon(request.leaveType)}</span>
                        <span>{getLeaveTypeLabel(request.leaveType)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{fontSize: '0.875rem'}}>
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{fontSize: '0.75rem'}}>
                        {request.days} days
                      </span>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(request.status),
                          color: 'white',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>
                    <td style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                          onClick={() => handleEdit(request)}
                          className="btn btn-sm btn-secondary"
                        >
                          <Edit size={14} />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="btn btn-sm btn-success"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="btn btn-sm btn-danger"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
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
              {editingRequest ? 'Edit Leave Request' : 'Submit Leave Request'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Leave Type *</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({...formData, leaveType: e.target.value as any})}
                    required
                  >
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="maternity">Maternity Leave</option>
                    <option value="paternity">Paternity Leave</option>
                    <option value="personal">Personal Leave</option>
                    <option value="emergency">Emergency Leave</option>
                  </select>
                </div>
                <div className="form-group"></div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--surface)', borderRadius: '4px'}}>
                  <strong>Total Days: </strong>
                  {calculateDays(formData.startDate, formData.endDate)} days
                </div>
              )}

              <div className="form-group">
                <label>Reason *</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  rows={2}
                  placeholder="Additional comments (optional)"
                />
              </div>

              <div className="btn-group" style={{justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingRequest ? 'Update Request' : 'Submit Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

