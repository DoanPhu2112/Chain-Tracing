import { useQuery } from '@tanstack/react-query'
import { getAddressTransactions } from '../get-address-transactions'

export function useAddressTransactions(
  address: string | null,
  startTimestamp?: number,
  endTimestamp?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['address-transactions', address, startTimestamp, endTimestamp, limit],
    queryFn: () =>
      address
        ? getAddressTransactions(address, limit, startTimestamp, endTimestamp)
        : null,
    // select: parseTransactions,
    enabled: !!address,
  })
}
