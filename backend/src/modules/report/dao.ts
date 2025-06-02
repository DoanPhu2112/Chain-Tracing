import { Prisma, PrismaClient } from '@prisma/client';
import { getUser } from '../user/dao';
const prisma = new PrismaClient();

export type ReportReturn = Awaited<ReturnType<typeof getReportById>>;

export async function createReport(
  reportDetail: Omit<Prisma.ReportCreateInput, 'user'>,
  userName?: string,
  graph_id?: number,
  token_id?: number
) {
  const userId = userName ? (await getUser({ name: userName }))?.id : undefined;
  const id = await prisma.report.create({
    data: {
      title: reportDetail.title,
      user_id: userId ?? 1,
      amount: reportDetail.amount || 0,
      token_id: token_id,
      transaction_hash: reportDetail.transaction_hash,
      timestamp: reportDetail.timestamp,
      category: reportDetail.category,
      address: reportDetail.address.toLowerCase(),
      url: reportDetail.url,
      ip: reportDetail.ip,
      graph_id: graph_id,
      description: reportDetail.description
    }
  });

  return id;
}

export async function getReportById(id: number) {
  const report = await prisma.report.findFirst({
    where: {
      report_id: Number(id)
    },
    include: {
      user: true,
      graph: {
        include: {
          graphTransactions: {
            include: {
              transaction: {
                include: {
                  token: {
                    select: {
                      symbol: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      token: {
        select: {
          symbol: true,
          name: true
        }
      }
    }
  });
  if (!report) {
    return null;
  }
  return report;
}

export async function getReports(): Promise<ReportReturn[] | null> {
  const reports = await prisma.report.findMany({
    include: {
      user: true,
      graph: {
        include: {
          graphTransactions: {
            include: {
              transaction: {
                include: {
                  token: {
                    select: {
                      symbol: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      token: {
        select: {
          symbol: true,
          name: true
        }
      }
    }
  });
  if (!reports.length) {
    return null;
  }
  return reports;
}
