import * as anchor from "@coral-xyz/anchor";
import { Torrent } from "../target/types/torrent";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("torrent", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Torrent as anchor.Program<Torrent>;

  const landlord = Keypair.generate();
  const tenant1 = Keypair.generate();
  const tenant2 = Keypair.generate();

  const rentAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);
  const depositAmount = new anchor.BN(2 * LAMPORTS_PER_SOL);
  const durationMonths = 12;

  let rentalAgreement: PublicKey;

  beforeAll(async () => {
    const airDropLandlord = await provider.connection.requestAirdrop(
      landlord.publicKey,
      10 * LAMPORTS_PER_SOL,
    );
    const airDropTenant1 = await provider.connection.requestAirdrop(
      tenant1.publicKey,
      10 * LAMPORTS_PER_SOL,
    );
    const airDropTenant2 = await provider.connection.requestAirdrop(
      tenant2.publicKey,
      10 * LAMPORTS_PER_SOL,
    );

    const latestBlockHashForLandlord =
      await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHashForLandlord.blockhash,
      lastValidBlockHeight: latestBlockHashForLandlord.lastValidBlockHeight,
      signature: airDropLandlord,
    });

    const latestBlockHashForTenant1 =
      await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHashForTenant1.blockhash,
      lastValidBlockHeight: latestBlockHashForTenant1.lastValidBlockHeight,
      signature: airDropTenant1,
    });
    const latestBlockHashForTenant2 =
      await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHashForTenant2.blockhash,
      lastValidBlockHeight: latestBlockHashForTenant2.lastValidBlockHeight,
      signature: airDropTenant2,
    });

    [rentalAgreement] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("rental_agreement"),
        landlord.publicKey.toBuffer(),
        tenant1.publicKey.toBuffer(),
      ],
      program.programId,
    );
  });

  it("Creates a rental agreement", async () => {
    await program.methods
      .createAgreement(rentAmount, depositAmount, durationMonths)
      .accounts({
        landlord: landlord.publicKey,
        tenant: tenant1.publicKey,
      })
      .signers([landlord, tenant1])
      .rpc();

    const agreement =
      await program.account.rentalAgreement.fetch(rentalAgreement);

    expect(agreement.landlord.toString()).toEqual(
      landlord.publicKey.toString(),
    );
    expect(agreement.tenant.toString()).toEqual(tenant1.publicKey.toString());
    expect(agreement.rentAmount.toNumber()).toEqual(rentAmount.toNumber());
    expect(agreement.depositAmount.toNumber()).toEqual(
      depositAmount.toNumber(),
    );
    expect(agreement.durationMonths).toEqual(durationMonths);
    expect(agreement.isActive).toBe(true);
    expect(agreement.missedPayments).toEqual(0);
  });

  it("Fails to create agreement with invalid amounts", async () => {
    try {
      await program.methods
        .createAgreement(new anchor.BN(0), depositAmount, durationMonths)
        .accounts({
          landlord: landlord.publicKey,
          tenant: tenant2.publicKey,
        })
        .signers([landlord, tenant2])
        .rpc();

      throw new Error("Should have failed with invalid amount");
    } catch (error) {
      expect((error as Error).message).toContain("InvalidAmount");
    }
  });

  it("Updates a rental agreement", async () => {
    const newRentAmount = new anchor.BN(1.5 * LAMPORTS_PER_SOL);

    await program.methods
      .updateAgreement(newRentAmount, null, null)
      .accounts({
        landlord: landlord.publicKey,
        tenant: tenant1.publicKey,
      })
      .signers([landlord, tenant1])
      .rpc();

    const agreement =
      await program.account.rentalAgreement.fetch(rentalAgreement);
    expect(agreement.rentAmount.toString()).toEqual(newRentAmount.toString());
  });

  it("Pays rent", async () => {
    const tenantBalanceBefore = await provider.connection.getBalance(
      tenant1.publicKey,
    );
    const landlordBalanceBefore = await provider.connection.getBalance(
      landlord.publicKey,
    );

    await program.methods
      .payRent()
      .accounts({
        tenant: tenant1.publicKey,
        landlord: landlord.publicKey,
      })
      .signers([tenant1])
      .rpc();

    const tenantBalanceAfter = await provider.connection.getBalance(
      tenant1.publicKey,
    );
    const landlordBalanceAfter = await provider.connection.getBalance(
      landlord.publicKey,
    );

    expect(tenantBalanceAfter).toBeLessThan(tenantBalanceBefore);
    expect(landlordBalanceAfter).toBeGreaterThan(landlordBalanceBefore);
  });

  it("Attempts fraudulant deduction of rent", async () => {
    try {
      await program.methods
        .attemptAutoDeduction()
        .accounts({
          tenant: tenant1.publicKey,
          landlord: landlord.publicKey,
        })
        .rpc();

      throw new Error("Should have failed with payment not due yet");
    } catch (error) {
      expect((error as Error).message).toContain("payment is not due");
    }
  });

  it("Submits a maintenance request", async () => {
    const description = "Leaky faucet in kitchen";

    await program.methods
      .submitMaintenanceRequest(description)
      .accounts({
        rentalAgreement,
        tenant: tenant1.publicKey,
      })
      .signers([tenant1])
      .rpc();

    const agreement =
      await program.account.rentalAgreement.fetch(rentalAgreement);

    expect(agreement.maintenanceRequests.length).toEqual(1);
    expect(agreement.maintenanceRequests[0].description).toEqual(description);
    expect(agreement.maintenanceRequests[0].isResolved).toBe(false);
  });

  it("Resolves a maintenance request", async () => {
    await program.methods
      .resolveMaintenanceRequest(0)
      .accounts({
        rentalAgreement,
        landlord: landlord.publicKey,
      })
      .signers([landlord])
      .rpc();

    const agreement =
      await program.account.rentalAgreement.fetch(rentalAgreement);

    expect(agreement.maintenanceRequests[0].isResolved).toBe(true);
  });

  it("Fails to submit maintenance request with invalid description", async () => {
    const longDescription = "a".repeat(201);

    try {
      await program.methods
        .submitMaintenanceRequest(longDescription)
        .accounts({
          rentalAgreement,
          tenant: tenant1.publicKey,
        })
        .signers([tenant1])
        .rpc();

      throw new Error("Should have failed with invalid description");
    } catch (error) {
      expect((error as Error).toString()).toContain("InvalidDescription");
    }
  });

  it("Terminates the agreement", async () => {
    await program.methods
      .terminateAgreement()
      .accounts({
        landlord: landlord.publicKey,
        tenant: tenant1.publicKey,
      })
      .signers([landlord, tenant1])
      .rpc();

    const agreement =
      await program.account.rentalAgreement.fetch(rentalAgreement);

    expect(agreement.isActive).toBe(false);
  });
});
