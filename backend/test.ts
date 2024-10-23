const { ethers } = require('ethers');
const ALCHEMY_URL = 'https://eth-mainnet.alchemyapi.io/v2/qwjRfs2eH5FC28dCv61GfNaq49rsQ8np';
async function getContractABI(address: string) {
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);
  const abi = await provider.getCode(address);
  console.log(provider);
}

getContractABI('0xD1C24f50d05946B3FABeFBAe3cd0A7e9938C63F2');