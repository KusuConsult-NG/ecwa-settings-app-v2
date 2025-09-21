"use client"
import { useState, useEffect } from "react"
import { Building, Users, MapPin, Phone, Mail, Calendar, Plus, Eye, Edit, Trash2, Search, Filter, Globe, Building2, Church, Users2 } from "lucide-react"

export const dynamic = 'force-dynamic';

type Organization = {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC'
  address: string
  phone: string
  email: string
  leader: string
  memberCount: number
  establishedDate: string
  parentId?: string
  parentName?: string
  status: 'active' | 'inactive' | 'suspended'
  lastActivity: string
  childrenCount?: number
}

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, fetch from API
      const mockOrganizations: Organization[] = [
        {
          id: '1',
          name: 'ECWA General Church Council',
          type: 'GCC',
          address: 'ECWA Headquarters, Jos, Plateau State',
          phone: '+234 803 000 0001',
          email: 'gcc@ecwa.org',
          leader: 'Rev. Dr. Stephen Panya Baba',
          memberCount: 50000,
          establishedDate: '1954-01-01',
          status: 'active',
          lastActivity: '2024-01-15',
          childrenCount: 12
        },
        {
          id: '2',
          name: 'Jos DCC',
          type: 'DCC',
          address: 'Jos District Office, Jos, Plateau State',
          phone: '+234 803 000 0002',
          email: 'josdcc@ecwa.org',
          leader: 'Rev. John Doe',
          memberCount: 8000,
          establishedDate: '2010-03-15',
          parentId: '1',
          parentName: 'ECWA General Church Council',
          status: 'active',
          lastActivity: '2024-01-14',
          childrenCount: 8
        },
        {
          id: '3',
          name: 'Bukuru DCC',
          type: 'DCC',
          address: 'Bukuru District Office, Bukuru, Plateau State',
          phone: '+234 803 000 0003',
          email: 'bukurudcc@ecwa.org',
          leader: 'Rev. Jane Smith',
          memberCount: 6500,
          establishedDate: '2012-07-20',
          parentId: '1',
          parentName: 'ECWA General Church Council',
          status: 'active',
          lastActivity: '2024-01-13',
          childrenCount: 6
        },
        {
          id: '4',
          name: 'Jos Central LCC',
          type: 'LCC',
          address: 'Jos Central Office, Jos, Plateau State',
          phone: '+234 803 000 0004',
          email: 'joscentral@ecwa.org',
          leader: 'Rev. Mike Johnson',
          memberCount: 1200,
          establishedDate: '2015-01-10',
          parentId: '2',
          parentName: 'Jos DCC',
          status: 'active',
          lastActivity: '2024-01-12',
          childrenCount: 5
        },
        {
          id: '5',
          name: 'ECWA • LC – Jos Central',
          type: 'LC',
          address: '123 Church Street, Jos, Plateau State',
          phone: '+234 803 000 0005',
          email: 'joscentral@ecwa.org',
          leader: 'Rev. David Wilson',
          memberCount: 450,
          establishedDate: '2018-03-15',
          parentId: '4',
          parentName: 'Jos Central LCC',
          status: 'active',
          lastActivity: '2024-01-11'
        }
      ]
      setOrganizations(mockOrganizations)
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || org.type === filterType
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GCC': return <Globe size={16} className="text-primary" />
      case 'DCC': return <Building2 size={16} className="text-info" />
      case 'LCC': return <Building size={16} className="text-warning" />
      case 'LC': return <Church size={16} className="text-success" />
      default: return <Building size={16} />
    }
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      GCC: { color: 'var(--primary)', bg: 'rgba(14, 77, 164, 0.1)' },
      DCC: { color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.1)' },
      LCC: { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
      LC: { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)' }
    }
    const style = styles[type as keyof typeof styles] || styles.GCC
    
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
        {getTypeIcon(type)}
        {type}
      </span>
    )
  }

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

  const getHierarchyLevel = (org: Organization) => {
    if (org.type === 'GCC') return 'Level 1 - National'
    if (org.type === 'DCC') return 'Level 2 - Regional'
    if (org.type === 'LCC') return 'Level 3 - Local Council'
    if (org.type === 'LC') return 'Level 4 - Local Church'
    return 'Unknown Level'
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Organization Management</h2>
        <p className="muted">Manage the ECWA organizational hierarchy and structure</p>
      </div>

      {/* Stats Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Globe size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {organizations.filter(o => o.type === 'GCC').length}
          </h3>
          <p className="muted" style={{margin: 0}}>GCC</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Building2 size={32} className="text-info" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {organizations.filter(o => o.type === 'DCC').length}
          </h3>
          <p className="muted" style={{margin: 0}}>DCCs</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Building size={32} className="text-warning" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {organizations.filter(o => o.type === 'LCC').length}
          </h3>
          <p className="muted" style={{margin: 0}}>LCCs</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Church size={32} className="text-success" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {organizations.filter(o => o.type === 'LC').length}
          </h3>
          <p className="muted" style={{margin: 0}}>Local Churches</p>
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
                placeholder="Search organizations, leaders, or addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{paddingLeft: "2.5rem"}}
              />
            </div>
          </div>
          <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
            <Filter size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="GCC">GCC</option>
              <option value="DCC">DCC</option>
              <option value="LCC">LCC</option>
              <option value="LC">LC</option>
            </select>
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
            Add Organization
          </button>
        </div>
      </div>

      {/* Organizations List */}
      <div className="card">
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)"}}>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Organization</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Type</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Leader</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Parent</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Members</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Children</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Status</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Established</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizations.map((org) => (
                <tr key={org.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{org.name}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <MapPin size={12} />
                        {org.address}
                      </div>
                      <div style={{fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem"}}>
                        {getHierarchyLevel(org)}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getTypeBadge(org.type)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", fontSize: "0.875rem"}}>{org.leader}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <Mail size={12} />
                        {org.email}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>
                      {org.parentName || '-'}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                      <Users2 size={14} />
                      {org.memberCount.toLocaleString()}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500"}}>
                      {org.childrenCount || 0}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getStatusBadge(org.status)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{formatDate(org.establishedDate)}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button className="btn secondary btn-sm">
                        <Eye size={14} />
                      </button>
                      <button className="btn secondary btn-sm">
                        <Edit size={14} />
                      </button>
                      <button className="btn danger btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrganizations.length === 0 && (
          <div style={{textAlign: "center", padding: "3rem", color: "var(--muted)"}}>
            <Building size={48} style={{marginBottom: "1rem", opacity: 0.5}} />
            <p>No organizations found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Organization Modal */}
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
              <h3>Add New Organization</h3>
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
                  <label>Organization Type *</label>
                  <select required>
                    <option value="">Select Type</option>
                    <option value="GCC">GCC - Global Coordinating Council</option>
                    <option value="DCC">DCC - District Coordinating Council</option>
                    <option value="LCC">LCC - Local Coordinating Council</option>
                    <option value="LC">LC - Local Church</option>
                  </select>
                </div>
                <div>
                  <label>Organization Name *</label>
                  <input
                    type="text"
                    placeholder="Organization Name"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Leader Name *</label>
                  <input
                    type="text"
                    placeholder="Rev. John Doe"
                    required
                  />
                </div>
                <div>
                  <label>Parent Organization</label>
                  <select>
                    <option value="">Select Parent (if applicable)</option>
                    <option value="1">ECWA General Church Council</option>
                    <option value="2">Jos DCC</option>
                    <option value="3">Bukuru DCC</option>
                  </select>
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="org@ecwa.org"
                    required
                  />
                </div>
                <div>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label>Address *</label>
                <textarea
                  placeholder="123 Organization Street, City, State"
                  rows={3}
                  required
                />
              </div>
              
              <div className="row">
                <div>
                  <label>Established Date *</label>
                  <input
                    type="date"
                    required
                  />
                </div>
                <div></div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
