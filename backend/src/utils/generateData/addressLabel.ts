import { PrismaClient } from '@prisma/client';
import { is_eoa, get_contract_functions } from '../accountclassify';
import { createEOA, createContract } from '~/modules/account/account.dao';
import { DEFAULT_CHAIN_ID, DEFAULT_SCORE } from '~/constants/defaultvalue';
import Parse from 'parse/node';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { error } from 'console';
import { wait } from '../wait';

const prisma = new PrismaClient();
type AccountLabel = {
  address: string;
  chainId: string;
  label: string;
  nameTag: string;
};
function extractAccountLabel(accountLabel: AccountLabel) {
  const { address, chainId, label, nameTag } = accountLabel;
  return {
    address,
    chainId: chainId === '1' ? '0x1' : DEFAULT_CHAIN_ID,
    label,
    nameTag
  };
}

const accountPath = path.join(__dirname, './accounts.csv');
console.log(accountPath);
async function parseCSV(): Promise<AccountLabel[]> {
  const arr: AccountLabel[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(accountPath)
      .pipe(csv())
      .on('data', (data: AccountLabel) => {
        arr.push(extractAccountLabel(data));
      })
      .on('end', () => {
        resolve(arr);
      })
      .on('error', reject);
  });
}
let count = 0;
const RETRY_DELAY = 1000; // 1 second

async function main() {
  let temp = count;
  try {

  const arr: AccountLabel[] = await parseCSV();
    for (let i = temp; i <  arr.length; i++) {
      console.log( "count", count)
      console.log("arr[i]: ", arr[i])

      count += 1;
      await writeAddress(arr[i]);
    }
  } catch (e) {

    console.log(e);
    console.log("count" , count);
    temp = count;

    await wait(RETRY_DELAY);
    await main();
  }
  // await writeChain()
}
// async function writeChain() {
//   await prisma.chain.create({
//     data: {
//       hash: "0x1",
//       name: "ethereum",
//     }
//   })
// }
async function writeAddress(accountLabel: AccountLabel) {
  const { address, chainId, label, nameTag } = accountLabel;
  const isEoaAccount = await is_eoa(address);
  console.log('address', isEoaAccount);
  // if (isEoaAccount) {
  //   await createEOA({
  //     nameTag: nameTag ? nameTag : label,
  //     chainHash: chainId,
  //     logo: '',
  //     hash: address,
  //     score: DEFAULT_SCORE,
  //     nativeBalance: 0,
  //     label: label
  //   });
  // }
  // if (!isEoaAccount) {
  //   const sourceCode = await get_contract_functions(address);
  //   const verified =
  //     sourceCode.result[0].ABI === 'Contract source code not verified' ? false : true;

  //   await createContract({
  //     address: address,
  //     chainHash: chainId,
  //     isVerified: verified,
  //     logo: '',
  //     nameTag: nameTag ? nameTag : label,
  //     sourceCode: sourceCode.result[0].SourceCode,
  //     type: 'ERC20',
  //     abi: sourceCode.result[0].ABI
  //   });
  // }
}
main();
