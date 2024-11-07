import { Entity } from "../types/entity";
import { Erc20Transfer } from "./account.transfer.type.erc20";
import { NativeTransfer } from "./account.transfer.type.native";
import { NFTTransfer } from "./account.transfer.type.nft";
export type TransactionReturnType = {
  metadata: {
    total_data: number,
    page: {
      index: number,
      size: number
    }
    block: {
      start: number,
      end: number | undefined,
    }
    timestamp: {
      start: string,
      end: string,
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
  startTimestamp: string
  endTimestamp: string,
  startBlock: number | undefined;
  endBlock: number | undefined;
  transactions: Transaction[]
}
export type Transaction = {
  transactionHash: string;
  fromEntity: Entity;
  toEntity: Entity;
  summary: string;
  methodLabel?: string;

  value: string;

  blockTimestamp: string,

  nftTransfers: NFTTransfer[];

  erc20Transfers: Erc20Transfer[];

  nativeTransfers: NativeTransfer[];
};
