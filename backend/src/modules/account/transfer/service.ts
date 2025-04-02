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
  order: 'ASC' | 'DESC' | undefined,
  limit: number,
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
    order,
    limit
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
  console.log(" getAccountFollowupTransaction")
  let txnAPIReturn: TransactionAPIReturn = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    undefined,
    undefined,
    blockNumber,
    undefined,
    'ASC'
  );
  console.log("Txn API return: ", txnAPIReturn)
  //TODO: STORE TO DB
  return txnAPIReturn;
}

export { getAccountTransaction, getAccountFollowupTransaction };
