import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "~/constants/defaultvalue";
import API from './api'
const Service = {
  GetERC20Balance,
  GetNFTBalance
}

async function GetERC20Balance(
  address: string,
  chainID: string,
  tokenAddresses: string[] = [],
  endTimestamp: number,
) {
  // TODO: IF DB exist address data

  // ELSE:  
  let response = await API.fetchERC20Balance(chainID, address, tokenAddresses, endTimestamp);
  //TODO: STORE TO DB

  return response;
}
async function GetNFTBalance(
  address: string,
  chainID: string,
  tokenAddresses: string[] = [],
  endTimestamp: number,
) {
  // TODO: IF DB exist address data

  // ELSE:  
  let response = await API.fetchNFTTokens(chainID, address, tokenAddresses, endTimestamp);
  //TODO: STORE TO DB

  return response;
}

export default Service;