import { useSuspenseQuery } from '@tanstack/react-query'
import { getReport, parseReport } from '../get-report'

export function useReport(id: string) {
  return useSuspenseQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      return getReport({ id })
    },
    select: parseReport,
    // staleTime: Number.POSITIVE_INFINITY,
  })
}
