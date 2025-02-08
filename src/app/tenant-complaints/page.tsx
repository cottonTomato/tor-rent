"use client"
import { useState } from "react";

const complaintsData = [
  {
    id: 1,
    title: "Water Leakage in Bathroom",
    status: "Under Review",
    mediator: "Amit Sharma",
    landlordReply: "Plumber has been scheduled for tomorrow.",
    chat: [
      { sender: "Tenant", message: "There is water leakage from the bathroom ceiling." },
      { sender: "Landlord", message: "I'll get it checked tomorrow." },
    ],
    resolution: "Pending",
  },
  {
    id: 2,
    title: "No Electricity in Kitchen",
    status: "Resolved",
    mediator: "Priya Verma",
    landlordReply: "Electrician fixed the wiring issue on Feb 10th.",
    chat: [
      { sender: "Tenant", message: "There is no electricity in the kitchen since last night." },
      { sender: "Landlord", message: "The electrician has fixed it today. Let me know if there's any issue." },
    ],
    resolution: "Refund Processed",
  },
];



export default function ComplaintsPage() {
    // Property details state (Indian Context)
const [propertyDetails, setPropertyDetails] = useState({
    address: "Flat 302, Gokul Residency, Andheri East, Mumbai",
    rent: 22000, // INR per month
    nextPayment: "2024-03-01",
    leaseEnd: "2024-12-31",
    deposit: 75000, // INR, typical 3-6 months' rent
    maintenanceRequests: [],
    documents: ["Rent Agreement", "Aadhaar Card", "Electricity Bill"]
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Complaints</h1>
      <div className="grid grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="col-span-1 border-r border-gray-700 pr-4">
          {complaintsData.map((complaint) => (
            <div
              key={complaint.id}
              className={`p-4 mb-4 rounded-lg cursor-pointer ${
                selectedComplaint?.id === complaint.id ? "bg-gray-800" : "bg-gray-700"
              }`}
              onClick={() => setSelectedComplaint(complaint)}
            >
              <h2 className="text-xl font-semibold">{complaint.title}</h2>
              <p className="text-sm text-gray-400">Status: {complaint.status}</p>
            </div>
          ))}
        </div>

        {/* Complaint Details */}
        <div className="col-span-2">
          {selectedComplaint ? (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold">{selectedComplaint.title}</h2>
              <p className="text-gray-400">Status: {selectedComplaint.status}</p>
              <p className="text-gray-400">Mediator: {selectedComplaint.mediator}</p>
              <p className="mt-4">Landlord's Reply: "{selectedComplaint.landlordReply}"</p>
              <h3 className="mt-6 text-lg font-semibold">Chat</h3>
              <div className="bg-gray-700 p-4 rounded-lg max-h-40 overflow-auto">
                {selectedComplaint.chat.map((msg, index) => (
                  <p key={index} className={msg.sender === "Tenant" ? "text-blue-400" : "text-green-400"}>
                    <strong>{msg.sender}: </strong>{msg.message}
                  </p>
                ))}
              </div>
              <p className="mt-4 text-yellow-400">Resolution: {selectedComplaint.resolution}</p>
            </div>
          ) : (
            <p className="text-gray-400">Select a complaint to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}