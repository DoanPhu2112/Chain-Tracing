import { DEFAULT_CONTRACT_VERIFICATION, DEFAULT_INVALID_PERCENTAGE, DEFAULT_INVALID_VALUE, DEFAULT_LOGO_PATH, DEFAULT_TOKEN_ADDRESS } from "~/utils/const"
export type MORALIS_PAGINATION_RETURN = {
  cursor: string | null,
  page: number,
  page_size: number,
  result: MORALIS_ASSET_PORTFOLIO_RETURN,
}

export type MORALIS_ASSET_PORTFOLIO_RETURN = {
  tokenAddress: string,
  symbol: string,
  name: string,
  logo: string 
  balance_formatted: string,
  possible_spam: boolean,
  verified_contract: boolean,
  usd_price_24hr_percent_change: number,
  usd_price_24hr_usd_change: number,
  usd_value: number,
  native_token: boolean,
  porfolio_percentage: string,
  percentage_relative_to_total_supply: string
}

export type ASSET_PORTFOLIO = {
  tokenAddress: string,
  symbol: string,
  name: string,
  logo?: string 

  //The formatted string representation of the token balance
  balance_formatted: string,

  possible_spam: boolean,
  verified_contract: boolean,

  // //The 24-hour percentage change in the token's USD price
  // usd_price_24hr_percent_change: string,

  // //The USD amount change in the token's price over the last 24 hours
  // usd_price_24hr_usd_change: string,

  // The current USD value of the token balance
  usd_value: string,

  //The USD value change of the token balance over the last 24 hours
  usd_value_24hr_usd_change: string,
  
  native_token: boolean,

  //The percentage of the token's value relative to the total portfolio value (so sanh voi )
  porfolio_percentage: number,

  //The percentage of the token's value relative to the total portfolio value
  percentage_relative_to_total_supply: number
}
export function NewAssetPortfolio(
  tokenAddress: string = DEFAULT_TOKEN_ADDRESS,
  symbol: string,
  name: string,
  logo: string | undefined = DEFAULT_LOGO_PATH,
  balance_formatted: string,
  possible_spam: boolean,
  verified_contract: boolean = DEFAULT_CONTRACT_VERIFICATION,
  usd_value: string = DEFAULT_INVALID_VALUE,
  usd_value_24hr_usd_change: string = DEFAULT_INVALID_VALUE,
  native_token: boolean,
  porfolio_percentage: number,
  percentage_relative_to_total_supply: number = DEFAULT_INVALID_PERCENTAGE,
): ASSET_PORTFOLIO {
  return {
    tokenAddress,
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