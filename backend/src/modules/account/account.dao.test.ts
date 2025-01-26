import { createContract, getContractByHash, getEOAByHash } from "./account.dao";

async function main () {
    // const result =  await getEOAByHash('0x');
    // console.log(result);
    const result = await createContract({
        address: '0x',
        sourceCode: '0x',
        isVerified: true,
        type: '0x',
        chainHash: '0x',
        nameTag: '0x',
        logo: '0x',
        labelSource: 'ethereum'
    })

}
main()