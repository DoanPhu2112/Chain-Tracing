import { Entity } from "../types/entity";
import { ERC20Token } from "../types/token";

export type Erc20Transfer = {
  token_entity: ERC20Token;
  from_entity: Entity;
  to_entity: Entity;
  direction: 'send' | 'receive';
  block_timestamp?: string;
  value_formatted: string;
};
