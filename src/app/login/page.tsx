"use client"

import { WalletButton } from "@/components/solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/router for older Next.js versions

export default function Page() {
  const { connected } = useWallet(); // Get wallet connection status
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push("/dashboard"); // Redirect when wallet is connected
    }
  }, [connected, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
      <WalletButton />
    </div>
  );
}
