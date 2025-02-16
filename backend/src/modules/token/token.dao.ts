import { TokenLabel } from '~/utils/generateData/tokenLabel';
import prisma from 'prisma/prismaClient';
type TokenProps = TokenLabel & {
  name_tag?: string;
}
export async function createToken(props: TokenProps) {
  const tokens = await prisma.token.create({
    data: {
        chain_id: props.chainId as string,
        address: props.address,
        label: props.label,
        name: props.name,
        symbol: props.symbol,
        website: props.website,
        image: props.image
    }
  });
  return tokens;
}

export async function getTokenByAddress(address: string): Promise<TokenProps | undefined> {
  // const token = await prisma.token.findFirst({
  //   where: {
  //     address: address
  //   }
  // });
  const token: TokenProps[] = await prisma.$queryRaw`SELECT t.chain_id, t.address, t.symbol, t.label, t.name, s.name_tag, t.website, t.image FROM token as t JOIN Smartcontract as s WHERE t.address=${address} AND t.address = s.address AND t.chain_id='0x1';`
  return token.length > 0 ? token[0] : undefined;
}