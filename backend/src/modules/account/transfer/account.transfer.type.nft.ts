import { Entity } from '../types/entity';
import { NFTToken } from '../types/token';
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
