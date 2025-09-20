import type { Metadata } from "next"
import "./globals.css"
import Image from "next/image"
import ClientTopbar from "./topbar-client"
import { 
  Home, 
  BarChart3, 
  Receipt, 
  Plus, 
  DollarSign, 
  Building2, 
  FileText, 
  Building, 
  Settings, 
  Users, 
  CreditCard, 
  Calendar, 
  MessageSquare, 
  Star, 
  Shield, 
  Search, 
  UserCog, 
  Lock
} from "lucide-react"

export const metadata: Metadata = {
  title: "ChurchFlow - Church Management System",
  description: "Comprehensive church management system for modern congregations",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Remove server-side authentication to prevent redirect loops
  // Authentication will be handled by middleware and client-side

  return (
    <html lang="en">
      <body>
        <ClientTopbar />

        <div className="layout">
          <aside className="sidebar" id="sidebar">
            <div className="logo">
              <Image src="/logo.svg" alt="ChurchFlow" width={32} height={32} />
              <span>ChurchFlow</span>
            </div>
            <nav className="nav" id="nav">
              {/* Main Navigation */}
              <div className="nav-section">
                <div className="nav-section-title">Main</div>
                <a href="/" className="nav-link">
                  <Home className="nav-icon" size={20} />
                  <span>Home</span>
                </a>
                <a href="/dashboard" className="nav-link">
                  <BarChart3 className="nav-icon" size={20} />
                  <span>Dashboard</span>
                </a>
              </div>

              {/* Financial Management */}
              <div className="nav-section">
                <div className="nav-section-title">Financial</div>
                <a href="/expenditures" className="nav-link">
                  <Receipt className="nav-icon" size={20} />
                  <span>Expenditures</span>
                </a>
                <a href="/expenditures/new" className="nav-link">
                  <Plus className="nav-icon" size={20} />
                  <span>Add Expenditure</span>
                </a>
                <a href="/income" className="nav-link">
                  <DollarSign className="nav-icon" size={20} />
                  <span>Income</span>
                </a>
                <a href="/bank" className="nav-link">
                  <Building2 className="nav-icon" size={20} />
                  <span>Bank Management</span>
                </a>
                <a href="/reports" className="nav-link">
                  <FileText className="nav-icon" size={20} />
                  <span>Reports</span>
                </a>
              </div>

              {/* Organization Management */}
              <div className="nav-section">
                <div className="nav-section-title">Organizations</div>
                <a href="/org" className="nav-link">
                  <Building className="nav-icon" size={20} />
                  <span>Create Organization</span>
                </a>
                <a href="/organization-management" className="nav-link">
                  <Settings className="nav-icon" size={20} />
                  <span>Manage Organizations</span>
                </a>
              </div>

              {/* Human Resources */}
              <div className="nav-section">
                <div className="nav-section-title">Human Resources</div>
                <a href="/hr" className="nav-link">
                  <Users className="nav-icon" size={20} />
                  <span>HR Dashboard</span>
                </a>
                <a href="/hr/staff" className="nav-link">
                  <Users className="nav-icon" size={20} />
                  <span>Staff Management</span>
                </a>
                <a href="/hr/payroll" className="nav-link">
                  <CreditCard className="nav-icon" size={20} />
                  <span>Payroll</span>
                </a>
                <a href="/hr/leave" className="nav-link">
                  <Calendar className="nav-icon" size={20} />
                  <span>Leave Management</span>
                </a>
                <a href="/hr/queries" className="nav-link">
                  <MessageSquare className="nav-icon" size={20} />
                  <span>Queries</span>
                </a>
              </div>

              {/* Leadership & Administration */}
              <div className="nav-section">
                <div className="nav-section-title">Leadership</div>
                <a href="/executive" className="nav-link">
                  <Star className="nav-icon" size={20} />
                  <span>Executive</span>
                </a>
                <a href="/agencies" className="nav-link">
                  <Shield className="nav-icon" size={20} />
                  <span>Agencies & Groups</span>
                </a>
                <a href="/verify-login" className="nav-link">
                  <Lock className="nav-icon" size={20} />
                  <span>Leader Login</span>
                </a>
              </div>

              {/* System & Security */}
              <div className="nav-section">
                <div className="nav-section-title">System</div>
                <a href="/audit" className="nav-link">
                  <Search className="nav-icon" size={20} />
                  <span>Audit Logs</span>
                </a>
                <a href="/hr/user-roles" className="nav-link">
                  <UserCog className="nav-icon" size={20} />
                  <span>User Roles</span>
                </a>
                <a href="/hr/system-config" className="nav-link">
                  <Settings className="nav-icon" size={20} />
                  <span>System Config</span>
                </a>
                <a href="/hr/security" className="nav-link">
                  <Lock className="nav-icon" size={20} />
                  <span>Security</span>
                </a>
              </div>
            </nav>
          </aside>
          <main className="content">
            {children}
          </main>
        </div>
        
        <script dangerouslySetInnerHTML={{
          __html: `
            // Update user info in topbar
            fetch('/api/me', {
              credentials: 'include',
              cache: 'no-store'
            }).then(r => r.json()).then(data => {
              const user = data.user;
              if (!user) return;
              
              // Update topbar with user info
              const topbar = document.querySelector('.topbar');
              if (topbar) {
                const userInfo = topbar.querySelector('.user-info');
                if (userInfo) {
                  userInfo.textContent = \`Hello, \${user.name || 'User'}\`;
                }
              }
            }).catch(err => {
              console.log('Failed to load user info:', err);
            });
          `
        }} />
      </body>
    </html>
  )
}