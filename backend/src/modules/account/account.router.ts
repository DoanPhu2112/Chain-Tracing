import { Router } from 'express';
import BalanceController from './balance/account.balance.controller';
import { validateGetBalanceParam } from '~/modules/account/balance/account.balance.middleware';
import { validateTransactionParam } from './transfer/account.transfer.middleware';
import Transaction from './transfer/account.transfer.controller';

const router = Router();
router.get('/balance/erc20/:address', validateGetBalanceParam, BalanceController.GetERC20Balance);
router.get('/balance/erc20/:address/range', validateGetBalanceParam, BalanceController.GetERC20BalanceByRange);
router.get('/balance/nft/:address', validateGetBalanceParam, BalanceController.GetNFTBalance);
router.get('/transaction/:address', validateTransactionParam, Transaction.GetWalletTransactionHistory);

export default router;