import path from 'path';
import fs from 'fs';
import { get_contract_functions } from '~/utils/accountclassify';
import csv from 'csv-parser';

import { DEFAULT_CHAIN_ID } from '~/constants/defaultvalue';
import { wait } from '../wait';
import { createToken } from '~/modules/token/token.dao';
export type TokenLabel = {
    address: string,
    chain_id: string | number,
    label: string,
    name: string;
    symbol: string;
    website: string;
    image: string;
}
const accountPath = path.join(__dirname, './tokens.csv');

const mockTokenLabel: TokenLabel = {
    address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
    chain_id: 1,
    label: "0x-protocol",
    name: "ZRX",
    symbol: "ZRX",
    website: "https://0x.org",
    image: "https://assets.coingecko.com/coins/images/863/large/0x.png?1547034658"
}
enum TokenType {
    ERC20=  "ERC20",
    ERC721= "ERC721",
    ERC1155= "ERC1155",
    UNKNOWN= "UNKNOWN"
}
let count = 0;
const RETRY_DELAY = 1000; // 1 second

export async function getABI(address: string): Promise<object[]> {
    const source_code = await get_contract_functions(address);
    return JSON.parse(source_code.result[0].ABI);

}
function extractTokenLabel(accountLabel: TokenLabel) {
  const { address, chain_id, label, name, symbol, website, image } = accountLabel;
  return {
    address,
    chain_id: chain_id === 1 ? '0x1' : DEFAULT_CHAIN_ID,
    label,
    name: name,
    symbol,
    website,
    image
  };
}
async function parseCSV(): Promise<TokenLabel[]> {
  const arr: TokenLabel[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(accountPath)
      .pipe(csv())
      .on('data', (data: TokenLabel) => {
        arr.push(extractTokenLabel(data));
      })
      .on('end', () => {
        resolve(arr);
      })
      .on('error', reject);
  });
}

async function main() {
  let temp = count;
  try {

  const arr: TokenLabel[] = await parseCSV();
    for (let i = temp; i <  arr.length; i++) {
      console.log( "count", count)
      console.log("arr[i]: ", arr[i])

      count += 1;
      await writeToken(arr[i]);
    }
  } catch (e) {

    console.log(e);
    console.log("count" , count);
    temp = count;

    await wait(RETRY_DELAY);
    await main();
  }
//   await writeToken(mockTokenLabel)
}

async function writeToken(accountLabel: TokenLabel) {
    await createToken(accountLabel)
}
main();