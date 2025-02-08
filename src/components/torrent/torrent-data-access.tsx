'use client'

import { getTorrentProgram, getTorrentProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useTorrentProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTorrentProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getTorrentProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['torrent', 'all', { cluster }],
    queryFn: () => program.account.torrent.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['torrent', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ torrent: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useTorrentProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useTorrentProgram()

  const accountQuery = useQuery({
    queryKey: ['torrent', 'fetch', { cluster, account }],
    queryFn: () => program.account.torrent.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['torrent', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ torrent: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['torrent', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ torrent: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['torrent', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ torrent: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['torrent', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ torrent: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
