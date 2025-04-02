import { wait } from '~/utils/wait';
import {
  TokenAmount,
  Transaction,
  TransactionAPIReturn,
  TransactionType,
  Direction
} from './type.return';
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
import { transferableAbortController } from 'util';
import { ERC20Amount, ERC20Token, NativeAmount, NativeToken, NFTAmount, NFTToken } from '../types/token';
import { processAirdropTransfers, processReceiveTransfers, processSentTransfers, processSignTransfers } from './processTxn';

export async function getEntity(
  chainId: string,
  addressHash: string,
  txAddressLabel: string | undefined,
  txAddressEntity?: string | undefined,
  txAddressEntityLogo?: string | undefined
): Promise<Entity> {
  let entity: Entity | undefined = undefined
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
        label: entity.address_entity_label || ''
      });
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
  if (!token && !isFromEOA) {
    const sourceCode = await get_contract_functions(addressHash);
    const verified =
      sourceCode.result[0].ABI === 'Contract source code not verified' ? false : true;

    const contract = await createContract({
      address: addressHash,
      chainHash: chainId,
      isVerified: verified,
      logo: txAddressEntityLogo || '',
      nameTag: txAddressEntity || '',
      sourceCode: sourceCode.result[0].SourceCode,
      type: 'ERC20',
      abi: sourceCode.result[0].ABI
    });
    entity = {
      address: addressHash,
      address_entity: txAddressEntity,
      address_entity_logo: contract.logo, // prior Moralis
      address_entity_label: txAddressLabel,
      type: addressType
    };
  }
  if (entity === undefined) {
    throw new Error("Cannot workaround to find entity: " + addressHash)
  }
  return entity;
}
async function buildParams(
  startBlock: number | undefined,
  startTimestamp: number | undefined,
  endTimestamp: number | undefined,
  chainID: string,
  address: string,
  order: 'ASC' | 'DESC' | undefined,
  cursor: string | null,
  toBlock: number | undefined,
  limit: number | undefined
) {
  if (startBlock) {
    const startBlockParam = startBlock || (await timestampToBlock(startTimestamp, chainID));
    const toBlockParam = toBlock || (await timestampToBlock(endTimestamp, chainID));

    return {
      address,
      chain: chainID,
      fromBlock: startBlockParam,
      toBlock: toBlockParam || undefined,
      includeInternalTransactions: false,
      nftMetadata: true,
      order,
      limit: limit|| DEFAULT_MAX_TRANSACTION_REQUEST,
      ...(cursor && { cursor })
    };
  } else {
    const startDateTime = new Date(startTimestamp!);
    const endDateTime = new Date(endTimestamp!);

    return {
      address,
      chain: chainID,
      fromDate: startDateTime,
      toDate: endDateTime,
      includeInternalTransactions: true,
      nftMetadata: true,
      order,
      limit: limit|| DEFAULT_MAX_TRANSACTION_REQUEST,
      ...(cursor && { cursor })
    };
  }
}

