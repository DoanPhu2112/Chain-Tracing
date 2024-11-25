import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
export function BigNumbertoEther(amount: BigNumber ) {
  return formatEther(amount);
}



