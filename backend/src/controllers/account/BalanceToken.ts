import { Request, Response } from 'express';
import Service from 'src/services/address.services'
import codes from 'src/errors/codes';

async function get(req: Request, res: Response) {
  const { address } = req.params;
  const { chainID, tokenAddresses, page, pageSize } = req.query;

  const result = await Service.getUserAssetInformation(
    address,
    chainID as string,
    tokenAddresses as string[],
    Number(page),
    Number(pageSize)
  );

  return res.status(codes.SUCCESS).json(result);
}