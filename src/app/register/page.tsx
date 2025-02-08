"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Key, User, Mail, Camera, Phone, Loader2, CheckCircle, Building, Search } from 'lucide-react';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharImage: null
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate OCR processing
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setFormData(prev => ({
          ...prev,
          phone: '9876543210' // Simulated phone number from OCR
        }));
        setStep(3);
      }, 2000);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== '' && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Check if OTP is complete
    if (index === 3 && value !== '') {
      verifyOtp();
    }
  };

  const verifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      // Redirect after verification
      setTimeout(() => {
        window.location.href = role === 'tenant' ? '/tenant-dashboard' : '/dashboard';
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto my-40">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to TorRent</h1>
            <p className="text-gray-400 mb-12">Choose your journey with us</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tenant Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100/10 p-8 rounded-xl backdrop-blur-sm cursor-pointer"
                onClick={() => handleRoleSelect('tenant')}
              >
                <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Looking for Home</h2>
                <p className="text-gray-400">Find your perfect rental space with blockchain-secured agreements</p>
              </motion.div>

              {/* Landlord Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100/10 p-8 rounded-xl backdrop-blur-sm cursor-pointer"
                onClick={() => handleRoleSelect('landlord')}
              >
                <div className="bg-purple-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Building className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">I'm a Landlord</h2>
                <p className="text-gray-400">List your property and manage tenants with smart contracts</p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800/30 rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-800/30 rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Upload Aadhar Card</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="aadhar-upload"
                  />
                  <label
                    htmlFor="aadhar-upload"
                    className="w-full bg-gray-800/30 rounded-lg p-6 border-2 border-dashed border-gray-700 flex flex-col items-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-gray-400">Click to upload</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">Verify Your Phone</h2>
            <p className="text-gray-400 mb-8">Enter the OTP sent to {formData.phone}</p>
            
            <div className="flex justify-center space-x-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center bg-gray-800/30 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-xl"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Verifying...</span>
              </div>
            )}

            {isVerified && (
              <div className="flex items-center justify-center text-green-500">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span>Verified! Redirecting...</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full ${
                  step >= stepNumber ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;