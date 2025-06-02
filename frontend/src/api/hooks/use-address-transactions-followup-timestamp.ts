import { useQuery } from '@tanstack/react-query'
import {
  getAddressTransactionsFollowupTimestamp,
  parseTransactions,
} from '../get-address-transactions-followup-timestamp'

export function useAddressTransactionsFollowupTimestamp(
  address: string,
  timestamp: string,
  limit?: string
) {
  return useQuery({
    queryKey: ['address-transactions-followup-timestamp', address, timestamp, limit],
    queryFn: () => getAddressTransactionsFollowupTimestamp(timestamp, address, limit),
    select: parseTransactions,
    enabled: false,
  })
}
