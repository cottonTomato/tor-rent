"use client";
import React from 'react';
import { Check, Download, FileText, Clock, AlertTriangle } from 'lucide-react';

const RentalAgreementPage = () => {
  const [status, setStatus] = React.useState('PENDING');
  const [isDownloading, setIsDownloading] = React.useState(false);

  const contractDetails = {
    propertyAddress: "123 Blockchain Street, Crypto City",
    monthlyRent: "2,000 USDC",
    duration: "12 months",
    startDate: "March 1, 2025",
    endDate: "February 28, 2026",
    deposit: "4,000 USDC",
    maintenanceClauses: "Tenant responsible for minor repairs under $200",
    penalties: "Late fee of 5% if rent paid after 5th of month"
  };

  const handleSign = () => {
    setStatus('SIGNED');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const getStatusColor = () => {
    const colors = {
      PENDING: 'text-yellow-500',
      SIGNED: 'text-green-500',
      ACTIVE: 'text-blue-500',
      EXPIRED: 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rental Agreement</h1>
          <p className="text-gray-400">Smart Contract-Based Digital Lease</p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center mb-8 bg-gray-800/50 p-4 rounded-lg">
          <Clock className="mr-2" />
          <span>Status: </span>
          <span className={`ml-2 font-semibold ${getStatusColor()}`}>
            {status}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Contract Terms */}
          <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" />
              Contract Terms
            </h2>
            <div className="space-y-4">
              {Object.entries(contractDetails).map(([key, value]) => (
                <div key={key} className="border-b border-gray-700 pb-2">
                  <div className="text-gray-400 text-sm mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Signature Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Digital Signature</h2>
              <div className="mb-4">
                <p className="text-gray-400 mb-4">
                  By signing this agreement, you confirm that you have read and agree to all terms and conditions.
                </p>
                <button
                  onClick={handleSign}
                  disabled={status !== 'PENDING'}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                    ${status === 'PENDING' 
                      ? 'bg-blue-600 hover:bg-blue-700 transition-colors' 
                      : 'bg-gray-700 cursor-not-allowed'}`}
                >
                  <Check className="w-5 h-5" />
                  <span>Sign Agreement</span>
                </button>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Download Agreement</h2>
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>

            {/* Warning Section */}
            <div className="bg-yellow-500/10 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-yellow-200">
                This is a legally binding smart contract. Once signed, it will be permanently recorded on the blockchain and cannot be modified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreementPage;