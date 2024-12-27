import { wait } from "~/utils/wait";
import { Transaction, TransactionAPIReturn } from "./account.transfer.type.return";
import Moralis from "moralis";
import { Erc20Transfer } from "./account.transfer.type.erc20";
import { NFTTransfer } from "./account.transfer.type.nft";
import { NativeTransfer } from "./account.transfer.type.native";
import { DEFAULT_ADDRESS, DEFAULT_MAX_TRANSACTION_REQUEST } from "~/constants/defaultvalue";
import { timestampToBlock } from "~/utils/time";

async function fetchAccountTransaction(
  address: string,
  chainID: string,
  startTimestamp: string,
  endTimestamp: string,
  nft_metadata: boolean = true,
  include_erc20_transactions_triggered: boolean = true,
  include_nft_transactions_triggered: boolean = true,
  include_native_transactions_triggered: boolean = true,

): Promise<TransactionAPIReturn> {
  let cursor: string | null = "";

  let startBlock = await timestampToBlock(startTimestamp, chainID);
  let toBlock = await timestampToBlock(endTimestamp, chainID);

  let result: TransactionAPIReturn = {
    size: 0,
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    startBlock: startBlock,
    endBlock: toBlock,
    transactions: [],
  }

  while (cursor != null) {
    await wait(1000);
    if (result.size >= DEFAULT_MAX_TRANSACTION_REQUEST) {
      break;
    }
    const params = {
      address: address,
      chain: chainID,
      from_date: startTimestamp,
      end_date: endTimestamp,
      include_internal_transactions: false,
      nft_metadata: nft_metadata,
      order: "DESC" as "ASC" | "DESC" | undefined,
      limit: DEFAULT_MAX_TRANSACTION_REQUEST,
      ...(cursor && { cursor })
    }
    const pageResult = await Moralis.EvmApi.wallets.getWalletHistory(params);
    cursor = pageResult.hasNext() ? pageResult.response.cursor : null;

    const walletTransactionHistoryReturn = pageResult.response.result;
    const transaction = walletTransactionHistoryReturn.map((transaction) => {

      let erc20Transactions: Erc20Transfer[] = [];
      let NFTTransactions: NFTTransfer[] = [];
      let nativeTransactions: NativeTransfer[] = [];

      let transactionReturn: Transaction;
      if (include_erc20_transactions_triggered) {
        if (transaction.erc20Transfers.length > 0) {
          // TODO: Handle transaction.direction
          transaction.erc20Transfers.forEach((erc20: any) => {
            erc20Transactions.push({
              token_entity: {
                name: erc20.tokenName,
                decimal: erc20.tokenDecimals,
                address: erc20.address.checksum,
                symbol: erc20.tokenSymbol,
                logo: erc20.tokenLogo,
                possibleSpam: erc20.possibleSpam,
                verifiedContract: erc20.verifiedContract
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
                  bannerImage: nft.collectionBannerImage || null,
                }
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

      transactionReturn = {
        summary: transaction.summary,
        transactionHash: transaction.blockHash,
        fromEntity: {
          address: transaction.fromAddress.checksum,
          address_entity: transaction.fromAddressEntity,
          address_entity_logo: transaction.fromAddressEntityLogo,
          address_entity_label: transaction.fromAddressLabel
        },
        toEntity: {
          address: transaction.toAddress?.checksum,
          address_entity: transaction.toAddressEntity,
          address_entity_logo: transaction.toAddressEntityLogo,
          address_entity_label: transaction.toAddressLabel
        },
        methodLabel: transaction.methodLabel,
        value: transaction.value,
        blockTimestamp: transaction.blockTimestamp,
        nftTransfers: NFTTransactions,
        erc20Transfers: erc20Transactions,
        nativeTransfers: nativeTransactions,
      }
      return transactionReturn;
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

export { fetchAccountTransaction }