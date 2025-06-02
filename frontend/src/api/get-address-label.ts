import { fetchApiV1 } from '@/lib/fetch-api'

type Query = {
  address: string
}

type GetAddressLabelResponse = {
  label: string[]
  researchLabel: string
  tornadoCashInteracted: boolean
}

export function getAddressLabel({ address }: Query) {
  return fetchApiV1.get<GetAddressLabelResponse>(`account/label/${address}`).json()
}
