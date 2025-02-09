'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Clock, Check, AlertTriangle, DollarSign, Ban, Wallet } from 'lucide-react'

const TenantsPayment = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      month: 'January 2024',
      amount: 1500,
      status: 'paid',
      dueDate: '2024-01-05',
      paidDate: '2024-01-03',
      txHash: '0x123...',
      landlordAddress: '0xabc...'
    },
    {
      id: 2, 
      month: 'February 2024',
      amount: 1500,
      status: 'pending',
      dueDate: '2024-02-05',
      landlordAddress: '0xabc...'
    },
    {
      id: 3,
      month: 'March 2024', 
      amount: 1500,
      status: 'overdue',
      dueDate: '2024-03-05',
      penalty: 75,
      landlordAddress: '0xabc...',
      evictionStatus: 'warning'
    }
  ])

  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletConnected(true)
        setAccount(accounts[0])
      } catch (error) {
        console.error("Error connecting wallet:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'overdue':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid':
        return <Check className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'overdue':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return null
    }
  }

  const handlePayment = async (paymentId) => {
    if (!walletConnected) {
      alert("Please connect your wallet first")
      return
    }

    const payment = payments.find(p => p.id === paymentId)
    const totalAmount = payment.amount + (payment.penalty || 0)

    try {
      // Create provider and signer
      const provider = new window.ethereum
      const signer = provider.getSigner()

      // Create transaction
      const tx = await signer.sendTransaction({
        to: payment.landlordAddress,
        value: totalAmount.toString()
      })

      // Wait for transaction confirmation
      await tx.wait()

      // Update payment status
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? {
              ...payment, 
              status: 'paid', 
              paidDate: new Date().toISOString().split('T')[0],
              txHash: tx.hash
            }
          : payment
      ))

    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    }
  }

  const initiateEviction = async (paymentId) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment.status !== 'overdue') {
      alert("Eviction can only be initiated for overdue payments")
      return
    }

    try {
      // Call smart contract to initiate eviction process
      setPayments(payments.map(p => 
        p.id === paymentId 
          ? {...p, evictionStatus: 'initiated'}
          : p
      ))
      alert("Eviction process has been initiated")
    } catch (error) {
      console.error("Failed to initiate eviction:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Rent Payments</h1>
            {!walletConnected ? (
              <button 
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-500 rounded-lg flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="text-sm text-gray-400">
                Connected: {account?.slice(0,6)}...{account?.slice(-4)}
              </div>
            )}
          </div>
          
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Total Due</h3>
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold mt-2">$3,000</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pending</h3>
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold mt-2">$1,500</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Overdue</h3>
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-3xl font-bold mt-2">$1,575</p>
            </div>
          </div>

          {/* Payment List */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            </div>
            
            <div className="divide-y divide-gray-700">
              {payments.map((payment) => (
                <motion.div
                  key={payment.id}
                  className="p-6 hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(payment.status)}`} />
                      <div>
                        <h3 className="font-medium">{payment.month}</h3>
                        <p className="text-sm text-gray-400">Due: {payment.dueDate}</p>
                        {payment.txHash && (
                          <p className="text-xs text-blue-400">
                            Tx: {payment.txHash.slice(0,6)}...{payment.txHash.slice(-4)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-medium">${payment.amount}</p>
                        {payment.penalty && (
                          <p className="text-sm text-red-400">+${payment.penalty} penalty</p>
                        )}
                      </div>
                      
                      {payment.status !== 'paid' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-medium"
                            onClick={() => handlePayment(payment.id)}
                          >
                            Pay Now
                          </motion.button>
                          
                          {payment.status === 'overdue' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium flex items-center gap-2"
                              onClick={() => initiateEviction(payment.id)}
                              disabled={payment.evictionStatus === 'initiated'}
                            >
                              <Ban className="w-4 h-4" />
                              {payment.evictionStatus === 'initiated' ? 'Eviction Initiated' : 'Initiate Eviction'}
                            </motion.button>
                          )}
                        </div>
                      )}
                      
                      {payment.status === 'paid' && (
                        <div className="flex items-center space-x-2 text-green-500">
                          <Check className="w-5 h-5" />
                          <span className="text-sm">Paid on {payment.paidDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TenantsPayment
