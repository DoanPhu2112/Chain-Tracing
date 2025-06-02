import { fetchApiV1 } from '@/lib/fetch-api'
import { Transaction, TransactionType } from '@/types/transaction.interface'

export type ReportResponse = {
  description: string
  title: string
  graphTransactions: Transaction[]
  targetAddress: string
  type: string
  url: string
  author: string
  timestamp: number
  amount: {
    value: number
    token: string
  }
}

const beToFeTxnType: Record<string, TransactionType> = {
  swap: TransactionType.Swap,
  send: TransactionType.Sent,
  sign: TransactionType.Sign,
  airdrop: TransactionType.Airdrop,
  receive: TransactionType.Receive,
  approve: TransactionType.Approve,
}

export function getReport({ id }: { id: string }) {
  return fetchApiV1.get<ReportResponse>(`report/${id}`).json()
}

export function parseReport(report: ReportResponse): ReportResponse {
  const transactions = report.graphTransactions.map((transaction: Transaction) => ({
    ...transaction,
    type: beToFeTxnType[transaction.type],
  }))
  return {
    ...report,
    graphTransactions: transactions,
  }
}
