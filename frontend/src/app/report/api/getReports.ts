import { ReportCardProps } from '../_component/ReportCard'

// type ReportsResponse = {
//   report_id: number
//   description: string
//   title: string
//   type: string
//   targetAddress: string
//   graphTransactions: any[]
//   url: string
//   timestamp: number
//   author: string
// }[]

// export async function getReports() {
//   const response = await fetch('http://localhost:3002/report/', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//   const data = await response.json()
//   if (!response.ok) {
//     throw new Error('Failed to fetch reports')
//   }
//   return parseReportsData(data)
// }

// function parseReportsData(data: ReportsResponse): ReportCardProps[] {
//   return data.map((item: ReportsResponse[number]) => ({
//     reportId: item.report_id,
//     category: item.type,
//     description: item.description,
//     reporter: item.author,
//     reportedAddresses: [item.targetAddress],
//     reportedDomain: [item.url],
//     timestamp: item.timestamp,
//   }))
// }
