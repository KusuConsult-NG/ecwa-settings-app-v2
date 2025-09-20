"use client"
import { useState, useEffect } from "react"
import { Building, Plus, Search, Filter, Download, Eye, Edit, Trash2, Users, Calendar, MapPin } from "lucide-react"

interface Organization {
  id: string
  name: string
  type: string
  location: string
  members: number
  established: string
  status: 'active' | 'inactive' | 'pending'
  leader: string
  contact: string
}

export default function OrganizationManagementPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Simulate loading data
    const orgsData: Organization[] = [
      {
        id: "1",
        name: "Grace Assembly",
        type: "Local Church",
        location: "Lagos, Nigeria",
        members: 1250,
        established: "2015-03-15",
        status: "active",
        leader: "Pastor John Doe",
        contact: "+234 801 234 5678"
      },
      {
        id: "2",
        name: "Victory Chapel",
        type: "Branch Church",
        location: "Abuja, Nigeria",
        members: 850,
        established: "2018-07-20",
        status: "active",
        leader: "Pastor Jane Smith",
        contact: "+234 802 345 6789"
      },
      {
        id: "3",
        name: "Hope Center",
        type: "Ministry Center",
        location: "Port Harcourt, Nigeria",
        members: 420,
        established: "2020-01-10",
        status: "active",
        leader: "Pastor Mike Johnson",
        contact: "+234 803 456 7890"
      },
      {
        id: "4",
        name: "New Life Fellowship",
        type: "Local Church",
        location: "Kano, Nigeria",
        members: 680,
        established: "2019-11-05",
        status: "pending",
        leader: "Pastor Sarah Wilson",
        contact: "+234 804 567 8901"
      }
    ]

    setOrganizations(orgsData)
  }, [])

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
      'Local Church': 'var(--primary)',
      'Branch Church': 'var(--success)',
      'Ministry Center': 'var(--warning)',
      'Fellowship': 'var(--danger)'
    }
    return colors[type] || 'var(--muted)'
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || org.type === filterType
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalMembers = organizations.reduce((sum, org) => sum + org.members, 0)
  const activeOrgs = organizations.filter(org => org.status === 'active').length

  return (
    <div className="container">
      <div className="section-title">
        <h2>Organization Management</h2>
        <p>Manage church organizations and branches</p>
      </div>

      {/* Summary Cards */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Organizations</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{organizations.length}</h3>
            </div>
            <Building className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Organizations</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{activeOrgs}</h3>
            </div>
            <Users className="text-success" size={32} />
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
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{[...new Set(organizations.map(o => o.type))].length}</h3>
            </div>
            <Building className="text-primary" size={32} />
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
              placeholder="Search organizations..."
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
            <option value="Local Church">Local Church</option>
            <option value="Branch Church">Branch Church</option>
            <option value="Ministry Center">Ministry Center</option>
            <option value="Fellowship">Fellowship</option>
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
          <a href="/org" className="btn primary">
            <Plus size={16} />
            Add Organization
          </a>
          <button className="btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="card" style={{padding: "0", overflow: "hidden"}}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Type</th>
                <th>Location</th>
                <th>Members</th>
                <th>Leader</th>
                <th>Established</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div>
                      <div style={{fontWeight: "500", marginBottom: "0.25rem"}}>{org.name}</div>
                      <div style={{fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem"}}>
                        <MapPin size={12} />
                        {org.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{backgroundColor: getTypeColor(org.type), color: "white"}}>
                      {org.type}
                    </span>
                  </td>
                  <td>{org.location}</td>
                  <td style={{fontWeight: "600"}}>{org.members.toLocaleString()}</td>
                  <td>{org.leader}</td>
                  <td>{formatDate(org.established)}</td>
                  <td>
                    <span className={`status ${getStatusColor(org.status)}`}>
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-sm btn-secondary" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="btn-sm btn-secondary" title="Edit">
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

      {filteredOrganizations.length === 0 && (
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <Building size={48} style={{color: "var(--muted)", marginBottom: "1rem"}} />
          <h3 style={{margin: "0 0 0.5rem 0"}}>No organizations found</h3>
          <p className="muted" style={{margin: "0 0 1.5rem 0"}}>
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first organization"
            }
          </p>
          <a href="/org" className="btn primary">
            <Plus size={16} />
            Add Organization
          </a>
        </div>
      )}
    </div>
  )
}
