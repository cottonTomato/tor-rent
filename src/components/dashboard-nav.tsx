"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./../lib/utils";
import { Button } from "./ui/button";
import { Building2, LogOut } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Rental Agreements", href: "/agreements" },
    { name: "Payments & Transactions", href: "/payments" },
    { name: "Dispute Resolution", href: "/disputes" },
    { name: "Identity Verification", href: "/verification" },
    { name: "Support & Help Center", href: "/support" },
    { name: "Profile & Settings", href: "/settings" },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
              <Building2 className="w-8 h-8 text-white" />
              <span className="ml-2 text-xl text-white font-bold">Tor-Rent</span>
            </Link>
            <div className="hidden md:flex ml-8 space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
