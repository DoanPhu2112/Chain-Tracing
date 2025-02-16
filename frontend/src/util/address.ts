export function shortenAddress(address: string, length = 6): string {
    return `${address.slice(0, length)}...${address.slice(length * -1)}`;
  }
  

  export function shortenValue(address: string, length = 6): string {
      return `${address.slice(0, length)}`;
    }
    