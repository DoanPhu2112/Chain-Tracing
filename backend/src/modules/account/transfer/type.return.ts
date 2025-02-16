import { Entity } from "../types/entity";
import { ERC20Amount, ERC20Token, NativeAmount, NativeToken, NFTAmount, NFTToken } from "../types/token";

export type Direction = 'receive' | 'send'

export enum TransactionType {
  Approve = 'Approved',
  Receive = 'Received',
  Swap = 'Swapped',
  Sent = 'Sent',
  Sign = 'Sign',
  Airdrop = 'Airdrop'
}

export type TransactionAPIReturn = {
  size: number;
  startTimestamp: number | undefined
  endTimestamp: number | undefined,
  startBlock: number | undefined;
  endBlock: number | undefined;
  transactions: Transaction[]
}

// export type TransactionResponse = {
//   size: number;
//   startTimestamp: number | undefined
//   endTimestamp: number | undefined,
//   startBlock: number | undefined;
//   endBlock: number | undefined;
//   txnPairRecord: Record <string, Transaction[]>
// }

export type Transaction = {
  chainId: string;
  txnHash: string;
  from: Entity;
  to: Entity;
  type: TransactionType | string;
  summary: string;
  value: { sent: (ERC20Amount | NFTAmount | NativeAmount)[], receive: (ERC20Amount | NFTAmount | NativeAmount)[]};
  date: Date;
};

export type TokenAmount = {
  name: string;
  amount: string;
}

// export function transformTransactionApiResponse(
//   apiResponse: TransactionAPIReturn
// ): TransactionResponse {
//   const txnPairRecord: Record<string, Transaction[]> = {};

//   for (const transaction of apiResponse.transactions) {
//     const addresses = [transaction.from.address, transaction.to.address].sort();
//     const key = addresses.join('-')
//     if (!txnPairRecord[key]) {
//       txnPairRecord[key] = [];
//     }
//     txnPairRecord[key].push(transaction);
//   }

//   return {
//     size: apiResponse.size,
//     startTimestamp: apiResponse.startTimestamp,
//     endTimestamp: apiResponse.endTimestamp,
//     startBlock: apiResponse.startBlock,
//     endBlock: apiResponse.endBlock,
//     txnPairRecord: txnPairRecord,
//   };
// }