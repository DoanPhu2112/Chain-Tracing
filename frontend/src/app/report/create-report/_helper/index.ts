export type CaseDetail = {

}

export type ScammerDetailValue = {
    amount: {
        value: number,
        token: string
    }[]
    transactionHash: string[]
    description: string
    timestamp: number
};
export type CaseDetailValue = {
    category: string
    address: string[]
    url: string
    ip: string
}
  
export type ReportDetailValue = ScammerDetailValue & CaseDetailValue & {
    userId: number
};

export const defaultReportDetailValue: ReportDetailValue = {
    userId: 0,
    amount: [{ value: 0, token: 'ETH' }],  
    transactionHash: [''],
    description: '',
    timestamp: 0,
    category: '',
    address: [''],
    url: '',
    ip: ''
}