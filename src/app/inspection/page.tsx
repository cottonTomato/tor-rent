"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import emailjs from "@emailjs/browser";
import { 
  MessageSquare, Home, Calendar, AlertTriangle, 
  CheckCircle, Clock, MailIcon, Eye
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cp } from 'fs';

const PropertyMonitoring = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dummy data representing tenant updates
  const properties = [
    {
      id: 1,
      address: "Flat 303, Sunshine Apartments, Andheri West",
      tenant: {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 98765 43210",
      },
      leaseStart: "2024-01-01",
      lastUpdate: "2025-02-08",
      updateStatus: "On Track",
      monthlyUpdates: [
        {
          month: "February 2025",
          status: "Submitted",
          submitDate: "2025-02-08",
          isComplete: true,
          images: [
            {
              area: "Kitchen",
              url: "https://ab487509f8decc2c0cd2-9ff2a6143bff296f88e68c3257991f4b.ssl.cf6.rackcdn.com/2421620b6b35ad3ce_thumbnail.jpeg",
              condition: "Good",
              notes: "AC serviced, no issues reported",
              submittedAt: "2025-02-08 09:00 AM",
            },
            {
              area: "Living Room",
              url: "https://is1-2.housingcdn.com/01c16c28/10593da2631fd8828f81e391824690e6/v0/fs/2_bhk_apartment-for-rent-ghatkopar_east-Mumbai-kitchen.jpg",
              condition: "Excellent",
              notes: "Recently painted, all electrical fittings working",
              submittedAt: "2025-02-08 09:05 AM",
            },
          ],
        },
        {
          month: "January 2025",
          status: "Submitted",
          submitDate: "2025-01-07",
          isComplete: true,
          images: [
            
            {
              area: "Living Room",
              url: "https://is1-2.housingcdn.com/01c16c28/10593da2631fd8828f81e391824690e6/v0/fs/2_bhk_apartment-for-rent-ghatkopar_east-Mumbai-kitchen.jpg",
              condition: "Good",
              notes: "Minor cracks on wall near window",
              submittedAt: "2025-01-07 10:05 AM",
            },
          ],
        },
        {
          month: "December 2024",
          status: "Missing",
          isComplete: false,
          dueDate: "2024-12-31",
        },
      ],
    },
    {
      id: 2,
      address: "201, Sea View Society, Bandra West",
      tenant: {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        phone: "+91 87654 32109",
      },
      leaseStart: "2024-02-01",
      lastUpdate: "2025-02-01",
      updateStatus: "Update Overdue",
      monthlyUpdates: [
        {
          month: "January 2025",
          status: "missing",
          submitDate: "2025-01-31",
          isComplete: true,
          images: [
            
           
          ],
        },
        {
          month: "February 2025",
          status: "Missing",
          isComplete: false,
          dueDate: "2025-02-28",
        },
      ],
    },
  ]

  const handleEmail = async (email) => {
    console.log("Email:", email);
    setLoading(true);

    const serviceID = "service_khesrrp";
    const templateID = "template_63tblyc";
    const publicKey = "oJmBKOHVFS2r-wETd";


    emailjs
      .send(serviceID, templateID, {
        from_name: "Landlord XYZ",
        to_name: 'Tenant',
        from_email: "piyanshugehani@gmail.com",
        to_email: email,
        message: "This is a reminder to submit your monthly property update. Please complete the form at your earliest convenience.",
      },
        publicKey)
      .then((response) => {
        alert("Message sent successfully:", response);
        setSuccess(true);
        setOpen(false); // Close the dialog
        setMessage("");
      })
      .catch((error) => {
        // alert("Error sending message:", error);
        setSuccess(false);
      })
      .finally(() => setLoading(false));
  }
 

  const getStatusColor = (status) => {
    const colors = {
      "On Track": "bg-green-500",
      "Update Overdue": "bg-red-500",
      "Update Due Soon": "bg-yellow-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const RequestUpdate = ({ tenant }) => {
    console.log("Tenant:", tenant.email);
    return(<Card className="bg-gray-700 border-gray-600 text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium mb-2">Request Monthly Update</h3>
          <p className="text-sm text-gray-400">Send reminder to tenant</p>
        </div>
        <button 
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
  onClick={() => handleEmail(tenant.email)}
>
  <MailIcon className="w-4 h-4" />
  Send Reminder
</button>

      </div>
    </CardContent>
  </Card>
);
  }
    

  const MonthlyUpdateView = ({ update }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-xl font-medium">{update.month}</h3>
          <p className="text-sm text-gray-400">
            {update.isComplete 
              ? `Submitted on ${update.submitDate}` 
              : `Due by ${update.dueDate}`}
          </p>
        </div>
        <Badge className={update.isComplete ? "bg-green-500" : "bg-red-500"}>
          {update.status}
        </Badge>
      </div>

      {update.isComplete ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
          {update.images.map((image, idx) => (
            <Card key={idx} className="bg-gray-700 border-gray-600">
              <img 
                src={image.url} 
                alt={image.area} 
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{image.area}</h4>
                  <Badge className={image.condition === 'Excellent' ? 'bg-green-500' : 'bg-blue-500'}>
                    {image.condition}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mb-2">{image.notes}</p>
                <p className="text-xs text-gray-400">Submitted: {image.submittedAt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="bg-gray-700 border-red-500">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <AlertDescription className="text-gray-300">
            Update not yet received from tenant
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Property Updates Dashboard</h1>
              <p className="text-gray-400">Track monthly tenant updates for your properties</p>
            </div>
            <div className="flex gap-4">
              <Card className="bg-gray-800 border-gray-700 p-4">
                <p className="text-sm text-gray-400">Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-4">
                <p className="text-sm text-gray-400">Pending Updates</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {properties.reduce((acc, prop) => 
                    acc + prop.monthlyUpdates.filter(update => !update.isComplete).length, 0)}
                </p>
              </Card>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Properties</CardTitle>
                <CardDescription className="text-gray-400">
                  Select a property to view updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{property.address}</h3>
                          <p className="text-sm text-gray-400">{property.tenant.name}</p>
                        </div>
                        <Badge className={getStatusColor(property.updateStatus)}>
                          {property.updateStatus}
                        </Badge>
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        <p>Last Update: {property.lastUpdate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Updates View */}
          <div className="lg:col-span-2">
            {selectedProperty ? (
              <div className="space-y-6">
                {/* Property Header */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white mb-2">{selectedProperty.address}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Tenant: {selectedProperty.tenant.name}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p>Email: {selectedProperty.tenant.email}</p>
                        <p>Phone: {selectedProperty.tenant.phone}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Missing Updates Alert */}
                {selectedProperty.monthlyUpdates.some(update => !update.isComplete) && (
                  <RequestUpdate tenant={selectedProperty.tenant} />
                )}

                {/* Monthly Updates */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 text-white">
                    {selectedProperty.monthlyUpdates.map((update, idx) => (
                      <MonthlyUpdateView key={idx} update={update} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a property to view tenant updates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMonitoring;