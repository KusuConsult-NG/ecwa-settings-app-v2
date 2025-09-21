"use client"
import { useState, useEffect } from "react"
import { Settings, User, Bell, Shield, Database, Save, RefreshCw } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 803 123 4567',
    position: 'Administrator',
    department: 'IT',
    bio: 'System administrator with 5+ years of experience'
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    systemAlerts: true,
    securityAlerts: true
  })
  
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    passwordExpiry: 90
  })
  
  const [system, setSystem] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    currency: 'NGN'
  })

  const handleSave = async (section: string) => {
    try {
      setLoading(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage(`${section} settings saved successfully!`)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(`Failed to save ${section} settings`)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Settings }
  ]

  return (
    <div className="container">
      <div className="section-title">
        <h2>Settings</h2>
        <p className="muted">Manage your account and application preferences</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <div style={{display: 'flex', gap: '2rem'}}>
        {/* Sidebar */}
        <div style={{width: '250px', flexShrink: 0}}>
          <div className="card">
            <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn ${activeTab === tab.id ? 'primary' : 'ghost'}`}
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <Icon size={16} style={{marginRight: '0.75rem'}} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div style={{flex: 1}}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <User size={20} />
                Profile Information
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSave('profile') }}>
                <div className="row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={profile.position}
                      onChange={(e) => setProfile(prev => ({...prev, position: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={profile.department}
                      onChange={(e) => setProfile(prev => ({...prev, department: e.target.value}))}
                    >
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="form-group"></div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  <Save size={16} style={{marginRight: '0.5rem'}} />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <Bell size={20} />
                Notification Preferences
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSave('notifications') }}>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px'}}>
                    <div>
                      <h4 style={{margin: '0 0 0.25rem 0'}}>Email Notifications</h4>
                      <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                        Receive notifications via email
                      </p>
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications(prev => ({...prev, emailNotifications: e.target.checked}))}
                        style={{marginRight: '0.5rem'}}
                      />
                      <span className="toggle"></span>
                    </label>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px'}}>
                    <div>
                      <h4 style={{margin: '0 0 0.25rem 0'}}>SMS Notifications</h4>
                      <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                        Receive notifications via SMS
                      </p>
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications(prev => ({...prev, smsNotifications: e.target.checked}))}
                        style={{marginRight: '0.5rem'}}
                      />
                      <span className="toggle"></span>
                    </label>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px'}}>
                    <div>
                      <h4 style={{margin: '0 0 0.25rem 0'}}>Push Notifications</h4>
                      <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                        Receive push notifications in browser
                      </p>
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications(prev => ({...prev, pushNotifications: e.target.checked}))}
                        style={{marginRight: '0.5rem'}}
                      />
                      <span className="toggle"></span>
                    </label>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px'}}>
                    <div>
                      <h4 style={{margin: '0 0 0.25rem 0'}}>Weekly Reports</h4>
                      <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                        Receive weekly summary reports
                      </p>
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReports}
                        onChange={(e) => setNotifications(prev => ({...prev, weeklyReports: e.target.checked}))}
                        style={{marginRight: '0.5rem'}}
                      />
                      <span className="toggle"></span>
                    </label>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px'}}>
                    <div>
                      <h4 style={{margin: '0 0 0.25rem 0'}}>System Alerts</h4>
                      <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.875rem'}}>
                        Receive system maintenance and update alerts
                      </p>
                    </div>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={notifications.systemAlerts}
                        onChange={(e) => setNotifications(prev => ({...prev, systemAlerts: e.target.checked}))}
                        style={{marginRight: '0.5rem'}}
                      />
                      <span className="toggle"></span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                  style={{marginTop: '1.5rem'}}
                >
                  <Save size={16} style={{marginRight: '0.5rem'}} />
                  {loading ? 'Saving...' : 'Save Notifications'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <Shield size={20} />
                Security Settings
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSave('security') }}>
                <div className="row">
                  <div className="form-group">
                    <label>Two-Factor Authentication</label>
                    <select
                      value={security.twoFactorEnabled ? 'true' : 'false'}
                      onChange={(e) => setSecurity(prev => ({...prev, twoFactorEnabled: e.target.value === 'true'}))}
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))}
                      min="5"
                      max="480"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Login Alerts</label>
                    <select
                      value={security.loginAlerts ? 'true' : 'false'}
                      onChange={(e) => setSecurity(prev => ({...prev, loginAlerts: e.target.value === 'true'}))}
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Password Expiry (days)</label>
                    <input
                      type="number"
                      value={security.passwordExpiry}
                      onChange={(e) => setSecurity(prev => ({...prev, passwordExpiry: parseInt(e.target.value)}))}
                      min="30"
                      max="365"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  <Save size={16} style={{marginRight: '0.5rem'}} />
                  {loading ? 'Saving...' : 'Save Security Settings'}
                </button>
              </form>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="card">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <Settings size={20} />
                System Preferences
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSave('system') }}>
                <div className="row">
                  <div className="form-group">
                    <label>Theme</label>
                    <select
                      value={system.theme}
                      onChange={(e) => setSystem(prev => ({...prev, theme: e.target.value}))}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={system.language}
                      onChange={(e) => setSystem(prev => ({...prev, language: e.target.value}))}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={system.timezone}
                      onChange={(e) => setSystem(prev => ({...prev, timezone: e.target.value}))}
                    >
                      <option value="Africa/Lagos">Africa/Lagos</option>
                      <option value="Africa/Abuja">Africa/Abuja</option>
                      <option value="Africa/Kano">Africa/Kano</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <select
                      value={system.dateFormat}
                      onChange={(e) => setSystem(prev => ({...prev, dateFormat: e.target.value}))}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={system.currency}
                      onChange={(e) => setSystem(prev => ({...prev, currency: e.target.value}))}
                    >
                      <option value="NGN">Nigerian Naira (NGN)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>
                  <div className="form-group"></div>
                </div>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  <Save size={16} style={{marginRight: '0.5rem'}} />
                  {loading ? 'Saving...' : 'Save System Settings'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
