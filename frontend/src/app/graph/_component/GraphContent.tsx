'use client'
import React, { useState, useEffect, useCallback } from 'react'
import TxDataNodeGraph from '@/components/graph/TxDataNodeGraph'
import AddressInfoCard from '../../../components/card/AddressInfoCard'
import TxInfoCard from '../../../components/card/TxInfoCard'
import GraphTxDataTableCard from '../../../components/graph/GraphTxDataTableCard'
import { LoadingOutlined } from '@ant-design/icons'
import { Alert, Spin } from 'antd'
import { Empty } from 'antd'

import { EdgeData, NodeData } from '@/types/graph.interface'
import InputCard from '../../../components/card/InputCard'

import { useToast } from '@/hooks/use-toast'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { addTransactions } from '@/lib/features/transactions/transactionsSlice'
import { PortfolioBalance } from '@/types/wallet.interface'
import { useAddressBalanceQuery } from '@/api/hooks/use-address-balance'
import { useReportGraphTransactions } from '@/api/hooks/use-report-graph-transactions'
import { useAddressTransactionsFollowupTimestamp } from '@/api/hooks/use-address-transactions-followup-timestamp'
import { useAddressLabel } from '@/api/hooks/use-address-label'

const GraphContent = () => {
  const dispatch = useDispatch()
  const targetNode = useSelector((state: RootState) => state.node.clickedNode)

  const reportId = useSelector((state: RootState) => state.report)

  const transactions = useSelector((state: RootState) => state.transactions.transactions)

  const startTime = useSelector((state: RootState) => state.startTime)

  const [nodeInfo, setNodeInfo] = useState<NodeData | null>(null)
  const [edgeInfo, setEdgeInfo] = useState<EdgeData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
  const [showError, setShowError] = useState<string | null>(null)

  // const [balances, setBalances] = useState<PortfolioBalance[]>()
  const [nodeDetail, setNodeDetail] = useState<{
    label: string[]
    balance: PortfolioBalance[]
  }>()

  const { toast } = useToast()

  const {
    refetch: refetchBalances,
    error: balanceError,
    isLoading,
  } = useAddressBalanceQuery({
    address: targetNode?.data.addressHash ?? null,
  })

  const { refetch: refetchLabel, error: labelError } = useAddressLabel({
    address: targetNode?.data.addressHash || '0x',
  })

  const { mutateAsync: saveGraph, isError } = useReportGraphTransactions(
    reportId.toString(),
    transactions
  )

  const [endDate, setEndDate] = useState<number>(Date.now())
  const [limit, setLimit] = useState<number>(10)

  const { refetch } = useAddressTransactionsFollowupTimestamp(
    targetNode?.data.addressHash ?? '',
    startTime.toString(),
    limit.toString()
  )

  const handleSaveGraph = async () => {
    await saveGraph()
    if (isError) {
      setShowError('Failed to save graph')
      toast({
        title: 'Failed to save graph',
        description: 'The graph could not be saved. Please try again.',
        duration: 2000,
      })
    } else {
      toast({
        title: 'Graph saved successfully',
        description: 'The graph has been saved successfully.',
        duration: 2000,
      })
    }
  }

  const handleFindFollowingTransactions = async () => {
    setLoading(true)

    const result = await refetch()
    if (result.isSuccess) {
      toast({
        title: 'Following transactions fetched successfully',
        description: 'The following transactions have been fetched successfully.',
        duration: 2000,
      })
    }
    const sentTransactions = result.data?.filter(
      (transaction) => transaction.value.sent.length > 0
    )
    dispatch(addTransactions(sentTransactions || []))

    setLoading(false)
  }

  // Trigger notification on balance or transactions fetch
  const handleNodeClick = useCallback(
    async (nodeInfo: NodeData) => {
      console.log('Handle node click')
      setNodeInfo(nodeInfo)
      setEdgeInfo(null)

      const balance = await refetchBalances()
      const label = await refetchLabel()

      if (balance.isSuccess) {
        setNodeDetail((prevNode) => ({
          balance: balance.data,
          label: prevNode?.label || [],
        }))
      } else {
        toast({
          title: 'Failed to fetch address balance',
          description: balanceError?.message,
          duration: 2000,
        })
      }
      if (label.isSuccess) {
        setNodeDetail((prevNode) => ({
          balance: prevNode?.balance || [],
          label: [...label.data.label, label.data.researchLabel].filter(item => item !== "0x"),
        }))
      } else {
        toast({
          title: 'Failed to fetch address label',
          description: labelError?.message,
          duration: 2000,
        })
      }
    },
    [refetchBalances, refetchLabel, toast]
  )

  const handleEdgeClick = (edgeInfo: EdgeData) => {
    setEdgeInfo(edgeInfo)
    setNodeInfo(null) // Clear nodeInfo when edge is clicked
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEndDate(Number(Date.now()))
      setLimit(Number(localStorage.getItem('limit') || '10'))
    }
  }, [startTime])

  useEffect(() => {
    if (!transactions.length) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
  }, [transactions])



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
        <TxDataNodeGraph
          onSaveGraphAction={handleSaveGraph}
          onFindFollowingTransactionsAction={handleFindFollowingTransactions}
          onAddressClickAction={handleNodeClick} // Capture node click event
          onTxClickAction={handleEdgeClick} // Capture edge click event
        />
        <div className="w-full">
          {showError && <Alert message={showError} type="error" />}

          {isEmpty && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-xl-regular text-black">
                  No transaction found during selected range
                </div>
              }
            />
          )}
          <GraphTxDataTableCard
            txs={transactions}
            loading={loading}
          />
        </div>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 ">
        <InputCard setIsLoading={setLoading} />
        {edgeInfo && <TxInfoCard edgeData={edgeInfo} />}
        {nodeInfo && (
          <>
            <AddressInfoCard
              nodeData={nodeInfo}
              balances={nodeDetail?.balance}
              label={nodeDetail?.label || []}
              loading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default GraphContent
