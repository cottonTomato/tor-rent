"use client";
import React from "react";
import { Check, Download, FileText, Clock, AlertTriangle } from "lucide-react";
import { tenantKey, landlordKey } from "@/constants/keymap";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "../../../anchor/target/idl/torrent.json";
import { Torrent } from "../../../anchor/target/types/torrent";
import * as anchor from "@coral-xyz/anchor";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const RentalAgreementPage = () => {
  const [status, setStatus] = React.useState("PENDING");
  const [isDownloading, setIsDownloading] = React.useState(false);

  const contractDetails = {
    propertyAddress: "123 Blockchain Street, Crypto City",
    monthlyRent: "2,000 LM",
    duration: "12 months",
    startDate: "March 1, 2025",
    endDate: "February 28, 2026",
    deposit: "4,000 LM",
    maintenanceClauses: "Tenant responsible for minor repairs under 200 LM",
    penalties: "Late fee of 5% if rent paid after 5th of month",
    walletAddress: "Dyb1tpRK7476ypHh1my89ehuQxXn7fKMFh2nySvKTddH",
  };
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const handleSign = async () => {
    setStatus("SIGNED");

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

    const tx = await program.methods
      .createAgreement(new BN(2000), new BN(4000), 12)
      .accounts({
        landlord: landlordKeyPair.publicKey,
        tenant: tenantKeyPair.publicKey,
      })
      .signers([landlordKeyPair, tenantKeyPair])
      .transaction();

    tx.feePayer = wallet?.publicKey;

    tx.recentBlockhash = (
      await provider.connection.getLatestBlockhash()
    ).blockhash;

    const signedTx = wallet?.signTransaction(tx);

    await provider.connection.sendRawTransaction(tx.serialize());

    console.log("RENTAL AGRIMENT: " + rentalAgreement.toString());
  };

  const handleDownload = async () => {
    setIsDownloading(true);
  
    const agreementElement = document.getElementById("rental-agreement");
    if (!agreementElement) return;
  
    try {
      const canvas = await html2canvas(agreementElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Rental_Agreement.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = () => {
    const colors = {
      PENDING: "text-yellow-500",
      SIGNED: "text-green-500",
      ACTIVE: "text-blue-500",
      EXPIRED: "text-red-500",
    };
    return colors[status] || "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-900 text-white p-8">
      <div id="rental-agreement" className="max-w-4xl mx-auto">
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
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
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
                  By signing this agreement, you confirm that you have read and
                  agree to all terms and conditions.
                </p>
                <button
                  onClick={handleSign}
                  disabled={status !== "PENDING"}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                    ${
                      status === "PENDING"
                        ? "bg-blue-600 hover:bg-blue-700 transition-colors"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
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
                <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
              </button>
            </div>

            {/* Warning Section */}
            <div className="bg-yellow-500/10 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-yellow-200">
                This is a legally binding smart contract. Once signed, it will
                be permanently recorded on the blockchain and cannot be
                modified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreementPage;
