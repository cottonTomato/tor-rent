'use client';

import React, {useEffect} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';


export default function Wallet() {

  const {publicKey} = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push('/dashboard');
    }
  }, [publicKey, router]);

  return (
    <div>
        <h1>SOLANA UR MOM</h1>
        <WalletMultiButton/>
    </div>
  );
}