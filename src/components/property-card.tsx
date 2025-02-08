import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
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
        <Card className="overflow-hidden rounded-lg shadow-lg bg-white/10">
            <div className="relative h-48 w-full">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg"
                />
            </div>
            <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{property.title}</h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                            {property.address}
                        </div>
                    </div>
                    <Badge
                        className={`px-3 py-1 text-sm font-semibold ${property.status === "Available"
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                    >
                        {property.status}
                    </Badge>

                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Monthly Rent</p>
                        <p className="text-lg font-semibold text-white">${property.rent}</p>
                    </div>
                    <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" className="px-4 py-2 text-sm bg-white/10 text-white">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
