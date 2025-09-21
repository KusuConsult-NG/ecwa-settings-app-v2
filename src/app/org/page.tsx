"use client"
import { useEffect, useState } from "react"
import { Building, Plus, Users, MapPin, ArrowRight } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type Organization = {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC'
  email?: string
  address?: string
  phone?: string
  website?: string
  parentId?: string
  createdAt: string
}

export default function OrgPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/org')
      const data = await response.json()
      
      if (response.ok) {
        setOrganizations(data.items || [])
      } else {
        setError(data.error || 'Failed to fetch organizations')
      }
    } catch (err) {
      setError('Failed to fetch organizations')
    } finally {
      setLoading(false)
    }
  }

  const getOrgTypeInfo = (type: string) => {
    switch (type) {
      case 'GCC':
        return { icon: '🌍', label: 'Global Coordinating Council', color: '#0E4DA4' }
      case 'DCC':
        return { icon: '🏢', label: 'District Coordinating Council', color: '#3B82F6' }
      case 'LCC':
        return { icon: '🏛️', label: 'Local Coordinating Council', color: '#10B981' }
      case 'LC':
        return { icon: '🏢', label: 'Local Church', color: '#F59E0B' }
      default:
        return { icon: '🏢', label: 'Organization', color: '#6B7280' }
    }
  }

  const filteredOrgs = organizations.filter(org => 
    filter === '' || org.type === filter
  )

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
        <h2>Organizations</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <a href="/org/create" className="btn primary">
            <Plus size={16} style={{marginRight: '0.5rem'}} />
            Create Organization
          </a>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{marginBottom: '1rem'}}>
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '1rem'}}>Filter Organizations</h3>
        <div className="row">
          <div className="form-group">
            <label>Organization Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="GCC">🌍 Global Coordinating Council (GCC)</option>
              <option value="DCC">🏢 District Coordinating Council (DCC)</option>
              <option value="LCC">🏛️ Local Coordinating Council (LCC)</option>
              <option value="LC">🏢 Local Church (LC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="card">
        <h3 style={{marginBottom: '1rem'}}>
          Organizations ({filteredOrgs.length})
        </h3>
        
        {filteredOrgs.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🏢</div>
            <p className="muted" style={{marginBottom: '1rem'}}>
              {filter ? 'No organizations found for the selected type.' : 'No organizations found.'}
            </p>
            {!filter && (
              <a href="/org/create" className="btn primary">
                <Plus size={16} style={{marginRight: '0.5rem'}} />
                Create First Organization
              </a>
            )}
          </div>
        ) : (
          <div style={{display: 'grid', gap: '1rem'}}>
            {filteredOrgs.map((org) => {
              const typeInfo = getOrgTypeInfo(org.type)
              return (
                <div 
                  key={org.id} 
                  className="card" 
                  style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // Navigate to specific org type page
                    const typeMap = {
                      'GCC': '/org/gcc',
                      'DCC': '/org/dcc', 
                      'LCC': '/org/lcc',
                      'LC': '/org/lcc' // LCs are managed under LCC
                    }
                    window.location.href = typeMap[org.type] || '/org'
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <div style={{fontSize: '2rem'}}>{typeInfo.icon}</div>
                      <div>
                        <h4 style={{margin: '0 0 0.25rem 0', color: 'var(--text)'}}>
                          {org.name}
                        </h4>
                        <p style={{margin: '0 0 0.5rem 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                          {typeInfo.label}
                        </p>
                        <div style={{display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--muted)'}}>
                          {org.email && (
                            <span>📧 {org.email}</span>
                          )}
                          {org.phone && (
                            <span>📞 {org.phone}</span>
                          )}
                          {org.address && (
                            <span>📍 {org.address}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: typeInfo.color,
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {org.type}
                      </span>
                      <ArrowRight size={16} style={{color: 'var(--muted)'}} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
