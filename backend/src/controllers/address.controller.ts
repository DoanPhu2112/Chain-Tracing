import { Request, Response } from 'express';
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';

import CustomError from '../errors/CustomError.errors';
import codes from '../utils/codes';
import Service from '../services/address.services'


async function getAssetInformation(req: Request, res: Response) {
  const { address } = req.params;
  const { chainID, tokenAddresses, limit } = req.query;
  console.log("Chain ID", chainID)
  console.log("token Addresses", tokenAddresses)
  console.log("limit", limit)
  // const cursor = undefined;

  // if (cursor) {
  //   if (typeof (cursor) === 'string') query.cursor = cursor
  //   else {
  //     throw new CustomError(codes.BAD_REQUEST, "Cursor Param Error");
  //   }
  // } else {
  //   query.cursor = cursor
  // }

  const result = await Service.getAssetInformation(address, chainID as string, undefined, tokenAddresses as string[], Number(limit as string));
  
  return res.status(codes.SUCCESS).json(result);

}
async function getUserInformation(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { currency_address, timestamp } = req.query

    const timestampNumber = Number(timestamp)

    const serviceResult = await Service.getUserInformation(address, currency_address as string, timestampNumber)
    res.send(serviceResult)

  } catch (error) {
    console.log(error);
  }
};

async function getUserBalance(req: Request, res: Response) {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const balance = await Service.getUserBalance(address);
    res.json({ address, balance });
  } catch (error) {
    console.error('Error fetching user balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAddressTransactions(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { fromBlock, toAddress, category, order, pageKey } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const fromBlockString = typeof fromBlock === 'string' ? fromBlock : undefined;

    const toAddressString = typeof toAddress === 'string' ? toAddress : undefined;
    // Parse and validate the category
    let parsedCategory: AssetTransfersCategory[] | undefined;
    if (category) {
      try {
        parsedCategory = JSON.parse(category as string) as AssetTransfersCategory[];
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category format' });
      }
    }

    // Parse and validate the order
    let parsedOrder: SortingOrder | undefined;
    if (order) {
      if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
        parsedOrder = order;
      } else {
        return res.status(400).json({ error: 'Invalid order value' });
      }
    }

    const transactions = await Service.getAddressTransactions(
      address,
      fromBlockString,
      toAddressString,
      parsedCategory,
      parsedOrder,
      pageKey as string
    );
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAddressERC20Transactions(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { fromBlock, toAddress, category, order, pageKey } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const fromBlockString = typeof fromBlock === 'string' ? fromBlock : undefined;

    const toAddressString = typeof toAddress === 'string' ? toAddress : undefined;

    let parsedCategory: AssetTransfersCategory[] | undefined;
    if (category) {
      try {
        parsedCategory = JSON.parse(category as string) as AssetTransfersCategory[];
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category format' });
      }
    }

    let parsedOrder: SortingOrder | undefined;
    if (order) {
      if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
        parsedOrder = order;
      } else {
        return res.status(400).json({ error: 'Invalid order value' });
      }
    }

    const transactions = await Service.getAddressERC20Transaction(
      address,
      fromBlockString,
      toAddressString,
      parsedOrder,
      pageKey as string
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAddressERC721Transactions(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { fromBlock, toAddress, category, order, pageKey } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const fromBlockString = typeof fromBlock === 'string' ? fromBlock : undefined;

    const toAddressString = typeof toAddress === 'string' ? toAddress : undefined;

    let parsedCategory: AssetTransfersCategory[] | undefined;
    if (category) {
      try {
        parsedCategory = JSON.parse(category as string) as AssetTransfersCategory[];
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category format' });
      }
    }

    let parsedOrder: SortingOrder | undefined;
    if (order) {
      if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
        parsedOrder = order;
      } else {
        return res.status(400).json({ error: 'Invalid order value' });
      }
    }

    const transactions = await Service.getAddressERC721Transaction(
      address,
      fromBlockString,
      toAddressString,
      parsedOrder,
      pageKey as string
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAddressERC721TransactionsByETH(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { fromBlock, toAddress, category, order, pageKey } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const fromBlockString = typeof fromBlock === 'string' ? fromBlock : undefined;

    const toAddressString = typeof toAddress === 'string' ? toAddress : undefined;

    let parsedCategory: AssetTransfersCategory[] | undefined;
    if (category) {
      try {
        parsedCategory = JSON.parse(category as string) as AssetTransfersCategory[];
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category format' });
      }
    }

    let parsedOrder: SortingOrder | undefined;
    if (order) {
      if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
        parsedOrder = order;
      } else {
        return res.status(400).json({ error: 'Invalid order value' });
      }
    }

    const transactions = await Service.getAddressERC721TransactionByETH(
      address,
      fromBlockString,
      toAddressString,
      parsedOrder,
      pageKey as string
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAddressERC721TransactionsByERC20(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { fromBlock, toAddress, category, order, pageKey } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });

    }
    const fromBlockString = typeof fromBlock === 'string' ? fromBlock : undefined;

    const toAddressString = typeof toAddress === 'string' ? toAddress : undefined;

    let parsedCategory: AssetTransfersCategory[] | undefined;
    if (category) {
      try {
        parsedCategory = JSON.parse(category as string) as AssetTransfersCategory[];
      } catch (e) {
        return res.status(400).json({ error: 'Invalid category format' });
      }
    }

    let parsedOrder: SortingOrder | undefined;
    if (order) {
      if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
        parsedOrder = order;
      } else {
        return res.status(400).json({ error: 'Invalid order value' });
      }
    }

    const transactions = await Service.getAddressERC721TransactionByERC20(
      address,
      fromBlockString,
      toAddressString,
      parsedOrder
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getNFTTransaction(req: Request, res: Response) {
  const { nftaddress } = req.params;

  const { nftId, pageKey, fromBlock, order } = req.query;

  if (!nftaddress) {
    return res.status(400).json({ error: 'Address is required' });
  }

  if (nftaddress.length != 42) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  const fromBlockString = typeof fromBlock === 'string' ? fromBlock : '0x0';

  let parsedNftId: number = -1;
  parsedNftId = Number(nftId)
  let parsedOrder: SortingOrder | undefined;
  if (order) {
    if (order === SortingOrder.ASCENDING || order === SortingOrder.DESCENDING) {
      parsedOrder = order;
    } else {
      return res.status(400).json({ error: 'Invalid order value' });
    }
  }

  const transactions = await Service.getNFTTransaction(
    [nftaddress],
    parsedNftId,
    pageKey as string || undefined,
    fromBlockString,
  );

  res.json(transactions);
}

async function getAddressTokenBalance(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const { tokenId } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (address.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    if (typeof (tokenId) !== 'string') {
      return res.status(400).json({ error: 'Invalid tokenId type' });
    }
    if (tokenId.length != 42) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    const result = await Service.getAddressTokenBalance(address, [tokenId] as string[])
    res.json(result);
  } catch (err) {
    throw new Error("Cannot Get Address Token Balance Controller")
  }

}

export {
  getUserBalance,
  getAddressTransactions,
  getAddressERC20Transactions,
  getAddressERC721TransactionsByETH,
  getAddressERC721TransactionsByERC20,
  getAddressERC721Transactions,
  getNFTTransaction,
  getAddressTokenBalance,
  getUserInformation,
  getAssetInformation
};
