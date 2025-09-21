"use client"
import { useState, useEffect } from "react"
import { BarChart3, Users, DollarSign, Calendar, TrendingUp, Activity, Building, Shield, FileText, Plus, Eye, Settings } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type User = {
  id: string
  name: string
  email: string
  role: string
  organizationId: string
  organizationName: string
  organizationType: 'GCC' | 'DCC' | 'LCC' | 'LC'
  position: string
}

type DashboardStats = {
  totalMembers: number
  monthlyIncome: number
  monthlyExpenditure: number
  pendingApprovals: number
  activeMinistries: number
  upcomingEvents: number
  totalChurches?: number
  totalDistricts?: number
  totalLCCs?: number
  totalLCs?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    monthlyIncome: 0,
    monthlyExpenditure: 0,
    pendingApprovals: 0,
    activeMinistries: 0,
    upcomingEvents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from API
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'secretary',
        organizationId: 'org1',
        organizationName: 'ECWA General Church Council',
        organizationType: 'GCC',
        position: 'General Secretary'
      }
      setUser(mockUser)

      // Load stats based on organization type
      const mockStats = getMockStats(mockUser.organizationType)
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMockStats = (orgType: string): DashboardStats => {
    const baseStats = {
      totalMembers: 0,
      monthlyIncome: 0,
      monthlyExpenditure: 0,
      pendingApprovals: 0,
      activeMinistries: 0,
      upcomingEvents: 0
    }

    switch (orgType) {
      case 'GCC':
        return {
          ...baseStats,
          totalMembers: 50000,
          monthlyIncome: 2500000,
          monthlyExpenditure: 1800000,
          pendingApprovals: 15,
          activeMinistries: 25,
          upcomingEvents: 8,
          totalDistricts: 12,
          totalLCCs: 45,
          totalLCs: 180
        }
      case 'DCC':
        return {
          ...baseStats,
          totalMembers: 8000,
          monthlyIncome: 400000,
          monthlyExpenditure: 320000,
          pendingApprovals: 8,
          activeMinistries: 15,
          upcomingEvents: 5,
          totalLCCs: 8,
          totalLCs: 25
        }
      case 'LCC':
        return {
          ...baseStats,
          totalMembers: 2000,
          monthlyIncome: 100000,
          monthlyExpenditure: 85000,
          pendingApprovals: 5,
          activeMinistries: 8,
          upcomingEvents: 3,
          totalLCs: 6
        }
      case 'LC':
        return {
          ...baseStats,
          totalMembers: 500,
          monthlyIncome: 25000,
          monthlyExpenditure: 20000,
          pendingApprovals: 3,
          activeMinistries: 5,
          upcomingEvents: 2
        }
      default:
        return baseStats
    }
  }

  const getDashboardTitle = () => {
    if (!user) return "Dashboard"
    switch (user.organizationType) {
      case 'GCC': return "GCC Dashboard - National Overview"
      case 'DCC': return "DCC Dashboard - Regional Management"
      case 'LCC': return "LCC Dashboard - Local Coordination"
      case 'LC': return "LC Dashboard - Church Operations"
      default: return "Dashboard"
    }
  }

  const getDashboardDescription = () => {
    if (!user) return "Overview of your church management system"
    switch (user.organizationType) {
      case 'GCC': return "National oversight, policy management, and consolidated analytics"
      case 'DCC': return "Regional supervision, resource distribution, and district coordination"
      case 'LCC': return "Local coordination, church oversight, and community management"
      case 'LC': return "Daily church operations, member management, and ministry coordination"
      default: return "Overview of your church management system"
    }
  }

  const getQuickActions = () => {
    if (!user) return []
    
    const baseActions = [
      { href: "/expenditures/new", label: "Add Expenditure", icon: DollarSign, color: "primary" },
      { href: "/income/new", label: "Record Income", icon: TrendingUp, color: "success" },
      { href: "/approvals", label: "Pending Approvals", icon: Activity, color: "warning" },
      { href: "/reports", label: "Generate Report", icon: BarChart3, color: "secondary" }
    ]

    switch (user.organizationType) {
      case 'GCC':
        return [
          ...baseActions,
          { href: "/org/create", label: "Create DCC", icon: Building, color: "primary" },
          { href: "/agencies", label: "Manage Agencies", icon: Users, color: "secondary" },
          { href: "/hr/user-roles", label: "User Management", icon: Shield, color: "secondary" }
        ]
      case 'DCC':
        return [
          ...baseActions,
          { href: "/org/create", label: "Create LCC", icon: Building, color: "primary" },
          { href: "/agencies", label: "Manage Agencies", icon: Users, color: "secondary" },
          { href: "/hr/staff", label: "Staff Management", icon: Users, color: "secondary" }
        ]
      case 'LCC':
        return [
          ...baseActions,
          { href: "/org/create", label: "Create LC", icon: Building, color: "primary" },
          { href: "/agencies", label: "Manage Agencies", icon: Users, color: "secondary" },
          { href: "/hr/staff", label: "Staff Management", icon: Users, color: "secondary" }
        ]
      case 'LC':
        return [
          ...baseActions,
          { href: "/hr/staff", label: "Member Management", icon: Users, color: "primary" },
          { href: "/agencies", label: "Ministry Management", icon: Users, color: "secondary" },
          { href: "/calendar", label: "Schedule Event", icon: Calendar, color: "secondary" }
        ]
      default:
        return baseActions
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const getNetIncome = () => {
    return stats.monthlyIncome - stats.monthlyExpenditure
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>{getDashboardTitle()}</h2>
        <p className="muted">{getDashboardDescription()}</p>
        {user && (
          <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted)'}}>
            Welcome, {user.position} {user.name} • {user.organizationName}
          </div>
        )}
      </div>

      {/* Primary Stats Grid */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Members</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.totalMembers.toLocaleString()}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+5% this month</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Monthly Income</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(stats.monthlyIncome)}</h3>
            </div>
            <DollarSign className="text-success" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+12% from last month</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Monthly Expenditure</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(stats.monthlyExpenditure)}</h3>
            </div>
            <BarChart3 className="text-warning" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <span style={{fontSize: "0.875rem", color: getNetIncome() >= 0 ? 'var(--success)' : 'var(--danger)'}}>
              Net: {formatCurrency(getNetIncome())}
            </span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Pending Approvals</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.pendingApprovals}</h3>
            </div>
            <Activity className="text-warning" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <span className="text-warning" style={{fontSize: "0.875rem"}}>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Organization-specific Stats */}
      {user && (user.organizationType === 'GCC' || user.organizationType === 'DCC' || user.organizationType === 'LCC') && (
        <div className="grid cols-3" style={{marginBottom: "2rem"}}>
          {stats.totalDistricts && (
            <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
              <Building size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h3 style={{margin: "0 0 0.25rem 0", fontSize: "1.5rem"}}>{stats.totalDistricts}</h3>
              <p className="muted" style={{margin: 0}}>Districts</p>
            </div>
          )}
          {stats.totalLCCs && (
            <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
              <Building size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h3 style={{margin: "0 0 0.25rem 0", fontSize: "1.5rem"}}>{stats.totalLCCs}</h3>
              <p className="muted" style={{margin: 0}}>LCCs</p>
            </div>
          )}
          {stats.totalLCs && (
            <div className="card" style={{padding: "1.5rem", textAlign: "center"}}>
              <Building size={32} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h3 style={{margin: "0 0 0.25rem 0", fontSize: "1.5rem"}}>{stats.totalLCs}</h3>
              <p className="muted" style={{margin: 0}}>Local Churches</p>
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid cols-2" style={{gap: "2rem"}}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{margin: "0 0 1rem 0"}}>Recent Activity</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {[
              { action: "New member registered", user: "John Doe", time: "2 hours ago", type: "success" },
              { action: "Offering recorded", user: "Jane Smith", time: "4 hours ago", type: "success" },
              { action: "Requisition approved", user: "Mike Johnson", time: "1 day ago", type: "info" },
              { action: "Report generated", user: "Sarah Wilson", time: "2 days ago", type: "info" },
              { action: "Organization created", user: "Admin", time: "3 days ago", type: "info" }
            ].map((activity, index) => (
              <div key={index} style={{display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", borderRadius: "8px", backgroundColor: "var(--bg)"}}>
                <div style={{
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: activity.type === "success" ? "var(--success)" : "var(--primary)"
                }}></div>
                <div style={{flex: 1}}>
                  <p style={{margin: "0 0 0.25rem 0", fontWeight: "500"}}>{activity.action}</p>
                  <p style={{margin: "0", fontSize: "0.875rem", color: "var(--muted)"}}>by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{margin: "0 0 1rem 0"}}>Quick Actions</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
            {getQuickActions().map((action, index) => {
              const Icon = action.icon
              return (
                <a 
                  key={index}
                  href={action.href} 
                  className={`btn ${action.color}`} 
                  style={{justifyContent: "flex-start"}}
                >
                  <Icon size={16} style={{marginRight: "0.5rem"}} />
                  {action.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Organization Management Section */}
      {user && (user.organizationType === 'GCC' || user.organizationType === 'DCC' || user.organizationType === 'LCC') && (
        <div className="card" style={{marginTop: "2rem"}}>
          <h3 style={{margin: "0 0 1rem 0"}}>Organization Management</h3>
          <div className="grid cols-3" style={{gap: "1rem"}}>
            <div className="card" style={{padding: "1rem", textAlign: "center"}}>
              <Plus size={24} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h4 style={{margin: "0 0 0.5rem 0"}}>Add Leaders</h4>
              <p className="muted" style={{margin: "0 0 1rem 0", fontSize: "0.875rem"}}>
                Add new leadership positions to your organization
              </p>
              <button className="btn primary btn-sm">Add Leader</button>
            </div>
            
            <div className="card" style={{padding: "1rem", textAlign: "center"}}>
              <Building size={24} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h4 style={{margin: "0 0 0.5rem 0"}}>
                {user.organizationType === 'GCC' ? 'Create DCC' : 
                 user.organizationType === 'DCC' ? 'Create LCC' : 'Create LC'}
              </h4>
              <p className="muted" style={{margin: "0 0 1rem 0", fontSize: "0.875rem"}}>
                Create new {user.organizationType === 'GCC' ? 'district' : 
                           user.organizationType === 'DCC' ? 'local council' : 'local church'}
              </p>
              <a href="/org/create" className="btn primary btn-sm">Create</a>
            </div>
            
            <div className="card" style={{padding: "1rem", textAlign: "center"}}>
              <Users size={24} className="text-primary" style={{marginBottom: "0.5rem"}} />
              <h4 style={{margin: "0 0 0.5rem 0"}}>Manage Agencies</h4>
              <p className="muted" style={{margin: "0 0 1rem 0", fontSize: "0.875rem"}}>
                Create and manage agencies and groups
              </p>
              <a href="/agencies" className="btn secondary btn-sm">Manage</a>
            </div>
          </div>
        </div>
      )}

      {/* Financial Overview for Finance Roles */}
      {user && ['treasurer', 'financial-secretary', 'general-secretary'].includes(user.role) && (
        <div className="card" style={{marginTop: "2rem"}}>
          <h3 style={{margin: "0 0 1rem 0"}}>Financial Overview</h3>
          <div className="grid cols-2" style={{gap: "2rem"}}>
            <div>
              <h4 style={{margin: "0 0 0.5rem 0"}}>Account Management</h4>
              <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                <button className="btn secondary" style={{justifyContent: "flex-start"}}>
                  <Plus size={16} style={{marginRight: "0.5rem"}} />
                  Create New Account
                </button>
                <button className="btn secondary" style={{justifyContent: "flex-start"}}>
                  <Eye size={16} style={{marginRight: "0.5rem"}} />
                  View Account Statements
                </button>
                <button className="btn secondary" style={{justifyContent: "flex-start"}}>
                  <FileText size={16} style={{marginRight: "0.5rem"}} />
                  Generate Financial Report
                </button>
              </div>
            </div>
            <div>
              <h4 style={{margin: "0 0 0.5rem 0"}}>Recent Transactions</h4>
              <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                {[
                  { desc: "Tithe Collection", amount: 15000, type: "income" },
                  { desc: "Building Maintenance", amount: 5000, type: "expenditure" },
                  { desc: "Youth Ministry", amount: 2000, type: "expenditure" },
                  { desc: "Special Offering", amount: 8000, type: "income" }
                ].map((txn, index) => (
                  <div key={index} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", backgroundColor: "var(--bg)", borderRadius: "4px"}}>
                    <span style={{fontSize: "0.875rem"}}>{txn.desc}</span>
                    <span style={{fontSize: "0.875rem", color: txn.type === "income" ? "var(--success)" : "var(--danger)"}}>
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}