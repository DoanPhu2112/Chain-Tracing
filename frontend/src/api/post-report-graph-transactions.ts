import { fetchApiV1 } from '@/lib/fetch-api'
import { Transaction } from '@/types/transaction.interface'

export function postReportGraph(reportId: string, graphTransactions: Transaction[]) {
  return fetchApiV1<{ status: boolean }>(`report/${reportId}`, {
    body: JSON.stringify({
      reportId,
      graphTransactions,
    }),
    headers: {
      'Content-Type': 'application/json', // <-- This is crucial
    },
    method: 'POST',
  })
}
