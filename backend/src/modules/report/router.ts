import { Router } from 'express';
import { getAccountFollowupTransaction } from '../account/transfer/service';
import { createReport, getReportById } from './service';
import { convertBigIntToNumber } from '~/utils/bigint';

const router = Router();

router.post('/create-report', async (req, res) => {
  console.log("Called here Create Report Back end")
  try {
    const reportDetail = req.body;
    console.log("Report Detail: ", reportDetail)
    // Check that reportDetail exists
    if (!reportDetail) {
      return res.status(400).json({ error: 'Missing reportDetail in request body' });
    }

    // Destructure the reportDetail fields
    const { 
    userId,
      amount, 
      transactionHash, 
      description, 
      timestamp, 
      category, 
      address, 
      url, 
      ip 
    } = reportDetail;

    // Validate amount: must be a non-empty array
    if (!amount || typeof amount !== 'object' || !Array.isArray(amount) || amount.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing amount' });
    }

    // Validate transactionHash: must be a non-empty array with valid Ethereum transaction hashes
    if (!Array.isArray(transactionHash) || transactionHash.length === 0) {
      return res.status(400).json({ error: 'Transaction hash field must be a non-empty array' });
    }
    const ethTxRegex = /^0x[a-fA-F0-9]{64}$/;
    for (const hash of transactionHash) {
      if (!ethTxRegex.test(hash)) {
        return res.status(400).json({ error: `Invalid transaction hash: ${hash}` });
      }
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

    // Validate address: must be a non-empty array with valid Ethereum addresses
    if (!Array.isArray(address) || address.length === 0) {
      return res.status(400).json({ error: 'Address field must be a non-empty array' });
    }
    const ethAddrRegex = /^0x[a-fA-F0-9]{40}$/;
    for (const addr of address) {
      if (!ethAddrRegex.test(addr)) {
        return res.status(400).json({ error: `Invalid Ethereum address: ${addr}` });
      }
    }

    // Call the DAO method to create the report
    const report = await createReport(reportDetail, userId);
    // Return the created report
    return res.json({report_id: report.report.report_id, transactions: report.transactions});
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Called here Get Report Back end")
  try {
    // Call the DAO method to get the report by ID
    const report = await getReportById(Number(id));
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Return the report
    const safeReport = convertBigIntToNumber(report);
    const response = {
      description: safeReport.description,
      title: safeReport.graph?.title || "Fraud Case Report",
      type: safeReport.category,
      targetAddress: JSON.parse(safeReport?.address || "[\"0x\"]")[0],
      graphTransactions: linkGraphTransactionToFrontendTransaction(safeReport.graph?.graphTransactions || []),
      url: safeReport.url,
      author: safeReport.user.name,
      timestamp: safeReport.timestamp,
      amount: JSON.parse(safeReport.amount || "[\"0x\"]")
    }
    return res.json(response);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: (error as Error).message });
  }
})

function linkGraphTransactionToFrontendTransaction (graphTransaction: any[]) {
  const parsedtransactions = []
  for (const transaction of graphTransaction) {
    parsedtransactions.push({
      chainId: "0x1",
      summary: "",
      txnHash: transaction.transaction.hash,
      from: {
        address: transaction.transaction.from_address,
        address_entity: null,
        address_entity_logo: null,
        address_entity_label: null,
        type: ["EOA_ACTIVE"],
      },
      to: {
        address: transaction.transaction.to_address,
        address_entity: null,
        address_entity_logo: null,
        address_entity_label: null,
        type: ["EOA_ACTIVE"],
      },
      value: {
        sent: [],
        receive: []
      },
      date: new Date(),
    })
  }
  return parsedtransactions;
}
export default router;
