import { AnchorProvider, Program, web3, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../../anchor/target/idl/torrent.json"; // Anchor IDL file
import type { Torrent } from "../../anchor/target/types/torrent";
import { useConnection } from "@solana/wallet-adapter-react";

const connection = new Connection("http://localhost:8899");

export const getProvider = (wallet: any) => {
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
};

export const getProgram = (wallet: any) => {
  const provider = getProvider(wallet);
  return new Program(idl as Torrent, { connection });
};
