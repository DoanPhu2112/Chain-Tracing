import { ReportDetailValue } from '@/app/report/create-report/_helper'
import { Transaction } from '@/types/transaction.interface'

type CreateReportResponse = {
  report_id: number
  transactions: Transaction[]
}

export async function submitReport(
  formData: ReportDetailValue
): Promise<CreateReportResponse> {
  console.log(`${process.env.BACKEND_HOST}/report/create-report`)
  const response = await fetch(`${process.env.BACKEND_HOST}/report/create-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  console.log('response', response)
  if (!response.ok) {
    throw new Error('Failed to submit report')
  }
  const data: CreateReportResponse = await response.json()
  return data
}

export type ReportResponse = {
  description: string
  title: string
  graphTransactions: Transaction[]
  targetAddress: string
  type: string
  url: string[]
  author: string
  timestamp: number
  amount: {
    value: number
    token: string
  }
}
