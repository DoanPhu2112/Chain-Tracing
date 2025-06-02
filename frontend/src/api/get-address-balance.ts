import { fetchApiV1 } from '@/lib/fetch-api'
import { PortfolioBalance } from '@/types/wallet.interface'

type Query = {
  address: string
}

export interface Token {
  name: string
  decimal: number
  address: string
  symbol: string
  logo: string
  possibleSpam: boolean
  verifiedContract: boolean
}

export interface USDValue {
  price: number
  price24hrUsdChange: number | null
  price24hrPercentChange: number | null
  value: string
  value24hrUsdChange: number | null
}

export interface PortfolioData {
  percentage: number
  percentageRelativeToTotalSupply: number | null
}

export interface WalletAsset {
  native_token: boolean
  balance: string
  token: Token
  usd: USDValue
  portfolio: PortfolioData
}

export type GetAddressBalanceResponse = {
  metadata: {
    total_data: number
    chainID: string
    page: {
      index: number
      size: number
    }
    block: {
      start: number
      end: number
    }
    timestamp: {
      start: number
      end: number
    }
    datetime: {
      start: string
      end: string
    }
  }
  result: WalletAsset[]
}

export function parseAddressBalance(data: GetAddressBalanceResponse): PortfolioBalance[] {
  return data.result.map((item) => ({
    token: item.token.name,
    chain: data.metadata.chainID,
    price: item.usd.price,
    value: Number(item.usd.value),
    portfolioPercentage: item.portfolio.percentage,
    amount: Number(item.balance),
    logo: item.token.logo,
  }))
}

export function getAddressBalance({ address }: Query) {
  return fetchApiV1
    .get<GetAddressBalanceResponse>(`account/balance/erc20/${address}`)
    .json()
}
