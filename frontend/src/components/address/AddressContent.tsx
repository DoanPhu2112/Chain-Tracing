'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import InputCard from '../card/InputCard'
import AddressInfoCard from './AddressInfoCard'
import TabCard from './TabCard'
import { PortfolioBalance } from '@/types/wallet.interface'
import { getAddressBalance, getAddressTransactions } from '@/services/address'
import { useToast } from '@/hooks/use-toast'
import { AddressTxByMonth } from '../chart/AddressTxByMonth'
import { Transaction } from '@/types/transaction.interface'
const initialBalance = [
  {
    transactionHash: '0x3e24fe4617af8037a03fefe8243a32e494bbbd30913523c41456d793ce7e62d8',
    from_entity: {
      address: '0xF82DcE9bb688D15095E4072271bF3161876Cba47',
      address_entity: null,
      address_entity_logo: null,
      address_entity_label: null,
    },
    to_entity: {
      address: '0xD1C24f50d05946B3FABeFBAe3cd0A7e9938C63F2',
      address_entity: null,
      address_entity_logo: null,
      address_entity_label: null,
    },
    method_label: null,
    value: '1000000000000',
    block_timestamp: '2018-11-02T05:01:04.000Z',
    nft_transfers: [],
    erc20_transfers: [],
    native_transfers: [
      {
        from_entity: {
          address: '0xF82DcE9bb688D15095E4072271bF3161876Cba47',
          address_entity: null,
          address_entity_logo: null,
          address_entity_label: null,
        },
        to_entity: {
          address: '0xD1C24f50d05946B3FABeFBAe3cd0A7e9938C63F2',
          address_entity: null,
          address_entity_logo: null,
          address_entity_label: null,
        },
        token: {
          symbol: 'ETH',
          logo: 'https://cdn.moralis.io/eth/0x.png',
        },
        value_formatted: '0.000001',
        direction: 'receive',
      },
    ],
    summary: 'Received 0.000001 ETH from 0xf8...ba47',
  },
]

const AddressContent = () => {
  const { toast } = useToast()
  const params = useParams<{ address: string }>()
  //@ts-ignore
  const address = params.address
  console.log('TEST address: ', address)
  const [balance, setBalance] = useState<PortfolioBalance[]>()
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
          // const balanceData = await getAddressBalance(address);
          const balancePortfolio = await getAddressBalance(address)
          console.log('TEST Balance Portfolio: ', balancePortfolio)
          const balanceData = Number(balancePortfolio[0].value) //TODO: Check for AddressInfoCard
          const transactionsData = await getAddressTransactions(address)
          console.log('🚀 ~ fetchWalletData ~ transactionsData:', transactionsData)
          console.log('🚀 ~ fetchWalletData ~ balanceData:', balanceData)
          setBalance(balancePortfolio) // Set the fetched balance
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

  useEffect(() => {}, [balance, transactions])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div>
        <AddressInfoCard balance={0} address={address} />
        {/* <AddressTxByMonth /> */}
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {/* <TabCard portfolio={balance!} transactions={transactions} /> */}
        {!loading && balance && transactions ? (
          <TabCard portfolio={balance} transactions={transactions} />
        ) : (
          <p>Loading data...</p> // Optional loading message
        )}
      </div>
    </main>
  )
}

export default AddressContent
