import { MoralisTransactionReturn } from './api/MoralisResponse.type';

export type WalletTransactionHistory = {
  size: number;
  transactions: MoralisTransactionReturn[];
};