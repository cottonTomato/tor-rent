import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Torrent} from '../target/types/torrent'

describe('torrent', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Torrent as Program<Torrent>

  const torrentKeypair = Keypair.generate()

  it('Initialize Torrent', async () => {
    await program.methods
      .initialize()
      .accounts({
        torrent: torrentKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([torrentKeypair])
      .rpc()

    const currentCount = await program.account.torrent.fetch(torrentKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Torrent', async () => {
    await program.methods.increment().accounts({ torrent: torrentKeypair.publicKey }).rpc()

    const currentCount = await program.account.torrent.fetch(torrentKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Torrent Again', async () => {
    await program.methods.increment().accounts({ torrent: torrentKeypair.publicKey }).rpc()

    const currentCount = await program.account.torrent.fetch(torrentKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Torrent', async () => {
    await program.methods.decrement().accounts({ torrent: torrentKeypair.publicKey }).rpc()

    const currentCount = await program.account.torrent.fetch(torrentKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set torrent value', async () => {
    await program.methods.set(42).accounts({ torrent: torrentKeypair.publicKey }).rpc()

    const currentCount = await program.account.torrent.fetch(torrentKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the torrent account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        torrent: torrentKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.torrent.fetchNullable(torrentKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
