import { Entity } from '../types/entity';
import { NFTToken } from '../types/token';
export type NFTTransfer = {
  token: NFTToken;
  from: Entity;
  to: Entity;
  direction: string;
  amount: string;
  contractType: string;  // Either ERC1155 or ERC721
  blockTimestamp?: string;
  value: string;  //The value that was sent in the transaction (ETH/BNB/etc..)
};
