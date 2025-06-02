import { useSuspenseQuery } from '@tanstack/react-query'
import { getReports, parseReportsData } from '../get-reports'

export function useReports() {
  return useSuspenseQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      return getReports()
    },
    select: parseReportsData,
  })
}
