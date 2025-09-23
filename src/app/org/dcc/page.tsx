"use client"
import { useState, useEffect } from "react"
import { Building, Plus, Users, Mail, Phone, MapPin, Globe, ArrowDown } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type Organization = {
  id: string
  name: string
  type: string
  parentId?: string
}

export default function CreateDccPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [selectedGcc, setSelectedGcc] = useState("")
  const [gccs, setGccs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchGccs()
  }, [])

  const fetchGccs = async () => {
    try {
      const response = await fetch('/api/org?type=GCC')
      const data = await response.json()
      if (response.ok) {
        setGccs(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch GCCs:', error)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setAddress("")
    setPhone("")
    setWebsite("")
    setSelectedGcc("")
    setMessage("")
  }

  async function createOrganization(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !selectedGcc) {
      setMessage("Organization name, email, and parent GCC are required")
      return
    }
    
    setLoading(true)
    setMessage("")
    
    try {
      // Create a leader for the DCC
      const leaders = [{
        firstName: 'District',
        surname: 'Leader',
        email: email.trim(),
        role: 'District Leader',
        phone: phone || '',
        address: address || ''
      }]

      const body = {
        name: name.trim(),
        type: 'DCC',
        email: email.trim(),
        address: address || undefined,
        phone: phone || undefined,
        website: website || undefined,
        parentId: selectedGcc,
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
        setMessage(`DCC created successfully! Verification code sent to ${email}`)
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error || error.message || 'Failed to create DCC'}`)
      }
    } catch (error) {
      console.error('Error creating DCC:', error)
      setMessage('Failed to create DCC. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
          <Building size={24} style={{marginRight: '1rem', color: 'var(--primary)'}} />
          <div>
            <h1 style={{margin: 0, fontSize: '1.5rem'}}>Create DCC</h1>
            <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.9rem'}}>
              District Coordinating Council - Regional Administration
            </p>
          </div>
        </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <form onSubmit={createOrganization}>
        {/* Parent Organization */}
        <div style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <ArrowDown size={20} style={{marginRight: '0.5rem'}} />
            Parent Organization
          </h3>
          
          <div className="form-group">
            <label>Parent GCC *</label>
            <select
              value={selectedGcc}
              onChange={(e) => setSelectedGcc(e.target.value)}
              required
            >
              <option value="">Select Parent GCC</option>
              {gccs.map((gcc) => (
                <option key={gcc.id} value={gcc.id}>
                  {gcc.name}
                </option>
              ))}
            </select>
            {gccs.length === 0 && (
              <p style={{color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                No GCC organizations found. Please create a GCC first.
              </p>
            )}
          </div>
        </div>

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
                placeholder="e.g., ECWA Jos DCC"
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@josdcc.ecwa.org"
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
                placeholder="https://josdcc.ecwa.org"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jos District Office, Plateau State, Nigeria"
              rows={3}
            />
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
            disabled={loading || !name || !email || !selectedGcc}
          >
            {loading ? 'Creating...' : 'Create DCC'}
            <Plus size={16} style={{marginLeft: '0.5rem'}} />
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
