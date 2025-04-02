'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import InputCard from '../card/InputCard'
import OverallInfoCard from './OverallInfoCard'
import TabCard from './TabCard'
import {
  getAddressBalance,
  getAddressLabels,
  getAddressTornadoStat,
  getAddressTransactions,
} from '@/services/address'
import { useToast } from '@/hooks/use-toast'
import { AddressTxByMonth } from '../chart/AddressTxByMonth'
import { PortfolioBalance } from '@/types/wallet.interface'
import {
  AccountType,
  ERC20Amount,
  TornadoStatResponse,
  Transaction,
  TransactionType,
} from '@/types/transaction.interface'

const AddressInfo = () => {
  const { toast } = useToast()
  const params = useParams<{ address: string }>()
  //@ts-ignore
  const address = params.address
  const [labels, setLabel] = useState<string[] | undefined>()

  const [portfolio, setBalance] = useState<PortfolioBalance[]>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [tornadoStat, setTornadoStat] = useState<TornadoStatResponse | undefined>(
    undefined
  )
  const [currentTab, setCurrentTab] = useState('tornado')
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (address) {
        try {
          setLoading(true) // Start loading when fetching begins
          const portfolioData = await getAddressBalance(address)
          const transactionsData = await getAddressTransactions(address, 10)
          const labelsData = await getAddressLabels(address);
          console.log(':rocket: ~ fetchWalletData ~ transactionsData:', transactionsData)
          console.log(':rocket: ~ fetchWalletData ~ portfolioData:', portfolioData)
          console.log(':rocket: ~ fetchWalletData ~ labelsData:', labelsData)
          setLabel(labelsData) // Set the fetched labels
          setBalance(portfolioData) // Set the fetched portfolio
          //@ts-ignore
          setTransactions(transactionsData) // Set the fetched transactions
        } catch (error) {
          console.error('Error fetching wallet data:', error)
        } finally {
          setLoading(false) // Stop loading after data is fetched
        }
      }
    }
    const fetchWalletData = async () => {
      if (address) {
        try {
          toast({
            title: 'Loading wallet data',
            description: 'hehe',
            duration: 2000,
          })
          setLoading(true) // Start loading when fetching begins
          const tornadoResult = await getAddressTornadoStat(address)
          setTornadoStat(tornadoResult)
        } catch (error) {
          console.error('Error fetching wallet data:', error)
        } finally {
          setLoading(false) // Stop loading after data is fetched
        }
      } else {
        setLoading(false) // Stop loading if no valid address is present
      }
    }
    address && fetchWalletData()
    address && fetchPortfolio()
  }, [address]) // Re-fetch if the address changes

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div>
        {portfolio && tornadoStat && (
          <OverallInfoCard
            labels={labels}
            portfolio={portfolio}
            address={address}
            loading
            tornadoStat={tornadoStat}
          />
        )}
        {/* {tornadoStat && <AddressTxByMonth withdraw={tornadoStat.withdraw.length} deposit={tornadoStat.deposit.length} linkedAddress={tornadoStat.linkedTxns} multiDenom={tornadoStat.multiDenom}/>} */}
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {!loading && portfolio && transactions && tornadoStat ? (
          <TabCard
            portfolio={portfolio}
            transactions={transactions}
            loading={loading}
            tornadoStat={tornadoStat}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          <p>Loading data...</p> // Optional loading message
        )}
      </div>
    </main>
  )
}

export default AddressInfo
