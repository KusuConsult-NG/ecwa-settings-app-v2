"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Shield, Users, MapPin, Phone, Calendar, Star } from 'lucide-react'

export default function EditAgencyPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    leader: '',
    contact: '',
    location: '',
    established: '',
    status: 'active'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const params = useParams()

  const agencyTypes = [
    'Ministry',
    'Outreach', 
    'Fellowship',
    'Service',
    'Prayer Group',
    'Bible Study',
    'Evangelism',
    'Welfare',
    'Education',
    'Media',
    'Music',
    'Drama',
    'Sports',
    'Other'
  ]

  useEffect(() => {
    // Load agency data
    loadAgencyData()
  }, [params.id])

  const loadAgencyData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call to load agency data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - in real app, this would come from API
      const agencyData = {
        name: 'Women\'s Fellowship',
        type: 'Ministry',
        description: 'Empowering women through fellowship and service',
        leader: 'Sister Mary Johnson',
        contact: '+234 801 234 5678',
        location: 'Main Church',
        established: '2015-03-15',
        status: 'active'
      }
      
      setFormData(agencyData)
    } catch (error) {
      console.error('Error loading agency data:', error)
      setError('Failed to load agency data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.name || !formData.type || !formData.leader || !formData.contact) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Updated agency data:', formData)
      setSuccess('Agency updated successfully!')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/agencies')
      }, 2000)
      
    } catch (error) {
      setError('Failed to update agency. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !formData.name) {
    return (
      <div className="container">
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <div className="loading">Loading agency data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div style={{display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem"}}>
            <button 
              onClick={() => router.back()}
              className="btn ghost"
              style={{padding: "0.5rem"}}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{margin: 0, display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Shield size={24} />
                Edit Agency
              </h1>
              <p className="muted" style={{margin: "0.25rem 0 0 0"}}>
                Update agency information
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="row">
            <div className="form-group">
              <label htmlFor="name">
                <Shield size={16} style={{marginRight: "0.5rem"}} />
                Agency Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Women's Fellowship"
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">
                <Star size={16} style={{marginRight: "0.5rem"}} />
                Agency Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="">Select agency type</option>
                {agencyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the agency's purpose and activities"
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="leader">
                <Users size={16} style={{marginRight: "0.5rem"}} />
                Leader/Coordinator *
              </label>
              <input
                type="text"
                id="leader"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                required
                placeholder="e.g., Sister Mary Johnson"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">
                <Phone size={16} style={{marginRight: "0.5rem"}} />
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="e.g., +234 801 234 5678"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={16} style={{marginRight: "0.5rem"}} />
                Location/Meeting Place
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Church, Youth Center"
              />
            </div>
            <div className="form-group">
              <label htmlFor="established">
                <Calendar size={16} style={{marginRight: "0.5rem"}} />
                Established Date
              </label>
              <input
                type="date"
                id="established"
                name="established"
                value={formData.established}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Agency'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


