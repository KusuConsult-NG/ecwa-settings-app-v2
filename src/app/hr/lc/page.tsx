"use client"
import { useState, useEffect } from "react"
import { Building, Users, MapPin, Phone, Mail, Calendar, Plus, Eye, Edit, Trash2, Search, Filter } from "lucide-react"

export const dynamic = 'force-dynamic';

type LocalChurch = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  pastor: string
  memberCount: number
  establishedDate: string
  lccId: string
  lccName: string
  status: 'active' | 'inactive' | 'suspended'
  lastActivity: string
}

export default function LCPage() {
  const [churches, setChurches] = useState<LocalChurch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingChurch, setEditingChurch] = useState<LocalChurch | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    pastor: '',
    memberCount: 0,
    establishedDate: '',
    lccId: '',
    lccName: '',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  })

  useEffect(() => {
    loadChurches()
  }, [])

  const loadChurches = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, fetch from API
      const mockChurches: LocalChurch[] = [
        {
          id: '1',
          name: 'ECWA • LC – Jos Central',
          address: '123 Church Street, Jos, Plateau State',
          phone: '+234 803 123 4567',
          email: 'joscentral@ecwa.org',
          pastor: 'Rev. John Doe',
          memberCount: 450,
          establishedDate: '2020-01-15',
          lccId: 'lcc1',
          lccName: 'Jos Central LCC',
          status: 'active',
          lastActivity: '2024-01-15'
        },
        {
          id: '2',
          name: 'ECWA • LC – Bukuru',
          address: '456 Faith Avenue, Bukuru, Plateau State',
          phone: '+234 803 234 5678',
          email: 'bukuru@ecwa.org',
          pastor: 'Rev. Jane Smith',
          memberCount: 320,
          establishedDate: '2019-06-20',
          lccId: 'lcc1',
          lccName: 'Jos Central LCC',
          status: 'active',
          lastActivity: '2024-01-14'
        },
        {
          id: '3',
          name: 'ECWA • LC – Rayfield',
          address: '789 Hope Road, Rayfield, Plateau State',
          phone: '+234 803 345 6789',
          email: 'rayfield@ecwa.org',
          pastor: 'Rev. Mike Johnson',
          memberCount: 280,
          establishedDate: '2021-03-10',
          lccId: 'lcc2',
          lccName: 'Jos South LCC',
          status: 'inactive',
          lastActivity: '2023-12-20'
        }
      ]
      setChurches(mockChurches)
    } catch (error) {
      console.error('Error loading churches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (church: LocalChurch) => {
    setFormData({
      name: church.name,
      address: church.address,
      phone: church.phone,
      email: church.email,
      pastor: church.pastor,
      memberCount: church.memberCount,
      establishedDate: church.establishedDate,
      lccId: church.lccId,
      lccName: church.lccName,
      status: church.status
    })
    setEditingChurch(church)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this church?')) {
      setChurches(churches.filter(church => church.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingChurch) {
      // Update existing church
      setChurches(churches.map(church => 
        church.id === editingChurch.id 
          ? { ...church, ...formData, lastActivity: new Date().toISOString().split('T')[0] }
          : church
      ))
    } else {
      // Add new church
      const newChurch: LocalChurch = {
        id: Date.now().toString(),
        ...formData,
        lastActivity: new Date().toISOString().split('T')[0]
      }
      setChurches([...churches, newChurch])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      pastor: '',
      memberCount: 0,
      establishedDate: '',
      lccId: '',
      lccName: '',
      status: 'active'
    })
    setEditingChurch(null)
    setShowForm(false)
  }

  const filteredChurches = churches.filter(church => {
    const matchesSearch = church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         church.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         church.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || church.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)' },
      inactive: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
      suspended: { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' }
    }
    const style = styles[status as keyof typeof styles] || styles.active
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: style.color,
        backgroundColor: style.bg
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading local churches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Local Churches Management</h2>
        <p className="muted">Manage and oversee local churches under your jurisdiction</p>
      </div>

      {/* Stats Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Building size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>{churches.length}</h3>
          <p className="muted" style={{margin: 0}}>Total Churches</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Users size={32} className="text-success" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {churches.reduce((sum, church) => sum + church.memberCount, 0).toLocaleString()}
          </h3>
          <p className="muted" style={{margin: 0}}>Total Members</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--success)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {churches.filter(c => c.status === 'active').length}
          </div>
          <p className="muted" style={{margin: 0}}>Active Churches</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--warning)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {churches.filter(c => c.status === 'inactive').length}
          </div>
          <p className="muted" style={{margin: 0}}>Inactive Churches</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <div style={{display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{flex: "1", minWidth: "300px"}}>
            <div style={{position: "relative"}}>
              <Search size={16} style={{position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)"}} />
              <input
                type="text"
                placeholder="Search churches, pastors, or addresses..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button 
            className="btn primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} style={{marginRight: "0.5rem"}} />
            Add Church
          </button>
        </div>
      </div>

      {/* Churches List */}
      <div className="card">
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)"}}>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Church Name</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Pastor</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>LCC</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Members</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Status</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Established</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChurches.map((church) => (
                <tr key={church.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{church.name}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <MapPin size={12} />
                        {church.address}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500"}}>{church.pastor}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <Phone size={12} />
                        {church.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{church.lccName}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500"}}>{church.memberCount.toLocaleString()}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getStatusBadge(church.status)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{formatDate(church.establishedDate)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button 
                        className="btn secondary btn-sm"
                        onClick={() => alert(`View ${church.name} - Feature coming soon`)}
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn secondary btn-sm"
                        onClick={() => handleEdit(church)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn danger btn-sm"
                        onClick={() => handleDelete(church.id)}
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

        {filteredChurches.length === 0 && (
          <div style={{textAlign: "center", padding: "3rem", color: "var(--muted)"}}>
            <Building size={48} style={{marginBottom: "1rem", opacity: 0.5}} />
            <p>No churches found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Church Modal */}
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
              <h3>{editingChurch ? 'Edit Local Church' : 'Add New Local Church'}</h3>
              <button 
                className="btn secondary btn-sm"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div>
                  <label>Church Name *</label>
                  <input
                    type="text"
                    placeholder="ECWA • LC – Church Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label>Pastor Name *</label>
                  <input
                    type="text"
                    placeholder="Rev. John Doe"
                    value={formData.pastor}
                    onChange={(e) => setFormData({...formData, pastor: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="church@ecwa.org"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label>Address *</label>
                <textarea
                  placeholder="123 Church Street, City, State"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              
              <div className="row">
                <div>
                  <label>LCC *</label>
                  <select 
                    value={formData.lccId}
                    onChange={(e) => {
                      const selectedLcc = e.target.value
                      setFormData({
                        ...formData, 
                        lccId: selectedLcc,
                        lccName: selectedLcc === 'lcc1' ? 'Jos Central LCC' : 'Jos South LCC'
                      })
                    }}
                    required
                  >
                    <option value="">Select LCC</option>
                    <option value="lcc1">Jos Central LCC</option>
                    <option value="lcc2">Jos South LCC</option>
                  </select>
                </div>
                <div>
                  <label>Established Date *</label>
                  <input
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData({...formData, establishedDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div>
                  <label>Member Count</label>
                  <input
                    type="number"
                    value={formData.memberCount}
                    onChange={(e) => setFormData({...formData, memberCount: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'suspended'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingChurch ? 'Update Church' : 'Add Church'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
