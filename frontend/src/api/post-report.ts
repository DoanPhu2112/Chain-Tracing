import { ReportDetailValue } from '@/app/report/create-report/_helper'
import { fetchApiV1 } from '@/lib/fetch-api'
import { ResponsePromise } from 'ky'

export function postCreateReport(reportDetail: ReportDetailValue): ResponsePromise<{
  status: boolean
  report_id: string
}> {
  console.log('reportDetail', reportDetail)
  return fetchApiV1<{ status: boolean }>('report/create-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // <-- This is crucial
    },
    body: JSON.stringify(reportDetail),
  })
}
