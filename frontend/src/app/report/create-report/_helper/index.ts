export type CaseDetail = {}

export type ScammerDetailValue = {
  amount: {
    value: number
    token: string
  }[]
  transactionHash: string
  description: string
  // timestamp: number
}
export type CaseDetailValue = {
  category: string
  address: string
  url: string
  ip: string
}

export type ReportDetailValue = ScammerDetailValue &
  CaseDetailValue & {
    userName: string
    title: string
    timestamp: number
  }

export const defaultReportDetailValue: ReportDetailValue = {
  userName: 'phu',
  amount: [{ value: 0, token: 'ETH' }],
  transactionHash: '',
  description: '',
  timestamp: 0,
  category: '',
  address: '',
  url: '',
  ip: '',
  title: '',
}
