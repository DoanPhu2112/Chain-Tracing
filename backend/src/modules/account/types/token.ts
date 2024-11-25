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
export type NativeToken = {
  symbol?: string,
  logo?: string,
}
export type ERC20Token = {
  name: string;
  decimal: number;
  address: string;
  symbol: string;
  logo: string | null;
  possibleSpam: boolean | null,
  verifiedContract: boolean | null;
}

export type NFTCollection = {
  verified?: boolean | null;
  logo: string | null;
  bannerImage: string | null;
}
export type ERC20USD = {
  price: string;
  price24hrUsdChange: string | null,
  price24hrPercentChange: string | null,
  value: string | null;
  value24hrUsdChange: string | null;
}

export type ERC20Portfolio = {
  percentage: number;
  percentageRelativeToTotalSupply: number | null;
}