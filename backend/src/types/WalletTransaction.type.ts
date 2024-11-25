import { MoralisTransactionReturn } from './api/moralisResponse';

export type WalletTransactionHistory = {
  size: number;
  transactions: MoralisTransactionReturn[];
};