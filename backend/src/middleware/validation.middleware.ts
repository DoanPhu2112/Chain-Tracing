import { Request, Response, NextFunction } from 'express';
import CustomError from '~/errors/CustomError.errors';
import codes from '~/utils/codes';
import { ethers } from 'ethers'
import { ParsedQs } from 'qs';
import { chainIDList } from '~/utils/chainIDList';
import { DEFAULT_PAGE_SIZE } from '~/utils/const';

function validateAddress(address: string) {
  if (typeof address === 'string' && ethers.utils.isAddress(address)) {
    return address;
  }
  throw new CustomError(codes.BAD_REQUEST, "Address Param Error");
}

function validateTokenAddresses(tokenAddresses: string | ParsedQs | string[] | ParsedQs[] | undefined): string[] | ParsedQs[] | undefined {
  if (!tokenAddresses) {
    return undefined;
  }
  if (typeof (tokenAddresses) === 'string') {
    return [tokenAddresses];
  }
  if (Array.isArray(tokenAddresses)) {
    return tokenAddresses;
  }
  throw new CustomError(codes.BAD_REQUEST, "Token Param Error");
}
function validateChainID(chainID: string | ParsedQs | string[] | ParsedQs[] | undefined): string {

  if (typeof (chainID) === 'string' && chainIDList.includes(chainID)) {
    return chainID;
  }

  throw new CustomError(codes.BAD_REQUEST, "ChainID Param Error");
}

function validateLimit(limit: string | ParsedQs | string[] | ParsedQs[] | undefined): string {
  if (limit === undefined) return DEFAULT_PAGE_SIZE.toString(); // Set a default limit if needed
  if (typeof limit === 'string') {
    return limit; // Convert to number if it’s a string
  }
  throw new CustomError(codes.BAD_REQUEST, "Limit Param Error");
}

export function validateAssetInformationParam(req: Request, res: Response, next: NextFunction) {
  const { address } = req.params;
  const { chainID, tokenAddresses, limit } = req.query;

  req.params.address = validateAddress(address);

  req.query = {
    tokenAddresses: validateTokenAddresses(tokenAddresses),
    chainID: validateChainID(chainID),
    limit: validateLimit(limit)
  }
  
  next()
}