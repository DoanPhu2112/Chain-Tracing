import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/defaultvalue";
import API from './account.balance.api'
const Service = {
  GetERC20AndNativeBalance,
  GetNFTBalance
}

async function GetERC20AndNativeBalance(
  address: string,
  chainID: string,
  tokenAddresses: string[] = [],
  toTimestamp: string,
) {
  // TODO: IF DB exist address data

  // ELSE:  
  let response = await API.fetchERC20AndNativeBalance(chainID, address, tokenAddresses, toTimestamp);
  //TODO: STORE TO DB

  return response;
}
async function GetNFTBalance(
  address: string,
  chainID: string,
  tokenAddresses: string[] = [],
  toTimestamp: string,
) {
  // TODO: IF DB exist address data

  // ELSE:  
  let response = await API.fetchNFTTokens(chainID, address, tokenAddresses, toTimestamp);
  //TODO: STORE TO DB

  return response;
}

export default Service;