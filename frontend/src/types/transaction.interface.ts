export type Transaction = {
  chainId: string,
  txnHash: string
  from: {
    address: string;
    address_entity?: string;
    address_entity_logo?: string;
    address_entity_label?: string;
    type: string;
  };
  to: {
    address: string;
    address_entity?: string;
    address_entity_logo?: string;
    address_entity_label?: string;
    type: string;
  };
  tokenName: string,
  type: string
  summary: string
  status: string
  date: string
  amount: string
  asset: string
  added?: boolean // New field
}

export type BackendTransaction = {
  transactionHash: string;
  fromEntity: {
    address?: string;
    address_entity?: string;
    address_entity_logo?: string;
    address_entity_label?: string;
  };
  toEntity: {
    address?: string;
    address_entity?: string;
    address_entity_logo?: string;
    address_entity_label?: string;
  };
  summary: string;
  methodLabel?: string;

  value: string;

  blockTimestamp: string,

  nftTransfers: NFTTransfer[];

  erc20Transfers: Erc20Transfer[];

  nativeTransfers: NativeTransfer[];
};
export type Erc20Transfer = {
  token_entity: ERC20Token;
  from_entity: Entity;
  to_entity: Entity;
  direction: 'send' | 'receive';
  block_timestamp?: string;
  value_formatted: string;
};
export type ERC20Token = {
  name: string;
  decimal: number;
  address: string;
  symbol: string;
  logo: string | null;
  possibleSpam: boolean | null,
  verifiedContract: boolean | null;
}
export type NativeTransfer = {
  from_entity: Entity,
  to_entity: Entity,
  token: NativeToken
  value_formatted: string,
  block_timestamp?: string,
  direction?: string,

}
export type NativeToken = {
  symbol?: string,
  logo?: string,
}
export type NFTTransfer = {
  token: NFTToken;
  from_entity: Entity;
  to_entity: Entity;
  direction: string;
  amount: string;
  contract_type: string;  // Either ERC1155 or ERC721
  block_timestamp?: string;
  value: string;  //The value that was sent in the transaction (ETH/BNB/etc..)
};
export type Entity = {
  address?: string;
  address_entity?: string;
  address_entity_logo?: string;
  address_entity_label?: string;
};
export type NFTToken = {
  address: string;
  id: string;
  name: string | null;
  description?: string | null;
  animationUrl?: string | null;
  image?: string | null;  // e.g. https://dobutsu.xyz/api/thebuns/revealed/9455.png
  possibleSpam?: boolean | null;
  collection: NFTCollection;
};
export type NFTCollection = {
  verified?: boolean | null;
  logo: string | null;
  bannerImage: string | null;
}
export type TransactionsList = Transaction[]
