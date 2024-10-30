import { ethers } from 'ethers'
import { ParsedQs } from 'qs';
import CustomError from '~/errors/CustomError';
import codes from '~/errors/codes';
import { ChainIDList } from '~/constants/chainid';
import { DEFAULT_CHAIN_ID, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_START_TIMESTAMP } from '~/constants/defaultvalue';
import { CustomHelpers } from 'joi';

function validateBoolean(check: string | ParsedQs | string[] | ParsedQs[] | undefined): string {
  if (typeof check === 'string') {
    if (check === "false" || check === "true") {
      return check
    }
  }
  throw new CustomError(codes.BAD_REQUEST, "Check Param Error");
}
const validateAddress = (value: string, helpers: CustomHelpers) => {
  if (!ethers.utils.isAddress(value)) {
    return helpers.error('any.invalid'); // Trigger a validation error
  }
  return value; // Return the value if valid
};

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

  if (typeof (chainID) === 'string' && ChainIDList.includes(chainID)) {
    return chainID;
  }
  else if (chainID === undefined) {
    return DEFAULT_CHAIN_ID;
  }
  throw new CustomError(codes.BAD_REQUEST, "ChainID Param Error");
}

function validatePage(page: string | ParsedQs | string[] | ParsedQs[] | undefined): string {
  if (page === undefined) return DEFAULT_PAGE.toString();
  if (typeof page === 'string') {
    return page;
  }
  throw new CustomError(codes.BAD_REQUEST, "Limit Param Error");
}

function validatePageSize(page: string | ParsedQs | string[] | ParsedQs[] | undefined): string {
  if (page === undefined) return DEFAULT_PAGE_SIZE.toString();
  if (typeof page === 'string') {
    return page;
  }
  throw new CustomError(codes.BAD_REQUEST, "Limit Param Error");
}
function validateStartTimestamp(timestamp: string | ParsedQs | string[] | ParsedQs[] | undefined): string {
  if (timestamp === undefined) return DEFAULT_START_TIMESTAMP.toString();
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  throw new CustomError(codes.BAD_REQUEST, "Limit Param Error");
}

function validateEndTimestamp(timestamp: string | ParsedQs | string[] | ParsedQs[] | undefined): string | undefined {

  if (timestamp === undefined) return undefined;
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  throw new CustomError(codes.BAD_REQUEST, "Limit Param Error");
}
const Field = {
  validateBoolean,
  validateAddress,
  validateChainID,
  validateStartTimestamp,
  validateEndTimestamp,
  validatePage,
  validatePageSize,
  validateTokenAddresses,
};
export default Field;