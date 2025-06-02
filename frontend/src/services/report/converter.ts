import { Transaction, TransactionType } from '@/types/transaction.interface'

const beToFeTxnType: Record<string, TransactionType> = {
  swap: TransactionType.Swap,
  send: TransactionType.Sent,
  sign: TransactionType.Sign,
  airdrop: TransactionType.Airdrop,
  receive: TransactionType.Receive,
  approve: TransactionType.Approve,
}

export const reportConverter = (report: any) => {
  const transactions = report.graphTransactions.map((transaction: Transaction) => ({
    ...transaction,
    type: beToFeTxnType[transaction.type],
  }))
  return {
    ...report,
    graphTransactions: transactions,
  }
}
