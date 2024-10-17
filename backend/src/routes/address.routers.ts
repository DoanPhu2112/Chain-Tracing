import express from 'express';
import {
  getAddressTransactions,
  getUserBalance,
  getAddressERC20Transactions,
  getAddressERC721TransactionsByERC20,
  getAddressERC721TransactionsByETH,
  getAddressERC721Transactions,
  getNFTTransaction,
  getAddressTokenBalance,
  getUserInformation,
  getAssetInformation
} from '../controllers/address.controller'
import { validateAssetInformationParam } from '~/middleware/validation.middleware';

const router = express.Router();

// Route for getting address transactions
router.get('/balance/:address', getUserBalance);
router.get('/transactions/:address', getAddressTransactions);
router.get('/erc20-transactions/:address', getAddressERC20Transactions);
router.get('/erc721-transactions/eth/:address', getAddressERC721TransactionsByETH);
router.get('/erc721-transactions/erc20/:address', getAddressERC721TransactionsByERC20);
router.get('/erc721-transactions/:address', getAddressERC721Transactions);
router.get('/NFT-transactions/:nftaddress', getNFTTransaction);
router.get('/balance/token/:address', getAddressTokenBalance);
router.get('/information/:address', getUserInformation);
router.get('/asset/:address', validateAssetInformationParam, getAssetInformation)
export default router;