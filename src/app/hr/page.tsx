import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Calendar, CreditCard, MessageSquare, Settings } from "lucide-react";

export default function HRPage() {
  const stats = [
    { label: "Total Staff", value: "156", change: "+5 this month" },
    { label: "Active Staff", value: "142", change: "98% active" },
    { label: "Pending Leaves", value: "8", change: "3 new requests" },
    { label: "Payroll This Month", value: "₦2.4M", change: "+12% from last month" }
  ];

  const quickActions = [
    {
      title: "Staff Management",
      description: "Add, edit, and manage staff members",
      icon: <Users className="h-8 w-8 text-primary-600" />,
      href: "/hr/staff"
    },
    {
      title: "Add New Staff",
      description: "Register a new staff member",
      icon: <UserPlus className="h-8 w-8 text-primary-600" />,
      href: "/hr/staff/new"
    },
    {
      title: "Leave Management",
      description: "Manage staff leave requests",
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      href: "/hr/leave"
    },
    {
      title: "Payroll",
      description: "Process monthly payroll",
      icon: <CreditCard className="h-8 w-8 text-primary-600" />,
      href: "/hr/payroll"
    },
    {
      title: "Queries",
      description: "Handle staff queries and requests",
      icon: <MessageSquare className="h-8 w-8 text-primary-600" />,
      href: "/hr/queries"
    },
    {
      title: "User Roles",
      description: "Manage user permissions and roles",
      icon: <Settings className="h-8 w-8 text-primary-600" />,
      href: "/hr/user-roles"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
        <p className="text-gray-600">Manage staff, payroll, and HR operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {action.icon}
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {action.description}
                </CardDescription>
                <Button className="w-full">
                  Access {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent HR Activity</CardTitle>
          <CardDescription>Latest updates in human resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New staff member added", user: "John Doe", time: "2 hours ago", type: "staff" },
              { action: "Leave request approved", user: "Jane Smith", time: "4 hours ago", type: "leave" },
              { action: "Payroll processed", user: "Mike Johnson", time: "1 day ago", type: "payroll" },
              { action: "Staff role updated", user: "Sarah Wilson", time: "2 days ago", type: "role" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'staff' ? 'bg-blue-500' :
                  activity.type === 'leave' ? 'bg-green-500' :
                  activity.type === 'payroll' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
