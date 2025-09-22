"use client"
import { useEffect, useState } from "react"
import { Building, Users, Plus, ArrowRight, Mail, Phone, MapPin, User } from "lucide-react"
import { DataPersistence } from '@/lib/data-persistence'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type Org = { id: string; name: string; type: string; parentId?: string }

// ECWA Organizational Roles by Level
const ORGANIZATIONAL_ROLES = {
  GCC: [
    { id: 'president', name: 'President', required: true },
    { id: 'vice-president', name: 'Vice President', required: false },
    { id: 'general-secretary', name: 'General Secretary', required: true },
    { id: 'assistant-secretary', name: 'Assistant Secretary', required: false },
    { id: 'treasurer', name: 'Treasurer', required: true },
    { id: 'financial-secretary', name: 'Financial Secretary', required: false },
    { id: 'evangelism-secretary', name: 'Evangelism Secretary', required: false },
    { id: 'youth-secretary', name: 'Youth Secretary', required: false },
    { id: 'women-secretary', name: 'Women Secretary', required: false },
    { id: 'men-secretary', name: 'Men Secretary', required: false },
    { id: 'children-secretary', name: 'Children Secretary', required: false },
    { id: 'education-secretary', name: 'Education Secretary', required: false },
    { id: 'social-secretary', name: 'Social Secretary', required: false },
    { id: 'legal-advisor', name: 'Legal Advisor', required: false },
    { id: 'auditor', name: 'Auditor', required: false }
  ],
  DCC: [
    { id: 'chairman', name: 'Chairman', required: true },
    { id: 'vice-chairman', name: 'Vice Chairman', required: false },
    { id: 'district-secretary', name: 'District Secretary', required: true },
    { id: 'assistant-secretary', name: 'Assistant District Secretary', required: false },
    { id: 'treasurer', name: 'Treasurer', required: true },
    { id: 'financial-secretary', name: 'Financial Secretary', required: false },
    { id: 'delegate', name: 'Delegate', required: false },
    { id: 'cel', name: 'CEL (Church Education Leader)', required: false }
  ],
  LCC: [
    { id: 'local-overseer', name: 'Local Overseer (LO)', required: true },
    { id: 'assistant-lo', name: 'Assistant Local Overseer', required: false },
    { id: 'secretary', name: 'Secretary', required: true },
    { id: 'treasurer', name: 'Treasurer', required: true },
    { id: 'financial-secretary', name: 'Financial Secretary', required: false },
    { id: 'delegate', name: 'Delegate', required: false }
  ],
  LC: [
    { id: 'senior-minister', name: 'Senior Minister', required: true },
    { id: 'associate-minister', name: 'Associate Minister', required: false },
    { id: 'pastor', name: 'Pastor', required: false },
    { id: 'elder-treasurer', name: 'Elder - Treasurer', required: false },
    { id: 'elder-financial', name: 'Elder - Financial Secretary', required: false },
    { id: 'elder-works', name: 'Elder - Works Superintendent', required: false },
    { id: 'elder-usher', name: 'Elder - Chief Usher', required: false },
    { id: 'elder-missions', name: 'Elder - Missions Director', required: false },
    { id: 'elder-welfare', name: 'Elder - Welfare', required: false },
    { id: 'elder-custom', name: 'Elder - Custom Role', required: false }
  ]
}

type Leader = {
  id: string
  title: string
  academicTitle: string
  firstName: string
  surname: string
  otherNames: string
  email: string
  phone: string
  position: string
  isRequired: boolean
}

