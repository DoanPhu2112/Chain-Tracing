import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { Request, Response } from 'express';
import Service from 'src/services/address.services'
import codes from '~/errors/codes';

async function get(req: Request, res: Response) {
  const { address } = req.params;
  const { fromBlock, toAddress, category, order, pageKey } = req.query;

  const transactions = await Service.getAddressERC721Transaction(
    address,
    fromBlockString,
    toAddressString,
    parsedOrder,
    pageKey as string
  );

  return res.status(codes.SUCCESS).json(transactions);

}
const AccountNFTTransaction = {
  get,
}

export default AccountNFTTransaction;