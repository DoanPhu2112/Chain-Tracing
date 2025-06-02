import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function getDepositTornadoTxnsByAddress(address: string) {
  const depositTxns = await prisma.tornadoDepositTransaction.findMany({
    where: {
      from_address: address
    }
  });
  const parsed = depositTxns.map((txn) => ({
    ...txn,
    timestamp: txn.timestamp.toString() // 👈 convert if timestamp is BigInt too
  }));
  return parsed;
}

export async function getWithdrawTornadoTxnsByAddress(address: string) {
  const withdrawTxns = await prisma.tornadoWithdrawTransaction.findMany({
    where: {
      recipient_address: address
    }
  });
  const parsed = withdrawTxns.map((txn) => ({
    ...txn,
    timestamp: txn.timestamp.toString() // 👈 convert if timestamp is BigInt too
  }));
  return parsed;
}
