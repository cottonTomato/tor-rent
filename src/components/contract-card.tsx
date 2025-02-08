import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Calendar } from "lucide-react";
import Link from "next/link";

interface ContractCardProps {
    contract: {
        id: number;
        property: string;
        tenant: string;
        startDate: string;
        endDate: string;
        status: string;
    };
}

export function ContractCard({ contract }: ContractCardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{contract.property}</h3>
                        <p className="text-sm text-muted-foreground">Tenant: {contract.tenant}</p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge
                        className={`px-3 py-1 text-sm font-semibold ${contract.status === "Available"
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                    >
                        {contract.status}
                    </Badge>
                    <Link href={`/contracts/${contract.id}`}>
                        <Button variant="outline">View Contract</Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}