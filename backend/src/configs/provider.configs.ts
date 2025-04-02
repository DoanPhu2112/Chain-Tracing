import { JsonRpcProvider } from "@ethersproject/providers";
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { ethers } from "ethers";

import { ALCHEMY_URLs, RPC_URLs, BIT_QUERY_URLS, MORALIS_URLS, ETHEREUM_URLS } from "../utils/API";
import { randomIntFromInterval } from "~/utils/randomAPI";

//ALCHEMY, RPC, BITQUERY, MORALIS, ETHEREUM
const API_current = [0, 0, 0, 2, 0]
let number = API_current[0]

function round_robin_API(URL: string[], startIndex: number): string {
  const API_LENGTH = URL.length - 1

  if (number >= API_LENGTH) {
    number = 0;
  }
  else {
    number += 1;
  }
  return URL[number]
}


export function getDrpcAPI(): JsonRpcProvider {
  const key: string = round_robin_API(RPC_URLs, 1);
  const provider: JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(key)
  return provider;
}

export function getDrpcURLs(): string {
  const key: string = round_robin_API(RPC_URLs, 0);
  return key;
}

export function getAlchemyAPI(): Alchemy {
  const config = {
    apiKey: round_robin_API(ALCHEMY_URLs, 0),
    network: Network.ETH_MAINNET
  };
  const alchemy: Alchemy = new Alchemy(config);
  return alchemy;
}

export function getBitQueryAPI() {
  const apiKey = round_robin_API(BIT_QUERY_URLS, 2);
  return apiKey;
}
export function getMoralisAPI() {
  const num = randomIntFromInterval(0, MORALIS_URLS.length - 1);
  const apiKey = MORALIS_URLS[num]
  return apiKey;
}

export function getEtherscanAPI() {
  const apiKey = round_robin_API(ETHEREUM_URLS, 4);
  return apiKey;
}


