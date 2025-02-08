"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Key, User, Mail, Camera, Phone, Loader2, CheckCircle, Building, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleRoleSelect = (selectedRole: any) => {
    setRole(selectedRole);
    if (role === 'tenant') {
      router.push('/tenant-dashboard');
    } else if (role === 'landlord') {
      router.push('/dashboard');
    }
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
                onClick={() => router.push('/tenant-dashboard')}
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
                onClick={() => router.push('/dashboard')}
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
      </div>
    </div>
  );
};

export default RegistrationPage;