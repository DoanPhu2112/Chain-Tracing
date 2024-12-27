import { Node, Edge } from '@xyflow/react'
import { Transaction } from './transaction.interface';

export interface NodeData extends Node {
  details: Account
}

export interface EdgeData extends Edge {
    details: Transaction
}

export interface Account {
  address: string;
  type?: string;
}

export interface TransactionDetails {
  blockNumber: number;  
  blockHash: string;
  hash: string;
  type: number;
  accessList: string[] | null; // Based on the empty array from the example
  transactionIndex?: number; // Added as it's in the provided data
  confirmations: number;
  from: Account;
  gasPrice: string;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  gasLimit: string;
  to: Account;
  value: string | number; // To handle 0 as a number as well as strings
  nonce: number;
  data: string;
  r: string;
  s: string;
  v: number;
  creates?: string | null; // Added because it's in the data (null in this case)
  chainId: number;
}