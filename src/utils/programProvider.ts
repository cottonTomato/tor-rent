import { Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import type { Torrent } from "../../anchor/target/types/torrent";
import idl from "../../anchor/target/idl/torrent.json";

const connection = new Connection("http://localhost:8899");

export const program = new Program(idl as Torrent, {
  connection,
});
