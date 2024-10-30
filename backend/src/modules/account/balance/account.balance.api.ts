import Moralis from "moralis";
import { wait } from "src/utils/wait";
import { DEFAULT_LIMIT, DEFAULT_TOKEN_ADDRESS, DEFAULT_CONTRACT_VERIFICATION, DEFAULT_INVALID_VALUE, DEFAULT_INVALID_PERCENTAGE, DEFAULT_MAX_RESULT_COUNT } from '~/constants/defaultvalue';

import { ERC20Balance, ERC20BalanceReturn, NewERC20Balance, NewNFTBalance, NFTBalance, NFTBalanceReturn } from "./account.balance.type";

import timestampToBlock from "src/utils/timestampToBlock";

const API = {
  fetchERC20AndNativeBalance,
  fetchNFTTokens,
  fetchNativeBalance
}

async function fetchNativeBalance(
  chainID: string,
  address: string,
  toTimestamp: string
) {
  let toBlock = await timestampToBlock(toTimestamp, chainID)

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    "chain": chainID,
    "address": address,
    "toBlock": toBlock
  })
  const balanceETH = balance.result.balance.value;
  return balanceETH;
}

async function fetchERC20AndNativeBalance(
  chainID: string,
  address: string,
  tokenAddresses: string[],
  toTimestamp: string
): Promise<ERC20BalanceReturn> {

  let cursor: string | null = "";
  let result: ERC20BalanceReturn = {
    size: 0,
    tokens: [],
  };
  let toBlock = await timestampToBlock(toTimestamp, chainID)
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
      excludeNative: false,
      excludeSpam: false,
      excludeUnverifiedContracts: false,
      toBlock: toBlock,
      ...(cursor && { cursor })
    };

    const pageResult = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice(params);
    cursor = pageResult.hasNext() ? pageResult.response.cursor! : null;

    const page_size: number = pageResult.response.pageSize || 0;
    result.size += page_size;

    const tokensReturn = pageResult.response.result;

    const token = tokensReturn.map((asset): ERC20Balance => {
      return NewERC20Balance(
        asset.tokenAddress?.checksum || DEFAULT_TOKEN_ADDRESS,
        asset.symbol,
        asset.name,
        asset.logo,
        asset.balanceFormatted,
        asset.possibleSpam,
        asset.verifiedContract || DEFAULT_CONTRACT_VERIFICATION,
        asset.usdPrice,
        asset.usdValue24hrUsdChange || DEFAULT_INVALID_VALUE,
        asset.nativeToken,
        asset.portfolioPercentage,
        asset.percentageRelativeToTotalSupply || DEFAULT_INVALID_PERCENTAGE,
      )
    })

    result.tokens = result.tokens.concat(token);
  }
  return result;
}

async function fetchNFTTokens(
  chainID: string,
  address: string,
  tokenAddresses: string[],
  toTimestamp: string
): Promise<NFTBalanceReturn> {

  let cursor: string | null = "";
  let result: NFTBalanceReturn = {
    size: 0,
    tokens: [],
  };
  let toBlock = await timestampToBlock(toTimestamp, chainID)

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
      excludeSpam: false,
      normalizeMetadata: true,
      media_items: true,
      toBlock: toBlock,
      ...(cursor && { cursor })
    };

    const pageResult = await Moralis.EvmApi.nft.getWalletNFTs(params);
    cursor = pageResult.hasNext() ? pageResult.pagination.cursor! : null;

    const page_size: number = pageResult.pagination.pageSize || 0;
    result.size += page_size;

    const tokensReturn = pageResult.raw.result;

    let count = 1;
    const token = tokensReturn.map((asset) => {
      if (count === 1) {
        console.log(asset)
        count += 1;
      }
      return NewNFTBalance(
        asset.token_address || DEFAULT_TOKEN_ADDRESS,
        asset.token_id,
        asset.name,
        asset.normalized_metadata?.description,
        asset.normalized_metadata?.animation_url,
        asset.token_uri,
        null,
        asset.possible_spam,
        asset.verified_collection,
        null,
        null,
        asset.amount,
      )
    })
    result.tokens = result.tokens.concat(token);
  }
  return result;
}

export default API;