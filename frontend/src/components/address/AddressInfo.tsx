'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import InputCard from '../card/InputCard'
import AddressInfoCard from './AddressInfoCard'
import TabCard from './TabCard'
import { Transaction } from '@/types/wallet.interface'
import { getAddressBalance, getAddressTransactions } from '@/services/address'
import { useToast } from '@/hooks/use-toast'
import { AddressTxByMonth } from '../chart/AddressTxByMonth'
import { PortfolioBalance } from '@/types/wallet.interface'

const AddressInfo = () => {
  const { toast } = useToast()
  const params = useParams<{ address: string }>()
  //@ts-ignore
  const address = params.address
  const [portfolio, setBalance] = useState<PortfolioBalance[]>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchWalletData = async () => {
      if (address) {
        try {
          toast({
            title: 'Loading wallet data',
            description: 'hehe',
            duration: 2000,
          })
          setLoading(true) // Start loading when fetching begins
          const portfolioData = await getAddressBalance(address)
          const transactionsData = await getAddressTransactions(address)
          console.log('🚀 ~ fetchWalletData ~ transactionsData:', transactionsData)
          console.log('🚀 ~ fetchWalletData ~ portfolioData:', portfolioData)
          setBalance(portfolioData) // Set the fetched portfolio
          //@ts-ignore
          setTransactions(transactionsData) // Set the fetched transactions
        } catch (error) {
          console.error('Error fetching wallet data:', error)
        } finally {
          setLoading(false) // Stop loading after data is fetched
        }
      } else {
        setLoading(false) // Stop loading if no valid address is present
      }
    }
    console.log('NODE INFO:', address)
    address && fetchWalletData()
  }, [address]) // Re-fetch if the address changes

  useEffect(() => {}, [portfolio, transactions])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div>
        {portfolio && <AddressInfoCard portfolio={portfolio} address={address} />}
        <AddressTxByMonth />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {/* <TabCard /> */}
        {!loading && portfolio && transactions ? (
          <TabCard portfolio={portfolio} transactions={transactions} loading={loading} />
        ) : (
          <p>Loading data...</p> // Optional loading message
        )}
      </div>
    </main>
  )
}

export default AddressInfo
