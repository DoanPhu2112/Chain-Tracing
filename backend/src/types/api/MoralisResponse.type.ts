import { EvmWalletHistoryErc20Transfer } from 'moralis/common-evm-utils'
export type MoralisTransactionReturn = {
  transactionHash: string;
  from_entity: MoralisEntity;
  to_entity: MoralisEntity;

  method_label?: string;

  value: string; // wei comes with transaction

  block_timestamp: string,

  nft_transfers: MoralisNFTTransferReturn[];

  erc20_transfers: MoralisErc20TransferReturn[];

  native_transfers: MoralisNativeTransferReturn[];
};
export type MoralisNativeTransferReturn = {
  from_entity: MoralisEntity,
  to_entity: MoralisEntity,
  token: MoralisNativeToken
  value_formatted: string,
  block_timestamp?: string,
  direction?: string,

}
export type MoralisErc20TransferReturn = {
  token_entity: MoralisERC20Token;
  from_entity: MoralisEntity;
  to_entity: MoralisEntity;
  direction: 'send' | 'receive';
  block_timestamp?: string;
  value_formatted: string;
};

export type MoralisNFTTransferReturn = {
  token_entity: MoralisNFTToken;
  from_entity: MoralisEntity;
  to_entity: MoralisEntity;
  direction: string;

  amount: string;

  // Either ERC1155 or ERC721
  contract_type: string;
  block_timestamp?: string;

  //The value that was sent in the transaction (ETH/BNB/etc..)
  value: string;
};


export type MoralisEntity = {
  address?: string;
  address_entity?: string;
  address_entity_logo?: string;
  address_entity_label?: string;
};
export type MoralisNativeToken = {
  symbol?: string,
  logo?: string,
}
export type MoralisERC20Token = {
  name: string;
  decimal: number;
  address: string;
  symbol: string;
  logo?: string;
  possible_spam?: boolean,
  verified_contract?: boolean;
};

export type MoralisNFTToken = {
  address: string;
  id: string;
  name?: string;

  description?: string | null;
  animation_url?: string | null;

  // e.g. https://dobutsu.xyz/api/thebuns/revealed/9455.png
  image?: string | null;

  // value at the buying time or the current time?
  value: string;
  possible_spam?: boolean;
  verified_collection?: boolean;
  collection_logo?: string | null;
  collection_banner_image?: string | null;
};

export type MoralisEvmWalletHistoryErc20Transfer = {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: number;
  fromAddressEntity: string;
  fromAddressEntityLogo: string;
  fromAddress: EvmAddress;
  fromAddressLabel: string;
  toAddressEntity: string | undefined;
  toAddressEntityLogo: string | undefined;
  toAddress: EvmAddress;
  toAddressLabel: string;
  address: EvmAddress;
  logIndex: number;
  value: string;
  possibleSpam: boolean;
  verifiedContract: boolean;
  blockTimestamp: string,
  securityScore?: number;
  direction: "receive" | "send";
  valueFormatted: string;
}
export type EvmAddress = {
  checksum: string;
}

// export interface MoralisEvmWalletHistoryErc20Transfer extends EvmWalletHistoryErc20Transfer {
//   direction: "receive" | "send"; // Adjust based on actual values
// }
