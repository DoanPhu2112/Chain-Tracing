import { Entity } from "../types/entity";
import { Erc20Transfer } from "./type.erc20";
import { NativeTransfer } from "./type.native";
import { NFTTransfer } from "./type.nft";
export type TransactionReturnType = {
  metadata: {
    total_data: number,
    chainID: string,
    page: {
      index: number,
      size: number
    }
    block: {
      start: number,
      end: number | undefined,
    }
    timestamp: {
      start: number,
      end: number,
    }
    datetime: {
      start: Date | string,
      end: Date | string,
    }
  },
  result: Transaction[],
}
export type TransactionAPIReturn = {
  size: number;
  startTimestamp: number | undefined
  endTimestamp: number | undefined,
  startBlock: number | undefined;
  endBlock: number | undefined;
  transactions: Transaction[]
}
export type Transaction = {
  chainId: string;
  txnHash: string;
  from: Entity;
  to: Entity;
  summary: string;
  methodLabel?: string;

  value: string;

  blockTimestamp: string,

  nftTransfers: NFTTransfer[];

  erc20Transfers: Erc20Transfer[];

  nativeTransfers: NativeTransfer[];
};
