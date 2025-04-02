import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function getDepositTornadoTxnsByAddress(address: string) {
    const depositTxns = await prisma.tornadoDepositTransaction.findMany({
        where: {
            from_address: address
        }
    });

    return depositTxns

}   

export async function getWithdrawTornadoTxnsByAddress(address: string) {    
    const withdrawTxns = await prisma.tornadoWithdrawTransaction.findMany({
        where: {
            recipient_address: address
        }
    });
    return withdrawTxns
}