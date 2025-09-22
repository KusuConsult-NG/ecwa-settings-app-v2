"use client"
import { useState, useEffect } from "react"

export default function DebugAuthPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/debug/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.error || 'Failed to load users')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      console.log('Login test result:', data)
      alert(`Login test: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`)
    } catch (err) {
      console.error('Login test error:', err)
      alert('Login test failed with network error')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div className="card">
        <h2>Authentication Debug</h2>
        
        {error && (
          <div className="alert alert-error" style={{marginBottom: '1rem'}}>
            {error}
          </div>
        )}

        <div style={{marginBottom: '2rem'}}>
          <h3>Current Users ({users.length})</h3>
          {users.length === 0 ? (
            <p>No users found. Try signing up first.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Test Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => {
                            const password = prompt(`Enter password for ${user.email}:`)
                            if (password) testLogin(user.email, password)
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Test Login
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3>Test Signup</h3>
          <button 
            onClick={async () => {
              const testUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                phone: '+1234567890',
                address: '123 Test Street'
              }
              
              try {
                const response = await fetch('/api/auth/signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(testUser)
                })
                
                const data = await response.json()
                console.log('Signup test result:', data)
                alert(`Signup test: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`)
                
                if (data.success) {
                  loadUsers() // Refresh the user list
                }
              } catch (err) {
                console.error('Signup test error:', err)
                alert('Signup test failed with network error')
              }
            }}
            className="btn primary"
          >
            Create Test User
          </button>
        </div>

        <div>
          <h3>Instructions</h3>
          <ol>
            <li>Check if users exist in the table above</li>
            <li>If no users, click "Create Test User" to create one</li>
            <li>Use "Test Login" to verify login works for each user</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
