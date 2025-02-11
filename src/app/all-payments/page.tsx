"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle, ChevronDown, ChevronRight, User, Home, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from "./../../firebaseConfig"; // Import the Firestore instance
import { collection, getDocs } from "firebase/firestore";

const LandlordDashboard = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [notices, setNotices] = useState(null);

  // Sample data - in a real app, this would come from your backend
  const tenants = [
    {
        id: 1,
        name: "Pulkit Chaudhary",
        property: "Gokuldham, Andheri East",
        contractStart: "2024-01-01",
        contractEnd: "2025-01-01",
        monthlyRent: 0.71657,
        status: "active",
        paymentHistory: [
            { month: 'Jan', onTime: true, amount: 12000, date: '2024-01-03', notice: null },
            { month: 'Feb', onTime: true, amount: 12000, date: '2024-02-04', notice: null },
            { month: 'Mar', onTime: false, amount: 12000, date: '2024-03-08', notice: "Will be late due to emergency expenses" }
        ]
    },
    {
        id: 2,
        name: "Priya Iyer",
        property: "456 Connaught Place, Unit 2",
        contractStart: "2023-06-01",
        contractEnd: "2024-05-31",
        monthlyRent: 0.7162,
        status: "active",
        paymentHistory: [
            { month: 'Jan', onTime: true, amount: 15000, date: '2024-01-02', notice: null },
            { month: 'Feb', onTime: true, amount: 15000, date: '2024-02-01', notice: null },
            { month: 'Mar', onTime: true, amount: 15000, date: '2024-03-02', notice: null }
        ]
    },
    {
        id: 3,
        name: "Rohit Verma",
        property: "789 Indiranagar, Apt 1A",
        contractStart: "2023-01-01",
        contractEnd: "2023-12-31",
        monthlyRent: 0.33,
        status: "expired",
        paymentHistory: [
            { month: 'Oct', onTime: true, amount: 13000, date: '2023-10-01', notice: null },
            { month: 'Nov', onTime: false, amount: 13000, date: '2023-11-07', notice: "Payment delayed due to job transition" },
            { month: 'Dec', onTime: true, amount: 13000, date: '2023-12-01', notice: null }
        ]
    }
];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notices")); // Fetch all notices
        const noticeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Notice List:", noticeList[0]);
        setNotices(noticeList[0]);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const getPaymentReliability = (history) => {
    const onTimePayments = history.filter(payment => payment.onTime).length;
    return (onTimePayments / history.length) * 100;
  };

  const TenantOverview = ({ tenant }) => (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
          onClick={() => setSelectedTenant(tenant)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">{tenant.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Home className="w-4 h-4" />
              <p>{tenant.property}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-sm ${
            tenant.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {tenant.status}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-400">
            <p>Contract Period</p>
            <p className="text-white">{tenant.contractStart} - {tenant.contractEnd}</p>
          </div>
          <div className="text-gray-400">
            <p>Monthly Rent</p>
            <p className="text-white">{tenant.monthlyRent} SOL</p>
          </div>
          <div className="text-gray-400">
            <p>Payment Reliability</p>
            <p className="text-white">{getPaymentReliability(tenant.paymentHistory).toFixed(1)}%</p>
          </div>
          <div className="text-gray-400">
            <p>Last Payment</p>
            <p className="text-white">{tenant.paymentHistory[tenant.paymentHistory.length - 1].date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TenantDetail = ({ tenant }) => (
    <div className="space-y-6">
      <button 
        onClick={() => setSelectedTenant(null)}
        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Overview
      </button>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-2xl">{tenant.name}</CardTitle>
              <CardDescription className="text-gray-400">{tenant.property}</CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              tenant.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {tenant.status}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Contract Start</p>
              <p className="text-white font-medium">{tenant.contractStart}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Contract End</p>
              <p className="text-white font-medium">{tenant.contractEnd}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Monthly Rent</p>
              <p className="text-white font-medium">{tenant.monthlyRent} SOL</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Payment Reliability</p>
              <p className="text-white font-medium">{getPaymentReliability(tenant.paymentHistory).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Payment Timeline</h3>
            <div className="space-y-6">
              {tenant.paymentHistory.map((payment, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className="absolute top-0 left-2 h-full w-0.5 bg-gray-600" />
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${
                    payment.onTime ? 'bg-green-500' : 'bg-yellow-500'
                  } relative z-10`} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{payment.amount} - {payment.month}</p>
                        <p className="text-gray-400 text-sm">Paid on {payment.date}</p>
                      </div>
                      
                    </div>
                    
                  </div>
                </div>
                
              ))}


                        <div className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm">
                          Notice Submitted
                        </div>
           
                      
              {notices && (
                      <div className="mt-2 p-3 bg-gray-600/50 rounded-lg text-gray-300 text-sm">
                        {notices?.message}
                      </div>
                    )}
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Payment Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tenant.paymentHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#F9FAFB' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#60A5FA" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Landlord Payment Dashboard</h1>
          <p className="text-gray-400">Manage and monitor tenant payments</p>
        </div>

        {/* Dashboard Summary */}
        {!selectedTenant && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-900 rounded-lg">
                    <User className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-400">Active Tenants</p>
                    <p className="text-2xl font-bold text-white">
                      {tenants.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-900 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-gray-400">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      {tenants.reduce((sum, t) => sum + (t.status === 'active' ? t.monthlyRent : 0), 0)} SOL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-900 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-gray-400">Expiring Soon</p>
                    <p className="text-2xl font-bold text-white">
                      {tenants.filter(t => {
                        const endDate = new Date(t.contractEnd);
                        const threeMonthsFromNow = new Date();
                        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                        return endDate <= threeMonthsFromNow && t.status === 'active';
                      }).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {selectedTenant ? (
          <TenantDetail tenant={selectedTenant} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenants.map(tenant => (
              <TenantOverview key={tenant.id} tenant={tenant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;