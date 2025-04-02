import { Node, Edge } from '@xyflow/react'
import { AccountType, Entity, TokenAmount, Transaction, } from './transaction.interface';

export interface NodeData extends Node {
  details: Account
  data: {
    addressHash: string
    label?: string,
    type: AccountType[],
    callBack: (node: NodeData) => void
  }
}

export interface EdgeData extends Edge {
    details: Transaction
}

export interface Account {
  address: string;
  type?: string;
}
