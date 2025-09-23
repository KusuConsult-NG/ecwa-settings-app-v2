"use client"
import { useState, useEffect } from "react"
import { Users, Plus, Edit, Trash2, Eye, Search, Filter, UserCheck, UserX } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type Staff = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  status: 'active' | 'inactive' | 'on-leave' | 'terminated'
  hireDate: string
  salary: number
  manager?: string
  location: string
  emergencyContact: string
  emergencyPhone: string
  agency?: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([])
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave' | 'terminated',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    manager: '',
    location: '',
    emergencyContact: '',
    emergencyPhone: '',
    agency: ''
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadStaff()
    loadAgencies()
  }, [])

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

  const loadStaff = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      const mockStaff: Staff[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+234 803 123 4567',
          position: 'Software Developer',
          department: 'IT',
          status: 'active',
          hireDate: '2023-01-15',
          salary: 150000,
          manager: 'Jane Smith',
          location: 'Lagos',
          emergencyContact: 'Mary Doe',
          emergencyPhone: '+234 803 987 6543'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+234 803 234 5678',
          position: 'IT Manager',
          department: 'IT',
          status: 'active',
          hireDate: '2022-06-01',
          salary: 200000,
          location: 'Abuja',
          emergencyContact: 'Bob Smith',
          emergencyPhone: '+234 803 876 5432'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+234 803 345 6789',
          position: 'HR Assistant',
          department: 'HR',
          status: 'on-leave',
          hireDate: '2023-03-10',
          salary: 120000,
          manager: 'Sarah Wilson',
          location: 'Kano',
          emergencyContact: 'Lisa Johnson',
          emergencyPhone: '+234 803 765 4321'
        }
      ]
      setStaff(mockStaff)
    } catch (error) {
      setMessage("Failed to load staff")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingStaff) {
        setStaff(prev => prev.map(s => 
          s.id === editingStaff.id ? { ...s, ...formData } : s
        ))
        setMessage("Staff member updated successfully!")
      } else {
        const newStaff: Staff = {
          id: Date.now().toString(),
          ...formData
        }
        setStaff(prev => [...prev, newStaff])
        setMessage("Staff member added successfully!")
      }
      
      setShowForm(false)
      setEditingStaff(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        manager: '',
        location: '',
        emergencyContact: '',
        emergencyPhone: ''
      })
    } catch (error) {
      setMessage("Failed to save staff member")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      position: staffMember.position,
      department: staffMember.department,
      status: staffMember.status,
      hireDate: staffMember.hireDate,
      salary: staffMember.salary,
      manager: staffMember.manager || '',
      location: staffMember.location,
      emergencyContact: staffMember.emergencyContact,
      emergencyPhone: staffMember.emergencyPhone
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        setStaff(prev => prev.filter(s => s.id !== id))
        setMessage("Staff member deleted successfully!")
      } catch (error) {
        setMessage("Failed to delete staff member")
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'inactive': return '#6b7280'
      case 'on-leave': return '#f59e0b'
      case 'terminated': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck size={16} />
      case 'inactive': return <UserX size={16} />
      case 'on-leave': return <Users size={16} />
      case 'terminated': return <UserX size={16} />
      default: return <Users size={16} />
    }
  }

  const filteredStaff = staff.filter(s => {
    if (filters.status && s.status !== filters.status) return false
    if (filters.department && s.department !== filters.department) return false
    if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !s.email.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const departments = [...new Set(staff.map(s => s.department))]

  if (loading && staff.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading staff...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Staff Management</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={() => {
              setShowForm(true)
              setEditingStaff(null)
              setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                department: '',
                status: 'active',
                hireDate: new Date().toISOString().split('T')[0],
                salary: 0,
                manager: '',
                location: '',
                emergencyContact: '',
                emergencyPhone: ''
              })
            }}
            className="btn primary"
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Add Staff
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by name or email..."
            />
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Users size={20} />
          Staff Members ({filteredStaff.length})
        </h3>
        
        {filteredStaff.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>👥</div>
            <p className="muted" style={{marginBottom: '1rem'}}>
              {filters.status || filters.department || filters.search 
                ? 'No staff found matching your filters.' 
                : 'No staff members found.'}
            </p>
            {!filters.status && !filters.department && !filters.search && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn primary"
              >
                <Plus size={16} style={{marginRight: '0.5rem'}} />
                Add First Staff Member
              </button>
            )}
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Agency</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>
                      <div>
                        <div style={{fontWeight: '500'}}>{staffMember.name}</div>
                        <div style={{fontSize: '0.875rem', color: 'var(--muted)'}}>{staffMember.email}</div>
                      </div>
                    </td>
                    <td>{staffMember.position}</td>
                    <td>
                      <span className="badge" style={{fontSize: '0.75rem'}}>
                        {staffMember.department}
                      </span>
                    </td>
                    <td>
                      {staffMember.agency ? (
                        <span className="badge" style={{fontSize: '0.75rem', backgroundColor: 'var(--primary)', color: 'white'}}>
                          {staffMember.agency}
                        </span>
                      ) : (
                        <span style={{color: 'var(--muted)', fontSize: '0.875rem'}}>—</span>
                      )}
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(staffMember.status),
                          color: 'white',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {getStatusIcon(staffMember.status)}
                        {staffMember.status}
                      </span>
                    </td>
                    <td>₦{staffMember.salary.toLocaleString()}</td>
                    <td style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                      {new Date(staffMember.hireDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                          onClick={() => handleEdit(staffMember)}
                          className="btn btn-sm btn-secondary"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember.id)}
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
          <div className="card" style={{width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '1rem'}}>
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Finance">Finance</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="ESM">ESM</option>
                    <option value="Evangelism">Evangelism</option>
                    <option value="Media">Media</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Hire Date *</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary *</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Manager</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    placeholder="Direct manager's name"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
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
                <div className="form-group">
                  <label>Emergency Contact *</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Emergency Phone *</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                    required
                  />
                </div>
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
                  {loading ? 'Saving...' : (editingStaff ? 'Update Staff' : 'Add Staff')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

