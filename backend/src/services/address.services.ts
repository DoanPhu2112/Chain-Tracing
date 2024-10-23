import axios from 'axios';
import { BigNumber } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import Moralis from 'moralis';
import { Alchemy, AssetTransfersCategory, SortingOrder, fromHex, TokenBalancesResponse } from 'alchemy-sdk';

import { getRandomDrpcAPI, getRandomAlchemyAPI, getRandomBitQueryAPI, getRandomMoralisAPI } from 'src/configs/provider.configs';
import { BigNumbertoEther } from 'src/utils/convertEther';
import { timestampToDate } from 'src/utils/datetime';
import { DEFAULT_PAGE_SIZE, DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_TOKEN_ADDRESS, DEFAULT_CONTRACT_VERIFICATION, DEFAULT_INVALID_VALUE, DEFAULT_INVALID_PERCENTAGE, DEFAULT_ADDRESS, DEFAULT_MAX_TRANSACTION_REQUEST } from 'src/utils/const';
import { AssetPortfolio, FrontEndResponsesType, WalletTokenBalancePrice, NewAssetPortfolio, WalletTransactionHistory, MoralisTransactionReturn, MoralisErc20TransferReturn, MoralisEvmWalletHistoryErc20Transfer, MoralisNFTTransferReturn, MoralisNativeTransferReturn } from 'src/types/index.type';
import { EvmWalletHistoryErc20Transfer } from 'moralis/common-evm-utils';
import { wait } from '~/utils/wait';
const moralisAPI = getRandomMoralisAPI();
Moralis.start({
  apiKey: moralisAPI,
});
interface BalanceHistory {
  value: string; // assuming value can be a string (e.g., for large numbers)
  transferAmount: string; // same as above
  timestamp: string; // ISO 8601 date string
  block: string; // block number or hash
}

