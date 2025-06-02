import { Request, Response } from 'express';
import { getAccountFollowupTransaction, getAccountTransaction } from './service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/constants/defaultvalue';
import codes from '~/errors/codes';

type SortOrder = 'ASC' | 'DESC' | undefined;
const Transaction = {
  GetWalletTransactionHistory,
  GetWalletFollowupTransactions
};

async function GetWalletTransactionHistory(req: Request, res: Response) {
  const { address } = req.params;
  const { chainId, startTimestamp, endTimestamp, startBlock, endBlock, order, page, pageSize } =
    req.query;

  const addressLowercase = address.toLowerCase();
  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;

  const startBlockNumber = typeof startBlock === 'number' ? startBlock : 0;
  const endBlockNumber = typeof endBlock === 'number' ? endBlock : 0;
  const startTimestampNumber = typeof startTimestamp === 'string' ? parseInt(startTimestamp) : 0;
  const endTimestampNumber = typeof endTimestamp === 'string' ? parseInt(endTimestamp) : 0;

  const orderString: SortOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';

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
  const result = response.transactions;
  return res.status(codes.SUCCESS).json(result);
}

async function GetWalletFollowupTransactions(req: Request, res: Response) {
  const { address } = req.params;
  const { transactionHash, chainId = '0x1', limit = 10, timestamp } = req.query;

  if (!address) {
    return res.status(codes.BAD_REQUEST).json({ message: 'address are required' });
  }
  if (!transactionHash && !timestamp) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: 'transactionHash or timestamp are required' });
  }
  try {
    const response = await getAccountFollowupTransaction(
      address.toLowerCase(),
      chainId.toString(),
      transactionHash?.toString(),
      timestamp ? parseInt(timestamp.toString()) : undefined,
      Number(limit)
    );

    const result = response.transactions;
    console.log('result', result.length);
    return res.status(codes.SUCCESS).json(result);
  } catch (error) {
    console.error('Error fetching followup transactions:', error);
    return res.status(codes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
}
export default Transaction;
