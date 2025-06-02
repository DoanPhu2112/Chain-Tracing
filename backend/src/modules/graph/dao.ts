import { Prisma, PrismaClient, Transaction } from '@prisma/client';
import { getReportById } from '../report/dao';

const prisma = new PrismaClient();

export async function createGraph(graph: Prisma.GraphCreateInput) {
  const result = await prisma.graph.create({
    data: {
      description: graph.description,
      created_at: graph.created_at || new Date(),
      updated_at: graph.updated_at || new Date()
    }
  });
  return result;
}

export async function updateGraphById(
  graphId: number,
  transactions: Omit<Transaction, 'transaction_id'>[]
) {
  // Step 1: Fetch existing transaction hashes from DB
  const existingTxns = await prisma.transaction.findMany({
    where: {
      hash: {
        in: transactions.map((txn) => txn.hash)
      }
    },
    select: {
      hash: true
    }
  });

  const existingHashes = new Set(existingTxns.map((txn) => txn.hash));

  // Step 2: Filter transactions that do NOT exist
  const newTransactions = transactions.filter((txn) => !existingHashes.has(txn.hash));

  await prisma.transaction.createMany({
    data: newTransactions.map((txn) => ({
      hash: txn.hash,
      block_hash: txn.block_hash,
      from_address: txn.from_address,
      to_address: txn.to_address,
      amount: txn.amount,
      token_id: txn.token_id,
      chain_id: txn.chain_id,
      type: txn.type,
      summary: txn.summary,
      date: BigInt(txn.date)
    })),
    skipDuplicates: true
  });

  const allTransactions = await prisma.transaction.findMany({
    where: {
      hash: {
        in: transactions.map((txn) => txn.hash)
      }
    },
    select: {
      transaction_id: true,
      hash: true
    }
  });

  const graphTransactionData = allTransactions.map((txn, index) => ({
    graph_id: graphId,
    transaction_id: txn.transaction_id,
    sequence_number: BigInt(index + 1)
  }));

  // Step 5: Create Graph_Transaction links (skip if already exists)
  await prisma.graph_Transaction.createMany({
    data: graphTransactionData,
    skipDuplicates: true
  });

  const updatedGraph = await prisma.graph.findUnique({
    where: { graph_id: graphId },
    include: { graphTransactions: true }
  });

  return !!updatedGraph;
}
