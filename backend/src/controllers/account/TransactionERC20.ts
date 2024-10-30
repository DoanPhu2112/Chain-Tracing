import { Request, Response } from 'express';
import Service from 'src/services/address.services'
import codes from '~/errors/codes';

async function get(req: Request, res: Response) {
  const { address } = req.params;

  const { chain_id,
    start_timestamp,
    end_timestamp,
    page,
    page_size } = req.query;


  const transactions = await Service.getAddressERC20Transaction(
    address,
    chain_id?.toString(),
    start_timestamp?.toString(),
    end_timestamp?.toString(),
    Number(page),
    Number(page_size)
  );
  return res.status(codes.SUCCESS).json(transactions);

}