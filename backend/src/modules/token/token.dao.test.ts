import { getABI, isERC721 } from "./token.dao";

async function main() {
    const address = await isERC721("0xe41d2489571d322189246dafa5ebde1f4699f498");
    console.log(address)    
}

main()