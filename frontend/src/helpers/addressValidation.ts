export function isEtherAddress (address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}export function isEtherTransaction(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address)
}