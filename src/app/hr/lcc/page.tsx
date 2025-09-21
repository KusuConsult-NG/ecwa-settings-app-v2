"use client"
import { useState, useEffect } from "react"
import { Building, Users, MapPin, Phone, Mail, Calendar, Plus, Eye, Edit, Trash2, Search, Filter, Church } from "lucide-react"

export const dynamic = 'force-dynamic';

type LocalCoordinatingCouncil = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  chairman: string
  secretary: string
  memberCount: number
  churchCount: number
  establishedDate: string
  dccId: string
  dccName: string
  status: 'active' | 'inactive' | 'suspended'
  lastActivity: string
}

export default function LCCPage() {
  const [lccs, setLccs] = useState<LocalCoordinatingCouncil[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadLCCs()
  }, [])

  const loadLCCs = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, fetch from API
      const mockLCCs: LocalCoordinatingCouncil[] = [
        {
          id: '1',
          name: 'Jos Central LCC',
          address: '456 LCC Street, Jos, Plateau State',
          phone: '+234 803 123 4567',
          email: 'joscentral@ecwa.org',
          chairman: 'Rev. John Doe',
          secretary: 'Mr. James Smith',
          memberCount: 1200,
          churchCount: 8,
          establishedDate: '2018-03-15',
          dccId: 'dcc1',
          dccName: 'Jos DCC',
          status: 'active',
          lastActivity: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jos South LCC',
          address: '789 LCC Avenue, Jos, Plateau State',
          phone: '+234 803 234 5678',
          email: 'jossouth@ecwa.org',
          chairman: 'Rev. Jane Wilson',
          secretary: 'Mrs. Mary Johnson',
          memberCount: 950,
          churchCount: 6,
          establishedDate: '2019-07-20',
          dccId: 'dcc1',
          dccName: 'Jos DCC',
          status: 'active',
          lastActivity: '2024-01-14'
        },
        {
          id: '3',
          name: 'Bukuru LCC',
          address: '321 LCC Road, Bukuru, Plateau State',
          phone: '+234 803 345 6789',
          email: 'bukuru@ecwa.org',
          chairman: 'Rev. Mike Brown',
          secretary: 'Mr. David Lee',
          memberCount: 750,
          churchCount: 5,
          establishedDate: '2020-01-10',
          dccId: 'dcc2',
          dccName: 'Bukuru DCC',
          status: 'inactive',
          lastActivity: '2023-12-20'
        }
      ]
      setLccs(mockLCCs)
    } catch (error) {
      console.error('Error loading LCCs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLCCs = lccs.filter(lcc => {
    const matchesSearch = lcc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lcc.chairman.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lcc.secretary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lcc.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lcc.status === filterStatus
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
          <p>Loading LCCs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Local Coordinating Councils (LCC)</h2>
        <p className="muted">Manage and oversee local coordinating councils under your jurisdiction</p>
      </div>

      {/* Stats Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Building size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>{lccs.length}</h3>
          <p className="muted" style={{margin: 0}}>Total LCCs</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Users size={32} className="text-success" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {lccs.reduce((sum, lcc) => sum + lcc.memberCount, 0).toLocaleString()}
          </h3>
          <p className="muted" style={{margin: 0}}>Total Members</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <Church size={32} className="text-info" style={{marginBottom: "0.5rem"}} />
          <h3 style={{margin: "0 0 0.25rem 0", fontSize: "2rem"}}>
            {lccs.reduce((sum, lcc) => sum + lcc.churchCount, 0)}
          </h3>
          <p className="muted" style={{margin: 0}}>Total Churches</p>
        </div>
        <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
          <div style={{color: "var(--success)", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem"}}>
            {lccs.filter(l => l.status === 'active').length}
          </div>
          <p className="muted" style={{margin: 0}}>Active LCCs</p>
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
                placeholder="Search LCCs, chairmen, secretaries, or addresses..."
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
            Add LCC
          </button>
        </div>
      </div>

      {/* LCCs List */}
      <div className="card">
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)"}}>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>LCC Name</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Leadership</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>DCC</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Churches</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Members</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Status</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Established</th>
                <th style={{textAlign: "left", padding: "1rem", fontWeight: "600"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLCCs.map((lcc) => (
                <tr key={lcc.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{lcc.name}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <MapPin size={12} />
                        {lcc.address}
                      </div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div>
                      <div style={{fontWeight: "500", fontSize: "0.875rem"}}>Chairman: {lcc.chairman}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>Secretary: {lcc.secretary}</div>
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{lcc.dccName}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                      <Church size={14} />
                      {lcc.churchCount}
                    </div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontWeight: "500"}}>{lcc.memberCount.toLocaleString()}</div>
                  </td>
                  <td style={{padding: "1rem"}}>
                    {getStatusBadge(lcc.status)}
                  </td>
                  <td style={{padding: "1rem"}}>
                    <div style={{fontSize: "0.875rem"}}>{formatDate(lcc.establishedDate)}</div>
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

        {filteredLCCs.length === 0 && (
          <div style={{textAlign: "center", padding: "3rem", color: "var(--muted)"}}>
            <Building size={48} style={{marginBottom: "1rem", opacity: 0.5}} />
            <p>No LCCs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add LCC Modal */}
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
              <h3>Add New LCC</h3>
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
                  <label>LCC Name *</label>
                  <input
                    type="text"
                    placeholder="Jos Central LCC"
                    required
                  />
                </div>
                <div>
                  <label>DCC *</label>
                  <select required>
                    <option value="">Select DCC</option>
                    <option value="dcc1">Jos DCC</option>
                    <option value="dcc2">Bukuru DCC</option>
                  </select>
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Chairman *</label>
                  <input
                    type="text"
                    placeholder="Rev. John Doe"
                    required
                  />
                </div>
                <div>
                  <label>Secretary *</label>
                  <input
                    type="text"
                    placeholder="Mr. James Smith"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="lcc@ecwa.org"
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
                  placeholder="123 LCC Street, City, State"
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
                  Add LCC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
