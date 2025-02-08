import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    address: string;
    status: string;
    rent: number;
    image: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{property.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.address}
            </div>
          </div>
          <Badge
            variant={property.status === "Available" ? "default" : "secondary"}
          >
            {property.status}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Rent</p>
            <p className="text-lg font-semibold">${property.rent}</p>
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}