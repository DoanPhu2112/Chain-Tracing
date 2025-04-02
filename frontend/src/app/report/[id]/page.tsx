'use client'
import { Divider } from '@/components/Divider'
import TxDataNodeGraph from '../../../components/graph/ViewOnlyGraph'

import mock_graph_transactions from '@/mocks/graph_response.json'
import mock_transactions from '@/mocks/transactions.json'
import { EdgeData, NodeData } from '@/types/graph.interface'
import { Transaction } from '@/types/transaction.interface'
import { timestampToAgo } from '@/util/timestampToAgo'
import { useEffect, useState } from 'react'
import { TokenIcon } from '@web3icons/react'
import { Badge } from '@/components/ui/badge'
import { useParams } from 'next/navigation'

const defaultValue = {
  description:
    'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum',
  title: 'Phishing Scam',
  type: 'lorem ipsum',
  targetAddress: '0x7fb5fdc3c756394f36d4bebd3cda1def3485841d',
  graphTransactions: mock_graph_transactions,
  url: ['https://www.scam.com', 'https://www.scammer.com'],
  author: 'phu',
  timestamp: 163234234234,
  amount: [{ value: 0.1, token: 'ETH' }],
}

export default function Report() {
  const params = useParams()
  const reportId = params?.id
  
  const [report, setReport] = useState(defaultValue)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [nodeInfo, setNodeInfo] = useState<NodeData | null>(null)
  const [edgeInfo, setEdgeInfo] = useState<EdgeData | null>(null)
  const [lastUpdated, setLastUpdated] = useState<'node' | 'edge' | null>(null)

  const timeAgo = timestampToAgo(report.timestamp.toString())

  const handleNodeClick = (nodeInfo: NodeData) => {
    setNodeInfo(nodeInfo)
    setEdgeInfo(null) // Clear edgeInfo when node is clicked
    setLastUpdated('node') // Set last updated to node
  }

  const handleEdgeClick = (edgeInfo: EdgeData) => {
    setEdgeInfo(edgeInfo)
    setNodeInfo(null) // Clear nodeInfo when edge is clicked
    setLastUpdated('edge') // Set last updated
  }
  useEffect(() => {
    if (!reportId) return

    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:3002/report/${reportId}`)
        const data = await res.json()
        console.log("data: ", data)
        if (data.error) {
          console.error('Error fetching report:', data.error)
          return
        }
        console.log(data)
        setReport(data)
      } catch (err) {
        console.error('Failed to fetch report:', err)
      }
    }

    fetchReport()
  }, [reportId])
  
  return (
    <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8">
      <div className="mx-auto max-w-[846px] space-y-4 md:space-y-6">
        <div className="font-inter text-title-h4">{report.title}</div>
        <Divider />
        <div className="flex gap-6">
          <div className="basis-2/3">
            <div className="font-inter text-title-h6">Description</div>
            <p className="text-p-md text-itr-tentPri-sub "> {report.description}</p>
          </div>

          <div className="relative flex items-start justify-between basis-1/3 px-4 md:block md:px-6 py-6 space-y-3 rounded-[20px] border border-bd-pri-sub bg-gray-50">
            <div className="font-inter text-title-h6 pb-3">Detail information</div>
            <div className="flex flex-col space-x-0 space-y-2 items-start">
              <div className="text-label-sm-pri text-itr-tentPri-sub">Target Address</div>
              <div className="flex items-center gap-1">
                <TokenIcon symbol="eth" variant="branded" />
                <div className="text-sm-regular">{report.targetAddress}</div>
              </div>
            </div>
            <div className="flex flex-col space-x-0 space-y-2 items-start">
              <div className="text-label-sm-pri text-itr-tentPri-sub">Amount Lost</div>
              <Badge className="text-sm-regular" variant="outline" size="md">
                {report.amount.map((amount) => `${amount.value} ${amount.token}`)}
              </Badge>
            </div>
            <div className="flex flex-col space-x-0 space-y-2 items-start">
              <div className="text-label-sm-pri text-itr-tentPri-sub">Reported URL</div>
              <div className="space-y-2 text-sm-regular italic">
                {report.url.length !== 0 && report.url.map((url, index) => (
                  <div key={index} className="text-link-sm-pri">
                    {url}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Divider />

        <div className="div flex gap-24">
          <div className="flex flex-col items-start gap-1">
            <div className="text-p-xs text-itr-tentPri-sub">Submitted</div>
            <div className="text-p-sm">{timeAgo}</div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-p-xs text-itr-tentPri-sub">Author</div>
            <div className="text-p-sm">{report.author}</div>
          </div>
        </div>

        <Divider />
        <div className="text-label-sm-pri">Built Graph</div>

        <TxDataNodeGraph
          transactionsInput={mock_graph_transactions as unknown as Transaction[]}
          cls={{ graph: 'max-h-96' }}
          onAddressClick={handleNodeClick} // Capture node click event
          onTxClick={handleEdgeClick} // Capture edge click event
        />
      </div>
    </div>
  )
}
