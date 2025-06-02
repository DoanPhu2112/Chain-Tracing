import { tornadoAddresses } from '../constants/tornadoCash'

export function shortenAddress(address: string, length = 6): string {
  return `${address.slice(0, length)}...${address.slice(length * -1)}`
}
export function toTornadoCashPoolName(address: string): string | undefined {
  for (const pool of tornadoAddresses) {
    if (pool.address === address) {
      return pool.name
    }
  }
  return undefined
}
export function shortenValue(address: string | number, length = 6): string {
  return `${address.toString().slice(0, length)}`
}
