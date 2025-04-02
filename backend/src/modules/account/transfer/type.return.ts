import { Entity } from "../types/entity";
import { ERC20Amount, ERC20Token, NativeAmount, NativeToken, NFTAmount, NFTToken } from "../types/token";

export type Direction = 'receive' | 'send'

export enum TransactionType {
  Approve = 'Approved',
  Receive = 'Received',
  Swap = 'Swapped',
  Sent = 'Sent',
  Sign = 'Sign',
  Airdrop = 'Airdrop',
  Unknown = 'Unknown',
  Revoked = 'Revoked',
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
  value: Value;
  date: Date;
};

export type Value = { sent: Amount[], receive:Amount[]};
export type Amount = ERC20Amount | NFTAmount | NativeAmount

export type TokenAmount = {
  name: string;
  amount: string;
}
