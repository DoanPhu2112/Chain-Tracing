import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createGraphTx(graph_id: number, transaction_id: number, sequence_number: number) {
  const tx = await prisma.graph_Transaction.create({
    data: {
      graph_id: graph_id,
      transaction_id: transaction_id,
      sequence_number: sequence_number,
    }
  });

  return tx;
}
