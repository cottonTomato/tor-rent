"use client"
import React, { useState } from 'react';
import { Calendar, Clock, FileText, Check, X, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const MeetingApprovalFlow = () => {
    const router = useRouter();
  const [step, setStep] = useState('approval'); // approval, agreement-prompt, agreement-form
  const [formData, setFormData] = useState({
    propertyAddress: '',
    tenantName: '',
    rentAmount: '',
    depositAmount: '',
    startDate: '',
    duration: '',
    specialTerms: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApprove = () => {
    setStep('agreement-prompt');
  };

  const handleAgreementChoice = (wantsAgreement) => {
    if (wantsAgreement) {
      setStep('agreement-form');
    } else {
      // Handle redirect or other logic
      console.log('Meeting approved without agreement');
    }
  };

  const handleSubmitAgreement = (e) => {
    e.preventDefault();
    // Handle agreement submission
    console.log('Agreement details:', formData);
    alert('Agreement submitted successfully.');
    router.push("final-agreement");
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {step === 'approval' && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Schedule Meeting Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-white">
                <Calendar className="h-5 w-5" />
                <span>Thursday, February 15, 2025</span>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <Clock className="h-5 w-5" />
                <span>2:00 PM - 3:00 PM</span>
              </div>
              <Alert className="bg-gray-700/50 border-gray-600">
                <AlertDescription className="text-gray-200">
                  John Doe has requested to view the property at 123 Main Street.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="space-x-4">
              <button
                onClick={handleApprove}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
              <button className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                <X className="h-4 w-4 mr-2" />
                Decline
              </button>
            </CardFooter>
          </Card>
        )}

        {step === 'agreement-prompt' && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Meeting Approved</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-200">
              Would you like to prepare a rental agreement for the potential tenant?
            </CardContent>
            <CardFooter className="space-x-4">
              <button
                onClick={() => handleAgreementChoice(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Agreement
              </button>
              <button
                onClick={() => handleAgreementChoice(false)}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Skip for Now
              </button>
            </CardFooter>
          </Card>
        )}

        {step === 'agreement-form' && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Create Rental Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAgreement} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white">Property Address</label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter property address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white">Tenant Name</label>
                  <input
                    type="text"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tenant name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white">Monthly Rent</label>
                    <input
                      type="number"
                      name="rentAmount"
                      value={formData.rentAmount}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white">Security Deposit</label>
                    <input
                      type="number"
                      name="depositAmount"
                      value={formData.depositAmount}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white">Lease Duration (months)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter months"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white">Special Terms & Conditions</label>
                  <textarea
                    name="specialTerms"
                    value={formData.specialTerms}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter any special terms or conditions"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Generate Agreement
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeetingApprovalFlow;