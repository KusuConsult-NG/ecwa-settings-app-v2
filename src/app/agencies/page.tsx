"use client"
import { useState, useEffect } from "react"
import { Shield, Plus, Search, Filter, Download, Eye, Edit, Trash2, Users, Calendar, MapPin, Star } from "lucide-react"

interface Agency {
  id: string
  name: string
  type: string
  description: string
  leader: string
  contact: string
  location: string
  established: string
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      const response = await fetch('/api/agencies')
      if (response.ok) {
        const data = await response.json()
        setAgencies(data.data || [])
      } else {
        console.error('Failed to load agencies')
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'danger'
      case 'pending': return 'warning'
      default: return 'muted'
    }
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Ministry': 'var(--primary)',
      'Outreach': 'var(--success)',
      'Fellowship': 'var(--warning)',
      'Service': 'var(--danger)'
    }
    return colors[type] || 'var(--muted)'
  }

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || agency.type === filterType
    const matchesStatus = filterStatus === 'all' || agency.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalMembers = agencies.length * 25 // Estimate based on average agency size
  const activeAgencies = agencies.filter(agency => agency.status === 'active').length

  return (
    <div className="container">
      <div className="section-title">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <h2>Agencies & Groups</h2>
            <p>Manage church ministries and special groups</p>
          </div>
          <div style={{display: "flex", gap: "1rem"}}>
            <button 
              onClick={loadAgencies}
              className="btn secondary"
              style={{display: "flex", alignItems: "center", gap: "0.5rem"}}
            >
              <Search size={16} />
              Refresh
            </button>
            <a href="/agencies/new" className="btn primary" style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <Plus size={16} />
              Add Agency
            </a>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Agencies</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{agencies.length}</h3>
            </div>
            <Shield className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Agencies</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{activeAgencies}</h3>
            </div>
            <Star className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Members</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{totalMembers.toLocaleString()}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Types</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(agencies.map(a => a.type))].length}</h3>
            </div>
            <Shield className="text-primary" size={32} />
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
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{paddingLeft: "40px", width: "100%"}}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Types</option>
            <option value="Ministry">Ministry</option>
            <option value="Outreach">Outreach</option>
            <option value="Fellowship">Fellowship</option>
            <option value="Service">Service</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{minWidth: "150px"}}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <a href="/agencies/new" className="btn primary">
            <Plus size={16} />
            Add Agency
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Agencies Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Type</th>
                <th>Members</th>
                <th>Leader</th>
                <th>Location</th>
                <th>Established</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.map((agency) => (
                <tr key={agency.id}>
                  <td>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{agency.name}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>{agency.description}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{backgroundColor: getTypeColor(agency.type), color: "white"}}>
                      {agency.type}
                    </span>
                  </td>
                  <td style={{fontWeight: "600"}}>25</td>
                  <td>{agency.leader}</td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                      <MapPin size={12} />
                      {agency.location}
                    </div>
                  </td>
                  <td>{formatDate(agency.established)}</td>
                  <td>
                    <span className={`status ${getStatusColor(agency.status)}`}>
                      {agency.status.charAt(0).toUpperCase() + agency.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-sm btn-secondary" title="View">
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn-sm btn-secondary" 
                        title="Edit Agency"
                        onClick={() => window.location.href = `/agencies/edit/${agency.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button className="btn-sm btn-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAgencies.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Shield size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No agencies found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first agency"
            }
          </p>
          <a href="/agencies/new" className="btn primary">
            <Plus size={16} />
            Add Agency
          </a>
        </div>
      )}
    </div>
  )
}

