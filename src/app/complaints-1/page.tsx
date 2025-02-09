"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { db, storage } from "./../../firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "conflict_resolution"));
        const fetchedComplaints = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComplaints(fetchedComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async () => {
    if (!reply.trim()) return alert("Please enter a response.");
    setLoading(true);
  
    try {
      // Construct updated landlord reply
      const updatedReply =
        selectedComplaint.landlordReply === "Awaiting landlord response."
          ? `${reply}`
          : `${selectedComplaint.landlordReply} | ${reply}`;
  
      // Update Firestore document
      await updateDoc(doc(db, "conflict_resolution", selectedComplaint.id), {
        landlordReply: updatedReply,
        status: "Resolved", // Set resolution status to "Resolved"
      });
  
      // Update selected complaint in UI
      setSelectedComplaint((prev) => ({
        ...prev,
        landlordReply: updatedReply,
        status: "Resolved",
      }));
  
      // Update complaints list to reflect changes
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === selectedComplaint.id
            ? { ...complaint, landlordReply: updatedReply, resolution: "Resolved" }
            : complaint
        )
      );
  
      setReply(""); // Clear input field after submission
      alert("Your reply has been updated & the issue is now marked as resolved!");
  
    } catch (error) {
      console.error("Error updating landlord reply:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const getStatusColor = (status) => {
    const colors = {
      "Under Review": "bg-yellow-500",
      "In Mediation": "bg-blue-500",
      "Resolved": "bg-green-500",
      "Escalated": "bg-red-500",
    };
    return colors[status] || "bg-gray-100";
  };

  useEffect(() => {
    console.log("selectedComplaint", selectedComplaint);
  }, [selectedComplaint]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dispute Management Center</h1>
          <p className="text-gray-400">Manage and resolve tenant disputes efficiently</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaints List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Active Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-400">Loading complaints...</p>
                ) : complaints.length === 0 ? (
                  <p className="text-gray-400">No active disputes</p>
                ) : (
                  <div className="space-y-4 text-white">
                    {complaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{complaint.sender}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{complaint.issue_id}</p>
                        <div className="flex items-center text-sm text-gray-400">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{complaint.messages?.length || 0} messages</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Complaint Details */}
          <div className="lg:col-span-2">
            {selectedComplaint ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white mb-2">{selectedComplaint.sender}</CardTitle>
                      <p className="text-sm text-gray-400">{selectedComplaint.issue_id}</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm">
                      Escalate to Arbitration
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Image */}
                  <div className="mb-6 text-white">
                    <h3 className="text-lg font-medium mb-4">Evidence Image</h3>
                    {selectedComplaint.image ? (
                      <img
                        src={selectedComplaint.image}
                        alt="Issue evidence"
                        className="rounded-lg"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <p className="text-gray-400">No image provided</p>
                    )}
                  </div>

                  {/* Landlord Response */}
                  <div className="mb-6 text-white">
                    <h3 className="text-lg font-medium mb-2">Landlord's Response</h3>
                    <p className={`text-sm p-2 rounded-md ${selectedComplaint.landlordReply === "Awaiting landlord response." ? "bg-yellow-600" : "bg-green-600"}`}>
                      {selectedComplaint.landlordReply === "Awaiting landlord response."
                        ? "Waiting for Landlord's Response"
                        : `Landlord Response: ${selectedComplaint.landlordReply}`}
                    </p>
                  </div>

                  {/* Chat Section */}
                  <div className="space-y-4 text-white">
                    <h3 className="text-lg font-medium mb-4">Mediation Chat</h3>
                    <div className="space-y-4 mb-4">
                      {selectedComplaint.messages?.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.sender === "Landlord" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === "Landlord" ? "bg-blue-600" : "bg-gray-700"}`}>
                            <p className="text-sm font-medium mb-1">{message.sender}</p>
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Reply Input (Only show if awaiting response) */}
                    {selectedComplaint?.landlordReply === "Awaiting landlord response." && (
                      <div className="flex gap-2">
                       <input
      type="text"
      placeholder="Type your response..."
      className="flex-1 bg-gray-700 border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={reply}
      onChange={(e) => setReply(e.target.value)}
    />
    <button 
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      onClick={handleSubmit}
    >
      Send
    </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a complaint to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
