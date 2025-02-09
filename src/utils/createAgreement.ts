import { program } from "./programProvider";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function createAgreement(
  landlord: Keypair,
  tenant: Keypair,
  rentAmount: anchor.BN,
  depositAmount: anchor.BN,
  durationMonths: number
): Promise<PublicKey> {
  const [rentalAgreement] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("rental_agreement"),
      landlord.publicKey.toBuffer(),
      tenant.publicKey.toBuffer(),
    ],
    program.programId
  );

  await program.methods
    .createAgreement(rentAmount, depositAmount, durationMonths)
    .accounts({
      landlord: landlord.publicKey,
      tenant: tenant.publicKey,
    })
    .signers([landlord, tenant])
    .rpc();

  console.log("RENTAL AGRIMENT: " + rentalAgreement.toString());
  return rentalAgreement;
}
