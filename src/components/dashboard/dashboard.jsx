"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, FileText, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { PropertyCard } from "@/components/property-card";
import { ContractCard } from "@/components/contract-card";

export default function Dashboard() {
  // Mock data - replace with real data from your backend
  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main St, New York, NY",
      status: "Available",
      rent: 2500,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    },
    // Add more properties...
  ];

  const contracts = [
    {
      id: 1,
      property: "Modern Downtown Apartment",
      tenant: "John Doe",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Active",
    },
    // Add more contracts...
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Properties</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Contracts</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Actions</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <Bell className="w-8 h-8 text-primary" />
                </div>
              </Card>
            </div>
          </section>

          {/* Properties Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Properties</h2>
              <Link href="/properties/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>

          {/* Contracts Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Contracts</h2>
              <Link href="/contracts">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}