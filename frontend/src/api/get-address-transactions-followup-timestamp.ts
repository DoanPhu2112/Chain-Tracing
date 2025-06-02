import { fetchApiV1 } from '@/lib/fetch-api'
import {
  Entity,
  TokenAmount,
  Transaction,
  TransactionType,
  Value,
} from '@/types/transaction.interface'

export type TransactionResponse = {
  chainId: string
  txnHash: string
  from: Entity
  to: Entity
  tokenAmount: TokenAmount | TokenAmount[]
  type: TransactionType | string
  summary: string
  value: Value
  date: string
}

export function getAddressTransactionsFollowupTimestamp(
  timestamp: string,
  address: string,
  limit?: string
): Promise<TransactionResponse[]> {
  const searchParams = limit
    ? new URLSearchParams({
        pageSize: limit,
        timestamp,
      })
    : undefined

  return fetchApiV1<TransactionResponse[]>(`account/transaction/${address}/followup`, {
    searchParams,
  }).json()
}

export function parseTransactions(transactions: TransactionResponse[]): Transaction[] {
  return transactions.map((txn) => ({
    ...txn,
    date: new Date(txn.date),
    type: txn.type as TransactionType, // Ensure type is cast to TransactionType
  }))
}
