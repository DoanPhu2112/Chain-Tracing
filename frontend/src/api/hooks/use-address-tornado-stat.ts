import { useSuspenseQuery } from '@tanstack/react-query'
import { getAddressTornado, parseAddressTornado } from '../get-address-tornado'

export function useAddressTornado({ address }: { address: string }) {
  return useSuspenseQuery({
    queryKey: ['address-tornado', address],
    queryFn: async () => {
      return getAddressTornado({ address })
    },
    staleTime: Number.POSITIVE_INFINITY,
    select: parseAddressTornado,
  })
}
