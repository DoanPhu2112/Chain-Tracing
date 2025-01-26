import { NFTToken } from "~/modules/account/types/token";

export type NFTBalanceReturn = {
  size: number;
  toTimestamp: number,
  toBlock: number | undefined;
  tokens: NFTBalance[];
};
export type NFTBalance = {
  token: NFTToken;
  value: string | null;  // value at the buying time or the current time?
  amount: string | null;
};

export function NewNFTBalance(
  address: string,
  id: string,
  value: string | null,
  amount: string | null,
  name: string | null,
  description: string | undefined,
  animationUrl: string | undefined,
  image: string | undefined,
  possibleSpam: boolean | null,
  verified: boolean | undefined,
  logo: string | null,
  bannerImage: string | null
): NFTBalance {
  return {
    token: {
      address,
      id,
      name,
      description,
      animationUrl,
      image,
      possibleSpam,
      collection: {
        verified,
        logo,
        bannerImage,
      },
    },
    value,
    amount,
  };
}