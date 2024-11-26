import React from 'react'
import { NodeData } from '@/types/graph.interface'
import { Transaction } from '@/types/wallet.interface'
import GraphTxDataTable from '@/components/graph/GraphTxDataTable'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TxDataVisualizeCardProps {
  nodeData: NodeData
  txs: Transaction[]
  loading: boolean
}

const GraphTxDataTableCard: React.FC<TxDataVisualizeCardProps> = ({
  nodeData,
  txs,
  loading,
}) => {
  return (
    <>
      <Card className="shadow-md" x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>{`Address ${nodeData.details.address}'s recent transactions`}</CardTitle>
          <CardDescription>Recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <GraphTxDataTable txs={txs} loading={loading} />
        </CardContent>
      </Card>
    </>
  )
}

export default GraphTxDataTableCard
