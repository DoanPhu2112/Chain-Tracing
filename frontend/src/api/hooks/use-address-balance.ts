import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getAddressBalance, parseAddressBalance } from '../get-address-balance'

export function useAddressBalance({ address }: { address: string }) {
  return useSuspenseQuery({
    queryKey: ['address-balance', address],
    queryFn: async () => {
      return getAddressBalance({ address })
    },
    staleTime: Number.POSITIVE_INFINITY,
    select: parseAddressBalance,
  })
}

export function useAddressBalanceQuery({ address }: { address: string | null }) {
  return useQuery({
    queryKey: ['address-balance', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }
      return getAddressBalance({ address })
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!address,
    select: parseAddressBalance,
  })
}
