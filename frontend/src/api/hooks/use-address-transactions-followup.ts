import { useQuery } from '@tanstack/react-query'
import {
  getAddressTransactionsFollowup,
  parseTransactions,
} from '../get-address-transactions-followup'

export function useAddressTransactionsFollowup(
  address: string,
  transactionHash: string,
  limit?: string
) {
  return useQuery({
    queryKey: ['address-transactions-followup', address, transactionHash, limit],
    queryFn: () => getAddressTransactionsFollowup(transactionHash, address, limit),
    select: parseTransactions,
  })
}
