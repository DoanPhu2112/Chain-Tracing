import { ERC20Balance } from '../modules/account/balance/account.balance.type';

export type Balance = {
  size: number;
  tokens: ERC20Balance[];
};
