import Moralis from "moralis";
import { wait } from "src/utils/wait";
import { DEFAULT_LIMIT, DEFAULT_TOKEN_ADDRESS, DEFAULT_CONTRACT_VERIFICATION, DEFAULT_INVALID_VALUE, DEFAULT_INVALID_PERCENTAGE, DEFAULT_MAX_RESULT_COUNT } from '~/constants/defaultvalue';

import { ERC20Balance, ERC20BalanceReturn as ERC20APIBalanceReturn, NewERC20Balance } from "./erc20";

import { timestampToBlock } from "~/utils/time";
import { getMoralisAPI } from "~/configs/provider.configs";
import { NewNFTBalance, NFTBalanceReturn as NFTAPIBalanceReturn } from "./type.nft";
import CustomError from "~/errors/CustomError";
import codes from "~/errors/codes";

const API = {
  fetchERC20Balance,
  fetchNFTTokens,
  fetchNativeBalance
}

const moralisAPI = getMoralisAPI();
console.log("Moralis Api", moralisAPI)
Moralis.start({
  apiKey: moralisAPI,
});

async function fetchNativeBalance(
  chainID: string,
  address: string,
  endTimestamp: number
) {
  let toBlock = await timestampToBlock(endTimestamp, chainID)

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    "chain": chainID,
    "address": address,
    "toBlock": toBlock
  })
  const balanceETH = balance.result.balance.value;
  return balanceETH;
}

async function fetchERC20Balance(
  chainID: string,
  address: string,
  tokenAddresses: string[],
  endTimestamp: number
): Promise<ERC20APIBalanceReturn> {
  let cursor: string | null = "";

  let toBlock = await timestampToBlock(endTimestamp, chainID);

  let result: ERC20APIBalanceReturn = {
    size: 0,
    toBlock: toBlock,
    toTimestamp: endTimestamp,
    tokens: [],
  };

  while (cursor != null) {
    await wait(1000);
    if (result.size > DEFAULT_MAX_RESULT_COUNT) {
      break;
    }
    // if (cursor === "") cursor = null;
    
    const params = {
      chain: chainID,
      address: address,
      tokenAddresses: tokenAddresses,
      limit: DEFAULT_LIMIT,
      excludeNative: false,
      excludeSpam: true,
      order: "DESC" as "ASC" | "DESC" | undefined,

      excludeUnverifiedContracts: false,
      toBlock: toBlock !== undefined ? toBlock : undefined,
      // ...(cursor && { cursor })
    };
    let pageResult;
    try {
      pageResult = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice(params);
    } catch (e: any) {
      if (e.message.includes('Cursor is invalid or expired')) {
        throw new CustomError(codes.NOT_FOUND, 'Server cannot handle this request');
      }
      throw new CustomError(codes.EXTERNAL_API_ERROR, `External API error ${e}`)
    }

    cursor = pageResult.hasNext() ? pageResult.response.cursor! : null;

    // const page_size: number = pageResult.response.pageSize || 0;
    // result.size += page_size;
    // console.log("size", result.size)
    const tokensReturn = pageResult.response.result;

    const token = tokensReturn.map((asset): ERC20Balance => {
      return NewERC20Balance(
        asset.tokenAddress?.checksum || DEFAULT_TOKEN_ADDRESS,
        asset.symbol,
        asset.name,
        asset.logo || "",
        asset.balanceFormatted,
        asset.possibleSpam,
        asset.verifiedContract || DEFAULT_CONTRACT_VERIFICATION,
        asset.usdPrice, // Gia tri $ cua token
        asset.usdPrice24hrUsdChange, // Gia tri chenh lech cua dong tien so voi hom qua (24h truoc)
        asset.usdPrice24hrPercentChange, // Phan tram thay doi cua dong tien so voi hom qua (24h truoc)
        String(asset.usdValue) || DEFAULT_INVALID_VALUE, // Gia tri $ cua token * user balance
        asset.usdValue24hrUsdChange || DEFAULT_INVALID_VALUE,
        asset.nativeToken,
        asset.portfolioPercentage,
        asset.percentageRelativeToTotalSupply || DEFAULT_INVALID_PERCENTAGE,
      )
    })
    result.size = tokensReturn.length

    result.tokens = result.tokens!.concat(token);
  }
  console.log(JSON.stringify(result))
  result.toBlock = toBlock;
  result.toTimestamp = endTimestamp;
  return result;
}

async function fetchNFTTokens(
  chainID: string,
  address: string,
  tokenAddresses: string[],
  endTimestamp: number
): Promise<NFTAPIBalanceReturn> {

  let cursor: string | null = "";
  let toBlock = await timestampToBlock(endTimestamp, chainID)

  let result: NFTAPIBalanceReturn = {
    size: 0,
    tokens: [],
    toBlock: toBlock,
    toTimestamp: endTimestamp
  };

  while (cursor != null) {
    await wait(1000);
    if (result.size > DEFAULT_MAX_RESULT_COUNT) {
      break;
    }
    const params = {
      chain: chainID,
      address: address,
      tokenAddresses: tokenAddresses,
      limit: DEFAULT_LIMIT,
      excludeSpam: true,
      normalizeMetadata: true,
      mediaItems: true,
      order: "DESC" as "ASC" | "DESC" | undefined,
      // toBlock: toBlock,
      ...(cursor && { cursor })
    };
    let pageResult;
    try {
      pageResult = await Moralis.EvmApi.nft.getWalletNFTs(params);
    } catch (e: any) {
      throw new CustomError(codes.EXTERNAL_API_ERROR, `External API error ${e}`)
    }

    cursor = pageResult.hasNext() ? pageResult.pagination.cursor! : null;

    // const page_size: number = pageResult.pagination.pageSize || 0;
    // result.size += page_size;

    const tokensReturn = pageResult.raw.result;

    const token = tokensReturn.map((asset) => {
      return NewNFTBalance(
        asset.token_address || DEFAULT_TOKEN_ADDRESS,
        asset.token_id,
        null,
        asset.amount || '-1',
        asset.name,
        asset.normalized_metadata?.description,
        asset.normalized_metadata?.animation_url,
        asset.token_uri,
        asset.possible_spam,
        asset.verified_collection,
        null,
        null,
      )
    })
    result.size = tokensReturn.length

    result.tokens = result.tokens.concat(token);
  }
  result.toBlock = toBlock;
  result.toTimestamp = endTimestamp;
  return result;
}

export default API;