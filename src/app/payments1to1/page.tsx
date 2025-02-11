"use client"
import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db, storage } from "./../../firebaseConfig"; // Ensure correct Firebase imports
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TenantDashboard = () => {
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [notices, setNotices] = useState<string[]>([]);


  // Sample data - in a real app, this would come from your backend
  const contractDetails = {
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    monthlyRent: 1200,
    deposit: 2400,
    propertyAddress: '123 Main St, Apt 4B',
    landlordName: 'John Smith',
  };

  const paymentHistory = [
    { id: 1, date: '2024-02-01', amount: 1200, status: 'paid', dueDate: '2024-02-05' },
    { id: 2, date: '2024-01-01', amount: 1200, status: 'paid', dueDate: '2024-01-05' },
    { id: 3, date: '2023-12-01', amount: 1200, status: 'paid', dueDate: '2023-12-05' },
  ];

  const nextPayment = {
    dueDate: '2024-03-05',
    amount: 1200,
    status: 'pending'
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) return; // Prevent empty submissions
  
    try {
      let imageUrl = "";
  
  
      // Store notice in Firestore
      const res = await addDoc(collection(db, "notices"), {
        message: noticeText,
        timestamp: serverTimestamp(),
      });
      console.log("response", res);
  
      // Append notice to the UI
      setNotices((prevNotices) => [...prevNotices, { text: noticeText }]);
  
      alert("Notice sent to landlord successfully!");
      setShowNoticeForm(false);
      setNoticeText("");

    } catch (error) {
      console.error("Error sending notice:", error);
      alert("Failed to send notice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Tenant Payment History</h1>
          <p className="text-gray-400">Manage your rental payments and communications</p>
        </div>

        {/* Contract Overview Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Contract Details</CardTitle>
            <CardDescription className="text-gray-400">Your current rental agreement</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-gray-400">Start Date:</span> {contractDetails.startDate}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-gray-400">End Date:</span> {contractDetails.endDate}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-gray-400">Monthly Rent:</span> ${contractDetails.monthlyRent}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-gray-400">Security Deposit:</span> ${contractDetails.deposit}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-gray-400">Property:</span> {contractDetails.propertyAddress}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-gray-400">Landlord:</span> {contractDetails.landlordName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Payment Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Next Payment Due</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          {notices.length > 0 && (
  <div className="mt-4 space-y-2 p-4 bg-gray-700 rounded-lg">
    <h3 className="text-white font-semibold">Sent Notice:</h3>
    {notices.map((notice, index) => (
      <p key={index} className="text-gray-300 p-2 border-b border-gray-600 last:border-none">
        {notice}
      </p>
    ))}
  </div>
)}
            <div className="flex justify-between items-center">
              <div className="text-white">
                <p className="text-lg font-semibold">${nextPayment.amount}</p>
                <p className="text-gray-400">Due by {nextPayment.dueDate}</p>
              </div>
              <button
                onClick={() => setShowNoticeForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Send Payment Notice
              </button>
            </div>

            {showNoticeForm && (
              <form onSubmit={handleSubmitNotice} className="space-y-4">
                <textarea
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Explain why you need an extension for this month's payment..."
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Send Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNoticeForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
            <CardDescription className="text-gray-400">Your recent payment records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {payment.status === 'paid' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="text-white font-medium">${payment.amount}</p>
                      <p className="text-sm text-gray-400">Due: {payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white capitalize">{payment.status}</p>
                    <p className="text-sm text-gray-400">Paid: {payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard;