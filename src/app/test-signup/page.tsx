"use client"
import { useState } from "react"

export default function TestSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  })
  const [result, setResult] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data being sent:', formData)
    
    // Check if confirmPassword is included
    if (!formData.confirmPassword) {
      setResult('ERROR: confirmPassword is missing from form data!')
      return
    }
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setResult('Error: ' + (err as Error).message)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Signup Form</h1>
      
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}>
        <h3>Current Form Data:</h3>
        <pre style={{ fontSize: '12px', margin: 0 }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Test Signup
        </button>
      </form>
      
      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{result}</pre>
        </div>
      )}
    </div>
  )
}
