import { getAccountFollowupTransaction } from "../account/transfer/service"
import { createGraph } from "../graph/dao"
import { createGraphTx } from "../graph_tx/dao"
import { getTokenBySymbol } from "../token/token.dao"
import { createTransaction } from "../transaction/dao"
import { createReport as daoCreateReport, getReportById as daoGetReportById } from "./dao"
type ReportDetail = { 
    title: string,
    amount: {
        value: number,
        token: string
    }[],
    transactionHash: string[]
    description: string
    timestamp: number,
    category: string
    address: string[]
    url: string
    ip: string
}

export async function createReport(reportDetail: ReportDetail, userId: number) {
    const transactions = await getAccountFollowupTransaction(
        reportDetail.address[0],
        reportDetail.transactionHash[0],
        "0x1",
    );
    const graph = await createGraph({
        description: reportDetail.description,
        created_at: new Date(),
        updated_at: new Date()
    })

    for (const [index, transaction] of transactions.transactions.entries()) {
        const tokenSymbol = reportDetail.amount[0].token;
        const token = await getTokenBySymbol(tokenSymbol)
        const tx = await createTransaction(transaction, token!.id!);
        await createGraphTx(
            graph.graph_id,
            tx.transaction_id,
            index
        );
    }
    
    const report = await daoCreateReport(
        {
            title: reportDetail.title,
            amount: reportDetail.amount[0].value,
            transaction_hash: JSON.stringify(reportDetail.transactionHash),
            timestamp: reportDetail.timestamp,
            category: reportDetail.category,
            address: JSON.stringify(reportDetail.address),
            url: reportDetail.url,
            ip: reportDetail.ip,
            description: reportDetail.description
        },
        userId,
        graph.graph_id,
    )
    return { report: report, transactions: transactions.transactions }
}

export async function getReportById(id: number) {
    const report = await daoGetReportById(id)
    return report
}