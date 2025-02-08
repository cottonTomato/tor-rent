"use client"
import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MapPin, Home, DollarSign,
    Bath, BedDouble, Maximize, PawPrint,
    Star, ChevronRight, Calendar, Shield,
    Plus, Minus, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@radix-ui/react-label';

const PropertyListings = () => {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        priceRange: [0, 5000],
        bedrooms: '',
        bathrooms: '',
        petFriendly: false,
        furnished: false,
    });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showCostCalculator, setShowCostCalculator] = useState(false);

    // Mock data
    const properties = [
        {
            id: 1,
            title: "Modern Downtown Apartment",
            address: "123 Main St, New York, NY",
            price: 2500,
            deposit: 3000,
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1200,
            petFriendly: true,
            furnished: true,
            images: ["/api/placeholder/800/500"],
            rating: 4.5,
            reviews: [
                { id: 1, user: "John D.", rating: 5, comment: "Excellent property and management" },

            ],
            amenities: ["Parking", "Gym", "Security"]
        },
        // Add more properties as needed
    ];

    // Calculate estimated costs
    const calculateCosts = (property) => {
        const serviceFee = property.price * 0.1; // 10% service fee
        return {
            rent: property.price,
            deposit: property.deposit,
            serviceFee,
            total: property.price + property.deposit + serviceFee
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Search Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto py-4 px-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by location, property name..."
                                className="w-full pl-10 bg-gray-800 border-gray-700 text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex gap-2">
                            <Select
                                value={filters.bedrooms}
                                onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
                            >
                                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Bedrooms" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {[1, 2, 3, 4, '5+'].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} {num === '5+' ? '' : num === 1 ? 'Bedroom' : 'Bedrooms'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="border-gray-700">
                                        <Filter className="w-4 h-4 mr-2" /> More Filters
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Filter Properties</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label>Price Range</Label>
                                            <div className="flex items-center space-x-4">
                                                <Input
                                                    type="number"
                                                    value={filters.priceRange[0]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                                                    })}
                                                    className="bg-gray-800 border-gray-700"
                                                />
                                                <span>to</span>
                                                <Input
                                                    type="number"
                                                    value={filters.priceRange[1]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                                    })}
                                                    className="bg-gray-800 border-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.petFriendly}
                                                    onChange={(e) => setFilters({ ...filters, petFriendly: e.target.checked })}
                                                    className="rounded bg-gray-800 border-gray-700"
                                                />
                                                <span>Pet Friendly</span>
                                            </label>

                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.furnished}
                                                    onChange={(e) => setFilters({ ...filters, furnished: e.target.checked })}
                                                    className="rounded bg-gray-800 border-gray-700"
                                                />
                                                <span>Furnished</span>
                                            </label>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Card
                            key={property.id}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all"
                        >
                            <CardContent className="p-0">
                                {/* Property Image */}
                                <div className="relative h-48 overflow-hidden rounded-t-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-full text-sm flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                        {property.rating}
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{property.title}</h3>
                                        <p className="text-gray-400 flex items-center mt-1">
                                            <MapPin className="w-4 h-4 mr-1" /> {property.address}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span className="flex items-center">
                                            <BedDouble className="w-4 h-4 mr-1" /> {property.bedrooms} Beds
                                        </span>
                                        <span className="flex items-center">
                                            <Bath className="w-4 h-4 mr-1" /> {property.bathrooms} Baths
                                        </span>
                                        <span className="flex items-center">
                                            <Maximize className="w-4 h-4 mr-1" /> {property.sqft} sqft
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    ${property.price}
                                                    <span className="text-sm text-gray-400">/month</span>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    ${property.deposit} deposit
                                                </p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-gray-900 text-white max-w-4xl max-h-screen">
                                                    <DialogHeader>
                                                        <DialogTitle>{property.title}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2">
                                                        {/* Property Images Carousel would go here */}
                                                        <div className="h-64 bg-gray-800 rounded-lg overflow-hidden">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                                alt={property.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* Property Info */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-semibold">Details</h4>
                                                                <ul className="space-y-1 text-gray-400">
                                                                    <li className="flex items-center">
                                                                        <BedDouble className="w-4 h-4 mr-2" />
                                                                        {property.bedrooms} Bedrooms
                                                                    </li>
                                                                    <li className="flex items-center">
                                                                        <Bath className="w-4 h-4 mr-2" />
                                                                        {property.bathrooms} Bathrooms
                                                                    </li>
                                                                    <li className="flex items-center">
                                                                        <Maximize className="w-4 h-4 mr-2" />
                                                                        {property.sqft} sqft
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h4 className="font-semibold">Amenities</h4>
                                                                <ul className="space-y-1 text-gray-400">
                                                                    {property.amenities.map((amenity, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            {amenity}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Reviews */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold">Tenant Reviews</h4>
                                                            <div className="space-y-3">
                                                                {property.reviews.map((review) => (
                                                                    <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-medium">{review.user}</span>
                                                                            <div className="flex items-center">
                                                                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                                                {review.rating}
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-gray-400 mt-2">{review.comment}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Cost Calculator */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold">Estimated Costs</h4>
                                                            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span>Monthly Rent</span>
                                                                    <span>${property.price}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Security Deposit</span>
                                                                    <span>${property.deposit}</span>
                                                                </div>

                                                                <div className="flex justify-between pt-2 border-t border-gray-700 font-semibold">
                                                                    <span>Total Move-in Cost</span>
                                                                    <span>${property.price + property.deposit + (property.price * 0.1)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Apply Button */}
                                                        <Button
                                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                                            onClick={() => {
                                                                window.location.href = "/tenant-agreement"; // Redirect to the agreement page
                                                            }}
                                                        >
                                                            Apply for Rental
                                                        </Button>

                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PropertyListings;