'use client'
import React, { useState, useEffect } from 'react'
import TxDataNodeGraph from '@/components/graph/TxDataNodeGraph'
import AddressInfoCard from '../card/AddressInfoCard'
import TxInfoCard from '../card/TxInfoCard'
import GraphTxDataTableCard from './GraphTxDataTableCard'

import { EdgeData, NodeData } from '@/types/graph.interface'
import { getAddressBalance, getAddressTransactions } from '@/services/address'
import { Transaction } from '@/types/wallet.interface'
import InputCard from '../card/InputCard'

import { useToast } from '@/hooks/use-toast'

const GraphContent = () => {
  const [nodeInfo, setNodeInfo] = useState<NodeData | null>(null)
  const [edgeInfo, setEdgeInfo] = useState<EdgeData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastUpdated, setLastUpdated] = useState<'node' | 'edge' | null>(null)
  const { toast } = useToast()

  // Trigger notification on balance or transactions fetch
  const handleNodeClick = (nodeInfo: NodeData) => {
    setNodeInfo(nodeInfo)
    setEdgeInfo(null) // Clear edgeInfo when node is clicked
    setLastUpdated('node') // Set last updated to node
  }

  const handleEdgeClick = (edgeInfo: EdgeData) => {
    setEdgeInfo(edgeInfo)
    setNodeInfo(null) // Clear nodeInfo when edge is clicked
    setLastUpdated('edge') // Set last updated to edge
  }

  useEffect(() => {
    const fetchWalletData = async () => {
      if (nodeInfo?.details?.address) {
        try {
          toast({
            title: 'Loading wallet data',
            description: 'hehe',
            duration: 2000,
          })
          setLoading(true) // Start loading when fetching begins
          const balanceData = await getAddressBalance(nodeInfo.details.address)
          const transactionsData = await getAddressTransactions(nodeInfo.details.address)
          console.log('🚀 ~ fetchWalletData ~ transactionsData:', transactionsData)
          console.log('🚀 ~ fetchWalletData ~ balanceData:', balanceData)
          setBalance(balanceData) // Set the fetched balance
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
    console.log('NODE INFO:', nodeInfo)
    nodeInfo && fetchWalletData()
  }, [nodeInfo]) // Re-fetch if the address changes

  useEffect(() => {}, [balance, transactions])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 ">
        <div className="">
          <TxDataNodeGraph
            onAddressClick={handleNodeClick} // Capture node click event
            onTxClick={handleEdgeClick} // Capture edge click event
          />
        </div>
        <div className="w-full">
          {nodeInfo && (
            <>
              <GraphTxDataTableCard
                nodeData={nodeInfo}
                txs={transactions}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 ">
        {edgeInfo && <TxInfoCard edgeData={edgeInfo} />}
        {nodeInfo && (
          <>
            <AddressInfoCard nodeData={nodeInfo} balance={balance} loading={loading} />
          </>
        )}
        <InputCard />
      </div>
    </main>
  )
}

export default GraphContent
