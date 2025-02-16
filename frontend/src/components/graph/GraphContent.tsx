'use client'
import React, { useState, useEffect } from 'react'
import TxDataNodeGraph from '@/components/graph/TxDataNodeGraph'
import AddressInfoCard from '../card/AddressInfoCard'
import TxInfoCard from '../card/TxInfoCard'
import GraphTxDataTableCard from './GraphTxDataTableCard'
import { LoadingOutlined } from '@ant-design/icons'
import { Alert, Spin, Typography } from 'antd'
import { Empty } from 'antd'

import { EdgeData, NodeData } from '@/types/graph.interface'
import { getAddressBalance, getAddressTransactions } from '@/services/address'
import { Transaction } from '@/types/transaction.interface'
import InputCard from '../card/InputCard'

import { useToast } from '@/hooks/use-toast'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setTransactions } from '@/lib/features/transactions/transactionsSlice'

const GraphContent = () => {
  const dispatch = useDispatch()

  const transactions = useSelector((state: RootState) => state.transactions.transactions)

  const [nodeInfo, setNodeInfo] = useState<NodeData | null>(null)
  const [edgeInfo, setEdgeInfo] = useState<EdgeData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
  const [showError, setShowError] = useState<string | null>(null)

  const [balance, setBalance] = useState<number>()
  // const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastUpdated, setLastUpdated] = useState<'node' | 'edge' | null>(null)
  const { toast } = useToast()

  // Trigger notification on balance or transactions fetch
  const handleNodeClick = (nodeInfo: NodeData) => {
    console.log('Handle Node Click')
    setNodeInfo(nodeInfo)
    setEdgeInfo(null) // Clear edgeInfo when node is clicked
    setLastUpdated('node') // Set last updated to node
  }

  const handleEdgeClick = (edgeInfo: EdgeData) => {
    console.log('Handle Edge Click')

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

          // NOTE: Temp only, modify in the future
          setBalance(balanceData[0].amount) // Set the fetched balance

          dispatch(setTransactions(transactionsData)) // Set the fetched transactions
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

  useEffect(() => {
    if (!transactions.length) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
  }, [transactions])

  useEffect(() => {
    if (loading) {
      const a = setTimeout(() => {
        if (loading) {
          setShowError('Fetching too long, retry latter')
          setLoading(false)
        }
      }, 20000)
      return () => clearTimeout(a)
    }
  }, [loading])

  useEffect(() => {
    if (showError) {
      const a = setTimeout(() => {
        if (showError) {
          setShowError(null)
        }
      }, 3000)
      return () => clearTimeout(a)
    }
  }, [showError])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 60, color: 'white' }} spin />}
          />
        </div>
      )}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 ">
        <div className="">
          <TxDataNodeGraph
            onAddressClick={handleNodeClick} // Capture node click event
            onTxClick={handleEdgeClick} // Capture edge click event
          />
        </div>
        <div className="w-full">
          {showError && <Alert message={showError} type="error" />}

          {isEmpty && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Typography.Text>
                  No transaction found during selected range
                </Typography.Text>
              }
            />
          )}
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
        <InputCard setIsLoading={setLoading} />
      </div>
    </main>
  )
}

export default GraphContent
