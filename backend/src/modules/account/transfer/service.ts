import { fetchBlockNumberFromTransaction } from '~/utils/getBlockByTxnHash';
import { fetchAccountTransactionWithRetry } from './api';
import {
  Transaction,
  TransactionAPIReturn,
} from './type.return';

async function getAccountTransaction(
  address: string,
  chainID: string,
  startTimestamp: number,
  endTimestamp: number | undefined,
  startBlock: number,
  endBlock: number,
  order: 'ASC' | 'DESC' | undefined
): Promise<TransactionAPIReturn> {
  // TODO: CHECK IF DB exist address data

  // ELSE:
  let txnAPIReturn = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    startTimestamp,
    endTimestamp,
    startBlock,
    endBlock,
    order
  );
  //TODO: STORE TO DB
  return txnAPIReturn;
}

async function getAccountFollowupTransaction(
  address: string,
  transactionHash: string,
  chainID: string
): Promise<TransactionAPIReturn> {
  const blockNumber: number = await fetchBlockNumberFromTransaction(transactionHash);
  // TODO: CHECK IF DB exist address data
  // ELSE:
  let txnAPIReturn: TransactionAPIReturn = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    undefined,
    undefined,
    blockNumber,
    undefined,
    'ASC'
  );

  //TODO: STORE TO DB
  return txnAPIReturn;
}

export { getAccountTransaction, getAccountFollowupTransaction };
