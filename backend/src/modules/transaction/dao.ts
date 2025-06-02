import { Prisma, PrismaClient } from '@prisma/client';
import { Transaction } from '../account/transfer/type.return';
import { ethers } from 'ethers';
import { parseTransactionSummary } from './parser';
const prisma = new PrismaClient();

export async function createTransaction(transaction: Transaction, token_id: number) {
  let amount = 0;
  if (transaction.value.receive.length > 0) {
    amount = Number(transaction.value.receive[0].value);
  } else if (transaction.value.sent.length > 0) {
    amount = Number(transaction.value.sent[0].value);
  }
  const tx = await prisma.transaction.create({
    data: {
      hash: transaction.txnHash,
      date: BigInt(transaction.date.getTime()),
      block_hash: '',
      from_address: transaction.from.address || '0x',
      to_address: transaction.to.address || '0x',
      chain_id: 1,
      token_id,
      amount: amount,
      type: parseTransactionSummary(transaction.summary) || 'send',
      summary: transaction.summary
    }
  });
  return tx;
}

export async function getTransactionByHash(hash: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      hash: hash
    }
  });
  if (!transaction) {
    return null;
  }
  return transaction;
}
