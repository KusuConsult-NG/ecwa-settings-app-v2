"use client"
import { useState, useEffect } from "react"
import { Shield, Eye, EyeOff, Key, User, AlertTriangle, CheckCircle } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    requireStrongPassword: true
  })

  useEffect(() => {
    calculatePasswordStrength(newPassword)
  }, [newPassword])

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.match(/[a-z]/)) strength += 1
    if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444'
    if (passwordStrength <= 3) return '#f59e0b'
    if (passwordStrength <= 4) return '#3b82f6'
    return '#10b981'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Fair'
    if (passwordStrength <= 4) return 'Good'
    return 'Strong'
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match")
      setLoading(false)
      return
    }

    if (passwordStrength < 3) {
      setMessage("Password is too weak. Please use a stronger password.")
      setLoading(false)
      return
    }

    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage("Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySettingsChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveSecuritySettings = async () => {
    try {
      setLoading(true)
      // In a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("Security settings saved successfully!")
    } catch (error) {
      setMessage("Failed to save security settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Security Settings</h2>
        <p className="muted">Manage your account security and privacy settings</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      {/* Change Password */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Key size={20} />
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordChange}>
          <div className="form-group" style={{marginBottom: '1rem'}}>
            <label>Current Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{marginBottom: '1rem'}}>
            <label>New Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPassword && (
              <div style={{marginTop: '0.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      height: '100%',
                      backgroundColor: getPasswordStrengthColor(),
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                  <span style={{fontSize: '0.875rem', color: getPasswordStrengthColor(), fontWeight: '500'}}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--muted)'}}>
                  Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                </div>
              </div>
            )}
          </div>

          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label>Confirm New Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <div style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem'}}>
                Passwords do not match
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={loading || passwordStrength < 3 || newPassword !== confirmPassword}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <Shield size={20} />
          Security Preferences
        </h3>
        
        <div className="row">
          <div className="form-group">
            <label>Two-Factor Authentication</label>
            <select
              value={securitySettings.twoFactorEnabled ? 'true' : 'false'}
              onChange={(e) => handleSecuritySettingsChange('twoFactorEnabled', e.target.value === 'true')}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Login Alerts</label>
            <select
              value={securitySettings.loginAlerts ? 'true' : 'false'}
              onChange={(e) => handleSecuritySettingsChange('loginAlerts', e.target.value === 'true')}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecuritySettingsChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
            />
          </div>
          <div className="form-group">
            <label>Max Login Attempts</label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => handleSecuritySettingsChange('maxLoginAttempts', parseInt(e.target.value))}
              min="3"
              max="10"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Password Expiry (days)</label>
            <input
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => handleSecuritySettingsChange('passwordExpiry', parseInt(e.target.value))}
              min="30"
              max="365"
            />
          </div>
          <div className="form-group">
            <label>Require Strong Password</label>
            <select
              value={securitySettings.requireStrongPassword ? 'true' : 'false'}
              onChange={(e) => handleSecuritySettingsChange('requireStrongPassword', e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <button
          onClick={saveSecuritySettings}
          className="btn primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Security Settings'}
        </button>
      </div>

      {/* Security Tips */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <AlertTriangle size={20} />
          Security Tips
        </h3>
        
        <div style={{display: 'grid', gap: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
            <CheckCircle size={16} style={{color: '#10b981', marginTop: '0.25rem', flexShrink: 0}} />
            <div>
              <strong>Use a strong, unique password</strong>
              <p style={{margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                Include uppercase, lowercase, numbers, and special characters. Avoid common words or personal information.
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
            <CheckCircle size={16} style={{color: '#10b981', marginTop: '0.25rem', flexShrink: 0}} />
            <div>
              <strong>Enable two-factor authentication</strong>
              <p style={{margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                Add an extra layer of security by requiring a second verification step when logging in.
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
            <CheckCircle size={16} style={{color: '#10b981', marginTop: '0.25rem', flexShrink: 0}} />
            <div>
              <strong>Keep your session timeout reasonable</strong>
              <p style={{margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                Shorter timeouts reduce the risk of unauthorized access if you forget to log out.
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
            <CheckCircle size={16} style={{color: '#10b981', marginTop: '0.25rem', flexShrink: 0}} />
            <div>
              <strong>Monitor login alerts</strong>
              <p style={{margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.875rem'}}>
                Get notified of suspicious login attempts to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
