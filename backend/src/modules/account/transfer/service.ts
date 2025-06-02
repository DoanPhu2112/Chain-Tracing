import { fetchBlockNumberFromTransaction } from '~/utils/getBlockByTxnHash';
import { fetchAccountTransactionWithRetry } from './api';
import { Transaction, TransactionAPIReturn } from './type.return';

async function getAccountTransaction(
  address: string,
  chainID: string,
  startTimestamp: number,
  endTimestamp: number | undefined,
  startBlock: number,
  endBlock: number,
  order: 'ASC' | 'DESC' | undefined,
  limit: number
): Promise<TransactionAPIReturn> {
  let txnAPIReturn = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    startTimestamp,
    endTimestamp,
    startBlock,
    endBlock,
    order,
    limit
  );
  return txnAPIReturn;
}

async function getAccountFollowupTransaction(
  address: string,
  chainID: string,
  transactionHash?: string,
  timestamp?: number,
  limit?: number
): Promise<TransactionAPIReturn> {
  try {
    const blockNumber: number | undefined = transactionHash
      ? await fetchBlockNumberFromTransaction(transactionHash)
      : undefined;

    let txnAPIReturn: TransactionAPIReturn = await fetchAccountTransactionWithRetry(
      address,
      chainID,
      timestamp,
      undefined,
      blockNumber,
      undefined,
      'ASC',
      limit
    );
    return txnAPIReturn;
  } catch (error) {
    throw new Error((error as any).message);
  }
}

export { getAccountTransaction, getAccountFollowupTransaction };
