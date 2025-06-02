import { fetchApiV1 } from '@/lib/fetch-api'
import { Transaction } from '@/types/transaction.interface'

export async function getAddressTransactions(
  address: string,
  limit?: number,
  startTimestamp?: number,
  endTimestamp?: number
): Promise<Transaction[]> {
  let param = startTimestamp ? `startTimestamp=${startTimestamp}` : ''
  param += endTimestamp ? `&endTimestamp=${endTimestamp}` : ''
  param += limit ? `&pageSize=${limit}` : ''
  const res = await fetchApiV1<Transaction[]>(`account/transaction/${address}?${param}`)
  return res.json()
}
