"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, User } from 'lucide-react'

export default function EditExecutivePage() {
  const [formData, setFormData] = useState({
    title1: '', // Religious title
    title2: '', // Academic/Professional title
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    startDate: '',
    salary: '',
    status: 'active'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const params = useParams()

  // ECWA Executive Positions
  const ecwaPositions = [
    'President',
    'Vice President', 
    'General Secretary',
    'Assistant General Secretary',
    'Treasurer',
    'Financial Secretary',
    'Accountant',
    'Auditor',
    'Legal Adviser'
  ]

  // ECWA Departments (Optional - not all positions have departments)
  const ecwaDepartments = [
    'Education Department',
    'Church-Related Ministry (CRM)',
    'Evangelical Missionary Society (EMS)',
    'Finance Department',
    'Medical and Health Department',
    'Christian Education Department',
    'Church Discipleship Ministry',
    'Media Department'
  ]

  // Religious Titles
  const religiousTitles = [
    'Rev.',
    'Pastor',
    'Pst.',
    'Elder',
    'Bishop',
    'Archbishop',
    'Canon',
    'Venerable',
    'Very Rev.',
    'Rt. Rev.',
    'Most Rev.'
  ]

  // Academic/Professional Titles
  const academicTitles = [
    'Dr.',
    'Prof.',
    'Engr.',
    'Arc.',
    'Barr.',
    'Pharm.',
    'Capt.',
    'Col.',
    'Gen.',
    'Hon.',
    'Sir',
    'Dame'
  ]

  useEffect(() => {
    // Load executive data
    loadExecutiveData()
  }, [params.id])

  const loadExecutiveData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call to load executive data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - in real app, this would come from API
      const executiveData = {
        title1: 'Rev.',
        title2: 'Dr.',
        name: 'John Doe',
        position: 'President',
        department: '',
        email: 'president@ecwa.com',
        phone: '+234 801 234 5678',
        address: '123 Church Street, Jos, Plateau State',
        startDate: '2020-01-01',
        salary: '500000',
        status: 'elected'
      }
      
      setFormData(executiveData)
    } catch (error) {
      console.error('Error loading executive data:', error)
      setError('Failed to load executive data')
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Updated executive data:', formData)
      setSuccess('Executive member updated successfully!')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/executive')
      }, 2000)
      
    } catch (error) {
      setError('Failed to update executive member. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !formData.name) {
    return (
      <div className="container">
        <div className="card" style={{textAlign: "center", padding: "3rem"}}>
          <div className="loading">Loading executive data...</div>
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
                <User size={24} />
                Edit Executive Member
              </h1>
              <p className="muted" style={{margin: "0.25rem 0 0 0"}}>
                Update executive member information
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
          {/* Title Selection */}
          <div className="row">
            <div className="form-group">
              <label htmlFor="title1">Religious Title</label>
              <select
                id="title1"
                name="title1"
                value={formData.title1}
                onChange={handleChange}
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="">Select religious title</option>
                {religiousTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title2">Academic/Professional Title</label>
              <select
                id="title2"
                name="title2"
                value={formData.title2}
                onChange={handleChange}
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="">Select academic/professional title</option>
                {academicTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">ECWA Executive Position *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="">Select ECWA position</option>
                {ecwaPositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="department">Department (Optional)</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="">Select department (if applicable)</option>
                {ecwaDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <small className="muted">Note: Not all positions require a department (e.g., President)</small>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="salary">Salary (₦) *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="Enter monthly salary amount"
                min="0"
                step="1000"
              />
              <small className="muted">This will be managed in HR module for payroll processing</small>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1rem' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
                <option value="elected">Elected</option>
                <option value="appointed">Appointed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter full address"
            />
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
              {isLoading ? 'Updating...' : 'Update Executive Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
