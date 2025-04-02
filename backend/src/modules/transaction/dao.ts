import { Prisma, PrismaClient } from '@prisma/client';
import { Transaction } from '../account/transfer/type.return';
const prisma = new PrismaClient();

export async function createTransaction(transaction: Transaction, token_id: number) {

  const tx = await prisma.transaction.create({
    data: {
      hash: transaction.txnHash,
      block_hash: "",
      from_address: transaction.from.address || "0x",
      to_address: transaction.to.address || "0x",
      chain_id: 1,
      token_id,
      amount: Number(transaction.value.receive[0].value) || Number(transaction.value.sent[0].value) || 0,
      summary: transaction.summary,
    }
  });
  return tx;
}