export default function OrgCreatePage() {
  const [orgType, setOrgType] = useState<string>("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [selectedParent, setSelectedParent] = useState("")
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [showLeaderForm, setShowLeaderForm] = useState(false)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
  const [leaderForm, setLeaderForm] = useState({
    title: '',
    academicTitle: '',
    firstName: '',
    surname: '',
    otherNames: '',
    email: '',
    phone: '',
    position: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const [parentOrgs, setParentOrgs] = useState<Org[]>([])
  const [members, setMembers] = useState<{name: string, email: string, role: string}[]>([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberForm, setMemberForm] = useState({name: '', email: '', role: ''})

  useEffect(() => {
    setMounted(true)
    
    // Load saved form data from localStorage
    const savedData = DataPersistence.load('org_form_data', null) as any
    if (savedData) {
      setOrgType(savedData.orgType || '')
      setOrgName(savedData.orgName || '')
      setEmail(savedData.email || '')
      setPhone(savedData.phone || '')
      setAddress(savedData.address || '')
      setSelectedParent(savedData.selectedParent || '')
      setLeaders(savedData.leaders || [])
      setMembers(savedData.members || [])
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    loadParentOrganizations()
  }, [mounted, orgType])

  const loadParentOrganizations = async () => {
    if (!orgType) return
    
    try {
      let parentType = ''
      switch (orgType) {
        case 'DCC': parentType = 'GCC'; break
        case 'LCC': parentType = 'DCC'; break
        case 'LC': parentType = 'LCC'; break
        default: return
      }
      
      const response = await fetch(`/api/org?type=${parentType}`)
      const data = await response.json()
      setParentOrgs(data.items || [])
    } catch (error) {
      console.error('Error loading parent organizations:', error)
    }
  }

  const getOrgTypeInfo = () => {
    switch (orgType) {
      case 'GCC':
        return {
          title: 'General Church Council (GCC)',
          description: 'Create the highest level of ECWA organization',
          icon: '🌍',
          placeholder: 'ECWA General Church Council',
          requiresParent: false
        }
      case 'DCC':
        return {
          title: 'District Church Council (DCC)',
          description: 'Create a district-level organization under GCC',
          icon: '🏢',
          placeholder: 'ECWA Kaswamagamu DCC',
          requiresParent: true,
          parentLabel: 'GCC'
        }
      case 'LCC':
        return {
          title: 'Local Church Council (LCC)',
          description: 'Create a local council under a DCC',
          icon: '🏛️',
          placeholder: 'ECWA Jos Central LCC',
          requiresParent: true,
          parentLabel: 'DCC'
        }
      case 'LC':
        return {
          title: 'Local Church (LC)',
          description: 'Create a local church under an LCC',
          icon: '🏢',
          placeholder: 'ECWA • LC – Example Name',
          requiresParent: true,
          parentLabel: 'LCC'
        }
      default:
        return {
          title: 'Create Organization',
          description: 'Select an organization type to get started',
          icon: '🏢',
          placeholder: 'Organization Name',
          requiresParent: false
        }
    }
  }

  const getAvailableRoles = () => {
    return ORGANIZATIONAL_ROLES[orgType as keyof typeof ORGANIZATIONAL_ROLES] || []
  }

  const handleAddLeader = () => {
    if (!leaderForm.firstName || !leaderForm.surname || !leaderForm.email || !leaderForm.position) {
      setMessage("Please fill in all required fields")
      return
    }

    const newLeader: Leader = {
      id: Date.now().toString(),
      ...leaderForm,
      isRequired: getAvailableRoles().find(role => role.id === leaderForm.position)?.required || false
    }

    let updatedLeaders: Leader[]
    if (editingLeader) {
      updatedLeaders = leaders.map(leader => 
        leader.id === editingLeader.id ? newLeader : leader
      )
    } else {
      updatedLeaders = [...leaders, newLeader]
    }
    
    setLeaders(updatedLeaders)

    setLeaderForm({
      title: '',
      academicTitle: '',
      firstName: '',
      surname: '',
      otherNames: '',
      email: '',
      phone: '',
      position: ''
    })
    setShowLeaderForm(false)
    setEditingLeader(null)
    
    // Save form data after adding/editing leader
    setTimeout(() => {
      const formData = {
        orgType,
        orgName,
        email,
        phone,
        address,
        selectedParent,
        leaders: updatedLeaders,
        members
      }
      DataPersistence.save('org_form_data', formData)
    }, 100)
  }

  const handleEditLeader = (leader: Leader) => {
    setEditingLeader(leader)
    setLeaderForm({
      title: leader.title,
      academicTitle: leader.academicTitle,
      firstName: leader.firstName,
      surname: leader.surname,
      otherNames: leader.otherNames,
      email: leader.email,
      phone: leader.phone,
      position: leader.position
    })
    setShowLeaderForm(true)
  }

  const handleDeleteLeader = (id: string) => {
    const updatedLeaders = leaders.filter(leader => leader.id !== id)
    setLeaders(updatedLeaders)
    
    // Save form data after deleting leader
    setTimeout(() => {
      const formData = {
        orgType,
        orgName,
        email,
        phone,
        address,
        selectedParent,
        leaders: updatedLeaders,
        members
      }
      DataPersistence.save('org_form_data', formData)
    }, 100)
  }

  const addMember = () => {
    if (memberForm.name && memberForm.email && memberForm.role) {
      const updatedMembers = [...members, { ...memberForm }]
      setMembers(updatedMembers)
      setMemberForm({ name: '', email: '', role: '' })
      setShowMemberForm(false)
      
      // Save form data after adding member
      setTimeout(() => {
        const formData = {
          orgType,
          orgName,
          email,
          phone,
          address,
          selectedParent,
          leaders,
          members: updatedMembers
        }
        DataPersistence.save('org_form_data', formData)
      }, 100)
    }
  }

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index)
    setMembers(updatedMembers)
    
    // Save form data after removing member
    setTimeout(() => {
      const formData = {
        orgType,
        orgName,
        email,
        phone,
        address,
        selectedParent,
        leaders,
        members: updatedMembers
      }
      DataPersistence.save('org_form_data', formData)
    }, 100)
  }

  const resetMemberForm = () => {
    setMemberForm({ name: '', email: '', role: '' })
    setShowMemberForm(false)
  }

  const saveFormData = () => {
    const formData = {
      orgType,
      orgName,
      email,
      phone,
      address,
      selectedParent,
      leaders,
      members
    }
    DataPersistence.save('org_form_data', formData)
  }

  const clearFormData = () => {
    DataPersistence.remove('org_form_data')
    setOrgType('')
    setOrgName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setSelectedParent('')
    setLeaders([])
    setMembers([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName || !email || !orgType) {
      setMessage("Please fill in all required fields")
      return
    }

    if (orgType !== 'GCC' && !selectedParent) {
      setMessage("Please select a parent organization")
      return
    }

    const requiredRoles = getAvailableRoles().filter(role => role.required)
    const hasRequiredLeaders = requiredRoles.every(role => 
      leaders.some(leader => leader.position === role.id)
    )

    if (!hasRequiredLeaders) {
      setMessage(`Please add leaders for all required positions: ${requiredRoles.map(r => r.name).join(', ')}`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          type: orgType,
          email: email.trim(),
          phone: phone || undefined,
          address: address || undefined,
          parentId: selectedParent || undefined,
          leaders: leaders,
          members: members
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message || `${orgType} created successfully! ${data.membersInvited || 0} invitation(s) sent to members.`)
        
        // Clear saved form data and reset form
        clearFormData()
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.message || error.error || 'Failed to create organization'}`)
      }
    } catch (error) {
      console.error('Error creating organization:', error)
      setMessage('Failed to create organization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const orgInfo = getOrgTypeInfo()

  return (
    <div className="container">
      <div className="section-title">
        <h2>Create Organization</h2>
        <p className="muted">Set up new ECWA organizations with proper hierarchy and leadership structure</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Organization Type Selection */}
          <div className="form-section" style={{marginBottom: '2rem'}}>
            <h3 style={{margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1.1rem'}}>
              {orgInfo.icon} Organization Type
            </h3>
            <div className="row">
              <div className="form-group">
                <label>Organization Level *</label>
                <select 
                  value={orgType} 
                  onChange={(e) => {
                    setOrgType(e.target.value)
                    setSelectedParent("")
                    setLeaders([])
                    setTimeout(saveFormData, 100)
                  }}
                  required
                  disabled={loading}
                >
                  <option value="">Select Organization Type</option>
                  <option value="GCC">🌍 General Church Council (GCC)</option>
                  <option value="DCC">🏢 District Church Council (DCC)</option>
                  <option value="LCC">🏛️ Local Church Council (LCC)</option>
                  <option value="LC">🏢 Local Church (LC)</option>
                </select>
              </div>
            </div>
          </div>

          {orgType && (
            <>
              {/* Basic Information */}
              <div className="form-section" style={{marginBottom: '2rem'}}>
                <h3 style={{margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1.1rem'}}>
                  {orgInfo.icon} {orgInfo.title}
                </h3>
                <p className="muted" style={{marginBottom: '1rem'}}>{orgInfo.description}</p>
                
                <div className="row">
                  <div className="form-group">
                    <label>Organization Name *</label>
                    <input 
                      value={orgName} 
                      onChange={e => {
                        setOrgName(e.target.value)
                        setTimeout(saveFormData, 100)
                      }} 
                      placeholder={orgInfo.placeholder}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email *</label>
                    <input 
                      type="email"
                      value={email} 
                      onChange={e => {
                        setEmail(e.target.value)
                        setTimeout(saveFormData, 100)
                      }} 
                      placeholder={`admin@ecwa-${orgType.toLowerCase()}-name.org`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      value={phone} 
                      onChange={e => {
                        setPhone(e.target.value)
                        setTimeout(saveFormData, 100)
                      }} 
                      placeholder="+234 803 123 4567"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input 
                      value={address} 
                      onChange={e => {
                        setAddress(e.target.value)
                        setTimeout(saveFormData, 100)
                      }} 
                      placeholder="123 Church Street, City, State"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Parent Organization Selection */}
              {orgInfo.requiresParent && (
                <div className="form-section" style={{marginBottom: '2rem'}}>
                  <h3 style={{margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1.1rem'}}>
                    Parent Organization
                  </h3>
                  <div className="row">
                    <div className="form-group">
                      <label>{orgInfo.parentLabel} *</label>
                      <select 
                        value={selectedParent} 
                        onChange={e => {
                          setSelectedParent(e.target.value)
                          setTimeout(saveFormData, 100)
                        }}
                        required
                        disabled={loading}
                      >
                        <option value="">Select {orgInfo.parentLabel}</option>
                        {parentOrgs.map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Leadership Management */}
              <div className="form-section" style={{marginBottom: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <h3 style={{margin: 0, color: 'var(--primary)', fontSize: '1.1rem'}}>
                    <Users size={20} style={{marginRight: '0.5rem'}} />
                    Leadership Team
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowLeaderForm(true)}
                    className="btn primary"
                    disabled={loading}
                  >
                    <Plus size={16} style={{marginRight: '0.5rem'}} />
                    Add Leader
                  </button>
                </div>

                {leaders.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '8px'}}>
                    <Users size={48} style={{color: 'var(--muted)', marginBottom: '1rem'}} />
                    <p className="muted">No leaders added yet. Click "Add Leader" to get started.</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '1rem'}}>
                    {leaders.map((leader) => (
                      <div key={leader.id} className="card" style={{padding: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          <div>
                            <h4 style={{margin: '0 0 0.25rem 0'}}>
                              {[leader.title, leader.academicTitle].filter(Boolean).join(' ')} {leader.firstName} {leader.surname} {leader.otherNames}
                            </h4>
                            <p style={{margin: '0 0 0.5rem 0', color: 'var(--muted)'}}>
                              {getAvailableRoles().find(role => role.id === leader.position)?.name}
                            </p>
                            <div style={{display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--muted)'}}>
                              <span>📧 {leader.email}</span>
                              {leader.phone && <span>📞 {leader.phone}</span>}
                            </div>
                          </div>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button
                              type="button"
                              onClick={() => handleEditLeader(leader)}
                              className="btn btn-sm btn-secondary"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLeader(leader.id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-actions" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <button 
                  type="button"
                  onClick={saveFormData}
                  className="btn secondary"
                  disabled={loading}
                >
                  💾 Save Draft
                </button>
                <button 
                  type="submit"
                  className="btn primary" 
                  disabled={loading || !orgName || !email || (orgInfo.requiresParent && !selectedParent)}
                  style={{ minWidth: '200px' }}
                >
                  {loading ? `Creating ${orgType}...` : `Create ${orgType}`}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Leader Form Modal */}
        {showLeaderForm && (
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
                {editingLeader ? 'Edit Leader' : 'Add New Leader'}
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddLeader(); }}>
                <div className="row">
                  <div className="form-group">
                    <label>Religious Title</label>
                    <select
                      value={leaderForm.title}
                      onChange={(e) => setLeaderForm({...leaderForm, title: e.target.value})}
                    >
                      <option value="">Select Religious Title</option>
                      <option value="Rev.">Rev.</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Pst.">Pst.</option>
                      <option value="Elder">Elder</option>
                      <option value="Bishop">Bishop</option>
                      <option value="Archbishop">Archbishop</option>
                      <option value="Canon">Canon</option>
                      <option value="Venerable">Venerable</option>
                      <option value="Very Rev.">Very Rev.</option>
                      <option value="Rt. Rev.">Rt. Rev.</option>
                      <option value="Most Rev.">Most Rev.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Academic/Professional Title</label>
                    <select
                      value={leaderForm.academicTitle}
                      onChange={(e) => setLeaderForm({...leaderForm, academicTitle: e.target.value})}
                    >
                      <option value="">Select Academic Title</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Engr.">Engr.</option>
                      <option value="Arc.">Arc.</option>
                      <option value="Barr.">Barr.</option>
                      <option value="Pharm.">Pharm.</option>
                      <option value="Capt.">Capt.</option>
                      <option value="Col.">Col.</option>
                      <option value="Gen.">Gen.</option>
                      <option value="Hon.">Hon.</option>
                      <option value="Sir">Sir</option>
                      <option value="Dame">Dame</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Position *</label>
                    <select
                      value={leaderForm.position}
                      onChange={(e) => setLeaderForm({...leaderForm, position: e.target.value})}
                      required
                    >
                      <option value="">Select Position</option>
                      {getAvailableRoles().map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name} {role.required ? '(Required)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={leaderForm.firstName}
                      onChange={(e) => setLeaderForm({...leaderForm, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Surname *</label>
                    <input
                      type="text"
                      value={leaderForm.surname}
                      onChange={(e) => setLeaderForm({...leaderForm, surname: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Other Names</label>
                    <input
                      type="text"
                      value={leaderForm.otherNames}
                      onChange={(e) => setLeaderForm({...leaderForm, otherNames: e.target.value})}
                      placeholder="Middle names, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={leaderForm.phone}
                      onChange={(e) => setLeaderForm({...leaderForm, phone: e.target.value})}
                      placeholder="+234 803 123 4567"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={leaderForm.email}
                    onChange={(e) => setLeaderForm({...leaderForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="btn-group" style={{justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeaderForm(false)
                      setEditingLeader(null)
                      setLeaderForm({
                        title: '',
                        academicTitle: '',
                        firstName: '',
                        surname: '',
                        otherNames: '',
                        email: '',
                        phone: '',
                        position: ''
                      })
                    }}
                    className="btn secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary"
                  >
                    {editingLeader ? 'Update Leader' : 'Add Leader'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Members Section */}
        <div className="card">
          <div className="card-header">
            <h3>Members to Invite</h3>
            <p className="muted">Add members who will receive email invitations to join this organization</p>
          </div>
          
          <div className="card-body">
            {members.length > 0 && (
              <div className="table-container" style={{marginBottom: "1rem"}}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr key={index}>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.role}</td>
                        <td>
                          <button
                            onClick={() => removeMember(index)}
                            className="btn-sm btn-danger"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowMemberForm(true)}
              className="btn secondary"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
        </div>

        {/* Member Form Modal */}
        {showMemberForm && (
          <div className="modal-overlay" onClick={resetMemberForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Member</h3>
                <button onClick={resetMemberForm} className="btn ghost">×</button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); addMember(); }}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="member">Member</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="helper">Helper</option>
                      <option value="supporter">Supporter</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={resetMemberForm}
                    className="btn secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}