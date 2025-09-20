"use client"
import { useState, useEffect } from "react"
import { Users, UserPlus, CreditCard, Calendar, MessageSquare, Settings, Shield, BarChart3 } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  joinDate: string
  status: 'active' | 'inactive' | 'on-leave'
}

export default function HRPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    onLeave: 0,
    departments: 0
  })

  useEffect(() => {
    // Simulate loading data
    const staffData: StaffMember[] = [
      {
        id: "1",
        name: "Pastor John Doe",
        role: "Senior Pastor",
        department: "Ministry",
        email: "john@churchflow.com",
        phone: "+234 801 234 5678",
        joinDate: "2020-01-15",
        status: "active"
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "Administrative Assistant",
        department: "Administration",
        email: "jane@churchflow.com",
        phone: "+234 802 345 6789",
        joinDate: "2021-03-20",
        status: "active"
      },
      {
        id: "3",
        name: "Mike Johnson",
        role: "Youth Pastor",
        department: "Ministry",
        email: "mike@churchflow.com",
        phone: "+234 803 456 7890",
        joinDate: "2022-06-10",
        status: "on-leave"
      },
      {
        id: "4",
        name: "Sarah Wilson",
        role: "Finance Manager",
        department: "Finance",
        email: "sarah@churchflow.com",
        phone: "+234 804 567 8901",
        joinDate: "2021-09-05",
        status: "active"
      }
    ]

    setStaff(staffData)
    setStats({
      totalStaff: staffData.length,
      activeStaff: staffData.filter(s => s.status === 'active').length,
      onLeave: staffData.filter(s => s.status === 'on-leave').length,
      departments: [...new Set(staffData.map(s => s.department))].length
    })
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'on-leave': return 'warning'
      case 'inactive': return 'danger'
      default: return 'muted'
    }
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>Human Resources</h2>
        <p>Manage staff, payroll, and HR operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid cols-4" style={{marginBottom: "2rem"}}>
        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Total Staff</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.totalStaff}</h3>
            </div>
            <Users className="text-primary" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Active Staff</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.activeStaff}</h3>
            </div>
            <Shield className="text-success" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>On Leave</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.onLeave}</h3>
            </div>
            <Calendar className="text-warning" size={32} />
          </div>
        </div>

        <div className="card" style={{padding: "1.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <p className="muted" style={{margin: "0 0 0.5rem 0", fontSize: "0.875rem"}}>Departments</p>
              <h3 style={{margin: "0", fontSize: "2rem", fontWeight: "700"}}>{stats.departments}</h3>
            </div>
            <BarChart3 className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{marginBottom: "1.5rem"}}>
        <h3 style={{margin: "0 0 1rem 0"}}>Quick Actions</h3>
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem"}}>
          <a href="/hr/staff" className="btn secondary" style={{justifyContent: "flex-start", padding: "1rem"}}>
            <Users size={20} />
            <div style={{textAlign: "left"}}>
              <div style={{fontWeight: "600"}}>Staff Management</div>
              <div style={{fontSize: "0.875rem", opacity: 0.8}}>Manage team members</div>
            </div>
          </a>
          <a href="/hr/payroll" className="btn secondary" style={{justifyContent: "flex-start", padding: "1rem"}}>
            <CreditCard size={20} />
            <div style={{textAlign: "left"}}>
              <div style={{fontWeight: "600"}}>Payroll</div>
              <div style={{fontSize: "0.875rem", opacity: 0.8}}>Salary management</div>
            </div>
          </a>
          <a href="/hr/leave" className="btn secondary" style={{justifyContent: "flex-start", padding: "1rem"}}>
            <Calendar size={20} />
            <div style={{textAlign: "left"}}>
              <div style={{fontWeight: "600"}}>Leave Management</div>
              <div style={{fontSize: "0.875rem", opacity: 0.8}}>Track time off</div>
            </div>
          </a>
          <a href="/hr/queries" className="btn secondary" style={{justifyContent: "flex-start", padding: "1rem"}}>
            <MessageSquare size={20} />
            <div style={{textAlign: "left"}}>
              <div style={{fontWeight: "600"}}>Queries</div>
              <div style={{fontSize: "0.875rem", opacity: 0.8}}>Staff inquiries</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Staff */}
      <div className="card">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
          <h3 style={{margin: "0"}}>Recent Staff</h3>
          <a href="/hr/staff" className="btn secondary">View All</a>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{fontWeight: "500"}}>{member.name}</div>
                    <div style={{fontSize: "0.875rem", color: "var(--muted)"}}>{member.phone}</div>
                  </td>
                  <td>{member.role}</td>
                  <td>
                    <span className="badge" style={{backgroundColor: "var(--primary)", color: "white"}}>
                      {member.department}
                    </span>
                  </td>
                  <td>{member.email}</td>
                  <td>{formatDate(member.joinDate)}</td>
                  <td>
                    <span className={`status ${getStatusColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}