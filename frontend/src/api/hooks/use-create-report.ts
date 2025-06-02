import { useMutation } from '@tanstack/react-query'
import { postCreateReport } from '../post-report'
import { ReportDetailValue } from '@/app/report/create-report/_helper'

export function useCreateReport() {
  console.log('useCreateReport')
  return useMutation({
    mutationFn: (report: ReportDetailValue) => {
      return postCreateReport(report)
    },
  })
}
