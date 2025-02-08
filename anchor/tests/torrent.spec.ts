import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { Torrent } from "../target/types/torrent";

describe("torrent", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Torrent as anchor.Program<Torrent>;

  const torrentKeypair = Keypair.generate();

  it("Initialize Torrent", async () => {});
});
