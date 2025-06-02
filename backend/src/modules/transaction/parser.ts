import { transaction_type } from '@prisma/client';

export function parseTransactionSummary(summary: string): transaction_type {
  const type = summary.split(' ')[0];
  switch (type) {
    case 'Sent':
      return 'send';
    case 'Received':
      return 'receive';
    case 'Swapped':
      return 'swap';
    case 'Airdrop':
      return 'airdrop';
    case 'Approved':
      return 'approve';
    case 'Signed':
      return 'sign';
    case 'Revoked':
      return 'revoked';
  }
  throw new Error(`Unknown transaction type: ${type}`);
}
