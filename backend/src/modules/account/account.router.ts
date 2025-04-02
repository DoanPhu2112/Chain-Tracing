import { Router } from 'express';
import BalanceController from './balance/controller';
import {TornadoController} from './tornado/index';
import { validateGetBalanceParam } from '~/modules/account/balance/middleware';
import { validateTransactionParam } from './transfer/middleware';
import Transaction from './transfer/controller';
import { getLabel } from './label/dao';

const router = Router();
router.get('/tornado/:address', TornadoController.GetStat);

router.get('/label/:address', async (req, res) => {
    const { address } = req.params;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    const labels = await getLabel(address);
    return res.status(200).json({ label: labels });
});

router.get('/balance/erc20/:address', validateGetBalanceParam, BalanceController.GetERC20Balance);
router.get('/balance/erc20/:address/range', validateGetBalanceParam, BalanceController.GetERC20BalanceByRange);
router.get('/balance/nft/:address', validateGetBalanceParam, BalanceController.GetNFTBalance);
router.get('/transaction/:address', validateTransactionParam, Transaction.GetWalletTransactionHistory);
router.get('/transaction/:address/followup', Transaction.GetWalletFollowupTransactions);
export default router;