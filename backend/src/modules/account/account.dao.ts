import { StringLiteral } from '@solidity-parser/parser/dist/src/ast-types';
import prisma from 'prisma/prismaClient';
import { DEFAULT_NATIVE_BALANCE, DEFAULT_SCORE } from '~/constants/defaultvalue';
import { label_source } from '@prisma/client';
import { string } from 'joi';
import { get_contract_functions, getAddressType, is_eoa } from '~/utils/accountclassify';
import logger from '~/winston';

type EOAProps = {
  nativeBalance?: number;
  score?: number;
  nameTag: string;
  label: string;
  hash: string;
  chainHash: string;
  logo: string;
  labelSource?: label_source;
};

type ContractProps = {
  address: string;
  sourceCode: string;
  isVerified: boolean;
  type: string;
  chainHash: string;
  nameTag: string;
  logo: string;
  labelSource?: label_source;
  abi: string;
};

export async function createEOA(props: EOAProps) {
  const eoa = await prisma.eoa.create({
    data: {
      native_balance: props.nativeBalance || DEFAULT_NATIVE_BALANCE,
      name_tag: props.nameTag,
      label: props.label,
      hash: props.hash,
      chain_id: 1,
      logo: props.logo,
      label_source: props.labelSource
    }
  });
  logger.info("EOA created: ", eoa);
  return eoa;
}
export async function updateEOALabel(id: number, nameTag: string, logo: string | undefined) {
  const eoa = await prisma.eoa.update({
    where: {
      eoa_id: id
    },
    data: {
      name_tag: nameTag,
      logo: logo || ''
    }
  });

  return eoa;
}
export async function createContract(props: ContractProps) {
  const contract = await prisma.smartcontract.create({
    data: {
      address: props.address,
      is_verified: props.isVerified,
      type: props.type,
      name_tag: props.nameTag,
      logo: props.logo,
      chain_id: 1,
      label_source: props.labelSource,
      abi: props.abi,
      source_code: props.sourceCode || '',
    }
  });
  // logger.info("Contract created: ", contract);
  return contract;
}

export async function getContractByHash(hash: string) {
  //TODO: Leave room for open search
  let eoa = await prisma.smartcontract.findFirst({
    where: {
      address: hash
    }
  });
  return eoa;
}

export async function getEOAByHash(hash: string) {
  //TODO: Leave room for open search
  let eoa = await prisma.eoa.findFirst({
    where: {
      hash: hash
    }
  });
  return eoa;
}

export async function getEoaByNameTag(nameTag: string): Promise<any | null> {
  let eoa = await prisma.eoa.findFirst({
    where: {
      name_tag: nameTag
    }
  });
  return eoa;
}
type EvmWalletHistoryTransactionModified = {
  addressHash: string;
  addressEntity: string;
  addressLabel: string;
  logo: string;
};

export async function upsertLabelSource(
  transaction: EvmWalletHistoryTransactionModified,
  labelSource: label_source,
  chainID: string
): Promise<any | null> {
  const addressHash = transaction.addressHash;
  const newAddressLabel = transaction.addressLabel;
  const newAddressLogo = transaction.logo;
  const newAddressEntity = transaction.addressEntity;

  //if address is EOA, check if it exists in the database
  const ifEOA = await is_eoa(addressHash);
  if (ifEOA) {
    let eoaDb = await getEOAByHash(addressHash);
    // if not, create a new EOA
    if (!eoaDb) {
      if (newAddressEntity) {
        await createEOA({
          hash: addressHash,
          nameTag: newAddressLabel, // label from Moralis used for Database Name tag
          label: newAddressEntity,
          logo: newAddressLogo || '',
          chainHash: chainID,
          labelSource: labelSource
        });
      }
    }
    // if name tag doesn't exist, update it with new label
    if (eoaDb && !eoaDb?.name_tag) {
      if (newAddressLabel) {
        await updateEOALabel(eoaDb.eoa_id, newAddressLabel, newAddressLogo);
      }
    }
  }
  // if address is contract, check if it exists in the database
  if (!ifEOA) {
    const contractDb = await getContractByHash(addressHash);
    // if not, create a new contract
    if (!contractDb) {
      if (newAddressEntity) {
        const sourceCode = await get_contract_functions(addressHash);
        const verified =
          sourceCode.result[0].ABI === 'Contract source code not verified' ? false : true;

        await createContract({
          address: addressHash,
          sourceCode: sourceCode.result[0].SourceCode,
          isVerified: verified,
          type: 'ERC20',
          chainHash: chainID,
          nameTag: newAddressLabel!,
          logo: newAddressLogo || '',
          labelSource: 'moralis',
          abi: sourceCode.result[0].ABI
        });
      }
    }
    if (contractDb && !contractDb.name_tag) {
      if (newAddressLabel) {
        await updateEOALabel(contractDb.contract_id, newAddressLabel, newAddressLogo);
      }
    }
  }
}
