'use client'
import { Divider } from '@/components/Divider'
import TxDataNodeGraph from '../../../../components/graph/ViewOnlyGraph'

import { EdgeData, NodeData } from '@/types/graph.interface'
import { timestampToAgo } from '@/util/timestampToAgo'
import { TokenIcon } from '@web3icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/button'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { setTransactions } from '@/lib/features/transactions/transactionsSlice'
import { useReport } from '@/api/hooks/use-report'
import { Node } from '@xyflow/react'
import { setReportId } from '@/lib/features/report/reportSlice'
import { toast } from '@/hooks/use-toast'
import { useCallback, useEffect, useState } from 'react'
import AddressInfoCard from '@/components/card/AddressInfoCard'
import TxInfoCard from '@/components/card/TxInfoCard'
import { setStartTime } from '@/lib/features/start-time/startTimeSlice'
import { useAddressBalance, useAddressBalanceQuery } from '@/api/hooks/use-address-balance'
import { useAddressLabel } from '@/api/hooks/use-address-label'
import { setAddress } from '@/lib/features/address/addressSlice'
import { PortfolioBalance } from '@/types/wallet.interface'
import { RootState } from '@/lib/store'
import { setClickedNode } from '@/lib/features/node/nodeSlice'

export function Report({ id }: { id: string }) {
  const dispatch = useDispatch()
  const node = useSelector((state: RootState) => state.node.clickedNode)
  const transactions = useSelector((state: RootState) => state.transactions.transactions)
  const { data: report, isLoading } = useReport(id)
  const { refetch: refetchBalances, error: balanceError } = useAddressBalanceQuery({
    address: node?.data.addressHash ?? null,
  })
  const { refetch: refetchLabel, error: labelError } = useAddressLabel({
    address: node?.data.addressHash || '0x',
  })

  const startTxTimestamp = new Date(report.graphTransactions[0].date).getTime()

  const [nodeInfo, setNodeInfo] = useState<NodeData | null>(null)
  const [edgeInfo, setEdgeInfo] = useState<EdgeData | null>(null)

  const [nodeDetail, setNodeDetail] = useState<{
    label: string[]
    balance: PortfolioBalance[]
  }>()

  useEffect(() => {
    dispatch(setAddress(report.targetAddress)) // Set the target address in the Redux store
  }, [report.targetAddress, dispatch])

  const timeAgo = timestampToAgo(report.timestamp.toString())

  // Trigger notification on balance or transactions fetch
  const handleNodeClick = useCallback(
    async (nodeInfo: NodeData) => {

      const matchingTimestamps = transactions
        .filter((txn) => txn.to.address === nodeInfo.data.addressHash)
        .map((txn) => new Date(txn.date).getTime())

      const startTime = matchingTimestamps.length > 0 ? Math.max(...matchingTimestamps) : 0

      dispatch(setClickedNode({ node: nodeInfo, startTime }))

      setNodeInfo(nodeInfo)
      setEdgeInfo(null)

      const balance = (await refetchBalances()).data
      const label = (await refetchLabel()).data
      console.log('balance', balance)
      console.log('label', label)
      if (balance) {
        setNodeDetail((prevNode) => ({
          balance: balance,
          label: prevNode?.label || [],
        }))
      } else {
        toast({
          title: 'Empty Balance',
          // description: balanceError?.message,
          duration: 2000,
        })
      }
      if (label) {
        setNodeDetail((prevNode) => ({
          balance: prevNode?.balance || [],
          label: [...label.label, label.researchLabel],
        }))
      } else {
        toast({
          title: 'Failed to fetch address label',
          description: labelError?.message,
          duration: 2000,
        })
      }
    },
    [balanceError?.message, dispatch, labelError?.message, refetchBalances, refetchLabel, transactions]
  )

  const handleEdgeClick = (edgeInfo: EdgeData) => {
    setEdgeInfo(edgeInfo)
    setNodeInfo(null) // Clear nodeInfo when edge is clicked
  }

  const handleEditGraphClick = () => {
    dispatch(setStartTime(startTxTimestamp))
    dispatch(setReportId(id))
    dispatch(setTransactions(report.graphTransactions)) // Set the fetched transactions
  }
  if (isLoading) {
    toast({
      title: 'Loading report...',
      description: 'Please wait while we fetch the report data.',
      duration: 3000,
    })
    return <div>Loading...</div> // Or a skeleton/placeholder
  }

  return (
    <div className="px-10 2xl:px-60 md:grid md:grid-cols-3 flex flex-col gap-8">
      <div className="space-y-4 md:space-y-6 col-span-2">
        <div className="font-inter text-title-h4">{report.title}</div>
        <Divider />
        <div className="flex flex-col gap-6">
          <div className="font-inter text-title-h6">Description</div>
          <p className="text-p-lg text-itr-tentPri-sub " dangerouslySetInnerHTML={{
            __html: report.description.replace(/\n/g, '<br />'),
          }} />
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <div className="text-label-lg-pri ">Built Graph</div>
          <Link href={`/graph`}>
            <Button onClick={handleEditGraphClick} variant="secondary">
              Edit detail graph
            </Button>
          </Link>
        </div>

        <TxDataNodeGraph
          transactionsInput={report.graphTransactions}
          cls={{ graph: 'max-h-[800px]' }}
          onAddressClickAction={handleNodeClick} // Capture node click event
          onTxClick={handleEdgeClick} // Capture edge click event
        />
      </div>
      <div className="space-y-4">
        <div className="overflow-clip max-w-fit max-h-fit relative flex flex-col items-start justify-between basis-1/3 px-4 md:block md:px-6 py-6 mt-10 space-y-3 rounded-[20px] border-2 border-bd-pri-sub bg-gray-50">
          <div className="font-inter text-title-h6 pb-3">Detail information</div>
          <div className="flex flex-col space-x-0 space-y-2 items-start">
            <div className="text-label-md-pri text-itr-tentPri-df">Target Address</div>
            <div className="flex items-center gap-1">
              <TokenIcon symbol="eth" variant="branded" />
              <div className="text-sm-regular">{report.targetAddress}</div>
            </div>
          </div>
          <div className="flex flex-col space-x-0 space-y-2 items-start">
            <div className="text-label-md-pri text-itr-tentPri-df">Amount Lost</div>
            <Badge className="text-sm-regular" variant="outline" size="lg">
              {`${report.amount.value} ${report.amount.token}`}
            </Badge>
          </div>
          <div className="space-y-4 ">
            <div className="flex flex-col space-x-0 space-y-2 items-start">
              <div className="text-label-md-pri text-itr-tentPri-df">Reported URL</div>
              <div className="space-y-2 text-sm-regular">
                {report.url && <div className="text-link-sm-pri">{report.url}</div>}
              </div>
            </div>
            <Divider />

            <div className="div flex gap-24">
              <div className="flex flex-col items-start gap-1">
                <div className="text-label-md-pri font-sans">Submitted</div>
                <div className="text-p-sm">{timeAgo}</div>
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="text-label-md-pri font-sans">Author</div>
                <div className="text-p-sm">{report.author}</div>
              </div>
            </div>
          </div>
        </div>
        {edgeInfo && <TxInfoCard edgeData={edgeInfo} />}

        {nodeInfo && (
          <>
            <AddressInfoCard
              nodeData={nodeInfo}
              balances={nodeDetail?.balance}
              loading={false}
              label={nodeDetail?.label}
              inReport={true}
            />
          </>
        )}
      </div>
    </div>
  )
}
