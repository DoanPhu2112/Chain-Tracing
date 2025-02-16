import {
  BackendTransaction,
  Transaction,
} from '@/types/transaction.interface'
import { ERC20Balance, PortfolioBalance } from '@/types/wallet.interface'
const prefix = 'http://localhost:3002/account'

function ERC20BalanceToPortfolioBalance(
  chainID: string,
  erc20Balances: ERC20Balance[]
): PortfolioBalance[] {
  return erc20Balances.map(
    (balance: ERC20Balance): PortfolioBalance => ({
      chain: chainID,
      token: balance.token.name,
      logo: balance.token.logo,
      portfolioPercentage: balance.portfolio.percentage,
      price: parseInt(balance.usd.price),
      amount: parseInt(balance.balance),
      value: Number(balance.usd.value) || -1,
    })
  )
}
export const getAddressBalance = async (address: string): Promise<PortfolioBalance[]> => {
  try {
    const res = await fetch(`${prefix}/balance/erc20/${address}`)
    if (!res.ok) {
      throw new Error('Failed to fetch address balance')
    }
    const data = await res.json()
    console.log(data)
    const chainID = data.metadata.chainID
    const BEResponseData = data.result
    const portfolioData = ERC20BalanceToPortfolioBalance(chainID, BEResponseData)
    console.log('TEST portfolioData ', portfolioData)

    return portfolioData //BE data
  } catch (error) {
    console.error('Error fetching address balance:', error)
    throw error
  }
}

function transformTransaction(backendTransactions: BackendTransaction[]): Transaction[] {
  return backendTransactions.map((txn) => ({
    ...txn,
    date: new Date(txn.date),
  }))
}
export const getAddressTransactions = async (address: string): Promise<Transaction[]> => {
  try {
    const res = await fetch(`${prefix}/transaction/${address}`)
    if (!res.ok) {
      throw new Error('Failed to fetch address transactions')
    }
    const data = await res.json()
    console.log('BE Response Data', data)

    return transformTransaction(data)
  } catch (error) {
    console.error('Error fetching address transactions:', error)
    throw error
  }
}
export const getAddressTransactionsFollowup = async (
  address: string,
  transactionHash: string
): Promise<Transaction[]> => {
  try {
    const res = await fetch(
      `${prefix}/transaction/${address}/followup?transactionHash=${transactionHash}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch address transactions')
    }

    const data = await res.json()
    console.log('BE Response Data', data)

    return transformTransaction(data)
  } catch (error) {
    console.error('Error fetching address transactions:', error)
    throw error
  }
}

export const getAddressTxnsByRange = async (
  address: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  try {
    const startTimestamp = startDate.getTime()
    const endTimestamp = endDate.getTime()
    const res = await fetch(
      `${prefix}/transaction/${address}?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch address transactions')
    }

    const data = await res.json()
    console.log('BE Response Data', data)
    return data;
    
  } catch (error) {
    console.error('Error fetching address transactions:', error)
    throw error
  }
}