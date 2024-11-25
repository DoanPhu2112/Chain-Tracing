import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "alchemy-sdk";
import { getRandomDrpcAPI } from "src/configs/provider.configs";
import { BigNumbertoEther } from "~/utils/convertEther";

async function get(address: string) {
  const provider: JsonRpcProvider = getRandomDrpcAPI();
  const balance: BigNumber = await provider.getBalance(address);
  const balanceETH: string = BigNumbertoEther(balance);
  return balanceETH;
}

const ETHBalance = {
  get,
}

export default ETHBalance 