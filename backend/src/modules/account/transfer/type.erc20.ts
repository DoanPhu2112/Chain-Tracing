import { Entity } from "../types/entity";
import { ERC20Token } from "../types/token";

export type Erc20Transfer = {
  token: ERC20Token;
  from: Entity;
  to: Entity;
  direction: 'send' | 'receive';
  blockTimestamp?: string;
  valueFormatted: string;
};
