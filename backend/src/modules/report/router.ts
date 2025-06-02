import { Router } from 'express';
import {
  createReport,
  getReportById,
  ReportServiceReturn,
  getReports,
  updateReport
} from './service';
import { convertBigIntToNumber } from '~/utils/bigint';
import { ReportReturn } from './dao';

const router = Router();

router.post('/create-report', async (req, res) => {
  try {
    const reportDetail = req.body;
    // Check that reportDetail exists
    if (!reportDetail) {
      return res.status(400).json({ error: 'Missing reportDetail in request body' });
    }
    console.log('reportDetail', reportDetail);
    // Destructure the reportDetail fields
    const {
      userName,
      amount,
      transactionHash,
      description,
      timestamp,
      category,
      address,
      url,
      ip
    } = reportDetail;

    const ethTxRegex = /^0x[a-fA-F0-9]{64}$/;
    if (!ethTxRegex.test(transactionHash)) {
      return res
        .status(400)
        .json({ error: `Invalid transaction hash: ${transactionHash ?? 'Empty txn hash'}` });
    }

    // Validate description: must be a non-empty string
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Invalid or missing description' });
    }

    // Validate timestamp: must be a number
    if (typeof timestamp !== 'number') {
      return res.status(400).json({ error: 'Invalid or missing timestamp' });
    }

    // Validate category: must be a non-empty string
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ error: 'Invalid or missing category' });
    }

    const ethAddrRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddrRegex.test(address)) {
      return res.status(400).json({ error: `Invalid Ethereum address: ${address}` });
    }

    // Call the DAO method to create the report
    const report = await createReport(reportDetail, userName);
    console.log('Report Created: ', report);
    // Return the created report
    return res.json({ report_id: report.report.report_id });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});
router.get('/', async (req, res) => {
  try {
    const reports: ReportReturn[] = await getReports();
    if (!reports) {
      return res.status(404).json({ error: 'No reports found' });
    }
    // Return the reports
    const safeReports: NonNullable<ReportServiceReturn>[] = reports.map((report) =>
      convertBigIntToNumber(report)
    );
    const response = safeReports.map((report) => ({
      report_id: report.report_id,
      description: report.description,
      title: report.title,
      type: report.category,
      targetAddress: report?.address,
      graphTransactions: linkGraphTransactionToFrontendTransaction(
        report.transactions || [],
        report!.address!
      ),
      url: report.url,
      timestamp: report.timestamp,
      author: report.user?.name
    }));
    return res.json(response);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Call the DAO method to get the report by ID
    const report: ReportServiceReturn = await getReportById(Number(id));
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Return the report
    const safeReport: NonNullable<ReportServiceReturn> = convertBigIntToNumber(report);

    const response = {
      description: safeReport.description,
      title: safeReport.title,
      type: safeReport.category,
      targetAddress: safeReport?.address,
      graphTransactions: linkGraphTransactionToFrontendTransaction(
        safeReport.transactions || [],
        safeReport!.address!
      ),
      url: safeReport.url,
      author: safeReport.user?.name,
      timestamp: safeReport.timestamp,
      amount: {
        value: safeReport.amount,
        token: safeReport.token?.symbol || 'ETH'
      }
    };
    return res.json(response);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export type UpdateGraphTransaction = {
  chainId: string;
  date: number;
  from: {
    address: string;
    address_entity: string[];
    address_entity_logo: null;
    address_entity_label: string[];
    type: string[];
  };
  to: {
    address: string;
    address_entity: string[];
    address_entity_logo: null;
    address_entity_label: string[];
    type: string[];
  };
  summary: string;
  txnHash: string;
  type: string;
  value: {
    receive?: {
      value: number;
      symbol: string;
    }[];
    sent?: {
      value: number;
      symbol: string;
    }[];
  };
};

router.post('/:id', async (req, res) => {
  const { reportId, graphTransactions } = req.body;
  if (!reportId) {
    return res.status(400).json({ error: 'Missing reportId in request body' });
  }
  if (!graphTransactions) {
    return res.status(400).json({ error: 'Missing graphTransactions in request body' });
  }
  try {
    const result = await updateReport(reportId, graphTransactions as UpdateGraphTransaction[]);
    if (result) {
      return res.status(200).json({ message: 'Report updated successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to update report' });
    }
  } catch (error) {
    console.error('Error updating report:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

function linkGraphTransactionToFrontendTransaction(graphTransaction: any[], targetAddress: string) {
  const parsedtransactions = [];
  for (const transaction of graphTransaction) {
    const fromType =
      transaction.from.address.toLowerCase() === targetAddress.toLowerCase() ? 'TARGET' : '';
    const toType =
      transaction.to.address.toLowerCase() === targetAddress.toLowerCase() ? 'TARGET' : '';
    parsedtransactions.push({
      chainId: '0x1',
      summary: transaction.summary,
      type: transaction.type,
      txnHash: transaction.txnHash,
      from: {
        address: transaction.from.address,
        address_entity: transaction.from.address_entity,
        address_entity_logo: transaction.from.address_entity_logo,
        address_entity_label: transaction.from.address_entity_label,
        type: ['EOA_ACTIVE', fromType]
      },
      to: {
        address: transaction.to.address,
        address_entity: transaction.to.address_entity,
        address_entity_logo: transaction.to.address_entity_logo,
        address_entity_label: transaction.to.address_entity_label,
        type: ['EOA_ACTIVE', toType]
      },
      value: transaction.value,
      date: transaction.date
    });
  }
  return parsedtransactions;
}
export default router;
