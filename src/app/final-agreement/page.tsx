"use client"
import React, { useState } from "react";
import { Check, Download, FileText, Clock, AlertTriangle, X } from "lucide-react";

const LandlordAgreementPage = () => {
  const [status, setStatus] = useState("PENDING_APPROVAL");
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const contractDetails = {
    propertyAddress: "123 Main Street, Apartment 4B",
    monthlyRent: "$2,000",
    duration: "12 months",
    startDate: "March 1, 2025",
    endDate: "February 28, 2026",
    deposit: "$4,000",
    maintenanceClauses: "Tenant responsible for minor repairs under $200",
    penalties: "Late fee of 5% if rent paid after 5th of month",
    tenantName: "John Doe",
    tenantPhone: "(555) 123-4567",
    tenantEmail: "john.doe@email.com"
  };

  const handleApprove = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStatus("APPROVED");
      setLoading(false);
    }, 1500);
  };

  const handleReject = () => {
    setStatus("REJECTED");
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const getStatusColor = () => {
    const colors = {
      PENDING_APPROVAL: "text-yellow-500",
      APPROVED: "text-green-500",
      REJECTED: "text-red-500",
      ACTIVE: "text-blue-500",
    };
    return colors[status] || "text-gray-500";
  };

  const getStatusMessage = () => {
    const messages = {
      PENDING_APPROVAL: "Awaiting Your Approval",
      APPROVED: "Agreement Approved",
      REJECTED: "Agreement Rejected",
      ACTIVE: "Agreement Active",
    };
    return messages[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rental Agreement Review</h1>
          <p className="text-gray-400">Landlord Approval Interface</p>
        </div>

        <div className="flex items-center mb-8 bg-gray-800/50 p-4 rounded-lg">
          <Clock className="mr-2" />
          <span>Status: </span>
          <span className={`ml-2 font-semibold ${getStatusColor()}`}>
            {getStatusMessage()}
          </span>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" />
              Contract Details
            </h2>
            <div className="space-y-4">
              {Object.entries(contractDetails).map(([key, value]) => (
                <div key={key} className="border-b border-gray-700 pb-2">
                  <div className="text-gray-400 text-sm mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Agreement Approval</h2>
              <div className="mb-4">
                <p className="text-gray-400 mb-4">
                  Please review the agreement details carefully before approving.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={status !== "PENDING_APPROVAL" || loading}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                      ${
                        status === "PENDING_APPROVAL" && !loading
                          ? "bg-green-600 hover:bg-green-700 transition-colors"
                          : "bg-gray-700 cursor-not-allowed"
                      }`}
                  >
                    <Check className="w-5 h-5" />
                    <span>{loading ? "Processing..." : "Approve Agreement"}</span>
                  </button>
                  
                  <button
                    onClick={handleReject}
                    disabled={status !== "PENDING_APPROVAL" || loading}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                      ${
                        status === "PENDING_APPROVAL" && !loading
                          ? "bg-red-600 hover:bg-red-700 transition-colors"
                          : "bg-gray-700 cursor-not-allowed"
                      }`}
                  >
                    <X className="w-5 h-5" />
                    <span>Reject Agreement</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Download Agreement</h2>
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
              </button>
            </div>

            {status === "APPROVED" && (
              <div className="bg-green-500/10 p-4 rounded-lg flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-green-200">
                  Agreement has been approved. A confirmation email has been sent to both parties.
                </p>
              </div>
            )}

            {status === "REJECTED" && (
              <div className="bg-red-500/10 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-red-200">
                  Agreement has been rejected. The tenant will be notified of your decision.
                </p>
              </div>
            )}

            {status === "PENDING_APPROVAL" && (
              <div className="bg-yellow-500/10 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-yellow-200">
                  Please review all terms carefully. Once approved, the agreement will be sent to the tenant for final signature.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordAgreementPage;