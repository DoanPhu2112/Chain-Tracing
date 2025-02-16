import { getAlchemyAPI } from "~/configs/provider.configs";

export async function fetchBlockNumberFromTransaction(transactionHash: string) {
    const alchemy = getAlchemyAPI();
    const res = await alchemy.core.getTransactionReceipt(transactionHash);
  
    return Number(res?.blockNumber);
  }