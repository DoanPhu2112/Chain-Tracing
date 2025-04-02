import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const tornadoWithdrawPath = path.join(__dirname, './tornadoWithdraw.csv');
const tornadoDepositPath = path.join(__dirname, './tornadoDeposit.csv');
const prisma = new PrismaClient();

async function parseCSV() {
  const arr: any = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(tornadoDepositPath)
      .pipe(csv())
      .on('data', (data) => {
        arr.push((data));
      })
      .on('end', () => {
        resolve(arr);
      })
      .on('error', reject);
  });
}

async function main() {
    const data: any = await parseCSV();
    // const result = data.map((d: any) => ({
    //   "hash": d.hash,
    //   "from_address": d.from,
    //   "to_address": d.to,
    //   "contract_address": d.contractAddress,
    //   "from_proxy": d.fromProxy === "True" ? true : false,
    //   "recipient_address": d.recipient_address,
    //   "timestamp": BigInt(new Date(d.timeStamp).getTime()),
    //   "value": BigInt(d.value),
    // }))
    // await prisma.tornadoWithdrawTransaction.createMany({
    //   data: result
    // })


    const result = data.map((d: any) => ({
      "hash": d.hash,
      "from_address": d.from,
      "to_address": d.to,
      "contract_address": d.contractAddress,
      "timestamp": BigInt(new Date(d.timeStamp).getTime()),
    "value": d.value.toString(),
    }))
    await prisma.tornadoDepositTransaction.createMany({
      data: result
    })
}
main()