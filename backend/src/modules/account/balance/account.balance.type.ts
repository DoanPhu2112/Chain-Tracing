export type ERC20BalanceReturn = {
  size: number;
  tokens: ERC20Balance[];
};

export type ERC20Balance = {
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
export type NFTBalanceReturn = {
  size: number;
  tokens: NFTBalance[];
};
export type NFTBalance = {
  address: string;
  id: string;
  name?: string;
  description?: string | null;
  animation_url?: string | null;
  image?: string | null;  // e.g. https://dobutsu.xyz/api/thebuns/revealed/9455.png
  value?: string;  // value at the buying time or the current time?
  possible_spam?: boolean;
  verified_collection?: boolean;
  collection_logo?: string | null;
  collection_banner_image?: string | null;
  amount?: string
};

export function NewERC20Balance(
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
): ERC20Balance {
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


export function NewNFTBalance(
  address: string,
  id: string,
  value: string,
  name?: string,
  description?: string | null,
  animation_url?: string | null,
  image?: string | null,
  possible_spam?: boolean,
  verified_collection?: boolean,
  collection_logo?: string | null,
  collection_banner_image?: string | null,
  amount?: string
): NFTBalance {
  return {
    address,
    id,
    name,
    description,
    animation_url,
    image,
    value,
    possible_spam,
    verified_collection,
    collection_logo,
    collection_banner_image,
    amount
  };
}
