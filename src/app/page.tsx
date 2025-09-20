import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  FileText, 
  Settings, 
  Shield,
  TrendingUp,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <DollarSign className="h-8 w-8 text-primary-600" />,
      title: "Financial Management",
      description: "Complete expenditure tracking, income management, and financial reporting"
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "HR & Payroll",
      description: "Staff management, leave tracking, and automated payroll processing"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "Audit Trails",
      description: "Comprehensive logging and audit trails for all organizational activities"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Security & Access",
      description: "Role-based access control and secure authentication system"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
      title: "Analytics & Reports",
      description: "Real-time analytics and comprehensive reporting dashboard"
    },
    {
      icon: <Settings className="h-8 w-8 text-primary-600" />,
      title: "Organization Management",
      description: "Multi-level organization structure and management capabilities"
    }
  ];

  const stats = [
    { label: "Active Organizations", value: "12", change: "+2 this month" },
    { label: "Total Expenditures", value: "₦2.4M", change: "+12% from last month" },
    { label: "Pending Approvals", value: "8", change: "3 new today" },
    { label: "Active Staff", value: "156", change: "+5 this week" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="churchflow-gradient rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to ChurchFlow
        </h1>
        <p className="text-xl mb-6 opacity-90">
          Comprehensive church management system for modern congregations
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
            Learn More
          </Button>
        </div>
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
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Church Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and frequently used features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Add Offering</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span>Add Member</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and activities in your church
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New offering recorded", user: "John Doe", time: "2 hours ago", status: "success" },
              { action: "New member added", user: "Jane Smith", time: "4 hours ago", status: "success" },
              { action: "Report generated", user: "Mike Johnson", time: "1 day ago", status: "info" },
              { action: "Donation processed", user: "Sarah Wilson", time: "2 days ago", status: "success" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
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