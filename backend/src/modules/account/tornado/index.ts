import { Request, Response } from 'express';
// import thirdHeuristic from '../../../../returnAPI/Linked ETH.json';
import fourthHeuristic from '../../../../returnAPI/Multi Denomination.json';
import redis from '~/redis';
import prisma from 'prisma/prismaClient';
import {
  getDepositTornadoTxnsByAddress,
  getWithdrawTornadoTxnsByAddress
} from '~/modules/tornado_cash/dao';
import { getLinkedEth, getLinkedEthScore, getMultiDenom, getMultiDenomScore } from './redis';

export type HeuristicRule = 'Linked ETH' | 'Multi Denom';

export type LinkedETH = {
  address: string;
  tag: string;
  interaction_count: number;
  heuristic_used: HeuristicRule;
  transactions: {
    hash: string;
    from: string;
    to: string;
    timestamp: string;
  }[];
};

// const thirdStat: Record<string, LinkedETH[]> = thirdHeuristic as Record<string, LinkedETH[]>;
const fourthStat: Record<string, string[]> = fourthHeuristic as Record<string, string[]>;

export const TornadoController = {
  GetStat
};

async function GetStat(req: Request, res: Response) {
  const { address } = req.params;

  const addressDeposit = await getDepositTornadoTxnsByAddress(address);
  const addressWithdraws = await getWithdrawTornadoTxnsByAddress(address);

  let linkedEth: LinkedETH[] = await getLinkedEth(address);
  const linkedEthTransactions: string[] = linkedEth.flatMap((item) =>
    item.transactions.map((transaction) => transaction.hash)
  );

  let multiDenom: LinkedETH[] = await getMultiDenom(address);

  const score = Math.max(await getMultiDenomScore(address), await getLinkedEthScore(address));

  for (let i = 0; i < multiDenom.length; i++) {
    const transactions = await redis.hget('multi_denom', multiDenom[i].address).then((result) => {
      if (result) {
        const linkedEths = JSON.parse(result) as LinkedETH[];
        const linkedEthTransactions = linkedEths
          .filter((item) => item.address === address)
          .flatMap((item) => item.transactions);
        return linkedEthTransactions;
      }
      return [];
    });
    multiDenom[i].transactions.push(...transactions);
    multiDenom[i].transactions = multiDenom[i].transactions.sort(
      (a, b) => Number(a.timestamp) - Number(b.timestamp)
    );
  }
  const multiDenomTransactions: string[] = multiDenom.flatMap((item) =>
    item.transactions.map((transaction) => transaction.hash)
  );

  const addressDepositWithLabel = addressDeposit.map((item) => {
    if (item.hash in linkedEthTransactions) {
      return {
        hash: item.hash,
        from: item.from_address,
        to: item.to_address,
        timestamp: item.timestamp,
        heuristic_used: 'Linked ETH'
      };
    }
    if (item.hash in multiDenomTransactions) {
      return {
        hash: item.hash,
        from: item.from_address,
        to: item.to_address,
        timestamp: item.timestamp,
        heuristic_used: 'Multi Denom'
      };
    }
    return {
      hash: item.hash,
      from: item.from_address,
      to: item.to_address,
      timestamp: item.timestamp
    };
  });

  const addressWithdrawsWithLabel = addressWithdraws.map((item) => {
    if (item.hash in linkedEthTransactions) {
      return {
        hash: item.hash,
        from: item.from_address,
        to: item.to_address,
        timestamp: item.timestamp,
        heuristic_used: 'Linked ETH'
      };
    }
    if (item.hash in multiDenomTransactions) {
      return {
        hash: item.hash,
        from: item.from_address,
        to: item.to_address,
        timestamp: item.timestamp,
        heuristic_used: 'Multi Denom'
      };
    }
    return {
      hash: item.hash,
      from: item.from_address,
      to: item.to_address,
      timestamp: item.timestamp
    };
  });
  const result = {
    deposit: addressDepositWithLabel,
    withdraw: addressWithdrawsWithLabel,
    linkedAddress: [...multiDenom, ...linkedEth],
    score: score
  };
  return res.send(result);
}
