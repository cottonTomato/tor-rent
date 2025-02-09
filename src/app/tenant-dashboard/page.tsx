"use client";
import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { db, storage } from "./../../firebaseConfig"; // Firebase storage added
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  Home,
  Calendar,
  Bell,
  AlertCircle,
  CreditCard,
  MessageSquare,
  FileText,
  ChevronRight,
  ShieldCheck,
  Settings,
  DollarSign,
  Clock,
  Search,
  CheckCircle,
  Download,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import idl from "../../../anchor/target/idl/torrent.json";
import { Torrent } from "../../../anchor/target/types/torrent";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tenantKey, landlordKey } from "@/constants/keymap";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as Toast from "@radix-ui/react-toast";

const TenantDashboard = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new anchor.AnchorProvider(connection, wallet!, {});
  anchor.setProvider(provider);

  const program = new anchor.Program(idl as Torrent, {
    connection,
  });

  const landlordKeyPair = Keypair.fromSecretKey(landlordKey);
  const tenantKeyPair = Keypair.fromSecretKey(tenantKey);

  const [rentalAgreement] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("rental_agreement"),
      landlordKeyPair.publicKey.toBuffer(),
      tenantKeyPair.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [agreement, setAgreement] = useState<any>(null);

  const fetchAgreement = async () => {
    const fetchedAgreement = await program.account.rentalAgreement.fetch(
      rentalAgreement
    );
    console.log("gay, " + fetchedAgreement);
    setAgreement(fetchedAgreement);
  };

  useEffect(() => {
    fetchAgreement();
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleEmail = async (message) => {
    console.log("Message:", message);
    setLoading(true);
    setLoading(true);

    const serviceID = "service_khesrrp";
    const templateID = "template_63tblyc";
    const publicKey = "oJmBKOHVFS2r-wETd";

    emailjs
      .send(
        serviceID,
        templateID,
        {
          from_name: "Tenant ABC",
          to_name: "Landlord XYZ",
          from_email: "tenant@gmail.com",
          to_email: "piyanshugehani@gmail.com",
          message: message,
        },
        publicKey
      )
      .then((response) => {
        alert("Message sent successfully:", response);
        setSuccess(true);
        setOpen(false); // Close the dialog
        setMessage("");
      })
      .catch((error) => {
        alert("Error sending message:", error);
        setSuccess(false);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!message) return alert("Please enter a complaint message.");
    setLoading(true);

    try {
      let imageUrl = null;

      // Ensure `image` is valid
      if (image) {
        console.log("Image selected:", image);

        // Validate file type and size (5MB limit)
        if (!image.type.startsWith("image/")) {
          return alert("Please select a valid image file.");
        }
        if (image.size > 5 * 1024 * 1024) {
          return alert("Image size must be under 5MB.");
        }

        // Get Firebase storage reference
        const storageRef = ref(
          storage,
          `complaints/${Date.now()}_${image.name}`
        );
        console.log("Uploading to:", storageRef.fullPath);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(
              `Uploading: ${snapshot.bytesTransferred} / ${snapshot.totalBytes}`
            );
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Uploaded Image URL:", url);
          }
        );
      }

      // New complaint object
      const newComplaint = {
        issue_id: `Issue - ${new Date().toLocaleDateString()}`,
        status: "Under Review",
        mediator: "Admin",
        landlordReply: "Awaiting landlord response.",
        sender: message,
        image: imageUrl,
        resolution: "Pending",
      };

      console.log("New Complaint:", newComplaint);

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, "conflict_resolution"),
        newComplaint
      );
      console.log("Complaint submitted with ID:", docRef.id);

      // Update UI
      setComplaints([newComplaint, ...complaints]);
      setOpen(false);
      setMessage("");
      setImage(null);

      // Send email notification (if implemented)
      await handleEmail(message);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  // State management
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const [complaints, setComplaints] = useState([]);

  const actions = [
    { label: "Browse Listings", icon: Search, color: "blue", url: "/listings" },
    {
      label: "View Complaints",
      icon: AlertCircle,
      color: "red",
      url: "/tenant-complaints",
    },
    {
      label: "Make Payment",
      icon: CreditCard,
      color: "green",
      url: "/payment",
    },
    {
      label: "View Documents",
      icon: FileText,
      color: "purple",
      url: "/tenant-agreement",
    },
  ];

  // Property details state (Indian Context)
  const [propertyDetails, setPropertyDetails] = useState({
    address: "Flat 302, Gokul Residency, Andheri East, Mumbai",
    rent: 2000, // INR per month
    nextPayment: "2024-03-01",
    leaseEnd: "2024-12-31",
    deposit: 5000, // INR, typical 3-6 months' rent
    maintenanceRequests: [],
    documents: ["Rent Agreement", "Aadhaar Card", "Electricity Bill"],
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "crypto",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Mock data loading
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulating API calls
    const mockPayments = [
      {
        id: 1,
        type: "Rent",
        amount: 2500,
        due: "2024-03-01",
        status: "upcoming",
      },
      {
        id: 2,
        type: "Utilities",
        amount: 150,
        due: "2024-02-28",
        status: "pending",
      },
      {
        id: 3,
        type: "Security Deposit",
        amount: 5000,
        due: "2024-01-01",
        status: "paid",
      },
    ];

    const mockNotifications = [
      {
        id: 1,
        title: "Maintenance Request",
        desc: "Request #123 has been approved",
        type: "success",
      },
      {
        id: 2,
        title: "Rent Due Soon",
        desc: "Your next payment is due in 5 days",
        type: "warning",
      },
      {
        id: 3,
        title: "New Message",
        desc: "Message from your landlord",
        type: "info",
      },
    ];

    setPayments(mockPayments);
    setNotifications(notifications.length ? notifications : mockNotifications);
  };

  // Payment handling
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPayments([
        {
          id: payments.length + 1,
          type: "Rent",
          amount: parseFloat(paymentForm.amount),
          due: paymentForm.paymentDate,
          status: "processing",
        },
        ...payments,
      ]);
      setToastMessage("Payment Initiated: Your payment is being processed.");
      setIsPaymentModalOpen(false);
    } catch (error) {
      setToastMessage(
        "Payment Failed: There was an error processing your payment."
      );
    }
  };

  // Maintenance request handling
  const submitMaintenanceRequest = async (description) => {
    const newRequest = {
      id: propertyDetails.maintenanceRequests.length + 1,
      description,
      status: "pending",
      date: new Date().toISOString(),
    };

    setPropertyDetails({
      ...propertyDetails,
      maintenanceRequests: [...propertyDetails.maintenanceRequests, newRequest],
    });

    // Add notification
    const maintenanceNotification = {
      id: notifications.length + 1,
      title: "Maintenance Request Submitted",
      desc: "Your request has been sent to the landlord",
      type: "info",
    };

    setNotifications([maintenanceNotification, ...notifications]);
  };

  // Document handling
  const downloadDocument = async (documentId) => {
    setLoading(true);
    try {
      // Simulate document download
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Download Started",
        description: "Your document is being downloaded.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Payment Modal Component
  const PaymentModal = () => (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent className="bg-gray-900 text-white hover:from-gray-800 hover:to-gray-900 hover:text-white">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your payment method and enter the amount.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, amount: e.target.value })
              }
              placeholder="Enter amount"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentForm.paymentDate}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
              }
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Submit Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Top Navigation */}

      <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">My Rental Space</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Property Overview */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {propertyDetails.address}
                </h2>
                <p className="text-gray-400">
                  Lease ends on {propertyDetails.leaseEnd}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="w-4 h-4 mr-2" /> Complaint file
                      to Landlord
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 text-white">
                    <DialogHeader>
                      <DialogTitle>Contact Landlord</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Send a message to your landlord.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Image Upload Input */}
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-white"
                        onChange={handleImageUpload}
                      />

                      {/* Preview Uploaded Image */}
                      {image && (
                        <div className="mt-2">
                          <p className="text-gray-300 text-sm">Preview:</p>
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Complaint Attachment"
                            className="mt-2 max-h-40 rounded-lg"
                          />
                        </div>
                      )}
                      <textarea
                        className="w-full h-32 bg-gray-800 border-gray-700 rounded-md p-2"
                        placeholder="Type your message here..."
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button
                        className="bg-green-600 hover:bg-green-700 mt-4 w-full"
                        onClick={() => {
                          handleSubmit();
                          // handleEmail(message);
                        }}
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Send Message"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="border-gray-600"
                  onClick={() => downloadDocument("lease")}
                >
                  <FileText className="w-4 h-4 mr-2" /> View Lease
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Next Rent Due",
              value: `₹${propertyDetails.rent}`,
              icon: Calendar,
              date: propertyDetails.nextPayment,
              action: () => setIsPaymentModalOpen(true),
            },
            {
              label: "Security Deposit",
              value: `₹${propertyDetails.deposit}`,
              icon: ShieldCheck,
              status: "Held",
            },
            {
              label: "Days Until Due",
              value: "5 Days",
              icon: Clock,
              alert: true,
            },
            {
              label: "Payment Status",
              value: "On Track",
              icon: CreditCard,
              status: "good",
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 cursor-pointer hover:border-gray-600 transition-all"
              onClick={stat.action}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {stat.date || stat.status}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      stat.alert
                        ? "bg-red-500/10 text-red-400"
                        : "bg-gray-800/50 text-gray-400"
                    }`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Payments */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white">
                  Upcoming Payments
                </CardTitle>
                <Button variant="ghost" className="text-gray-400">
                  View All <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{payment.type}</p>
                        <p className="text-sm text-gray-400">
                          Due {payment.due}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        ₹{payment.amount}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          payment.status === "upcoming"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : payment.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white">
                  Notifications
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black/20 rounded-lg space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          notif.type === "success"
                            ? "bg-green-400"
                            : notif.type === "warning"
                            ? "bg-yellow-400"
                            : "bg-blue-400"
                        }`}
                      />
                      <p className="font-medium text-white">{notif.title}</p>
                    </div>
                    <p className="text-sm text-gray-400">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-white">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant="ghost"
              onClick={() => (window.location.href = action.url)}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 
        border border-gray-700 p-4 h-auto flex items-center justify-center space-x-2
        hover:border-${action.color}-500/50`}
            >
              <action.icon className={`w-5 h-5 text-${action.color}-400`} />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;
