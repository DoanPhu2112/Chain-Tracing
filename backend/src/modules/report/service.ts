import { getLabel } from '../account/label/dao';
import { getAccountFollowupTransaction } from '../account/transfer/service';
import { Transaction } from '../account/transfer/type.return';
import { createGraph, updateGraphById } from '../graph/dao';
import { updateGraphTransactions } from '../graph/service';
import { createGraphTx } from '../graph_tx/dao';
import { getTokenBySymbol } from '../token/token.dao';
import { createTransaction, getTransactionByHash } from '../transaction/dao';
import {
  createReport as daoCreateReport,
  getReportById as daoGetReportById,
  getReports as daoGetReports,
  ReportReturn
} from './dao';
import { UpdateGraphTransaction } from './router';

type ParsedReportReturn = ReportReturn & {
  transactions: {
    chainId: string;
    txnHash: string;
    type: string;
    summary: string;
    status: string;
    date: bigint;
    value: {
      sent: { value: number; symbol: string }[] | [];
      receive: { value: number; symbol: string }[] | [];
    };
    from: {
      address: string;
      address_entity: string[] | null;
      address_entity_logo: null;
      address_entity_label: string[] | null;
      type: string[];
    };
    to: {
      address: string;
      address_entity: string[] | null;
      address_entity_logo: null;
      address_entity_label: string[] | null;
      type: string[];
    };
  }[];
};

type ReportDetail = {
  title: string;
  amount: {
    value: number;
    token: string;
  }[];
  transactionHash: string;
  description: string;
  timestamp: number;
  category: string;
  address: string;
  url: string;
  ip: string;
};

export async function createReport(reportDetail: ReportDetail, userName: string) {
  const token = await getTokenBySymbol(reportDetail.amount[0].token);
  const transactions = await getAccountFollowupTransaction(
    reportDetail.address,
    '0x1',
    reportDetail.transactionHash,
    undefined,
    20
  );
  const graph = await createGraph({
    description: reportDetail.description,
    created_at: new Date(),
    updated_at: new Date()
  });
  let timestamp = 0;
  for (const [index, transaction] of transactions.transactions.entries()) {
    const tokenSymbol = reportDetail.amount[0].token;
    const token = await getTokenBySymbol(tokenSymbol);
    let tx = await getTransactionByHash(transaction.txnHash);
    if (!tx) {
      tx = await createTransaction(transaction, token!.id!);
    }

    if (index === 0) {
      timestamp = Number(transaction.date);
    }
    await createGraphTx(graph.graph_id, tx.transaction_id, index);
  }

  const report = await daoCreateReport(
    {
      title: reportDetail.title,
      amount: Number(reportDetail.amount[0].value),
      transaction_hash: reportDetail.transactionHash,
      timestamp: reportDetail.timestamp || timestamp,
      category: reportDetail.category,
      address: reportDetail.address,
      url: reportDetail.url,
      ip: reportDetail.ip,
      description: reportDetail.description
    },
    userName,
    graph.graph_id,
    token?.id
  );
  return { report: report, transactions: transactions.transactions };
}

export type ReportServiceReturn = Awaited<ReturnType<typeof getReportById>>;

export async function getReportById(id: number) {
  const report: ReportReturn = await daoGetReportById(id);
  const transactions: ParsedReportReturn['transactions'] = [];
  for (const transaction of report?.graph?.graphTransactions || []) {
    let value: {
      sent: { value: number; symbol: string }[];
      receive: { value: number; symbol: string }[];
    } = { sent: [], receive: [] };
    if (['send', 'sign', 'approve'].includes(transaction.transaction.type)) {
      value.sent.push({
        value: transaction.transaction.amount,
        symbol: transaction.transaction.token?.symbol || 'ETH'
      });
    }
    if (['receive', 'airdrop'].includes(transaction.transaction.type)) {
      value.receive.push({
        value: transaction.transaction.amount,
        symbol: transaction.transaction.token?.symbol || 'ETH'
      });
    }
    if (['swap'].includes(transaction.transaction.type)) {
      const summary = transaction.transaction.summary;
      const [fromAmount, fromToken] = summary.split(' ').slice(1, 3);
      const [toAmount, toToken] = summary.split(' ').slice(4, 6);

      value.sent.push({
        value: Number(fromAmount.replaceAll(',', '')) || 1,
        symbol: fromToken || 'ETH'
      });
      value.receive.push({
        value: Number(toAmount.replaceAll(',', '')) || 2,
        symbol: toToken || 'ETH'
      });
    }

    const fromAddress = await getLabel(transaction.transaction.from_address);
    const toAddress = await getLabel(transaction.transaction.to_address);

    //TODO: add address logic
    transactions.push({
      chainId: '0x1',
      txnHash: transaction.transaction.hash,
      type: transaction.transaction.type,
      summary: transaction.transaction.summary,
      status: 'Confirmed',
      date: transaction.transaction.date,
      from: {
        address: transaction.transaction.from_address,
        address_entity: fromAddress,
        address_entity_logo: null,
        address_entity_label: fromAddress,
        type: ['EOA_ACTIVE']
      },
      to: {
        address: transaction.transaction.to_address,
        address_entity: toAddress,
        address_entity_logo: null,
        address_entity_label: toAddress,
        type: ['EOA_ACTIVE']
      },
      value: value
    });
  }
  return { ...report, transactions };
}

export async function getReports() {
  const reports: ReportReturn[] | null = await daoGetReports();
  if (!reports) {
    return [];
  }
  let returnReports: ParsedReportReturn[] = [];

  for (const report of reports) {
    const transactions: ParsedReportReturn['transactions'] = [];
    for (const transaction of report?.graph?.graphTransactions || []) {
      let value: {
        sent: { value: number; symbol: string }[];
        receive: { value: number; symbol: string }[];
      } = { sent: [], receive: [] };
      if (['send', 'sign', 'approve'].includes(transaction.transaction.type)) {
        value.sent.push({
          value: transaction.transaction.amount,
          symbol: transaction.transaction.token?.symbol || 'ETH'
        });
      }
      if (['receive', 'airdrop'].includes(transaction.transaction.type)) {
        value.receive.push({
          value: transaction.transaction.amount,
          symbol: transaction.transaction.token?.symbol || 'ETH'
        });
      }
      const fromAddress = await getLabel(transaction.transaction.from_address);
      const toAddress = await getLabel(transaction.transaction.to_address);
      transactions.push({
        chainId: '0x1',
        txnHash: transaction.transaction.hash,
        type: transaction.transaction.type as string,
        summary: transaction.transaction.summary,
        status: 'Confirmed',
        date: transaction.transaction.date,
        from: {
          address: transaction.transaction.from_address,
          address_entity: fromAddress,
          address_entity_logo: null,
          address_entity_label: fromAddress,
          type: ['EOA_ACTIVE']
        },
        to: {
          address: transaction.transaction.to_address,
          address_entity: toAddress,
          address_entity_logo: null,
          address_entity_label: toAddress,
          type: ['EOA_ACTIVE']
        },
        value
      });
    }
    if (report) {
      returnReports.push({
        ...report,
        token: report.token ?? null,
        user: report.user ?? { id: 0, name: '', password: '' },
        transactions
      });
    }
  }
  return returnReports;
}

export async function updateReport(
  id: number,
  transactions: UpdateGraphTransaction[]
): Promise<boolean> {
  const report = await daoGetReportById(id);
  if (!report) {
    return false;
  }
  if (!report.graph) {
    throw new Error('Graph not found for this report');
  }
  const updatedGraph = await updateGraphTransactions(report.graph.graph_id, transactions);

  return updatedGraph;
}
