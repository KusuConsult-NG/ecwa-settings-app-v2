"use client"
import { useState, useEffect } from "react"
import { MessageSquare, User, Calendar, Clock, CheckCircle, AlertCircle, Plus, Eye, Reply, Search, Filter, Send } from "lucide-react"

export const dynamic = 'force-dynamic';

type Query = {
  id: string
  title: string
  description: string
  category: 'general' | 'payroll' | 'leave' | 'benefits' | 'policy' | 'technical'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  submittedBy: string
  submittedByEmail: string
  assignedTo?: string
  submittedDate: string
  lastUpdated: string
  dueDate?: string
  resolution?: string
  attachments?: string[]
  replies: QueryReply[]
}

type QueryReply = {
  id: string
  queryId: string
  message: string
  repliedBy: string
  repliedByEmail: string
  repliedDate: string
  isInternal: boolean
}

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  useEffect(() => {
    loadQueries()
  }, [])

  const loadQueries = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, fetch from API
      const mockQueries: Query[] = [
        {
          id: '1',
          title: 'Salary Payment Delay',
          description: 'My salary for January 2024 has not been paid yet. Can you please check the status?',
          category: 'payroll',
          priority: 'high',
          status: 'in_progress',
          submittedBy: 'Rev. John Doe',
          submittedByEmail: 'john@ecwa.org',
          assignedTo: 'HR Manager',
          submittedDate: '2024-01-15',
          lastUpdated: '2024-01-16',
          dueDate: '2024-01-20',
          replies: [
            {
              id: '1',
              queryId: '1',
              message: 'Thank you for bringing this to our attention. We are currently investigating the payment delay and will update you soon.',
              repliedBy: 'HR Manager',
              repliedByEmail: 'hr@ecwa.org',
              repliedDate: '2024-01-16',
              isInternal: false
            }
          ]
        },
        {
          id: '2',
          title: 'Leave Application Process',
          description: 'How do I apply for annual leave? What is the process and how much notice do I need to give?',
          category: 'leave',
          priority: 'medium',
          status: 'resolved',
          submittedBy: 'Mrs. Jane Smith',
          submittedByEmail: 'jane@ecwa.org',
          assignedTo: 'HR Assistant',
          submittedDate: '2024-01-10',
          lastUpdated: '2024-01-12',
          resolution: 'Leave application process explained and form provided',
          replies: [
            {
              id: '2',
              queryId: '2',
              message: 'To apply for annual leave, please fill out the leave application form available in the HR portal. You need to give at least 2 weeks notice for annual leave.',
              repliedBy: 'HR Assistant',
              repliedByEmail: 'hr@ecwa.org',
              repliedDate: '2024-01-11',
              isInternal: false
            },
            {
              id: '3',
              queryId: '2',
              message: 'I have sent you the leave application form via email. Please complete it and submit it to your supervisor for approval.',
              repliedBy: 'HR Assistant',
              repliedByEmail: 'hr@ecwa.org',
              repliedDate: '2024-01-12',
              isInternal: false
            }
          ]
        },
        {
          id: '3',
          title: 'Health Insurance Coverage',
          description: 'I need to add my spouse to the health insurance plan. What documents are required?',
          category: 'benefits',
          priority: 'medium',
          status: 'open',
          submittedBy: 'Mr. Mike Johnson',
          submittedByEmail: 'mike@ecwa.org',
          submittedDate: '2024-01-14',
          lastUpdated: '2024-01-14',
          dueDate: '2024-01-21',
          replies: []
        },
        {
          id: '4',
          title: 'System Login Issues',
          description: 'I am unable to log into the HR portal. I keep getting an error message.',
          category: 'technical',
          priority: 'urgent',
          status: 'in_progress',
          submittedBy: 'Mrs. Sarah Wilson',
          submittedByEmail: 'sarah@ecwa.org',
          assignedTo: 'IT Support',
          submittedDate: '2024-01-16',
          lastUpdated: '2024-01-16',
          dueDate: '2024-01-17',
          replies: [
            {
              id: '4',
              queryId: '4',
              message: 'We are aware of the login issues. Our IT team is working on resolving this. Please try clearing your browser cache and cookies.',
              repliedBy: 'IT Support',
              repliedByEmail: 'it@ecwa.org',
              repliedDate: '2024-01-16',
              isInternal: false
            }
          ]
        }
      ]
      setQueries(mockQueries)
    } catch (error) {
      console.error('Error loading queries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || query.category === filterCategory
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus
    const matchesPriority = filterPriority === 'all' || query.priority === filterPriority
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)' },
      medium: { color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.1)' },
      high: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
      urgent: { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' }
    }
    const style = styles[priority as keyof typeof styles] || styles.low
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: style.color,
        backgroundColor: style.bg
      }}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      open: { color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.1)', icon: MessageSquare },
      in_progress: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', icon: Clock },
      resolved: { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
      closed: { color: 'var(--muted)', bg: 'rgba(107, 114, 128, 0.1)', icon: CheckCircle }
    }
    const style = styles[status as keyof typeof styles] || styles.open
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
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payroll': return '💰'
      case 'leave': return '🏖️'
      case 'benefits': return '🎁'
      case 'policy': return '📋'
      case 'technical': return '💻'
      default: return '❓'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleReply = (queryId: string) => {
    if (!replyMessage.trim()) return
    
    const newReply: QueryReply = {
      id: Date.now().toString(),
      queryId,
      message: replyMessage,
      repliedBy: 'Current User',
      repliedByEmail: 'user@ecwa.org',
      repliedDate: new Date().toISOString().split('T')[0],
      isInternal: false
    }

    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { 
            ...query, 
            replies: [...query.replies, newReply],
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : query
    ))

    setReplyMessage("")
  }

  const handleStatusChange = (queryId: string, newStatus: string) => {
    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { 
            ...query, 
            status: newStatus as any,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : query
    ))
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading queries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>HR Queries & Support</h2>
        <p className="muted">Manage employee queries, support requests, and provide assistance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <MessageSquare size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>{queries.length}</h3>
          <p className="muted" style={{margin: 0}}>Total Queries</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--info)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {queries.filter(q => q.status === 'open').length}
          </div>
          <p className="muted" style={{margin: 0}}>Open</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--warning)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {queries.filter(q => q.status === 'in_progress').length}
          </div>
          <p className="muted" style={{margin: 0}}>In Progress</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--success)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {queries.filter(q => q.status === 'resolved').length}
          </div>
          <p className="muted" style={{margin: 0}}>Resolved</p>
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
                placeholder="Search queries, titles, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{paddingLeft: "2.5rem"}}
              />
            </div>
          </div>
          <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
            <Filter size={16} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="payroll">Payroll</option>
              <option value="leave">Leave</option>
              <option value="benefits">Benefits</option>
              <option value="policy">Policy</option>
              <option value="technical">Technical</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <button 
            className="btn primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} style={{marginRight: "0.5rem"}} />
            New Query
          </button>
        </div>
      </div>

      {/* Queries List */}
      <div className="card">
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)"}}>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Query</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Category</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Priority</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Status</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Submitted By</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Assigned To</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Due Date</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <tr key={query.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{query.title}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", marginBottom: "0.25rem"}}>
                        {query.description.length > 100 
                          ? query.description.substring(0, 100) + '...' 
                          : query.description
                        }
                      </div>
                      <div style={{fontSize: "0.75rem", color: "var(--muted)"}}>
                        {query.replies.length} replies • Updated {formatDate(query.lastUpdated)}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                      <span style={{fontSize: "1.2rem"}}>{getCategoryIcon(query.category)}</span>
                      <span style={{fontSize: "0.875rem", textTransform: "capitalize"}}>{query.category}</span>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getPriorityBadge(query.priority)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getStatusBadge(query.status)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", fontSize: "0.875rem"}}>{query.submittedBy}</div>
                      <div style={{fontSize: "0.75rem", color: "var(--muted)"}}>{query.submittedByEmail}</div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>
                      {query.assignedTo || 'Unassigned'}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>
                      {query.dueDate ? formatDate(query.dueDate) : '-'}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button 
                        className="btn secondary btn-sm"
                        onClick={() => setSelectedQuery(query)}
                      >
                        <Eye size={14} />
                      </button>
                      <button className="btn secondary btn-sm">
                        <Reply size={14} />
                      </button>
                      {query.status === 'open' && (
                        <button 
                          className="btn warning btn-sm"
                          onClick={() => handleStatusChange(query.id, 'in_progress')}
                        >
                          Start
                        </button>
                      )}
                      {query.status === 'in_progress' && (
                        <button 
                          className="btn success btn-sm"
                          onClick={() => handleStatusChange(query.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQueries.length === 0 && (
          <div style={{textAlign: "center", padding: "3rem", color: "var(--muted)"}}>
            <MessageSquare size={48} style={{marginBottom: "1rem", opacity: 0.5}} />
            <p>No queries found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
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
          <div className="card" style={{width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
              <h3>{selectedQuery.title}</h3>
              <button 
                className="btn secondary btn-sm"
                onClick={() => setSelectedQuery(null)}
              >
                ×
              </button>
            </div>
            
            <div style={{marginBottom: "1.5rem"}}>
              <div style={{display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap"}}>
                {getPriorityBadge(selectedQuery.priority)}
                {getStatusBadge(selectedQuery.status)}
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {getCategoryIcon(selectedQuery.category)} {selectedQuery.category}
                </span>
              </div>
              
              <div style={{marginBottom: "1rem"}}>
                <h4 style={{margin: "0 0 0.5rem 0"}}>Description</h4>
                <p style={{margin: 0, lineHeight: "1.6"}}>{selectedQuery.description}</p>
              </div>
              
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
                <div>
                  <strong>Submitted By:</strong><br />
                  {selectedQuery.submittedBy} ({selectedQuery.submittedByEmail})
                </div>
                <div>
                  <strong>Submitted Date:</strong><br />
                  {formatDate(selectedQuery.submittedDate)}
                </div>
                <div>
                  <strong>Assigned To:</strong><br />
                  {selectedQuery.assignedTo || 'Unassigned'}
                </div>
                <div>
                  <strong>Due Date:</strong><br />
                  {selectedQuery.dueDate ? formatDate(selectedQuery.dueDate) : 'Not set'}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <div style={{marginBottom: "1.5rem"}}>
              <h4 style={{margin: "0 0 1rem 0"}}>Replies ({selectedQuery.replies.length})</h4>
              <div style={{maxHeight: "300px", overflowY: "auto", border: "1px solid var(--line)", borderRadius: "8px", padding: "1rem"}}>
                {selectedQuery.replies.length === 0 ? (
                  <p style={{color: "var(--muted)", textAlign: "center", margin: "2rem 0"}}>No replies yet</p>
                ) : (
                  selectedQuery.replies.map((reply) => (
                    <div key={reply.id} style={{
                      padding: "1rem",
                      borderBottom: "1px solid var(--line)",
                      marginBottom: "0.5rem"
                    }}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem"}}>
                        <div style={{fontWeight: "500"}}>{reply.repliedBy}</div>
                        <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>
                          {formatDate(reply.repliedDate)}
                        </div>
                      </div>
                      <p style={{margin: 0, lineHeight: "1.6"}}>{reply.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply Form */}
            <div>
              <h4 style={{margin: "0 0 1rem 0"}}>Add Reply</h4>
              <div style={{display: "flex", gap: "0.5rem"}}>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={3}
                  style={{flex: 1, resize: "vertical"}}
                />
                <button 
                  className="btn primary"
                  onClick={() => handleReply(selectedQuery.id)}
                  disabled={!replyMessage.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Query Modal */}
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
              <h3>Submit New Query</h3>
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
                  <label>Query Title *</label>
                  <input
                    type="text"
                    placeholder="Brief description of your query"
                    required
                  />
                </div>
                <div>
                  <label>Category *</label>
                  <select required>
                    <option value="">Select Category</option>
                    <option value="general">General</option>
                    <option value="payroll">Payroll</option>
                    <option value="leave">Leave</option>
                    <option value="benefits">Benefits</option>
                    <option value="policy">Policy</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Priority *</label>
                  <select required>
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label>Due Date</label>
                  <input
                    type="date"
                  />
                </div>
              </div>
              
              <div>
                <label>Description *</label>
                <textarea
                  placeholder="Please provide detailed information about your query..."
                  rows={5}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Submit Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
