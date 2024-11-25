import { Network, Alchemy } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { parse } from '@solidity-parser/parser';

import { AccountType, CONTRACT_FUNCTIONALITY } from 'src/types/address.type';
import { getRandomEtherscanAPI } from 'src/configs/provider.configs';
import { EtherscanReturn } from 'src/types/index.type';

type ContractDetectionFields = {
  name: string,
  base_contracts: string[],
  relative_contracts: string[],
  verified: boolean,
  type: CONTRACT_FUNCTIONALITY[],
  ENS: string,
}

const settings = {
  apiKey: 'MKvBAJsZLrRwfyXqgLavDif9Ba6xs9eo',
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

const exchangeAddresses = ['0x28C6c06298d514Db089934071355E5743bf21d60'];
const inactiveAddresses = ['0x0000000000000000000000000000000000000000'];

const miner: string[] = [];

async function classfifyAccount(address: string): Promise<AccountType[]> {
  const accountType: AccountType[] = [];
  if (is_valid_address(address) == false) {
    accountType.push(AccountType.INVALID)
  }
  if (await is_eoa(address)) {
    if (await is_miner(address)) {
      accountType.push(AccountType.MINER);
    }
    if (await is_eoa_exchange(address)) {
      accountType.push(AccountType.EOA_EXCHANGE);
    }
    if (await is_eoa_active(address)) {
      accountType.push(AccountType.EOA_ACTIVE);

    } else {
      accountType.push(AccountType.EOA_INACTIVE);
    }

  } else if (await is_contract(address)) {

    if (await is_contract_exchange(address)) {
      accountType.push(AccountType.CONTRACT_EXCHANGE);

    } else {
      accountType.push(AccountType.CONTRACT)
    }
  }
  return accountType;
}
//NOTE: Done
async function is_eoa(address: string): Promise<boolean> {
  const checkEOA: boolean = await alchemy.core.isContractAddress(address);
  if (checkEOA) {
    return false;
  }
  return true;
}
export async function is_contract(address: string): Promise<boolean> {
  const isContract = await alchemy.core.isContractAddress(address);
  if (!isContract) {
    return false;
  }
  return true
}
export async function is_eoa_active(address: string): Promise<boolean> {
  const checkActive: number = await alchemy.core.getTransactionCount(address);
  if (checkActive == 0) {
    return false;
  }
  return true;
}
function is_valid_address(address: string): boolean {
  const check = ethers.utils.isAddress(address);

  return check;
}

async function is_eoa_inactive(address: string): Promise<boolean> {
  const isActive: number = await alchemy.core.getTransactionCount(address);
  if (isActive == 0) {
    //NOTE: Add the inactive address to the list
    inactiveAddresses.push(address);
    return true;
  }
  return false;
}
//TODO: Fill the exchangeAddress
async function is_eoa_exchange(address: string): Promise<boolean> {
  if (address in exchangeAddresses) {
    return true;
  }
  return false;
}

//TODO: 
async function is_miner(address: string): Promise<boolean> {
  if (address in miner) {
    return false;
  }
  return true;
}

async function is_contract_exchange(address: string): Promise<boolean> {
  if (address in exchangeAddresses) {
    return true;
  }

  return false;
}
async function is_contract_swap(address: string): Promise<boolean> {
  return false
}

async function is_contract_erc20(contractDetectionFields: ContractDetectionFields): Promise<boolean> {
  for (let baseContract of contractDetectionFields.base_contracts) {
    if (baseContract.toLowerCase().includes("erc")) {
      return true;
    }
  }
  return false
}

async function is_swap(contractDetectionFields: ContractDetectionFields): Promise<boolean> {
  return false
}
async function is_contract_erc721(address: string): Promise<boolean> {
  return false
}

const DEFAULT_CONTRACT_DETECTION_FIELDS: ContractDetectionFields = {
  name: "Contract",
  base_contracts: [],
  relative_contracts: [],
  verified: false,
  type: [],
  ENS: ''
}
async function get_contract_functions(address: string): Promise<EtherscanReturn> {
  const etherscanAPI = getRandomEtherscanAPI();

  const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=`
    + address
    + `&apikey=`
    + etherscanAPI);
  const data: EtherscanReturn = await response.json();

  return data;
}

async function get_contract_detection_fields(address: string): Promise<ContractDetectionFields | null> {
  const data: EtherscanReturn = await get_contract_functions(
    // '0x00fC270C9cc13e878Ab5363D00354bebF6f05C15'
    address
  );

  if (data.message.toUpperCase() !== 'OK') {
    throw new Error(`Fetch function contract error ${data.message.toString()}`);
  }
  const ABI = data.result[0].ABI;

  if (ABI === 'Contract source code not verified') {
    throw new Error(`Contract not verified`);
  }
  const contractName = data.result[0].ContractName;

  let sourceCode: string = "";
  let relativeContracts: string[] = [];
  try {
    const sourceCodes = JSON.parse(data.result[0].SourceCode.slice(1, -1));
    for (const [key, content] of Object.entries(sourceCodes.sources)) {
      if (key.includes(contractName)) {
        sourceCode = (content as any).content as string;
      }
      else {
        const path: string[] = key.split('.')[0].split('/');
        const relativeContractName = path[path.length - 1];
        relativeContracts.push(relativeContractName);
      }
    }
  } catch (error) {
    sourceCode = data.result[0].SourceCode;
    relativeContracts = []
  }
  console.log("Source Code", sourceCode)
  // return  null;

  const ast = parse(sourceCode)

  let contractDetectionTypeObject: ContractDetectionFields = DEFAULT_CONTRACT_DETECTION_FIELDS;
  contractDetectionTypeObject.verified = true;
  contractDetectionTypeObject.name = contractName;

  for (let astNode of ast.children) {
    const astNodeName = (astNode as any).name

    // Extract base contracts data 
    if (astNodeName === contractName && (astNode as any).baseContracts) {
      for (let astNodeChild of (astNode as any).baseContracts) {
        let name = astNodeChild.baseName.namePath
        contractDetectionTypeObject.base_contracts.push(name);
      }
    }
  }

  if (relativeContracts.length === 0) {
    for (let astNode of ast.children) {
      const astNodeName = (astNode as any).name
      const type = astNode.type;

      // Extract relative contracts data
      if (astNodeName !== contractName &&
        type === 'ContractDefinition' &&
        !contractDetectionTypeObject.base_contracts.includes(astNodeName)) {

        contractDetectionTypeObject.relative_contracts.push(astNodeName)

      }
    }
  } else {
    contractDetectionTypeObject.relative_contracts = relativeContracts

  }
  const isERC20 = await is_contract_erc20(contractDetectionTypeObject);
  if (isERC20) {
    contractDetectionTypeObject.name = contractName;
    contractDetectionTypeObject.type.push(CONTRACT_FUNCTIONALITY.TOKEN)
  }

  // console.log("contractDetectionTypeObject", contractDetectionTypeObject  )
  return contractDetectionTypeObject;
}


// async function main() {
//   const check = await get_contract_detection_fields('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
//   console.log('check', check)
// }

// main()