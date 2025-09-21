"use client"
import { useState, useEffect } from "react"
import { Settings, Save, RefreshCw, Database, Mail, Shield, Bell } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function SystemConfigPage() {
  const [config, setConfig] = useState({
    appName: 'ECWA Settings',
    appVersion: '1.0.0',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowSelfRegistration: true,
    defaultLanguage: 'en',
    timezone: 'Africa/Lagos',
    currency: 'NGN',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light'
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      // For now, we'll use the default config
      setMessage("Configuration loaded successfully")
    } catch (error) {
      setMessage("Failed to load configuration")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Configuration saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to save configuration")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading system configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>System Configuration</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={loadConfig}
            className="btn secondary"
            disabled={loading}
          >
            <RefreshCw size={16} style={{marginRight: '0.5rem'}} />
            Refresh
          </button>
          <button 
            onClick={handleSave}
            className="btn primary"
            disabled={saving}
          >
            <Save size={16} style={{marginRight: '0.5rem'}} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      {/* General Settings */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Settings size={20} />
          General Settings
        </h3>
        
        <div className="row">
          <div className="form-group">
            <label>Application Name</label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Version</label>
            <input
              type="text"
              value={config.appVersion}
              onChange={(e) => handleChange('appVersion', e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Default Language</label>
            <select
              value={config.defaultLanguage}
              onChange={(e) => handleChange('defaultLanguage', e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={config.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              <option value="Africa/Lagos">Africa/Lagos</option>
              <option value="Africa/Abuja">Africa/Abuja</option>
              <option value="Africa/Kano">Africa/Kano</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Currency</label>
            <select
              value={config.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              <option value="NGN">Nigerian Naira (NGN)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date Format</label>
            <select
              value={config.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Shield size={20} />
          Security Settings
        </h3>
        
        <div className="row">
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
            />
          </div>
          <div className="form-group">
            <label>Max Login Attempts</label>
            <input
              type="number"
              value={config.maxLoginAttempts}
              onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
              min="3"
              max="10"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Password Minimum Length</label>
            <input
              type="number"
              value={config.passwordMinLength}
              onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
              min="6"
              max="20"
            />
          </div>
          <div className="form-group">
            <label>Require Two-Factor Authentication</label>
            <select
              value={config.requireTwoFactor ? 'true' : 'false'}
              onChange={(e) => handleChange('requireTwoFactor', e.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Allow Self Registration</label>
            <select
              value={config.allowSelfRegistration ? 'true' : 'false'}
              onChange={(e) => handleChange('allowSelfRegistration', e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Maintenance Mode</label>
            <select
              value={config.maintenanceMode ? 'true' : 'false'}
              onChange={(e) => handleChange('maintenanceMode', e.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Bell size={20} />
          Notification Settings
        </h3>
        
        <div className="row">
          <div className="form-group">
            <label>Email Notifications</label>
            <select
              value={config.emailNotifications ? 'true' : 'false'}
              onChange={(e) => handleChange('emailNotifications', e.target.value === 'true')}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="form-group">
            <label>SMS Notifications</label>
            <select
              value={config.smsNotifications ? 'true' : 'false'}
              onChange={(e) => handleChange('smsNotifications', e.target.value === 'true')}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Database size={20} />
          Backup Settings
        </h3>
        
        <div className="row">
          <div className="form-group">
            <label>Automatic Backup</label>
            <select
              value={config.autoBackup ? 'true' : 'false'}
              onChange={(e) => handleChange('autoBackup', e.target.value === 'true')}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              value={config.backupFrequency}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              disabled={!config.autoBackup}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
