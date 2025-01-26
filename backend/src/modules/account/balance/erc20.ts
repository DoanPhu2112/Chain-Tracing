import { ERC20Portfolio, ERC20Token, ERC20USD } from "~/modules/account/types/token";

export type ERC20BalanceReturn = {
  size: number;
  toTimestamp: number,
  toBlock: number | undefined;
  tokens: ERC20Balance[];
};

export type ERC20Balance = {
  native_token: boolean;
  balance: string;
  token: ERC20Token;
  usd: ERC20USD;
  portfolio: ERC20Portfolio
};

// Factory function to create a new ERC20Balance instance
export function NewERC20Balance(
  tokenAddress: string,
  symbol: string,
  name: string,
  logo: string | null,
  balance_formatted: string,
  possible_spam: boolean,
  verified_contract: boolean,
  usd_price: string,
  usd_price_24hr_usd_change: string,
  usd_price_24hr_percent_change: string,
  usd_value: string | null,
  usd_value_24hr_usd_change: string | null,
  native_token: boolean,
  portfolio_percentage: number,
  percentage_relative_to_total_supply: number | null
): ERC20Balance {
  return {
    native_token,
    balance: balance_formatted,
    token: {
      name,
      decimal: 18,
      address: tokenAddress,
      symbol,
      logo,
      possibleSpam: possible_spam,
      verifiedContract: verified_contract
    },
    usd: {
      price: usd_price,
      price24hrUsdChange: usd_price_24hr_usd_change,
      price24hrPercentChange: usd_price_24hr_percent_change,
      value: usd_value,
      value24hrUsdChange: usd_value_24hr_usd_change
    },
    portfolio: {
      percentage: portfolio_percentage,
      percentageRelativeToTotalSupply: percentage_relative_to_total_supply
    },
  }
}