"use client"
import { useState } from "react"
import { Building, Plus, Users, Mail, Phone, MapPin, Globe } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type ExecutiveRole = {
  id: string
  title: string
  description: string
  level: string
  isRequired: boolean
}

export default function CreateGccPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['president', 'general-secretary', 'treasurer'])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // ECWA Executive Roles for GCC
  const executiveRoles: ExecutiveRole[] = [
    { id: 'president', title: 'President', description: 'Overall leadership and spiritual oversight', level: 'GCC', isRequired: true },
    { id: 'vice-president', title: 'Vice President', description: 'Assists the President in leadership duties', level: 'GCC', isRequired: false },
    { id: 'general-secretary', title: 'General Secretary', description: 'Administrative head and record keeping', level: 'GCC', isRequired: true },
    { id: 'assistant-secretary', title: 'Assistant Secretary', description: 'Supports the General Secretary', level: 'GCC', isRequired: false },
    { id: 'treasurer', title: 'Treasurer', description: 'Financial management and oversight', level: 'GCC', isRequired: true },
    { id: 'assistant-treasurer', title: 'Assistant Treasurer', description: 'Supports the Treasurer', level: 'GCC', isRequired: false },
    { id: 'evangelism-secretary', title: 'Evangelism Secretary', description: 'Oversees evangelism and missions', level: 'GCC', isRequired: false },
    { id: 'youth-secretary', title: 'Youth Secretary', description: 'Youth ministry coordination', level: 'GCC', isRequired: false },
    { id: 'women-secretary', title: 'Women Secretary', description: 'Women ministry coordination', level: 'GCC', isRequired: false },
    { id: 'men-secretary', title: 'Men Secretary', description: 'Men ministry coordination', level: 'GCC', isRequired: false },
    { id: 'education-secretary', title: 'Education Secretary', description: 'Educational programs and schools', level: 'GCC', isRequired: false },
    { id: 'health-secretary', title: 'Health Secretary', description: 'Health programs and medical services', level: 'GCC', isRequired: false },
    { id: 'legal-adviser', title: 'Legal Adviser', description: 'Legal counsel and compliance', level: 'GCC', isRequired: false },
    { id: 'auditor', title: 'Auditor', description: 'Financial auditing and oversight', level: 'GCC', isRequired: false }
  ]

  const resetForm = () => {
    setName("")
    setEmail("")
    setAddress("")
    setPhone("")
    setWebsite("")
    setSelectedRoles(['president', 'general-secretary', 'treasurer'])
    setMessage("")
  }

  async function createOrganization(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) {
      setMessage("Organization name and email are required")
      return
    }
    
    setLoading(true)
    setMessage("")
    
    try {
      // Convert selected roles to leaders format expected by API
      const leaders = selectedRoles.map(roleId => {
        const role = executiveRoles.find(r => r.id === roleId)
        return {
          firstName: role?.title.split(' ')[0] || 'Leader',
          surname: role?.title.split(' ').slice(1).join(' ') || 'Position',
          email: email.trim(),
          role: role?.title || 'Executive',
          phone: phone || '',
          address: address || ''
        }
      })

      const body = {
        name: name.trim(),
        type: 'GCC',
        email: email.trim(),
        address: address || undefined,
        phone: phone || undefined,
        website: website || undefined,
        leaders: leaders
      }

      const res = await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (res.ok) { 
        const { org } = await res.json()
        resetForm()
        const roleCount = selectedRoles.length
        setMessage(`GCC created successfully! ${roleCount} verification codes sent to ${email}`)
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error || error.message || 'Failed to create GCC'}`)
      }
    } catch (error) {
      console.error('Error creating GCC:', error)
      setMessage('Failed to create GCC. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = (roleId: string) => {
    const role = executiveRoles.find(r => r.id === roleId)
    if (role?.isRequired) return // Don't allow unchecking required roles
    
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
          <Building size={24} style={{marginRight: '1rem', color: 'var(--primary)'}} />
          <div>
            <h1 style={{margin: 0, fontSize: '1.5rem'}}>Create GCC</h1>
            <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.9rem'}}>
              Global Coordinating Council - ECWA Headquarters
            </p>
          </div>
        </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <form onSubmit={createOrganization}>
        {/* Basic Information */}
        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <Building size={20} style={{marginRight: '0.5rem'}} />
            Basic Information
          </h3>
          
          <div className="row">
            <div className="form-group">
              <label>Organization Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ECWA Global Headquarters"
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecwa.org"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://ecwa.org"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ECWA Headquarters, Jos, Plateau State, Nigeria"
              rows={3}
            />
          </div>
        </div>

        {/* Executive Roles */}
        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <Users size={20} style={{marginRight: '0.5rem'}} />
            Executive Leadership Roles
          </h3>
          <p style={{color: 'var(--muted)', marginBottom: '1rem'}}>
            Select the executive positions for this GCC. Required positions are pre-selected.
          </p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
            {executiveRoles.map((role) => (
              <div 
                key={role.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: selectedRoles.includes(role.id) ? 'var(--primary-light)' : 'transparent',
                  cursor: role.isRequired ? 'default' : 'pointer',
                  opacity: role.isRequired ? 1 : 0.8
                }}
                onClick={() => toggleRole(role.id)}
              >
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    disabled={role.isRequired}
                    style={{marginRight: '0.5rem'}}
                  />
                  <strong style={{color: role.isRequired ? 'var(--primary)' : 'inherit'}}>
                    {role.title}
                    {role.isRequired && <span style={{color: 'var(--error)', marginLeft: '0.25rem'}}>*</span>}
                  </strong>
                </div>
                <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--muted)'}}>
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="btn-group" style={{justifyContent: 'flex-end'}}>
          <button
            type="button"
            onClick={resetForm}
            className="btn secondary"
            disabled={loading}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn primary"
            disabled={loading || !name || !email}
          >
            {loading ? 'Creating...' : 'Create GCC'}
            <Plus size={16} style={{marginLeft: '0.5rem'}} />
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
