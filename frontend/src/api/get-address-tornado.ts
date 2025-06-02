import { fetchApiV1 } from '@/lib/fetch-api'
import {
  HeuristicRule,
  TornadoStat,
  TornadoStatResponse,
} from '@/types/transaction.interface'

type Query = {
  address: string
}

export function getAddressTornado({ address }: Query): Promise<TornadoStatResponse> {
  return fetchApiV1.get<TornadoStatResponse>(`account/tornado/${address}`).json()
}

export function parseAddressTornado(data: TornadoStatResponse): TornadoStat {
  const { deposit, withdraw, linkedAddress } = data
  const convertedLinkedAddress = linkedAddress.map((address) => ({
    ...address,
    heuristic_used:
      address.heuristic_used === 'Linked ETH'
        ? HeuristicRule.LinkedETH
        : HeuristicRule.MultiDenom,
    transactions: address.transactions.map((txn) => ({
      ...txn,
      timestamp: new Date(Number(txn.timestamp) * 1000),
    })),
  }))

  return {
    deposit,
    withdraw,
    linkedAddress: convertedLinkedAddress,
    score: data.score,
  }
}
