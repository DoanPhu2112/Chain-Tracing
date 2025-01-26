import { Router } from 'express';
import BalanceController from './balance/controller';
import { validateGetBalanceParam } from '~/modules/account/balance/middleware';
import { validateTransactionParam } from './transfer/middleware';
import Transaction from './transfer/controller';

const router = Router();
router.get('/balance/erc20/:address', validateGetBalanceParam, BalanceController.GetERC20Balance);
router.get('/balance/erc20/:address/range', validateGetBalanceParam, BalanceController.GetERC20BalanceByRange);
router.get('/balance/nft/:address', validateGetBalanceParam, BalanceController.GetNFTBalance);
router.get('/transaction/:address', validateTransactionParam, Transaction.GetWalletTransactionHistory);
router.get('/transaction/:address/followup', Transaction.GetWalletFollowupTransactions);
export default router;