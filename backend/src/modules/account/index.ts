import { Router } from 'express';
import BalanceController from './balance/account.balance.controller';
import { validateGetBalanceParam } from '~/middleware/validation.middleware';

const router = Router();
router.get('/balance/erc20/', () => {console.log("Ab c")});
router.get('/balance/nft/:address', validateGetBalanceParam, BalanceController.GetNFTBalance);

export default router;