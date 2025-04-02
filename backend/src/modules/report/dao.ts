import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createReport(reportDetail: Omit<Prisma.ReportCreateInput, "user">, userId: number, graph_id?: number, story_id?: number) {
    const id = await prisma.report.create({
        data: {
            title: reportDetail.title,
            user_id: userId,
            amount: reportDetail.amount || 0,
            transaction_hash: reportDetail.transaction_hash,
            timestamp: reportDetail.timestamp,
            category: reportDetail.category,
            address: reportDetail.address,
            url: reportDetail.url,
            ip: reportDetail.ip,
            graph_id: graph_id,
            description: reportDetail.description
        }
    })

    return id
}

export async function getReportById(id: number) {
  const report = await prisma.report.findFirst({
    where: {
      report_id: id,
    },
    include: {
      user: true,
      graph: {
        include: {
          graphTransactions: {
            include: {
              transaction: true, // lấy thông tin đầy đủ của transaction trong graph
            },
          },
        },
      },
    },
  });
  if (!report) {
    return null;
  }
  return report;
}
