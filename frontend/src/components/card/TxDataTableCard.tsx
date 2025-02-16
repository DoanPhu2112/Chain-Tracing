import React from 'react'
import { useState } from 'react'
import TxDataTable from '@/components/tx/TxDataTable'
import { Transaction } from '@/types/transaction.interface'
import { TransactionsList } from '@/types/transaction.interface'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TxDataTableCardProps {
  onUpdate: (txList: TransactionsList) => void
}

const TxDataTableCard: React.FC<TxDataTableCardProps> = ({ onUpdate }) => {
  const [txList, setTxList] = useState<TransactionsList>([])

  return (
    <>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>Relevant Transactions</CardTitle>
          <CardDescription>Relevant transactions description</CardDescription>
        </CardHeader>
        <CardContent>
          <TxDataTable onUpdate={onUpdate} />
        </CardContent>
      </Card>
    </>
  )
}

export default TxDataTableCard
