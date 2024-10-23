export type AssetPortfolio = {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string;
  balance_formatted: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_value: string;
  usd_value_24hr_usd_change: string;
  native_token: boolean;
  porfolio_percentage: number;
  percentage_relative_to_total_supply: number;
};

export function NewAssetPortfolio(
  token_address: string,
  symbol: string,
  name: string,
  logo: string | undefined,
  balance_formatted: string,
  possible_spam: boolean,
  verified_contract: boolean,
  usd_value: string,
  usd_value_24hr_usd_change: string,
  native_token: boolean,
  porfolio_percentage: number,
  percentage_relative_to_total_supply: number,
): AssetPortfolio {
  return {
    token_address,
    symbol,
    name,
    logo,
    balance_formatted,
    possible_spam,
    verified_contract,
    usd_value,
    usd_value_24hr_usd_change,
    native_token,
    porfolio_percentage,
    percentage_relative_to_total_supply,
  };
}
