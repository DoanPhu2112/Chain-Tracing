import { Request, Response } from 'express';
import codes from 'src/errors/codes';

import Service from './service';
import { LATEST_QUERY_TIMESTAMP_STRING, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, LATEST_QUERY_TIMESTAMP } from '~/constants/defaultvalue';
import { BalanceReturnType } from './type.return';
import { timestampToDateTime, toVNDateTime } from '~/utils/time';

const Controller = {
  GetERC20Balance,
  GetNFTBalance,
  GetERC20BalanceByRange,
}
async function GetERC20BalanceByRange(req: Request, res: Response) {

}
async function GetERC20Balance(req: Request, res: Response) {
  const { address } = req.params;
  const { chainId, tokenAddresses, page, pageSize, endTimestamp } = req.query;
  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;
  const endTimestampNumber = typeof endTimestamp === 'string' ? parseInt(endTimestamp) : LATEST_QUERY_TIMESTAMP;

  const endDatetimeDate = timestampToDateTime(endTimestampNumber);
  const endDatetime = toVNDateTime(endDatetimeDate);

  const response = await Service.GetERC20Balance(
    address,
    chainId as string,
    tokenAddresses as string[],
    endTimestampNumber
  );
  
  const responsePage = response.tokens!.slice(pageNumber * pageSizeNumber, pageNumber * pageSizeNumber + pageSizeNumber)


  const result: BalanceReturnType = {
    metadata: {
      total_data: response.size,
      chainID: chainId as string,
      page: {
        index: pageNumber,
        size: pageSizeNumber
      },
      block: {
        start: 0,
        end: response.toBlock,
      },
      timestamp: {
        start: 0,
        end: endTimestampNumber,
      },
      datetime: {
        start: new Date(0),
        end: endDatetime,
      }
    },
    result: responsePage
  }

  return res.status(codes.SUCCESS).json(result);
}


async function GetNFTBalance(req: Request, res: Response) {
  const { address } = req.params;
  const { chainId, tokenAddresses, page, pageSize, endTimestamp } = req.query;

  const pageNumber = typeof page === 'number' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'number' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;
  const endTimestampString = typeof endTimestamp === 'string' ? endTimestamp : LATEST_QUERY_TIMESTAMP_STRING;

  const endDatetimeDate = timestampToDateTime(Number(endTimestampString));
  const endDatetime = toVNDateTime(endDatetimeDate);

  const response = await Service.GetNFTBalance(
    address,
    chainId as string,
    tokenAddresses as string[],
    Number(endTimestampString)
  );
  const responsePage = response.tokens!.slice(pageNumber * pageSizeNumber, pageNumber * pageSizeNumber + pageSizeNumber)

  const result: BalanceReturnType = {
    metadata: {
      total_data: response.size,
      chainID: chainId as string,
      page: {
        index: pageNumber,
        size: pageSizeNumber
      },
      block: {
        start: 0,
        end: response.toBlock,
      },
      timestamp: {
        start: 0,
        end: Number(endTimestampString),
      },
      datetime: {
        start: new Date(0),
        end: endDatetime,
      }
    },
    result: responsePage
  }

  return res.status(codes.SUCCESS).json(result);
}

export default Controller;
