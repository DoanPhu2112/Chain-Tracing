import { Request, Response } from 'express';
import codes from 'src/errors/codes';
import { FrontEndResponsesType } from 'src/types/frontendResponse';

import Service from './account.balance.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/constants/defaultvalue';
import timestampToBlock from 'src/utils/timestampToBlock';
import { parseEther } from 'ethers/lib/utils';

console.log("Controller")
const Controller = {
  GetERC20AndNativeBalance,
  GetNFTBalance,
}

let result: FrontEndResponsesType;

async function GetERC20AndNativeBalance(req: Request, res: Response) {
  console.log("GetERC20AndNativeBalance")
  const { address } = req.params;
  const { chainID, tokenAddresses, page, pageSize, toTimestamp } = req.query;

  const pageNumber = typeof page === 'string' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'string' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;
  const toTimestampString = typeof toTimestamp === 'string' ? toTimestamp : '';
  
  const response = await Service.GetERC20AndNativeBalance(
    address,
    chainID as string,
    tokenAddresses as string[],
    toTimestampString
  );

  result = {
    metadata: {
      'total_data': response.size,
      'page': pageNumber,
      'page_size': pageSizeNumber
    },
    result: response.tokens.slice(pageNumber * pageSizeNumber, pageNumber * pageSizeNumber + pageSizeNumber)
  }

  return res.status(codes.SUCCESS).json(response);
}


async function GetNFTBalance(req: Request, res: Response) {
  console.log("GetNFTBalance")

  const { address } = req.params;
  const { chainID, tokenAddresses, page, pageSize, toTimestamp } = req.query;

  const pageNumber = typeof page === 'string' ? parseInt(page, 10) : DEFAULT_PAGE;
  const pageSizeNumber = typeof pageSize === 'string' ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE;
  const toTimestampString = typeof toTimestamp === 'string' ? toTimestamp : '';

  const response = await Service.GetNFTBalance(
    address,
    chainID as string,
    tokenAddresses as string[],
    toTimestampString
  );

  result = {
    metadata: {
      'total_data': response.size,
      'page': pageNumber,
      'page_size': pageSizeNumber
    },
    result: response.tokens.slice(pageNumber * pageSizeNumber, pageNumber * pageSizeNumber + pageSizeNumber)
  }
  return res.status(codes.SUCCESS).json(response);
}

export default Controller;