interface EthereumResponse {
  data: {
    ethereum: {
      address: {
        balances: {
          history: BalanceHistory[];
          currency: {
            name: string;
            symbol: string;
          };
        }[];
        smartContract: {
          currency: {
            symbol: string;
            name: string;
            tokenType: string;
          };
          contractType: string;
        };
      }[];
    };
  }
}
async function classifyAddress(
  chainId: string,
  address: string,
) {

}
async function fetchWalletTransactionHistory(
  address: string,
  chainID: string,
  startTimestamp?: string,
  endTimestamp?: string,
  nft_metadata: boolean = true,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,

): Promise<WalletTransactionHistory> {
  let cursor: string | null = "";

  let result: WalletTransactionHistory = {
    size: 0,
    transactions: [],
  }

  while (cursor != null) {
    await wait(1000);
    if (result.size > DEFAULT_MAX_TRANSACTION_REQUEST) {
      break;
    }
    const params = {
      address: address,
      chain: chainID,
      from_date: startTimestamp,
      end_date: endTimestamp,
      include_internal_transactions: false,
      nft_metadata: nft_metadata,
      order: "ASC" as "ASC" | "DESC" | undefined,
      ...(cursor && { cursor })
    }
    const pageResult = await Moralis.EvmApi.wallets.getWalletHistory(params);
    cursor = pageResult.hasNext() ? pageResult.response.cursor : null;

    const walletTransactionHistoryReturn = pageResult.response.result;
    const transaction = walletTransactionHistoryReturn.map((transaction) => {
      
      let erc20Transactions: MoralisErc20TransferReturn[] = [];
      let NFTTransactions: MoralisNFTTransferReturn[] = [];
      let nativeTransactions: MoralisNativeTransferReturn[] = [];

      let moralisTransactionReturn: MoralisTransactionReturn;
      console.log("include_erc20_transactions_triggered", include_erc20_transactions_triggered)
      if (include_erc20_transactions_triggered) {
        if (transaction.erc20Transfers.length > 0) {
          console.log("ERC 20 EXIST", true)
          // TODO: Handle transaction.direction
          transaction.erc20Transfers.forEach((erc20: any) => {
            erc20Transactions.push({
              token_entity: {
                name: erc20.tokenName,
                decimal: erc20.tokenDecimals,
                address: erc20.address.checksum,
                symbol: erc20.tokenSymbol,
                logo: erc20.tokenLogo,
                possible_spam: erc20.possibleSpam,
                verified_contract: erc20.verifiedContract
              },
              from_entity: {
                address: erc20.fromAddress.checksum,
                address_entity: erc20.fromAddressEntity,
                address_entity_logo: erc20.fromAddressEntityLogo,
                address_entity_label: erc20.fromAddressLabel,
              },
              to_entity: {
                address: erc20.toAddress?.checksum || DEFAULT_ADDRESS,
                address_entity: erc20.toAddressEntity,
                address_entity_logo: erc20.toAddressEntityLogo,
                address_entity_label: erc20.toAddressLabel,
              },
              block_timestamp: erc20.blockTimestamp,
              value_formatted: erc20.valueFormatted,
              direction: erc20.direction,
            })
          })
        }
      }
      if (include_nft_transactions_triggered) {
        if (transaction.nftTransfers.length > 0) {
          transaction.nftTransfers.forEach((nft) => {
            NFTTransactions.push({
              token_entity: {
                address: nft.tokenAddress.checksum,
                id: nft.tokenId,
                name: nft.normalizedMetadata?.name,
                description: nft.normalizedMetadata?.description,
                animation_url: nft.normalizedMetadata?.animationUrl,
                image: nft.normalizedMetadata?.image,
                value: nft.value,
                possible_spam: nft.possibleSpam,
                verified_collection: nft.verifiedCollection,
                collection_logo: nft.collectionLogo,
                collection_banner_image: nft.collectionBannerImage,
              },
              from_entity: {
                address: nft.fromAddress.checksum,
                address_entity: nft.fromAddressEntity,
                address_entity_logo: nft.fromAddressEntityLogo,
                address_entity_label: nft.fromAddressLabel,
              },
              to_entity: {
                address: nft.toAddress?.checksum || DEFAULT_ADDRESS,
                address_entity: nft.toAddressEntity,
                address_entity_logo: nft.toAddressEntityLogo,
                address_entity_label: nft.toAddressLabel,
              },
              amount: nft.amount,
              direction: nft.direction,
              contract_type: nft.contractType,
              value: nft.value,
            })
          })
        }
      }
      if (include_native_transactions_triggered) {
        if (transaction.nativeTransfers.length > 0) {
          transaction.nativeTransfers.forEach((native) => {
            nativeTransactions.push({
              from_entity: {
                address: native.fromAddress.checksum,
                address_entity: native.fromAddressEntity,
                address_entity_logo: native.fromAddressEntityLogo,
                address_entity_label: native.fromAddressLabel,
              },
              to_entity: {
                address: native.toAddress?.checksum || DEFAULT_ADDRESS,
                address_entity: native.toAddressEntity,
                address_entity_logo: native.toAddressEntityLogo,
                address_entity_label: native.toAddressLabel,
              },
              token: {
                symbol: native.tokenSymbol,
                logo: native.tokenLogo,
              },
              value_formatted: native.valueFormatted,
              direction: native.direction,
            })
          })
        }
      }

      moralisTransactionReturn = {
        transactionHash: transaction.blockHash,
        from_entity: {
          address: transaction.fromAddress.checksum,
          address_entity: transaction.fromAddressEntity,
          address_entity_logo: transaction.fromAddressEntityLogo,
          address_entity_label: transaction.fromAddressLabel
        },
        to_entity: {
          address: transaction.toAddress?.checksum,
          address_entity: transaction.toAddressEntity,
          address_entity_logo: transaction.toAddressEntityLogo,
          address_entity_label: transaction.toAddressLabel
        },
        method_label: transaction.methodLabel,
        value: transaction.value,
        block_timestamp: transaction.blockTimestamp,
        nft_transfers: NFTTransactions,
        erc20_transfers: erc20Transactions,
        native_transfers: nativeTransactions,
      }
      return moralisTransactionReturn;
    })
    result.size += pageResult.response.pageSize;
    result.transactions = result.transactions.concat(transaction);
    await wait(1000);
    if (result.size > DEFAULT_MAX_TRANSACTION_REQUEST) {
      break;
    }
  }
  return result;

}

