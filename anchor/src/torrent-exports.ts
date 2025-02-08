// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import TorrentIDL from '../target/idl/torrent.json'
import type { Torrent } from '../target/types/torrent'

// Re-export the generated IDL and type
export { Torrent, TorrentIDL }

// The programId is imported from the program IDL.
export const TORRENT_PROGRAM_ID = new PublicKey(TorrentIDL.address)

// This is a helper function to get the Torrent Anchor program.
export function getTorrentProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...TorrentIDL, address: address ? address.toBase58() : TorrentIDL.address } as Torrent, provider)
}

// This is a helper function to get the program ID for the Torrent program depending on the cluster.
export function getTorrentProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Torrent program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return TORRENT_PROGRAM_ID
  }
}
