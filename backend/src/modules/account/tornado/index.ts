import { Request, Response } from 'express';
import thirdHeuristic from '../../../../returnAPI/ThirdHeuristic.json';
import fourthHeuristic from '../../../../returnAPI/FourthHeuristic.json';
import prisma from 'prisma/prismaClient';
import { getDepositTornadoTxnsByAddress, getWithdrawTornadoTxnsByAddress } from '~/modules/tornado_cash/dao';

const thirdStat: Record<string, { address: string; count: number }[]> = thirdHeuristic;
const fourthStat: Record<string, string[]> = fourthHeuristic as Record<string, string[]>;

export const TornadoController = {
  GetStat
};

async function GetStat(req: Request, res: Response) {
  const { address } = req.params;
  const isAddressThirdHeuristicsStat = Object.keys(thirdHeuristic).includes(address);
  const isAddressFourthHeuristicsStat = Object.keys(fourthHeuristic).includes(address);
  let thirdResult: {
      address: string;
      count: number;
    }[] = []
  let fourthResult: string[] = [];

  const addressDeposit = await getDepositTornadoTxnsByAddress(address);
  const addressWithdraws = await getWithdrawTornadoTxnsByAddress(address);

  if (isAddressThirdHeuristicsStat) {
    thirdResult = thirdStat[address];
  }
  if (isAddressFourthHeuristicsStat) {
    fourthResult = fourthStat[address];
  }

  const result = {
    deposit: addressDeposit,
    withdraw: addressWithdraws,
    // addressMatch: 0,
    linkedTxns: thirdResult,
    multiDenom: fourthResult
  };
  res.send(result);
}
