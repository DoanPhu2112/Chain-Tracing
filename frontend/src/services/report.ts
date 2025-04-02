import { ReportDetailValue } from '@/app/report/create-report/_helper';
import { Transaction } from '@/types/transaction.interface';
const prefix = 'http://localhost:3002'

type ReportResponse = {
  report_id: number,
  transactions: Transaction[],
}

export async function submitReport(formData: ReportDetailValue): Promise<ReportResponse> {
  console.log("Form Data: ", formData)
  const response = await fetch(`${prefix}/report/create-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error('Failed to submit report');
  }
  const data: ReportResponse = await response.json();
  return data;
}