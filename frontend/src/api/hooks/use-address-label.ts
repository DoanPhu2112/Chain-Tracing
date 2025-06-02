import { useQuery } from '@tanstack/react-query'
import { getAddressLabel } from '../get-address-label'

export function useAddressLabel({ address }: { address: string }) {
  return useQuery({
    queryKey: ['address-label', address],
    queryFn: async () => {
      return getAddressLabel({ address })
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
}
