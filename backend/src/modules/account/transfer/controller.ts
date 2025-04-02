import { Request, Response } from 'express';
import { getAccountFollowupTransaction, getAccountTransaction } from './service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/constants/defaultvalue';
import { timestampToDateTime, toVNDateTime } from '~/utils/time';
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
  const addressLowercase = address.toLowerCase()
  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;

  const startBlockNumber = typeof startBlock === 'number' ? startBlock : 0;
  const endBlockNumber = typeof endBlock === 'number' ? endBlock : 0;
  const startTimestampNumber = typeof startTimestamp === 'string' ? parseInt(startTimestamp) : 0;
  const endTimestampNumber = typeof endTimestamp === 'string' ? parseInt(endTimestamp) : 0;

  // const startDatetimeDate = timestampToDateTime(parseInt(startTimestamp as string));
  // const startDatetime = toVNDateTime(startDatetimeDate);

  // const endDatetimeDate = timestampToDateTime(parseInt(endTimestamp as string ) );
  // const endDatetime = toVNDateTime(endDatetimeDate);

  const orderString: SortOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';

  console.log('GetWalletTransactionHistory Params', { address, chainId, startTimestampNumber, endTimestampNumber, startBlockNumber, endBlockNumber, order, include_erc20_transactions_triggered, include_nft_transactions_triggered, include_native_transactions_triggered, page, pageSize });
  const response = await getAccountTransaction(
    addressLowercase,
    chainId!.toString(),
    startTimestampNumber,
    endTimestampNumber,
    startBlockNumber,
    endBlockNumber,
    orderString,
    pageSizeNumber
  );
  const result = response.transactions
  return res.status(codes.SUCCESS).json(result);
}
async function GetWalletFollowupTransactions(req: Request, res: Response) {
  const { address } = req.params;
  const {
    transactionHash,
    chainId = '0x1',
  } = req.query;

  if (!address || !transactionHash) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: 'Address and transactionHash are required' });
  }
  const addressLowercase = address.toLowerCase()

  const transactionHashString = transactionHash.toString();
  const chainIdString = chainId.toString();
  const response = await getAccountFollowupTransaction(
    addressLowercase,
    transactionHashString,
    chainIdString
  );
  
  const result = response.transactions;

  return res.status(codes.SUCCESS).json(result);
}
export default Transaction;
