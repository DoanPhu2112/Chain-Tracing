import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/defaultvalue";
import { fetchAccountTransactionWithRetry, fetchBlockNumberFromTransaction } from "./api";
import { TransactionAPIReturn } from "./type.return";

async function getAccountTransaction(
  address: string,
  chainID: string,
  startTimestamp: number,
  endTimestamp: number | undefined,
  startBlock: number,
  endBlock: number,
  order: "ASC" | "DESC" | undefined,

  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,

) {
  // TODO: CHECK IF DB exist address data

  // ELSE:
  let response = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    startTimestamp,
    endTimestamp,
    startBlock, 
    endBlock,
    order,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
    
  );
  //TODO: STORE TO DB
  return response;
}

async function getAccountFollowupTransaction(
  address: string,
  transactionHash: string,
  chainID: string,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,

) {
  const blockNumber: number = await fetchBlockNumberFromTransaction(transactionHash);
  // TODO: CHECK IF DB exist address data
  // ELSE:
  let response: TransactionAPIReturn = await fetchAccountTransactionWithRetry(
    address,
    chainID,
    undefined,
    undefined,
    blockNumber, 
    undefined,
    "ASC",
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
  );
  //TODO: STORE TO DB
  
  return response;

}

export { getAccountTransaction, getAccountFollowupTransaction }