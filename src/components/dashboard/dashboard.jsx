"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, FileText, Bell } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { PropertyCard } from "@/components/property-card";
import { ContractCard } from "@/components/contract-card";

export default function Dashboard() {
  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main St, New York, NY",
      status: "Available",
      rent: 2500,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    },
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
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNav />

      <main className="container mx-auto px-6 py-10 space-y-12">
        {/* Overview Section */}
        <section className="space-y-6 m-10">
          <h2 className="text-2xl font-bold">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Active Properties", "Active Contracts", "Pending Actions"].map((label, index) => (
              <Card key={index} className="p-8 bg-white/10 text-white rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className="text-2xl font-bold">{index + 1}</p>
                  </div>
                  {index === 0 ? <Building2 className="w-10 h-10 text-white" /> : index === 1 ? <FileText className="w-10 h-10 text-white" /> : <Bell className="w-10 h-10 text-white" />}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Properties Section */}
        <section className="space-y-6 m-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Properties</h2>
            <Link href="/properties/new">
              <Button className="bg-white text-black px-6 py-3 rounded-lg">
                <Plus className="w-5 h-5 mr-2" /> Add Property
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* Contracts Section */}
        <section className="space-y-6 m-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Contracts</h2>
            <Link href="/contracts">
              <Button className="bg-white text-black px-6 py-3 rounded-lg">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
