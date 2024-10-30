import { Request, Response } from 'express';
import Service from 'src/services/address.services'
import codes from '~/errors/codes';

async function get(req: Request, res: Response) {
  const { address } = req.params;
  const { chain_id,
    start_timestamp,
    end_timestamp,
    include_erc20_transactions_triggered,
    include_nft_transactions_triggered,
    include_native_transactions_triggered,
    page,
    page_size } = req.query;
  const result = await Service.getWalletTransactionHistory(
    address,
    chain_id?.toString(),
    start_timestamp?.toString(),
    end_timestamp?.toString(),
    Boolean(include_erc20_transactions_triggered),
    Boolean(include_nft_transactions_triggered),
    Boolean(include_native_transactions_triggered),
    Number(page),
    Number(page_size)
  );
  return res.status(codes.SUCCESS).json(result);
}