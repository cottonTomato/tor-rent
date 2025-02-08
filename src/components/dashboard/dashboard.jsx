"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, FileText, Bell, Wallet, Users, Wrench, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { PropertyCard } from "@/components/property-card";
import { ContractCard } from "@/components/contract-card";

export default function Dashboard() {
  const stats = [
    { label: "Total Revenue", value: "$23,500", change: "+12.5%", icon: Wallet },
    { label: "Active Tenants", value: "24", change: "+2", icon: Users },
    { label: "Maintenance", value: "5", change: "-2", icon: Wrench },
  ];

  const notifications = [
    { title: "Lease Renewal", desc: "3 contracts expiring next month", type: "warning" },
    { title: "Maintenance Request", desc: "New request from Unit 4B", type: "alert" },
    { title: "Payment Received", desc: "Unit 7A rent processed", type: "success" },
  ];

  const tenants = [
    { name: "Alice Cooper", unit: "4B", status: "current", lastPayment: "2024-02-01" },
    { name: "Bob Marshall", unit: "7A", status: "late", lastPayment: "2024-01-15" },
    { name: "Carol Smith", unit: "2C", status: "current", lastPayment: "2024-02-03" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <DashboardNav />

      <main className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Landlord Dashboard
          </h1>
          <p className="text-gray-400">Welcome back! Here's your property overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {stat.change} from last month
                  </span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <stat.icon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tenants List */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Current Tenants</h2>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                View All <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-4">
              {tenants.map((tenant, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg cursor-pointer"
                  onClick={() => (window.location.href = '/complaints-1')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tenant.name}</p>
                      <p className="text-sm text-gray-400">Unit {tenant.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${tenant.status === 'current'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                        }`}
                    >
                      {tenant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications Panel */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {notifications.map((notif, idx) => (
                <div key={idx} className="p-4 bg-black/20 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${notif.type === 'warning' ? 'bg-yellow-400' :
                        notif.type === 'alert' ? 'bg-red-400' : 'bg-green-400'
                      }`} />
                    <p className="font-medium text-white">{notif.title}</p>
                  </div>
                  <p className="text-sm text-gray-400">{notif.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add Property", icon: Building2, link: "/add-property" },
            { label: "New Contract", icon: FileText, link: "/new-contract" },
            { label: "Schedule Inspection", icon: Calendar, link: "/inspection" },
            { label: "Report Issue", icon: AlertCircle, link: "/report-issue" }
          ].map((action, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-800 p-4 h-auto flex items-center justify-center space-x-2"
              onClick={() => (window.location.href = action.link)} // Redirect on click
            >
              <action.icon className="w-5 h-5 text-white" />
              <span className="text-sm text-white">{action.label}</span>
            </Button>
          ))}
        </div>

      </main>
    </div>
  );
}
