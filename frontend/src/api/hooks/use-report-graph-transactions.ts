import { Transaction } from '@/types/transaction.interface'
import { useMutation } from '@tanstack/react-query'
import { postReportGraph } from '../post-report-graph-transactions'

export function useReportGraphTransactions(
  reportId: string,
  graphTransactions: Transaction[]
) {
  return useMutation({
    mutationFn: async () => {
      postReportGraph(reportId, graphTransactions)
    },
  })
}
