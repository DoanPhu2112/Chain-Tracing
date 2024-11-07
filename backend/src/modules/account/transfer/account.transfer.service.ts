import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/defaultvalue";
import { fetchAccountTransaction } from "./account.transfer.api";

async function getAccountTransaction(
  address: string,
  chainID: string,
  startTimestamp: string,
  endTimestamp: string,
  include_nft_metadata: boolean = true,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,
) {
  // TODO: CHECK IF DB exist address data

  // ELSE:
  let response = await fetchAccountTransaction(
    address,
    chainID,
    startTimestamp,
    endTimestamp,
    include_nft_metadata,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
  );
  //TODO: STORE TO DB
  return response;
}

export { getAccountTransaction }