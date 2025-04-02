import { SquareMenu } from 'lucide-react';

export enum TransactionType {
  Approve = 'Approved',
  Receive = 'Received',
  Swap = 'Swapped',
  Sent = 'Sent',
  Sign = 'Sign',
  Airdrop = 'Airdrop'
}
export interface TornadoStatResponse {
  deposit: {
    hash: string;
    from_address: string;
    to_address: string;
    timestamp: Date;
  }[];
  withdraw: {
    hash: string;
    from_address: string;
    to_address: string;
    amount: number;
    timestamp: Date;
  }[];
  linkedTxns: {
    address: string;
    count: number;
  }[];
  multiDenom: string[];
}

export type BackendTransaction = {
  chainId: string;
  txnHash: string;
  from: Entity;
  to: Entity;
  tokenAmount: TokenAmount | TokenAmount[];
  type: TransactionType | string;
  summary: string;
  value: string;
  date: string;
};

export type TokenAmount = {
  name: string;
  amount: string;
}

export type Transaction = {
  chainId: string;
  txnHash: string;
  from: Entity;
  to: Entity;
  type: TransactionType;
  summary: string;
  value: Value;
  date: Date;
};

export type Value = { sent: Amount[], receive:Amount[]};
export type Amount = ERC20Amount | NFTAmount | NativeAmount


export enum AccountType {
  MINER = "MINER",
  EOA_ACTIVE = "EOA_ACTIVE",
  EOA_INACTIVE = "EOA_INACTIVE",
  EOA_EXCHANGE = "EOA_EXCHANGE",
  CONTRACT_EXCHANGE = "CONTRACT_EXCHANGE",
  CONTRACT_NORMAL = "CONTRACT_NORMAL",
  ROUTER = "ROUTER",
  CONTRACT_TOKEN = "CONTRACT_TOKEN",
  INVALID = "INVALID",
  TARGET = "TARGET",
}

export type Entity = {
  address?: string;
  address_entity?: string;
  address_entity_logo?: string;
  address_entity_label?: string;
  type: AccountType[];
};

export type ERC20Amount = ERC20Token & {value: string}
export type ERC20Token = {
  name: string
  decimal: number
  address: string
  symbol: string
  logo: string | null
  possibleSpam: boolean | null
  verifiedContract: boolean | null
}

export type NativeAmount = NativeToken & {value: string}
export type NativeToken = {
  symbol: string,
  logo: string,
}

export type NFTAmount = NFTToken & {value: string}
export type NFTToken = {
  address: string
  id: string
  name: string | null
  description?: string | null
  animationUrl?: string | null
  image?: string | null // e.g. https://dobutsu.xyz/api/thebuns/revealed/9455.png
  possibleSpam?: boolean | null
  collection: NFTCollection
}
export type NFTCollection = {
  verified?: boolean | null
  logo: string | null
  bannerImage: string | null
}
export type TransactionsList = Transaction[]
