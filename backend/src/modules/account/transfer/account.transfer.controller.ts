import { Request, Response } from "express";
import { getAccountTransaction } from "./account.transfer.service";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/defaultvalue";
import { timestampToDateTime, toVNDateTime } from "~/utils/time";
import { TransactionReturnType } from "./account.transfer.type.return";
import codes from "~/errors/codes";

const Transaction = {
  GetWalletTransactionHistory
}
async function GetWalletTransactionHistory(req: Request, res: Response) {
  const { address } = req.params;
  const { chainId,
    startTimestamp,
    endTimestamp,
    include_nft_metadata,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
    page,
    pageSize } = req.query;
  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;
  const startTimestampString = typeof startTimestamp === 'string' ? startTimestamp : '';

  const startDatetimeDate = timestampToDateTime(startTimestampString);
  const startDatetime = toVNDateTime(startDatetimeDate);

  const endTimestampString = typeof endTimestamp === 'string' ? endTimestamp : '';

  const endDatetimeDate = timestampToDateTime(endTimestampString);
  const endDatetime = toVNDateTime(endDatetimeDate);

  const response = await getAccountTransaction(
    address,
    chainId!.toString(),
    startTimestampString,
    endTimestampString,
    !include_nft_metadata ? true : false,
    !include_erc20_transactions_triggered ? true : false,
    !include_nft_transactions_triggered ? true : false,
    !include_native_transactions_triggered ? true : false,
  );
  const responsePage = response.transactions!.slice(pageNumber * pageSizeNumber, pageNumber * pageSizeNumber + pageSizeNumber)
  const result: TransactionReturnType = {
    metadata: {
      total_data: response.size,
      chainID: chainId as string,
      page: {
        index: pageNumber,
        size: pageSizeNumber
      },
      block: {
        start: response.startBlock!,
        end: response.endBlock,
      },
      timestamp: {
        start: startTimestampString,
        end: endTimestampString,
      },
      datetime: {
        start: startDatetime,
        end: endDatetime,
      }
    },
    result: responsePage
  }
  return res.status(codes.SUCCESS).json(result);
}

export default Transaction