async function fetchWalletTokenBalancesPrice(
  chainID: string,
  address: string,
  tokenAddresses: string[],
): Promise<WalletTokenBalancePrice> {

  let cursor: string | null = "";
  let result: WalletTokenBalancePrice = {
    size: 0,
    tokens: [],
  };
  while (cursor != null) {
    await wait(1000);
    if (result.size > DEFAULT_MAX_TRANSACTION_REQUEST) {
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
      ...(cursor && { cursor })
    };

    const pageResult = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice(params);
    cursor = pageResult.hasNext() ? pageResult.response.cursor! : null;

    const page_size: number = pageResult.response.pageSize || 0;
    result.size += page_size;

    const tokensReturn = pageResult.response.result;

    const token = tokensReturn.map((asset): AssetPortfolio => {
      return NewAssetPortfolio(
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
    console.log("Result size length", result.size)

  }
  return result;
}
async function getWalletTransactionHistory(
  address: string,
  chainID: string,
  startTimestamp?: string,
  endTimestamp?: string,
  include_nft_metadata: boolean = true,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,
  page: number = DEFAULT_PAGE,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  let result: FrontEndResponsesType;
  // TODO: CHECK IF DB exist address data

  // ELSE:
  let response = await fetchWalletTransactionHistory(
    address,
    chainID,
    startTimestamp,
    endTimestamp,
    include_nft_metadata,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
  );
  //TODO: STORE TO DB
  result = {
    metadata: {
      "total_data": response.size,
      "page": page,
      "page_size": pageSize
    },
    result: response.transactions.slice(page * pageSize, page * pageSize + pageSize)
  }
  return result;
}
async function getUserAssetInformation(
  address: string,
  chainID: string,
  tokenAddresses: string[] = [],
  page: number = DEFAULT_PAGE,
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  let result: FrontEndResponsesType;
  // TODO: CHECK IF DB exist address data

  // ELSE:
  let response = await fetchWalletTokenBalancesPrice(chainID, address, tokenAddresses);

  //TODO: STORE TO DB
  result = {
    metadata: {
      "total_data": response.size,
      "page": page,
      "page_size": pageSize,
    },
    result: response
  }

  return result;
}


async function getUserInformation(address: string, currency_address: string, timestamp: number) {
  try {
    const [datetimeISO, dateISO] = timestampToDate(timestamp)
    const API_KEY = getRandomBitQueryAPI()
    console.log("API_KEY", API_KEY)

    console.log("Address", address)
    console.log("currency_address", currency_address)
    console.log("timestamp", timestamp)
    const response = await axios.post(
      'https://graphql.bitquery.io',
      {
        query: `
        query MyQuery {
          ethereum {
            address(address: {is: "${address}"}) {
              balances(
                currency: {is: "${currency_address}"}
                date: {after: "${datetimeISO}"}
              ) {
                history {
                  value
                  transferAmount
                  timestamp
                  block
                }
                currency {
                  name
                  symbol
                }
              }
              smartContract {
                currency {
                  symbol
                  name
                  tokenType
                }
              }
            }
          }
        }
        `
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': `${API_KEY}`
        }
      }
    );
    const result: EthereumResponse = response.data;

    // const last_timestamp = result.data.ethereum.address[0].balances[0].history.slice(-1)[0].timestamp
    const returnObject = {
      "result": result,
      // "last_timestamp": last_timestamp
    }
    return returnObject
  } catch (error) {
    console.log(error)
    throw new Error()
  }
}

async function getUserBalance(address: string) {
  const provider: JsonRpcProvider = getRandomDrpcAPI();
  const balance: BigNumber = await provider.getBalance(address);
  const balanceETH = BigNumbertoEther(balance);
  return balanceETH;
}

async function getNFTTransaction(
  NFT_address: string[],
  nftId: number,
  pageKey: string | undefined,
  fromBlock: string = '0x0',
) {

  const alchemy: Alchemy = getRandomAlchemyAPI();
  const response = await alchemy.core.getAssetTransfers({
    fromBlock: fromBlock,
    contractAddresses: NFT_address,
    category: [AssetTransfersCategory.ERC721],
    excludeZeroValue: false,
    pageKey: pageKey
  });

  let txns = response.transfers.filter((txn) => fromHex(txn.erc721TokenId || '-1') === nftId);

  return txns;
}

async function getAddressTokenBalance(ownerAddress: string, tokenAddresses: string[]) {
  try {
    const alchemy: Alchemy = getRandomAlchemyAPI();
    const data: TokenBalancesResponse = await alchemy.core.getTokenBalances(ownerAddress, tokenAddresses);
    // const dataReturn: TokenBalanceReturn = 
    return data;
  } catch {
    throw new Error("Cannot get Address Token Balance Service")
  }
}

async function getAddressTransactions(
  fromAddress: string,
  fromBlock: string = '0x0',
  toAddress: string | undefined = undefined,

  category: AssetTransfersCategory[] = [
    AssetTransfersCategory.EXTERNAL,
    AssetTransfersCategory.ERC1155,
    AssetTransfersCategory.INTERNAL,
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.SPECIALNFT
  ],
  order: SortingOrder = SortingOrder.ASCENDING, // latest transaction last
  pageKey: string | undefined = undefined
) {
  if (toAddress == '') {
    toAddress = undefined;
  }
  const alchemy: Alchemy = getRandomAlchemyAPI();
  const params = {
    fromBlock: fromBlock,
    fromAddress: fromAddress,
    category: category,
    order: order,
    toAddress: toAddress,
    withMetadata: true,
    pageKey
  };

  const transactionHistory = await alchemy.core.getAssetTransfers(params);
  return transactionHistory;
}

async function getAddressERC20Transaction(
  fromAddress: string,
  fromBlock: string = '0x0',
  toAddress: string | undefined = undefined,
  order: SortingOrder = SortingOrder.ASCENDING, // latest transaction last
  pageKey: string | undefined = undefined
) {
  const alchemy: Alchemy = getRandomAlchemyAPI();

  const category: AssetTransfersCategory[] = [AssetTransfersCategory.ERC20];

  const params = {
    fromBlock: fromBlock,
    fromAddress: fromAddress,
    category: category,
    order: order,
    toAddress: toAddress,
    withMetadata: true,
    pageKey
  };

  const transactionHistory = await alchemy.core.getAssetTransfers(params);
  return transactionHistory;
}

async function getAddressERC721Transaction(
  fromAddress: string,
  fromBlock: string = '0x0',
  toAddress: string | undefined = undefined,
  order: SortingOrder = SortingOrder.ASCENDING, // latest transaction last
  pageKey: string | undefined = undefined
) {
  const alchemy: Alchemy = getRandomAlchemyAPI();

  const category: AssetTransfersCategory[] = [AssetTransfersCategory.ERC721];

  const params = {
    fromBlock: fromBlock,
    fromAddress: fromAddress,
    category: category,
    order: order,
    toAddress: toAddress,
    withMetadata: true,
    pageKey
  };

  const transactionHistory = await alchemy.core.getAssetTransfers(params);
  return transactionHistory;
}

async function getAddressERC721TransactionByETH(
  fromAddress: string,
  fromBlock: string = '0x0',
  toAddress: string | undefined = undefined,
  order: SortingOrder = SortingOrder.ASCENDING, // latest transaction last
  pageKey: string | undefined = undefined
) {
  const alchemy: Alchemy = getRandomAlchemyAPI();

  const category: AssetTransfersCategory[] = [
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.EXTERNAL
  ];

  const params = {
    fromBlock: fromBlock,
    fromAddress: fromAddress,
    category: category,
    order: order,
    toAddress: toAddress,
    withMetadata: true,
    pageKey
  };

  const transactionHistory = await alchemy.core.getAssetTransfers(params);
  return transactionHistory;
}

async function getAddressERC721TransactionByERC20(
  fromAddress: string,
  fromBlock: string = '0x0',
  toAddress: string | undefined = undefined,
  order: SortingOrder = SortingOrder.ASCENDING, // latest transaction last
  pageKey: string | undefined = undefined
) {
  const alchemy: Alchemy = getRandomAlchemyAPI();

  const category: AssetTransfersCategory[] = [
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.ERC20
  ];

  const params = {
    fromBlock: fromBlock,
    fromAddress: fromAddress,
    category: category,
    order: order,
    toAddress: toAddress,
    withMetadata: true,
    pageKey
  };

  const transactionHistory = await alchemy.core.getAssetTransfers(params);
  return transactionHistory;
}

export default {
  getUserBalance,
  getAddressTransactions,
  getAddressERC20Transaction,
  getAddressERC721TransactionByETH,
  getAddressERC721TransactionByERC20,
  getAddressERC721Transaction,
  getNFTTransaction,
  getAddressTokenBalance,
  getUserInformation,
  getUserAssetInformation,
  getWalletTransactionHistory
};
