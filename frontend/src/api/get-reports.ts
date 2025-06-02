import { fetchApiV1 } from '@/lib/fetch-api'

type ReportsResponse = {
  report_id: number
  description: string
  title: string
  type: string
  targetAddress: string
  graphTransactions: any[]
  url: string
  timestamp: number
  author: string
}[]

type Reports = {
  reportId: number
  category: string
  description: string
  reporter: string
  reportedAddresses: string[]
  reportedDomain: string[]
  timestamp: number
}
export async function getReports() {
  return fetchApiV1.get<ReportsResponse>(`report`).json()
}

export function parseReportsData(data: ReportsResponse): Reports[] {
  return data.map((item: ReportsResponse[number]) => ({
    reportId: item.report_id,
    category: item.type,
    description: item.description,
    reporter: item.author,
    reportedAddresses: [item.targetAddress],
    reportedDomain: [item.url],
    timestamp: item.timestamp,
  }))
}
