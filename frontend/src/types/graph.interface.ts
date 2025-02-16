import { Node, Edge } from '@xyflow/react'
import { Entity, TokenAmount, Transaction, TransactionType } from './transaction.interface';

export interface NodeData extends Node {
  details: Account
  data: {
    addressHash: string
    label?: string
  }
}

export interface EdgeData extends Edge {
    details: Transaction
}

export interface Account {
  address: string;
  type?: string;
}
