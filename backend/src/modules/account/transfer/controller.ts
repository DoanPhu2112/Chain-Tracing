import { Request, Response } from 'express';
import { getAccountFollowupTransaction, getAccountTransaction } from './service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/constants/defaultvalue';
import { timestampToDateTime, toVNDateTime } from '~/utils/time';
import { TransactionReturnType } from './type.return';
import codes from '~/errors/codes';

type SortOrder = 'ASC' | 'DESC' | undefined;
const Transaction = {
  GetWalletTransactionHistory,
  GetWalletFollowupTransactions
};

async function GetWalletTransactionHistory(req: Request, res: Response) {
  const { address } = req.params;
  const {
    chainId,
    startTimestamp,
    endTimestamp,
    startBlock,
    endBlock,
    order,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
    page,
    pageSize
  } = req.query;
  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;

  const startBlockNumber = typeof startBlock === 'number' ? startBlock : 0;
  const endBlockNumber = typeof endBlock === 'number' ? endBlock : 0;
  const startTimestampNumber = typeof startTimestamp === 'string' ? parseInt(startTimestamp) : undefined;
  const endTimestampNumber = typeof endTimestamp === 'string' ? parseInt(endTimestamp) : undefined;

  if (!startTimestampNumber) {
    return res.status(codes.BAD_REQUEST).json({ message: 'Invalid startTimestamp' });
  }
  const startDatetimeDate = timestampToDateTime(startTimestampNumber);
  const startDatetime = toVNDateTime(startDatetimeDate);

  if (!endTimestamp) {
    return res.status(codes.BAD_REQUEST).json({ message: 'Invalid endTimestamp' });
  }
  const endDatetimeDate = timestampToDateTime(endTimestampNumber!);
  const endDatetime = toVNDateTime(endDatetimeDate);

  const orderString: SortOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';

  console.log('GetWalletTransactionHistory Params', { address, chainId, startTimestamp, endTimestamp, startBlock, endBlock, order, include_erc20_transactions_triggered, include_nft_transactions_triggered, include_native_transactions_triggered, page, pageSize });
  const response = await getAccountTransaction(
    address,
    chainId!.toString(),
    startTimestampNumber,
    endTimestampNumber,
    startBlockNumber,
    endBlockNumber,
    orderString,
    !include_erc20_transactions_triggered ? true : false,
    !include_nft_transactions_triggered ? true : false,
    !include_native_transactions_triggered ? true : false
  );
  const responsePage = response.transactions!.slice(
    pageNumber * pageSizeNumber,
    pageNumber * pageSizeNumber + pageSizeNumber
  );
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
        end: response.endBlock
      },
      timestamp: {
        start: startTimestampNumber,
        end: endTimestampNumber || 0
      },
      datetime: {
        start: startDatetime,
        end: endDatetime
      }
    },
    result: responsePage
  };
  return res.status(codes.SUCCESS).json(result);
}
async function GetWalletFollowupTransactions(req: Request, res: Response) {
  const { address } = req.params;
  const {
    transactionHash,
    chainId = '0x1',
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered
  } = req.query;
  console.log(address)
  console.log(transactionHash)
  if (address === undefined || transactionHash === undefined) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: 'Address and transactionHash are required' });
  }
  const transactionHashString = transactionHash.toString();
  const chainIdString = chainId.toString();
  const response = await getAccountFollowupTransaction(
    address,
    transactionHashString,
    chainIdString,
    !include_erc20_transactions_triggered ? true : false,
    !include_nft_transactions_triggered ? true : false,
    !include_native_transactions_triggered ? true : false
  );
  
  const result: TransactionReturnType = {
    metadata: {
      total_data: response.size,
      chainID: chainId as string,
      page: {
        index: 0,
        size: 10
      },
      block: {
        start: response.startBlock!,
        end: response.endBlock
      },
      timestamp: {
        start: 0,
        end: 0
      },
      datetime: {
        start: "0",
        end: "0"
      }
    },
    result: response.transactions
  };
  return res.status(codes.SUCCESS).json(result);
}
export default Transaction;
