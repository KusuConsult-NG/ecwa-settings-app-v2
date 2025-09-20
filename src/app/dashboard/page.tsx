"use client"
import { useState, useEffect } from "react"
import { BarChart3, Users, DollarSign, Calendar, TrendingUp, Activity } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyOfferings: 0,
    upcomingEvents: 0,
    activeMinistries: 0
  })

  useEffect(() => {
    // Simulate loading data
    setStats({
      totalMembers: 1247,
      monthlyOfferings: 125000,
      upcomingEvents: 8,
      activeMinistries: 12
    })
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Dashboard</h2>
        <p>Overview of your church management system</p>
      </div>

      {/* Stats Grid */}
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
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Monthly Offerings</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{formatCurrency(stats.monthlyOfferings)}</h3>
            </div>
            <DollarSign className="text-primary" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+12% from last month</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Upcoming Events</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.upcomingEvents}</h3>
            </div>
            <Calendar className="text-primary" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <Activity size={16} className="text-warning" />
            <span className="text-warning" style={{fontSize: "0.875rem"}}>3 this week</span>
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Ministries</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.activeMinistries}</h3>
            </div>
            <BarChart3 className="text-primary" size={32} />
          </div>
          <div style={{marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <TrendingUp size={16} className="text-success" />
            <span className="text-success" style={{fontSize: "0.875rem"}}>+2 this quarter</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid cols-2" style={{gap: "2rem"}}>
        <div className="card">
          <h3 style={{margin: "0 0 1rem 0"}}>Recent Activity</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {[
              { action: "New member registered", user: "John Doe", time: "2 hours ago", type: "success" },
              { action: "Offering recorded", user: "Jane Smith", time: "4 hours ago", type: "success" },
              { action: "Event created", user: "Mike Johnson", time: "1 day ago", type: "info" },
              { action: "Report generated", user: "Sarah Wilson", time: "2 days ago", type: "info" }
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

        <div className="card">
          <h3 style={{margin: "0 0 1rem 0"}}>Quick Actions</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
            <a href="/expenditures/new" className="btn primary" style={{justifyContent: "flex-start"}}>
              <DollarSign size={16} />
              Add New Expenditure
            </a>
            <a href="/hr/staff" className="btn secondary" style={{justifyContent: "flex-start"}}>
              <Users size={16} />
              Manage Members
            </a>
            <a href="/reports" className="btn secondary" style={{justifyContent: "flex-start"}}>
              <BarChart3 size={16} />
              Generate Report
            </a>
            <a href="/calendar" className="btn secondary" style={{justifyContent: "flex-start"}}>
              <Calendar size={16} />
              Schedule Event
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
