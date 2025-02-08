"use client";
import { useEffect, useState } from "react";
import { db } from "./../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "conflict_resolution"));
        const complaintsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Rcvd",data);
          return {
            id: doc.id,
            title: `Issue ID: ${data.issue_id || "Issue - 2/8/2025"}`,
            status: data.resolved_at ? "Resolved" : "Under Review",
            mediator: data.mediator || "Admin",
            landlordReply: data.resolution_notes || "Awaiting landlord response.",
            chat: [
              { sender: "Tenant", message: "Tenant reported an issue." },
              { sender: "Landlord", message: data.resolution_notes || "Awaiting landlord response." },
            ],
            resolution: data.resolved_at
              ? `Resolved on ${new Date(data.resolved_at.seconds * 1000).toLocaleString()}`
              : "Pending",
              imageUrl: data.image && data.image.trim() !== "" 
              ? data.image
              : "",
            
          };
        });
        setComplaints(complaintsList);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Complaints</h1>
      <div className="flex w-full max-w-6xl gap-6">
        {/* Complaints List */}
        <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
          {complaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedComplaint?.id === complaint.id ? "bg-gray-900" : "bg-gray-700"
              }`}
              onClick={() => setSelectedComplaint(complaint)}
            >
              <h2 className="text-xl font-semibold">{complaint.title}</h2>
              <p
                className={`text-sm font-medium mt-1 py-1 px-2 inline-block rounded-md ${
                  complaint.status === "Resolved" ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {complaint.status}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Complaint Details */}
        <div className="w-2/3">
          {selectedComplaint ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-2">{selectedComplaint?.title}</h2>
              <p className="text-gray-400">Status: {selectedComplaint.status}</p>
              <p className="text-gray-400">Mediator: {selectedComplaint.mediator}</p>
              <p className="mt-4 text-yellow-400 font-medium">Landlord's Reply: "{selectedComplaint.landlordReply}"</p>

              {/* Render Image if Available */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Uploaded Image</h3>
                <img
                  src={selectedComplaint?.imageUrl}
                  alt="Complaint Image"
                  className="mt-2 w-full h-auto rounded-lg shadow-lg border border-gray-600"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold">Chat</h3>
              <div className="bg-gray-700 p-4 rounded-lg max-h-40 overflow-auto border border-gray-600">
                {selectedComplaint.chat.map((msg, index) => (
                  <p
                    key={index}
                    className={`text-sm mt-1 ${msg.sender === "Tenant" ? "text-blue-400" : "text-green-400"}`}
                  >
                    <strong>{msg.sender}: </strong>
                    {msg.message}
                  </p>
                ))}
              </div>
              <p className="mt-4 text-green-400 font-semibold">Resolution: {selectedComplaint.resolution}</p>
            </motion.div>
          ) : (
            <p className="text-gray-400 text-lg text-center">Select a complaint to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
