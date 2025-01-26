import { wait } from '~/utils/wait';
import { Transaction, TransactionAPIReturn } from './type.return';
import Moralis from 'moralis';
import { Erc20Transfer } from './type.erc20';
import { NFTTransfer } from './type.nft';
import { NativeTransfer } from './type.native';
import {
  DEFAULT_ADDRESS,
  DEFAULT_LABEL,
  DEFAULT_MAX_TRANSACTION_REQUEST,
  DEFAULT_SCORE
} from '~/constants/defaultvalue';
import { timestampToBlock } from '~/utils/time';

import { getAlchemyAPI } from '~/configs/provider.configs';
import { get_contract_functions, getAddressType, is_eoa } from '~/utils/accountclassify';
import {
  createContract,
  createEOA,
  getContractByHash,
  getEOAByHash,
  updateEOALabel
} from '../account.dao';
import { Entity } from '../types/entity';
import { AccountType } from '~/models/account.model';
import { getTokenByAddress } from '~/modules/token/token.dao';
import { MORALIS_URLS } from '~/utils/API';

async function fetchBlockNumberFromTransaction(transactionHash: string) {
  const alchemy = getAlchemyAPI();
  const res = await alchemy.core.getTransactionReceipt(transactionHash);

  return Number(res?.blockNumber);
}

async function getEntity(
  addressHash: string,
  txAddressLabel: string | undefined,
  txAddressEntity: string | undefined,
  txAddressEntityLogo: string | undefined,
  chainId: string,
): Promise<Entity> {
  let entity: Entity = {
    address: '',
    address_entity: '',
    address_entity_logo: '',
    address_entity_label: '',
    type: []
  };

  let addressType = await getAddressType(addressHash);

  // check if from address is EOA
  let isFromEOA = await is_eoa(addressHash);
  if (isFromEOA) {
    let eoaDb = await getEOAByHash(addressHash);
    const nameTag = eoaDb?.name_tag;
    const label = eoaDb?.label;

    entity = {
      address: addressHash,
      address_entity: txAddressEntity,
      address_entity_logo: txAddressEntityLogo,
      address_entity_label: nameTag || label || txAddressLabel,
      type: addressType
    };

    // if label is not empty, create EOA
    if (!eoaDb && entity.address_entity_label) { 
      await createEOA({
        hash: addressHash,
        nameTag: entity.address_entity_label || '',
        chainHash: chainId,
        logo: entity.address_entity_logo || '',
        label: entity.address_entity_label || '',
      })
    }
  }

  // check if from address is contract token
  let token = await getTokenByAddress(addressHash);
  if (token) {
    addressType.push(AccountType.CONTRACT_TOKEN);

    entity = {
      address: addressHash,
      address_entity: txAddressEntity,
      address_entity_logo: txAddressEntityLogo || token.image, // prior Moralis
      address_entity_label: token.symbol || txAddressLabel,
      type: addressType
    };
  }
  //if not EOA && not token contract, create contract
  if (!token && !isFromEOA && (txAddressEntityLogo || txAddressEntity)) {
    const sourceCode = await get_contract_functions(addressHash);
    const verified =
      sourceCode.result[0].ABI === 'Contract source code not verified' ? false : true;

    await createContract({
      address: addressHash,
      chainHash: chainId,
      isVerified: verified,
      logo: txAddressEntityLogo || '',
      nameTag: txAddressEntity || "",
      sourceCode: sourceCode.result[0].SourceCode,
      type: 'ERC20',
      abi: sourceCode.result[0].ABI

    })
  }

  return entity;
}
async function assignSameAddress(
  innerAddress: string,
  addressLabel: string | undefined,
  addressLogo: string | undefined,
  outerAddress: Entity
): Promise<Entity> {
  let resultAddress: Entity = {
    address: '',
    address_entity: '',
    address_entity_logo: '',
    address_entity_label: '',
    type: []
  };

  if (innerAddress === outerAddress.address) {
    resultAddress = outerAddress;
  }
  if (innerAddress !== outerAddress.address) {
    const address: string = innerAddress || DEFAULT_ADDRESS;
    const toAddressType: AccountType[] = await getAddressType(address);
    const toLabel: string = (await getEOAByHash(address))?.name_tag || DEFAULT_LABEL;

    resultAddress = {
      address: address,
      address_entity: addressLabel as string,
      address_entity_logo: addressLogo as string,
      address_entity_label: toLabel,
      type: toAddressType
    };
  }
  return resultAddress;
}

