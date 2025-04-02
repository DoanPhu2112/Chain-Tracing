import { DEFAULT_ADDRESS } from '~/constants/defaultvalue';
import { Entity } from '../types/entity';
import { ERC20Amount, NativeAmount, NFTAmount } from '../types/token';
import { getEntity } from './api';

export async function processSentTransfers(
  transaction: any,
  chainID: string
): Promise<
  [
    Entity,
    Entity,
    {
      sent: (ERC20Amount | NFTAmount | NativeAmount)[];
      receive: (ERC20Amount | NFTAmount | NativeAmount)[];
    }
  ]
> {
  let fromEntity: Entity;
  let toEntity: Entity;
  let value: {
    sent: (ERC20Amount | NFTAmount | NativeAmount)[];
    receive: (ERC20Amount | NFTAmount | NativeAmount)[];
  } = {
    sent: [],
    receive: []
  };
  fromEntity = await getEntity(
    chainID,
    transaction.fromAddress.lowercase,
    transaction.fromAddressLabel,
    transaction.fromAddressEntity,
    transaction.fromAddressEntityLogo
  );
  toEntity = await getEntity(
    chainID,
    transaction.toAddress.lowercase,
    transaction.toAddressLabel,
    transaction.toAddressEntity,
    transaction.toAddressEntityLogo
  );
  for (const transfer of transaction.erc20Transfers) {
    value.sent.push({
      value: transfer.valueFormatted,
      name: transfer.tokenName,
      decimal: transfer.tokenDecimals,
      address: transfer.address.lowercase,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo,
      possibleSpam: transfer.possibleSpam,
      verifiedContract: transfer.verifiedContract
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress.lowercase,
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  for (const transfer of transaction.nativeTransfers) {
    value.sent.push({
      value: transfer.valueFormatted,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress.lowercase,
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  for (const transfer of transaction.nftTransfers) {
    value.sent.push({
      value: transfer.value,
      address: transfer.tokenAddress.lowercase,
      id: transfer.tokenId,
      name: transfer.normalizedMetadata?.name,
      description: transfer.normalizedMetadata?.description,
      animationUrl: transfer.normalizedMetadata?.animationUrl,
      image: transfer.normalizedMetadata?.image,
      possibleSpam: transfer.possibleSpam,
      collection: {
        verified: transfer.verifiedCollection,
        logo: transfer.collectionLogo,
        bannerImage: transfer.collectionBannerImage
      }
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress.lowercase,
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  return [fromEntity, toEntity, value];
}

export async function processReceiveTransfers(
  address: string,
  transaction: any,
  chainID: string
): Promise<
  [
    Entity,
    Entity,
    Entity[],
    {
      sent: (ERC20Amount | NFTAmount | NativeAmount)[];
      receive: (ERC20Amount | NFTAmount | NativeAmount)[];
    }
  ]
> {
  console.log("Receive")
  let fromEntity: Entity;
  let toEntity: Entity;
  let intermediaryEntities: Entity[] = [];
  let value: {
    sent: (ERC20Amount | NFTAmount | NativeAmount)[];
    receive: (ERC20Amount | NFTAmount | NativeAmount)[];
  } = {
    sent: [],
    receive: []
  };
  fromEntity = await getEntity(
    chainID,
    transaction.fromAddress.lowercase,
    transaction.fromAddressLabel,
    transaction.fromAddressEntity,
    transaction.fromAddressEntityLogo
  );
  toEntity = await getEntity(
    chainID,
    transaction.toAddress.lowercase,
    transaction.toAddressLabel,
    transaction.toAddressEntity,
    transaction.toAddressEntityLogo
  );
  const isDeepReceive =
    transaction.fromAddress.lowercase !== address && transaction.toAddress?.lowercase !== address;
  if (isDeepReceive) {
    const intermediaryEntity = await getEntity(
      chainID,
      transaction.toAddress?.lowercase || DEFAULT_ADDRESS,
      transaction.toAddressLabel,
      transaction.toAddressEntity,
      transaction.toAddressEntityLogo
    );
    intermediaryEntities.push(intermediaryEntity);
  }

  // In case there are a list of erc20 transfers
  if (transaction.erc20Transfers.length >= 2) {
    throw new Error('Unhandled case where erc20 transfer got larger than 1 txn');
  }
  if (transaction.erc20Transfers.length) {
    for (const transfer of transaction.erc20Transfers) {
      value.receive.push({
        value: transfer.valueFormatted,
        name: transfer.tokenName,
        decimal: transfer.tokenDecimals,
        address: transfer.address.lowercase,
        symbol: transfer.tokenSymbol,
        logo: transfer.tokenLogo,
        possibleSpam: transfer.possibleSpam,
        verifiedContract: transfer.verifiedContract
      });
      if (isDeepReceive) {
        toEntity = await getEntity(
          chainID,
          transfer.toAddress?.lowercase,
          transfer.toAddressLabel,
          transfer.toAddressEntity,
          transfer.toAddressEntityLogo
        );
      }
    }
  }
  if (transaction.nativeTransfers.length) {
    if (transaction.nativeTransfers.length >= 2) {
      throw new Error(
        'Unhandled case where native transfer got larger than 1 txn, transaction native: ' +
          transaction.nativeTransfers
      );
    }
    for (const transfer of transaction.nativeTransfers) {
      if (!transfer.toAddress) {
        throw new Error('Unhandled case where to address of native transfer of txn got null');
      }
      value.receive.push({
        value: transfer.valueFormatted,
        symbol: transfer.tokenSymbol,
        logo: transfer.tokenLogo
      });
      if (isDeepReceive) {
        toEntity = await getEntity(
          chainID,
          transfer.toAddress?.lowercase,
          transfer.toAddressLabel,
          transfer.toAddressEntity,
          transfer.toAddressEntityLogo
        );
      }
    }
  }

  if (transaction.nftTransfers.length) {
    if (transaction.nftTransfers.length >= 2) {
      throw new Error(
        'Unhandled case where native transfer got larger than 1 txn, transaction native: ' +
          transaction.nativeTransfers
      );
    }
    for (const transfer of transaction.nftTransfers) {
      value.receive.push({
        value: transfer.value,
        address: transfer.tokenAddress.lowercase,
        id: transfer.tokenId,
        name: transfer.normalizedMetadata?.name,
        description: transfer.normalizedMetadata?.description,
        animationUrl: transfer.normalizedMetadata?.animationUrl,
        image: transfer.normalizedMetadata?.image,
        possibleSpam: transfer.possibleSpam,
        collection: {
          verified: transfer.verifiedCollection,
          logo: transfer.collectionLogo,
          bannerImage: transfer.collectionBannerImage
        }
      });
      if (isDeepReceive) {
        toEntity = await getEntity(
          chainID,
          transfer.toAddress?.lowercase,
          transfer.toAddressLabel,
          transfer.toAddressEntity,
          transfer.toAddressEntityLogo
        );
      }
    }
  }
  console.log( "From :", fromEntity)
  console.log( "To :", toEntity)
  return [fromEntity, toEntity, intermediaryEntities, value];
}

export async function processSignTransfers(
  transaction: any,
  chainID: string
): Promise<
  [
    Entity,
    Entity,
    {
      sent: (ERC20Amount | NFTAmount | NativeAmount)[];
      receive: (ERC20Amount | NFTAmount | NativeAmount)[];
    }
  ]
> {
  let fromEntity: Entity;
  let toEntity: Entity;
  let value: {
    sent: (ERC20Amount | NFTAmount | NativeAmount)[];
    receive: (ERC20Amount | NFTAmount | NativeAmount)[];
  } = {
    sent: [],
    receive: []
  };
  fromEntity = await getEntity(
    chainID,
    transaction.fromAddress.lowercase,
    transaction.fromAddressLabel,
    transaction.fromAddressEntity,
    transaction.fromAddressEntityLogo
  );
  toEntity = await getEntity(
    chainID,
    transaction.toAddress.lowercase,
    transaction.toAddressLabel,
    transaction.toAddressEntity,
    transaction.toAddressEntityLogo
  );
  for (const transfer of transaction.erc20Transfers) {
    value.receive.push({
      value: transfer.valueFormatted,
      name: transfer.tokenName,
      decimal: transfer.tokenDecimals,
      address: transfer.address.lowercase,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo,
      possibleSpam: transfer.possibleSpam,
      verifiedContract: transfer.verifiedContract
    });
  }
  for (const transfer of transaction.nativeTransfers) {
    value.receive.push({
      value: transfer.valueFormatted,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo
    });
  }
  for (const transfer of transaction.nftTransfers) {
    value.receive.push({
      value: transfer.value,
      address: transfer.tokenAddress.lowercase,
      id: transfer.tokenId,
      name: transfer.normalizedMetadata?.name,
      description: transfer.normalizedMetadata?.description,
      animationUrl: transfer.normalizedMetadata?.animationUrl,
      image: transfer.normalizedMetadata?.image,
      possibleSpam: transfer.possibleSpam,
      collection: {
        verified: transfer.verifiedCollection,
        logo: transfer.collectionLogo,
        bannerImage: transfer.collectionBannerImage
      }
    });
  }
  return [fromEntity, toEntity, value];
}
export async function processAirdropTransfers(
  transaction: any,
  chainID: string
): Promise<
  [
    Entity,
    Entity,
    {
      sent: (ERC20Amount | NFTAmount | NativeAmount)[];
      receive: (ERC20Amount | NFTAmount | NativeAmount)[];
    }
  ]
> {
  let fromEntity: Entity;
  let toEntity: Entity | undefined = undefined;
  let value: {
    sent: (ERC20Amount | NFTAmount | NativeAmount)[];
    receive: (ERC20Amount | NFTAmount | NativeAmount)[];
  } = {
    sent: [],
    receive: []
  };
  fromEntity = await getEntity(
    chainID,
    transaction.fromAddress.lowercase,
    transaction.fromAddressLabel,
    transaction.fromAddressEntity,
    transaction.fromAddressEntityLogo
  );
  // toEntity = await getEntity(
  //   chainID,
  //   transaction.toAddress.lowercase,
  //   transaction.toAddressLabel,
  //   transaction.toAddressEntity,
  //   transaction.toAddressEntityLogo
  // );

  for (const transfer of transaction.erc20Transfers) {
    value.receive.push({
      value: transfer.valueFormatted,
      name: transfer.tokenName,
      decimal: transfer.tokenDecimals,
      address: transfer.address.lowercase,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo,
      possibleSpam: transfer.possibleSpam,
      verifiedContract: transfer.verifiedContract
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress?.lowercase || '0x',
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  for (const transfer of transaction.nativeTransfers) {
    value.receive.push({
      value: transfer.valueFormatted,
      symbol: transfer.tokenSymbol,
      logo: transfer.tokenLogo
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress?.lowercase || '0x',
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  for (const transfer of transaction.nftTransfers) {
    value.receive.push({
      value: transfer.value,
      address: transfer.tokenAddress.lowercase,
      id: transfer.tokenId,
      name: transfer.normalizedMetadata?.name,
      description: transfer.normalizedMetadata?.description,
      animationUrl: transfer.normalizedMetadata?.animationUrl,
      image: transfer.normalizedMetadata?.image,
      possibleSpam: transfer.possibleSpam,
      collection: {
        verified: transfer.verifiedCollection,
        logo: transfer.collectionLogo,
        bannerImage: transfer.collectionBannerImage
      }
    });
    toEntity = await getEntity(
      chainID,
      transfer.toAddress?.lowercase || '0x',
      transfer.toAddressLabel,
      transfer.toAddressEntity,
      transfer.toAddressEntityLogo
    );
  }
  if (!toEntity) {
    throw new Error("Airdrop with no receiver")
  }
  return [fromEntity, toEntity, value];
}