async function fetchAccountTransactionWithRetry(
  address: string,
  chainID: string,
  startTimestamp: number | undefined,
  endTimestamp: number | undefined,
  startBlock: number | undefined,
  toBlock: number | undefined,
  order: 'ASC' | 'DESC' | undefined,
  limit?: number | undefined,

) {
  async function fetchAccountTransaction(
    address: string,
    chainID: string,
    startTimestamp: number | undefined,
    endTimestamp: number | undefined,
    startBlock: number | undefined,
    toBlock: number | undefined,
    order: 'ASC' | 'DESC' | undefined,
    limit?: number,
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
    while (cursor != null) {
      await wait(1000);
      if (result.size >= (limit || DEFAULT_MAX_TRANSACTION_REQUEST)) break;

      const params = await buildParams(startBlock, startTimestamp, endTimestamp, chainID, address, order, cursor, toBlock, limit);
      const pageResult = await Moralis.EvmApi.wallets.getWalletHistory(params);

      cursor = pageResult.hasNext() ? pageResult.response.cursor : null;

      const transactions = pageResult.result
      //.filter(txn => extractTxnType(txn.summary) !== TransactionType.Sign);
      console.log("Transactions: ", transactions)
      const transactionPromise = transactions.map(async (transaction) => {
        let transactionReturn: Transaction;

        let fromEntity, toEntity;
        let value: {
          sent: (ERC20Amount | NFTAmount | NativeAmount)[];
          receive: (ERC20Amount | NFTAmount | NativeAmount)[];
        } = {
          sent: [],
          receive: []
        };
        let intermediaryEntities: Entity[] = [];

        if (!transaction.toAddress) {
          return undefined
          // throw new Error('Unhandled case toaddress is null, transaction: \n' + transaction);
        }

        const txnType = extractTxnType(transaction.summary);
        if (txnType === undefined) {
          return undefined;
        }
        if (txnType === TransactionType.Unknown) {
          return undefined
        }
        if (txnType === TransactionType.Sent) {
          const [from, to, v] = await processSentTransfers(transaction, chainID)
          fromEntity = from
          toEntity = to
          value = v;
        }
        
        /**
         * In case is Receive txn,
         * from -> to (to may not be the txn we want)
         * we let the flow be like
         * => from -> inter -> to
         */
        if (txnType === TransactionType.Receive) {
          const [from, to, inter, v] = await processReceiveTransfers(address, transaction, chainID)
          fromEntity = from
          toEntity = to
          intermediaryEntities = inter
          value = v;
        }
        if (txnType === TransactionType.Sign) {
          const [from, to, v] = await processSignTransfers(transaction, chainID)
          fromEntity = from
          toEntity = to
          value = v;
        }
        /**
         * Approve should have the spender address,
         * `to_address` in approve is seen as Token contract instead of the one who was approved
         */
        if (txnType === TransactionType.Approve) {
          fromEntity = await getEntity(
            chainID,
            transaction.fromAddress.lowercase,
            transaction.fromAddressLabel,
            transaction.fromAddressEntity,
            transaction.fromAddressEntityLogo
          );
          const intermediaryEntity = await getEntity(
            chainID,
            transaction.toAddress.lowercase,
            transaction.toAddressLabel,
            transaction.toAddressEntity,
            transaction.toAddressEntityLogo
          );
          intermediaryEntities.push(intermediaryEntity);

          const toAddresses = transaction.contractInteractions?.approvals;
          if (!toAddresses) {
            // throw new Error('Approval summary but got no approval interaction');
            return undefined
          }
          if (toAddresses.length > 1) {
            throw new Error('Unhandled case approve many users ');
          }
          const toAddress = toAddresses[0];
          toEntity = await getEntity(
            chainID,
            toAddress.spender.address.lowercase,
            toAddress.spender.addressLabel
          );
          value.sent.push({
            value: toAddress.valueFormatted || '0',
            address: toAddress.token.address.lowercase,
            name: toAddress.token.tokenName,
            symbol: toAddress.token.tokenSymbol,
            possibleSpam: false,
            verifiedContract: true
          });
        }

        if (txnType === TransactionType.Swap) {
          fromEntity = await getEntity(
            chainID,
            transaction.fromAddress.lowercase,
            transaction.fromAddressLabel,
            transaction.fromAddressEntity,
            transaction.fromAddressEntityLogo
          );
          toEntity = await getEntity(
            chainID,
            transaction.toAddress.lowercase,
            transaction.fromAddressLabel,
            transaction.fromAddressEntity,
            transaction.fromAddressEntityLogo
          );

          for (const nativeTransfer of transaction.nativeTransfers) {
            if (nativeTransfer.direction === 'receive') {
              value.receive.push({
                value: nativeTransfer.valueFormatted,
                symbol: nativeTransfer.tokenSymbol,
                logo: nativeTransfer.tokenLogo
              });
            } else {
              value.sent.push({
                value: nativeTransfer.valueFormatted,
                symbol: nativeTransfer.tokenSymbol,
                logo: nativeTransfer.tokenLogo
              });
            }
          }
          for (const transfer of transaction.erc20Transfers) {
            if ((transfer as any).direction === 'receive') {
              value.receive.push({
                value: transfer.valueFormatted,

                name: transfer.tokenName,
                decimal: transfer.tokenDecimals,
                address: transfer.address.lowercase,
                symbol: transfer.tokenSymbol,
                logo: transfer.tokenLogo,
                possibleSpam: transfer.possibleSpam,
                verifiedContract: transfer.verifiedContract
              });
            } else {
              value.sent.push({
                value: transfer.valueFormatted,

                name: transfer.tokenName,
                decimal: transfer.tokenDecimals,
                address: transfer.address.lowercase,
                symbol: transfer.tokenSymbol,
                logo: transfer.tokenLogo,
                possibleSpam: transfer.possibleSpam,
                verifiedContract: transfer.verifiedContract
              });
            }
          }
          for (const transfer of transaction.nftTransfers) {
            if (transfer.direction === 'receive') {
              value.receive.push({
                value: transfer.value,

                address: transfer.tokenAddress.lowercase,
                id: transfer.tokenId,
                name: transfer.normalizedMetadata?.name,
                description: transfer.normalizedMetadata?.description,
                animationUrl: transfer.normalizedMetadata?.animationUrl,
                image: transfer.normalizedMetadata?.image,
                possibleSpam: transfer.possibleSpam,
                collection: {
                  verified: transfer.verifiedCollection,
                  logo: transfer.collectionLogo,
                  bannerImage: transfer.collectionBannerImage
                }
              });
            } else {
              value.sent.push({
                value: transfer.value,
                address: transfer.tokenAddress.lowercase,
                id: transfer.tokenId,
                name: transfer.normalizedMetadata?.name,
                description: transfer.normalizedMetadata?.description,
                animationUrl: transfer.normalizedMetadata?.animationUrl,
                image: transfer.normalizedMetadata?.image,
                possibleSpam: transfer.possibleSpam,
                collection: {
                  verified: transfer.verifiedCollection,
                  logo: transfer.collectionLogo,
                  bannerImage: transfer.collectionBannerImage
                }
              });
            }
          }
        }

        if (txnType === TransactionType.Airdrop) {
          const [from, to, v] = await processAirdropTransfers(transaction, chainID)
          fromEntity = from
          toEntity = to
          value = v;
        }
        if (value.receive.length === 0 && value.sent.length === 0) {
          return undefined
        }
        if (!fromEntity || !toEntity) {
          console.log("fromEntity", fromEntity);
          console.log("toEntity", toEntity);
          console.log("value", value);
          throw new Error('Unhandled case parsing txn for txn: ' + JSON.stringify(transaction));
        }
        let check = false
        if (fromEntity.address?.toLowerCase() === address.toLowerCase()) {
          check = true
          fromEntity.type.push(AccountType.TARGET);
        }

        if (toEntity.address?.toLowerCase() === address.toLowerCase()) {
          check = true
          toEntity.type.push(AccountType.TARGET);
        }
        if (!check) {
          return undefined
        }
        

        transactionReturn = {
          chainId: chainID,
          summary: transaction.summary,
          txnHash: transaction.hash,
          from: fromEntity,
          to: toEntity,
          value: value,
          date: new Date(transaction.blockTimestamp),
          type: txnType
        };
        return transactionReturn;
      });

      result.size += pageResult.response.pageSize;

      const resolvedTransactions = (await Promise.all(transactionPromise)).filter(txn => !!txn);
      result.transactions = result.transactions.concat(resolvedTransactions);

      await wait(1000);
      if (result.size > DEFAULT_MAX_TRANSACTION_REQUEST) {
        break;
      }
    }
    return result;
  }
  let attempts = 0;
  let accountTxn = undefined;
  while (attempts < 1) {
    try {
      accountTxn = await fetchAccountTransaction(
        address,
        chainID,
        startTimestamp,
        endTimestamp,
        startBlock,
        toBlock,
        order,
        limit
      );
      return accountTxn;
    } catch (err) {
      console.log('ATTEMPTS:', attempts);
      console.log('err:', err);
      attempts++;
      await wait(1000);
    }
  }
  throw new Error('Failed to fetch account transaction');
}


function extractTxnType(summary: string): TransactionType | undefined {
  if (summary.startsWith('Approved')) {
    return TransactionType.Approve;
  }
  if (summary.startsWith('Received')) {
    return TransactionType.Receive;
  }
  if (summary.startsWith('Sent')) {
    return TransactionType.Sent;
  }
  if (summary.startsWith('Swapped')) {
    return TransactionType.Swap;
  }
  if (summary.startsWith('Signed')) {
    return TransactionType.Sign;
  }
  if (summary.startsWith('Airdrop')) {
    return TransactionType.Airdrop;
  }
  if (summary.startsWith('Unknown')) {
    return TransactionType.Unknown
  }
  if (summary.startsWith('Revoked')) {
    return TransactionType.Revoked
  }
  return undefined;
  // throw Error('Unknown summary + ' + summary);
}
export { fetchAccountTransactionWithRetry };
