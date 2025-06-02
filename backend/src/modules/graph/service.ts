import { transaction_type } from '@prisma/client';
import { Transaction } from '../account/transfer/type.return';
import { UpdateGraphTransaction } from '../report/router';
import { getTokenBySymbol } from '../token/token.dao';
import { parseTransactionSummary } from '../transaction/parser';
import { updateGraphById } from './dao';

/**
 * Parses a transaction into the Prisma-compatible format.
 */
function parseTransactionToPrisma(
  transaction: UpdateGraphTransaction,
  tokenId: number | null,
  amount: number
) {
  return {
    chain_id: 1,
    hash: transaction.txnHash,
    from_address: transaction.from.address,
    to_address: transaction.to.address,
    type: parseTransactionSummary(transaction.type),
    summary: transaction.summary,
    date: BigInt(new Date(transaction.date).getTime()),
    block_hash: transaction.txnHash,
    token_id: tokenId,
    amount
  };
}

/**
 * Converts a list of transactions and updates a graph with them.
 */
export async function updateGraphTransactions(
  graphId: number,
  transactions: UpdateGraphTransaction[]
) {
  const parsedTransactions = await Promise.all(
    transactions.map(async (txn) => {
      const receive = txn.value.receive?.[0];
      const sent = txn.value.sent?.[0];

      const tokenSymbol = receive?.symbol ?? sent?.symbol;

      const token = tokenSymbol ? await getTokenBySymbol(tokenSymbol) : undefined;
      const tokenId = token?.id ?? null;

      const amount = receive?.value ? Number(receive.value) : sent ? Number(sent.value) : 0;

      return parseTransactionToPrisma(txn, tokenId, amount);
    })
  );
  console.log('Parsed transactions:', parsedTransactions);
  return await updateGraphById(graphId, parsedTransactions);
}
