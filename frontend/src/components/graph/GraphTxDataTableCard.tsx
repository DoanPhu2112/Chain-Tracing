import React from 'react'
import GraphTxDataTable from '@/components/graph/GraphTxDataTable'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/types/transaction.interface'

interface TxDataVisualizeCardProps {
  txs: Transaction[]
  loading: boolean
}

const GraphTxDataTableCard: React.FC<TxDataVisualizeCardProps> = ({
  txs,
  loading,
}) => {
  return (
    <>
      <Card className="shadow-md" x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>{`Transaction List`}</CardTitle>
        </CardHeader>
        <CardContent>
          <GraphTxDataTable txs={txs} loading={loading} />
        </CardContent>
      </Card>
    </>
  )
}

export default GraphTxDataTableCard
