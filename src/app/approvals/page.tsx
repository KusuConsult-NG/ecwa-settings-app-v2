"use client"
import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, Filter, Search, Eye, Check, X } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type ApprovalItem = {
  id: string
  type: 'leave' | 'expense' | 'purchase' | 'travel' | 'other'
  title: string
  description: string
  requester: string
  requesterEmail: string
  amount?: number
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  attachments?: string[]
  comments?: string
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: ''
  })
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      const mockApprovals: ApprovalItem[] = [
        {
          id: '1',
          type: 'leave',
          title: 'Annual Leave Request',
          description: 'Request for 2 weeks annual leave for family vacation',
          requester: 'John Doe',
          requesterEmail: 'john@example.com',
          date: '2024-01-15T10:30:00Z',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'expense',
          title: 'Office Supplies Purchase',
          description: 'Purchase of office supplies for Q1 2024',
          requester: 'Jane Smith',
          requesterEmail: 'jane@example.com',
          amount: 50000,
          date: '2024-01-14T15:45:00Z',
          status: 'approved',
          priority: 'low'
        },
        {
          id: '3',
          type: 'travel',
          title: 'Conference Travel',
          description: 'Travel to Lagos for annual conference',
          requester: 'Mike Johnson',
          requesterEmail: 'mike@example.com',
          amount: 150000,
          date: '2024-01-13T09:20:00Z',
          status: 'pending',
          priority: 'high'
        }
      ]
      setApprovals(mockApprovals)
    } catch (error) {
      setMessage("Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setApprovals(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      ))
      setMessage("Item approved successfully!")
      setSelectedItem(null)
    } catch (error) {
      setMessage("Failed to approve item")
    }
  }

  const handleReject = async (id: string) => {
    try {
      setApprovals(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      ))
      setMessage("Item rejected successfully!")
      setSelectedItem(null)
    } catch (error) {
      setMessage("Failed to reject item")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave': return '🏖️'
      case 'expense': return '💰'
      case 'purchase': return '🛒'
      case 'travel': return '✈️'
      default: return '📋'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'leave': return 'Leave Request'
      case 'expense': return 'Expense Claim'
      case 'purchase': return 'Purchase Request'
      case 'travel': return 'Travel Request'
      default: return 'Other'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} style={{color: '#f59e0b'}} />
      case 'approved': return <CheckCircle size={16} style={{color: '#10b981'}} />
      case 'rejected': return <XCircle size={16} style={{color: '#ef4444'}} />
      default: return <Clock size={16} />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const filteredApprovals = approvals.filter(item => {
    if (filters.status && item.status !== filters.status) return false
    if (filters.type && item.type !== filters.type) return false
    if (filters.priority && item.priority !== filters.priority) return false
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !item.requester.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const pendingCount = approvals.filter(item => item.status === 'pending').length
  const approvedCount = approvals.filter(item => item.status === 'approved').length
  const rejectedCount = approvals.filter(item => item.status === 'rejected').length

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading approvals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Approvals</h2>
        <p className="muted">Review and approve pending requests</p>
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
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="leave">Leave Request</option>
              <option value="expense">Expense Claim</option>
              <option value="purchase">Purchase Request</option>
              <option value="travel">Travel Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by title or requester..."
            />
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="card">
        <h3 style={{marginBottom: '1rem'}}>
          Approval Requests ({filteredApprovals.length})
        </h3>
        
        {filteredApprovals.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📋</div>
            <p className="muted" style={{marginBottom: '1rem'}}>
              {filters.status || filters.type || filters.priority || filters.search 
                ? 'No approvals found matching your filters.' 
                : 'No approval requests found.'}
            </p>
          </div>
        ) : (
          <div style={{display: 'grid', gap: '1rem'}}>
            {filteredApprovals.map((item) => (
              <div key={item.id} className="card" style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '1.5rem'}}>{getTypeIcon(item.type)}</span>
                      <div>
                        <h4 style={{margin: '0 0 0.25rem 0'}}>{item.title}</h4>
                        <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                          {getTypeLabel(item.type)} • {item.requester}
                        </p>
                      </div>
                    </div>
                    
                    <p style={{margin: '0.5rem 0', color: 'var(--text)'}}>{item.description}</p>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem'}}>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {getStatusIcon(item.status)} {item.status}
                      </span>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: getPriorityColor(item.priority),
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {item.priority} priority
                      </span>
                      {item.amount && (
                        <span style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                          ₦{item.amount.toLocaleString()}
                        </span>
                      )}
                      <span style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '0.5rem', marginLeft: '1rem'}}>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Eye size={14} />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="btn btn-sm btn-success"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
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
              {getTypeIcon(selectedItem.type)} {selectedItem.title}
            </h3>
            
            <div style={{marginBottom: '1rem'}}>
              <strong>Requester:</strong> {selectedItem.requester} ({selectedItem.requesterEmail})
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <strong>Description:</strong>
              <p style={{margin: '0.5rem 0 0 0'}}>{selectedItem.description}</p>
            </div>
            
            {selectedItem.amount && (
              <div style={{marginBottom: '1rem'}}>
                <strong>Amount:</strong> ₦{selectedItem.amount.toLocaleString()}
              </div>
            )}
            
            <div style={{marginBottom: '1rem'}}>
              <strong>Date:</strong> {new Date(selectedItem.date).toLocaleString()}
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <strong>Status:</strong> 
              <span 
                className="badge"
                style={{
                  backgroundColor: getStatusColor(selectedItem.status),
                  color: 'white',
                  marginLeft: '0.5rem'
                }}
              >
                {selectedItem.status}
              </span>
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <strong>Priority:</strong> 
              <span 
                className="badge"
                style={{
                  backgroundColor: getPriorityColor(selectedItem.priority),
                  color: 'white',
                  marginLeft: '0.5rem'
                }}
              >
                {selectedItem.priority}
              </span>
            </div>
            
            {selectedItem.comments && (
              <div style={{marginBottom: '1rem'}}>
                <strong>Comments:</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>{selectedItem.comments}</p>
              </div>
            )}
            
            <div className="btn-group" style={{justifyContent: 'flex-end'}}>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn secondary"
              >
                Close
              </button>
              {selectedItem.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedItem.id)}
                    className="btn success"
                  >
                    <Check size={16} style={{marginRight: '0.5rem'}} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedItem.id)}
                    className="btn danger"
                  >
                    <X size={16} style={{marginRight: '0.5rem'}} />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

