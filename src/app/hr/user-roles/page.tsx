"use client"
import { useState, useEffect } from "react"
import { Users, Plus, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  permissions: string[]
}

type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
}

const AVAILABLE_PERMISSIONS = [
  'dashboard.view',
  'users.manage',
  'organizations.manage',
  'hr.manage',
  'finance.manage',
  'reports.view',
  'settings.manage',
  'audit.view'
]

const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: AVAILABLE_PERMISSIONS,
    isSystem: true
  },
  {
    id: 'hr-manager',
    name: 'HR Manager',
    description: 'Human resources management',
    permissions: ['dashboard.view', 'hr.manage', 'users.manage', 'reports.view'],
    isSystem: false
  },
  {
    id: 'finance-manager',
    name: 'Finance Manager',
    description: 'Financial management and reporting',
    permissions: ['dashboard.view', 'finance.manage', 'reports.view'],
    isSystem: false
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['dashboard.view', 'reports.view'],
    isSystem: false
  }
]

export default function UserRolesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES)
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  })
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          permissions: AVAILABLE_PERMISSIONS
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'hr-manager',
          status: 'active',
          lastLogin: '2024-01-14T15:45:00Z',
          createdAt: '2024-01-05T00:00:00Z',
          permissions: ['dashboard.view', 'hr.manage', 'users.manage', 'reports.view']
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      setMessage("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingUser) {
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userForm, role: userForm.role, permissions: userForm.permissions }
            : user
        ))
        setMessage("User updated successfully!")
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          ...userForm,
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        setUsers(prev => [...prev, newUser])
        setMessage("User created successfully!")
      }
      
      setShowUserForm(false)
      setEditingUser(null)
      setUserForm({ name: '', email: '', role: '', permissions: [] })
    } catch (error) {
      setMessage("Failed to save user")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingRole) {
        setRoles(prev => prev.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...roleForm }
            : role
        ))
        setMessage("Role updated successfully!")
      } else {
        const newRole: Role = {
          id: roleForm.name.toLowerCase().replace(/\s+/g, '-'),
          ...roleForm,
          isSystem: false
        }
        setRoles(prev => [...prev, newRole])
        setMessage("Role created successfully!")
      }
      
      setShowRoleForm(false)
      setEditingRole(null)
      setRoleForm({ name: '', description: '', permissions: [] })
    } catch (error) {
      setMessage("Failed to save role")
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    })
    setShowUserForm(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    })
    setShowRoleForm(true)
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(prev => prev.filter(user => user.id !== id))
        setMessage("User deleted successfully!")
      } catch (error) {
        setMessage("Failed to delete user")
      }
    }
  }

  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        setRoles(prev => prev.filter(role => role.id !== id))
        setMessage("Role deleted successfully!")
      } catch (error) {
        setMessage("Failed to delete role")
      }
    }
  }

  const togglePermission = (permission: string, isUser: boolean = true) => {
    if (isUser) {
      setUserForm(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission]
      }))
    } else {
      setRoleForm(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission]
      }))
    }
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : roleId
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'inactive': return '#6b7280'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading users and roles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>User Roles & Permissions</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={() => {
              setShowRoleForm(true)
              setEditingRole(null)
              setRoleForm({ name: '', description: '', permissions: [] })
            }}
            className="btn secondary"
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Add Role
          </button>
          <button 
            onClick={() => {
              setShowUserForm(true)
              setEditingUser(null)
              setUserForm({ name: '', email: '', role: '', permissions: [] })
            }}
            className="btn primary"
          >
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Add User
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      {/* Users List */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Users size={20} />
          Users ({users.length})
        </h3>
        
        {users.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>👥</div>
            <p className="muted" style={{marginBottom: '1rem'}}>No users found.</p>
            <button 
              onClick={() => {
                setShowUserForm(true)
                setEditingUser(null)
                setUserForm({ name: '', email: '', role: '', permissions: [] })
              }}
              className="btn primary"
            >
              <Plus size={16} style={{marginRight: '0.5rem'}} />
              Add First User
            </button>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{fontWeight: '500'}}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge" style={{fontSize: '0.75rem'}}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(user.status),
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-sm btn-secondary"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Roles List */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Shield size={20} />
          Roles ({roles.length})
        </h3>
        
        <div style={{display: 'grid', gap: '1rem'}}>
          {roles.map((role) => (
            <div key={role.id} className="card" style={{padding: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div>
                  <h4 style={{margin: '0 0 0.25rem 0'}}>
                    {role.name}
                    {role.isSystem && (
                      <span className="badge" style={{marginLeft: '0.5rem', fontSize: '0.75rem'}}>
                        System
                      </span>
                    )}
                  </h4>
                  <p style={{margin: '0 0 0.5rem 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                    {role.description}
                  </p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                    {role.permissions.map(permission => (
                      <span key={permission} className="badge" style={{fontSize: '0.75rem'}}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    onClick={() => handleEditRole(role)}
                    className="btn btn-sm btn-secondary"
                    disabled={role.isSystem}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="btn btn-sm btn-danger"
                    disabled={role.isSystem}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
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
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleUserSubmit}>
              <div className="row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({...prev, role: e.target.value}))}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem'}}>
                  {AVAILABLE_PERMISSIONS.map(permission => (
                    <label key={permission} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
                      <input
                        type="checkbox"
                        checked={userForm.permissions.includes(permission)}
                        onChange={() => togglePermission(permission, true)}
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>

              <div className="btn-group" style={{justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Form Modal */}
      {showRoleForm && (
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
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h3>
            
            <form onSubmit={handleRoleSubmit}>
              <div className="form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({...prev, name: e.target.value}))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem'}}>
                  {AVAILABLE_PERMISSIONS.map(permission => (
                    <label key={permission} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
                      <input
                        type="checkbox"
                        checked={roleForm.permissions.includes(permission)}
                        onChange={() => togglePermission(permission, false)}
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>

              <div className="btn-group" style={{justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={() => setShowRoleForm(false)}
                  className="btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
