"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  FileText,
  DollarSign,
  Users,
  Building2,
  Shield,
  CreditCard,
  Calendar,
  MessageSquare,
  UserCheck,
  Banknote,
  TrendingUp,
  Search,
  UserCog,
  Cog
} from "lucide-react";

const navigation = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ]
  },
  {
    name: "Financial",
    items: [
      { name: "Expenditures", href: "/expenditures", icon: FileText },
      { name: "Income", href: "/income", icon: DollarSign },
      { name: "Bank Management", href: "/bank", icon: Banknote },
      { name: "Reports", href: "/reports", icon: TrendingUp },
    ]
  },
  {
    name: "Organizations",
    items: [
      { name: "Organizations", href: "/organizations", icon: Building2 },
      { name: "Agencies", href: "/agencies", icon: Building2 },
    ]
  },
  {
    name: "Human Resources",
    items: [
      { name: "HR Dashboard", href: "/hr", icon: Users },
      { name: "Staff Management", href: "/hr/staff", icon: UserCheck },
      { name: "Payroll", href: "/hr/payroll", icon: CreditCard },
      { name: "Leave Management", href: "/hr/leave", icon: Calendar },
      { name: "Queries", href: "/hr/queries", icon: MessageSquare },
    ]
  },
  {
    name: "Leadership",
    items: [
      { name: "Executive", href: "/executive", icon: Shield },
      { name: "Member Login", href: "/verify-login", icon: UserCog },
    ]
  },
  {
    name: "System",
    items: [
      { name: "Audit Logs", href: "/audit", icon: Search },
      { name: "User Roles", href: "/hr/user-roles", icon: UserCog },
      { name: "System Config", href: "/hr/system-config", icon: Cog },
      { name: "Security", href: "/hr/security", icon: Shield },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="ecwa-sidebar w-64 p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">ECWA Settings</h1>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
      </div>

      <nav className="space-y-6">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "ecwa-nav-item",
                      isActive && "ecwa-nav-item-active"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
