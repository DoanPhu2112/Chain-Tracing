import { JsonRpcProvider } from "@ethersproject/providers";
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { ethers } from "ethers";

import { ALCHEMY_URLs, RPC_URLs, BIT_QUERY_URLS, MORALIS_URLS } from "../utils/API";
import { ProviderType } from "../types/providers.type";
import { randomIntFromInterval } from "~/utils/randomAPI";

function random_API(URL: string[]): string {
  const API_LENGTH = URL.length

  let number = randomIntFromInterval(0, API_LENGTH - 1);

  const API_KEY = URL[number]
  return API_KEY
}

export function getRandomDrpcAPI(): JsonRpcProvider {
  const key: string = random_API(RPC_URLs);
  const provider: JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(key)
  return provider;
}

export function getRandomAlchemyAPI(): Alchemy {
  const config = {
    apiKey: random_API(ALCHEMY_URLs),
    network: Network.ETH_MAINNET
  };
  const alchemy: Alchemy = new Alchemy(config);
  return alchemy;
}

export function getRandomBitQueryAPI() {
  const apiKey = random_API(BIT_QUERY_URLS);
  return apiKey;
}
export function getRandomMoralisAPI() {
  const apiKey = random_API(MORALIS_URLS);
  return apiKey;
}