async function fetchAccountTransactionWithRetry(
  address: string,
  chainID: string,
  startTimestamp: number | undefined,
  endTimestamp: number | undefined,
  startBlock: number | undefined,
  toBlock: number | undefined,
  order: 'ASC' | 'DESC' | undefined,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true
) {
  async function fetchAccountTransaction(
    address: string,
    chainID: string,
    startTimestamp: number | undefined,
    endTimestamp: number | undefined,
    startBlock: number | undefined,
    toBlock: number | undefined,
    order: 'ASC' | 'DESC' | undefined,
    include_erc20_transactions_triggered: boolean = true,
    include_nft_transactions_triggered: boolean = true,
    include_native_transactions_triggered: boolean = true
  ): Promise<TransactionAPIReturn> {
    let cursor: string | null = '';
  
    let result: TransactionAPIReturn = {
      size: 0,
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
      startBlock: startBlock,
      endBlock: toBlock,
      transactions: []
    };
    console.log("startTimestamp", startTimestamp);
    console.log("endTimestamp", endTimestamp);
    while (cursor != null) {
      await wait(1000);
      console.log("result.size", result.size);
      if (result.size >= DEFAULT_MAX_TRANSACTION_REQUEST) {
        break;
      }
      let params;
      if (startBlock) {
        let startBlockParam = startBlock || (await timestampToBlock(startTimestamp, chainID));
        let toBlockParam = toBlock || (await timestampToBlock(endTimestamp, chainID));
  
        params = {
          address: address,
          chain: chainID,
          fromBlock: startBlockParam,
          toBlock: toBlockParam || undefined,
          includeInternalTransactions: false,
          nftMetadata: true,
          order: order,
          limit: DEFAULT_MAX_TRANSACTION_REQUEST,
          ...(cursor && { cursor })
        };
      } 
      if (!startBlock) {
        let startDateTime = new Date(startTimestamp!);
        let endDateTime = new Date(endTimestamp!);
        console.log("startDateTime", startDateTime);
        console.log("endDateTime", endDateTime);
        params = {
          address: address,
          chain: chainID,
          fromDate: startDateTime,
          toDate: endDateTime,
          includeInternalTransactions: false,
          nftMetadata: true,
          order: order,
          limit: DEFAULT_MAX_TRANSACTION_REQUEST,
          ...(cursor && { cursor })
        };
      }
  
      const pageResult = await Moralis.EvmApi.wallets.getWalletHistory(params!);
      cursor = pageResult.hasNext() ? pageResult.response.cursor : null;
  
      const walletTransactionHistoryReturn = pageResult.response.result;
      const transactionPromises = walletTransactionHistoryReturn.map(async (transaction) => {
        let erc20Transactions: Erc20Transfer[] = [];
        let NFTTransactions: NFTTransfer[] = [];
        let nativeTransactions: NativeTransfer[] = [];
  
        let transactionReturn: Transaction;
  
        let from: Entity = await getEntity(
          transaction.fromAddress.checksum,
          transaction.fromAddressLabel,
          transaction.fromAddressEntity,
          transaction.fromAddressEntityLogo,
          chainID
        );
        if (from.address === address) {
          from.type.push(AccountType.TARGET)
        }
        let to: Entity = await getEntity(
          transaction.toAddress?.checksum || DEFAULT_ADDRESS,
          transaction.toAddressLabel,
          transaction.toAddressEntity,
          transaction.toAddressEntityLogo,
          chainID
        )
        if (to.address === address) {
          to.type.push(AccountType.TARGET)
        }
        console.log('from', from);
        console.log('to', to);
  
        if (include_erc20_transactions_triggered) {
          if (transaction.erc20Transfers.length > 0) {
            // TODO: Handle transaction.direction
            transaction.erc20Transfers.forEach(async (erc20: any) => {
              let erc20From: Entity = await assignSameAddress(
                erc20.fromAddress.checksum,
                erc20.fromAddressEntity,
                erc20.fromAddressEntityLogo,
                from
              );
  
              let erc20To: Entity = await assignSameAddress(
                erc20.toAddress.checksum,
                erc20.toAddressEntity,
                erc20.toAddressEntityLogo,
                to
              );
  
              erc20Transactions.push({
                token: {
                  name: erc20.tokenName,
                  decimal: erc20.tokenDecimals,
                  address: erc20.address.checksum,
                  symbol: erc20.tokenSymbol,
                  logo: erc20.tokenLogo,
                  possibleSpam: erc20.possibleSpam,
                  verifiedContract: erc20.verifiedContract
                },
                from: erc20From,
                to: erc20To,
                blockTimestamp: erc20.blockTimestamp,
                valueFormatted: erc20.valueFormatted,
                direction: erc20.direction
              });
            });
          }
        }
        if (include_nft_transactions_triggered) {
          if (transaction.nftTransfers.length > 0) {
            transaction.nftTransfers.forEach(async (nft) => {
              let nftFrom: Entity = await assignSameAddress(
                nft.fromAddress.checksum,
                nft.fromAddressLabel,
                nft.fromAddressEntityLogo,
                from
              );
              let nftTo: Entity = await assignSameAddress(
                nft.toAddress?.checksum || DEFAULT_ADDRESS,
                nft.toAddressLabel,
                nft.toAddressEntityLogo,
                to
              );
              NFTTransactions.push({
                token: {
                  address: nft.tokenAddress.checksum,
                  id: nft.tokenId,
                  name: nft.normalizedMetadata?.name || null,
                  description: nft.normalizedMetadata?.description,
                  animationUrl: nft.normalizedMetadata?.animationUrl || null,
                  image: nft.normalizedMetadata?.image,
                  possibleSpam: nft.possibleSpam,
                  collection: {
                    verified: nft.verifiedCollection,
                    logo: nft.collectionLogo || null,
                    bannerImage: nft.collectionBannerImage || null
                  }
                },
                from: nftFrom,
                to: nftTo,
                amount: nft.amount,
                direction: nft.direction,
                contractType: nft.contractType,
                value: nft.value
              });
            });
          }
        }
        if (include_native_transactions_triggered) {
          if (transaction.nativeTransfers.length > 0) {
            transaction.nativeTransfers.forEach(async (native) => {
              let nativeFrom: Entity = await assignSameAddress(
                native.fromAddress.checksum,
                native.fromAddressEntity,
                native.fromAddressEntityLogo,
                from
              );
              let nativeTo: Entity = await assignSameAddress(
                native.toAddress?.checksum || DEFAULT_ADDRESS,
                native.toAddressEntity,
                native.toAddressEntityLogo,
                to
              );
  
              nativeTransactions.push({
                from: nativeFrom,
                to: nativeTo,
                token: {
                  symbol: native.tokenSymbol,
                  logo: native.tokenLogo
                },
                valueFormatted: native.valueFormatted,
                direction: native.direction
              });
            });
          }
        }
        transactionReturn = {
          chainId: chainID,
          summary: transaction.summary,
          txnHash: transaction.blockHash,
          from: from,
          to: to,
          methodLabel: transaction.methodLabel,
          value: transaction.value,
          blockTimestamp: transaction.blockTimestamp,
          nftTransfers: NFTTransactions,
          erc20Transfers: erc20Transactions,
          nativeTransfers: nativeTransactions
        };
        return transactionReturn;
      });
  
      result.size += pageResult.response.pageSize;
  
      const resolvedTransactions = await Promise.all(transactionPromises);
      result.transactions = result.transactions.concat(resolvedTransactions);
  
      await wait(1000);
      if (result.size > DEFAULT_MAX_TRANSACTION_REQUEST) {
        break;
      }
    }
    console.log(result);
    return result;
  }
  let attempts = 0;
  let accountTxn = undefined;
  while (attempts < MORALIS_URLS.length) {
    try {
      accountTxn = await fetchAccountTransaction(address, chainID, startTimestamp, endTimestamp, startBlock, toBlock, order, include_erc20_transactions_triggered, include_nft_transactions_triggered, include_native_transactions_triggered);
      return accountTxn;
    } catch(err) {
      console.log("ATTEMPTS:", attempts)
      attempts++;
      await wait(1000);
    }
  }
  throw new Error("Failed to fetch account transaction");
} 
export { fetchAccountTransactionWithRetry, fetchBlockNumberFromTransaction };
