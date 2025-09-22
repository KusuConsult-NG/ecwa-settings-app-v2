"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Expenditure {
  id: string
  title: string
  description: string
  amount: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  submittedBy: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

export default function ExpendituresPage() {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const categories = [
    'Office Supplies',
    'Equipment & Maintenance',
    'Travel & Transportation',
    'Utilities',
    'Marketing & Advertising',
    'Professional Services',
    'Training & Development',
    'IT & Software',
    'Facilities & Rent',
    'Insurance',
    'Legal & Compliance',
    'Research & Development',
    'Events & Conferences',
    'Charitable Donations',
    'Other'
  ]

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error'
  }

  const statusIcons = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌'
  }

  useEffect(() => {
    loadExpenditures()
  }, [])

  // Refresh data when page becomes visible (e.g., returning from new page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadExpenditures()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const loadExpenditures = async () => {
    try {
      setIsLoading(true)
      
      // Call the API to get expenditures
      const response = await fetch('/api/expenditures')
      const data = await response.json()
      
      if (data.success) {
        // Transform the data to match the expected format
        const transformedExpenditures: Expenditure[] = data.data.map((exp: any) => ({
          id: exp.id,
          title: exp.title,
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          status: exp.status,
          submittedBy: exp.createdBy,
          createdAt: exp.createdAt,
          approvedBy: exp.approvedBy,
          approvedAt: exp.approvedAt
        }))
        
        setExpenditures(transformedExpenditures)
      } else {
        console.error('Error loading expenditures:', data.message)
        // Fallback to empty array if API fails
        setExpenditures([])
      }
    } catch (error) {
      console.error('Error loading expenditures:', error)
      // Fallback to empty array if API fails
      setExpenditures([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExpenditures = expenditures.filter(exp => {
    const matchesFilter = filter === 'all' || exp.status === filter
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/expenditures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          approvedBy: 'Current User'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state with the updated expenditure
        setExpenditures(prev => prev.map(exp => 
          exp.id === id 
            ? { 
                ...exp, 
                status: data.data.status,
                approvedBy: data.data.approvedBy,
                approvedAt: data.data.approvedAt
              }
            : exp
        ))
      } else {
        console.error('Error updating status:', data.message)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleViewExpenditure = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure)
    setShowModal(true)
  }

  const handleReverseAction = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/expenditures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          approvedBy: newStatus === 'pending' ? undefined : 'Current User'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state with the updated expenditure
        setExpenditures(prev => prev.map(exp => 
          exp.id === id 
            ? { 
                ...exp, 
                status: data.data.status,
                approvedBy: data.data.approvedBy,
                approvedAt: data.data.approvedAt
              }
            : exp
        ))
      } else {
        console.error('Error reversing action:', data.message)
      }
    } catch (error) {
      console.error('Error reversing action:', error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedExpenditure(null)
  }

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Description', 'Amount', 'Category', 'Status', 'Submitted By', 'Date'],
      ...filteredExpenditures.map(exp => [
        exp.title,
        exp.description,
        exp.amount.toString(),
        exp.category,
        exp.status,
        exp.submittedBy,
        formatDate(exp.createdAt)
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenditures-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Parse CSV and add to expenditures
      console.log('Importing CSV:', content)
      // Implementation would parse CSV and add to state
    }
    reader.readAsText(file)
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading expenditures...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>Expenditures Management</h1>
          <p className="muted">Manage and track organizational expenditures</p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search expenditures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="actions">
            <button 
              className="btn secondary" 
              onClick={loadExpenditures}
              disabled={isLoading}
            >
              🔄 Refresh
            </button>
            <button className="btn secondary" onClick={handleExport}>
              📊 Export CSV
            </button>
            <label className="btn secondary">
              📥 Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              className="btn primary"
              onClick={() => router.push('/expenditures/new')}
            >
              ➕ Add Expenditure
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenditures.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <div className="title-cell">
                      <strong>{exp.title}</strong>
                      <small className="muted">{exp.description}</small>
                    </div>
                  </td>
                  <td>
                    <span className="amount">{formatCurrency(exp.amount)}</span>
                  </td>
                  <td>
                    <span className="category">{exp.category}</span>
                  </td>
                  <td>
                    <span className={`status status-${statusColors[exp.status]}`}>
                      {statusIcons[exp.status]} {exp.status}
                    </span>
                  </td>
                  <td>{exp.submittedBy}</td>
                  <td>{formatDate(exp.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      {exp.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm success"
                            onClick={() => handleStatusUpdate(exp.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm error"
                            onClick={() => handleStatusUpdate(exp.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {exp.status === 'approved' && (
                        <>
                          <button
                            className="btn btn-sm warning"
                            onClick={() => handleReverseAction(exp.id, 'pending')}
                            title="Move back to pending for review"
                          >
                            ⏳ Revert
                          </button>
                          <button
                            className="btn btn-sm error"
                            onClick={() => handleReverseAction(exp.id, 'rejected')}
                            title="Change to rejected"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      
                      {exp.status === 'rejected' && (
                        <>
                          <button
                            className="btn btn-sm warning"
                            onClick={() => handleReverseAction(exp.id, 'pending')}
                            title="Move back to pending for review"
                          >
                            ⏳ Revert
                          </button>
                          <button
                            className="btn btn-sm success"
                            onClick={() => handleReverseAction(exp.id, 'approved')}
                            title="Change to approved"
                          >
                            ✅ Approve
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="btn btn-sm secondary"
                        onClick={() => handleViewExpenditure(exp)}
                        title="View full details"
                      >
                        👁️ View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenditures.length === 0 && (
          <div className="empty-state">
            <p>No expenditures found matching your criteria.</p>
            <button 
              className="btn primary"
              onClick={() => router.push('/expenditures/new')}
            >
              Add First Expenditure
            </button>
          </div>
        )}
      </div>

      {/* Expenditure Details Modal */}
      {showModal && selectedExpenditure && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Expenditure Details</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Title:</label>
                  <span>{selectedExpenditure.title}</span>
                </div>
                
                <div className="detail-item">
                  <label>Description:</label>
                  <span>{selectedExpenditure.description}</span>
                </div>
                
                <div className="detail-item">
                  <label>Amount:</label>
                  <span className="amount">{formatCurrency(selectedExpenditure.amount)}</span>
                </div>
                
                <div className="detail-item">
                  <label>Category:</label>
                  <span className="category">{selectedExpenditure.category}</span>
                </div>
                
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status status-${statusColors[selectedExpenditure.status]}`}>
                    {statusIcons[selectedExpenditure.status]} {selectedExpenditure.status}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>Submitted By:</label>
                  <span>{selectedExpenditure.submittedBy}</span>
                </div>
                
                <div className="detail-item">
                  <label>Created Date:</label>
                  <span>{formatDate(selectedExpenditure.createdAt)}</span>
                </div>
                
                {selectedExpenditure.approvedBy && (
                  <div className="detail-item">
                    <label>Approved By:</label>
                    <span>{selectedExpenditure.approvedBy}</span>
                  </div>
                )}
                
                {selectedExpenditure.approvedAt && (
                  <div className="detail-item">
                    <label>Approved Date:</label>
                    <span>{formatDate(selectedExpenditure.approvedAt)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="action-buttons">
                {selectedExpenditure.status === 'pending' && (
                  <>
                    <button
                      className="btn success"
                      onClick={() => {
                        handleStatusUpdate(selectedExpenditure.id, 'approved')
                        closeModal()
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn error"
                      onClick={() => {
                        handleStatusUpdate(selectedExpenditure.id, 'rejected')
                        closeModal()
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {selectedExpenditure.status === 'approved' && (
                  <>
                    <button
                      className="btn warning"
                      onClick={() => {
                        handleReverseAction(selectedExpenditure.id, 'pending')
                        closeModal()
                      }}
                    >
                      Revert to Pending
                    </button>
                    <button
                      className="btn error"
                      onClick={() => {
                        handleReverseAction(selectedExpenditure.id, 'rejected')
                        closeModal()
                      }}
                    >
                      Change to Rejected
                    </button>
                  </>
                )}
                
                {selectedExpenditure.status === 'rejected' && (
                  <>
                    <button
                      className="btn warning"
                      onClick={() => {
                        handleReverseAction(selectedExpenditure.id, 'pending')
                        closeModal()
                      }}
                    >
                      Revert to Pending
                    </button>
                    <button
                      className="btn success"
                      onClick={() => {
                        handleReverseAction(selectedExpenditure.id, 'approved')
                        closeModal()
                      }}
                    >
                      Change to Approved
                    </button>
                  </>
                )}
              </div>
              
              <button className="btn secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


