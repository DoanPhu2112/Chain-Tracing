import { ethers } from 'ethers';
import { parse } from '@solidity-parser/parser';

import { getAlchemyAPI, getDrpcAPI, getDrpcURLs, getEtherscanAPI } from 'src/configs/provider.configs';
import { AccountType } from 'src/models/account.model';
import axios from 'axios';

type ContractDetectionFields = {
  name: string;
  base_contracts: string[];
  relative_contracts: string[];
  verified: boolean;
  type: string[];
  ENS: string;
};

const exchangeAddresses = ['0x28C6c06298d514Db089934071355E5743bf21d60'];
const inactiveAddresses = ['0x0000000000000000000000000000000000000000'];

const miner: string[] = [];

export async function getAddressType(address: string| undefined): Promise<AccountType[]> {
  const accountType: AccountType[] = [];
  try {

    if ( !address || !is_valid_address(address) ) {
      accountType.push(AccountType.INVALID);
      return accountType;
    }
    if (await is_eoa(address)) {
      if (is_miner(address)) {
        accountType.push(AccountType.MINER);
      }
      if (await is_eoa_exchange(address)) {
        accountType.push(AccountType.EOA_EXCHANGE);
      }
      // if (await is_eoa_active(address)) {
      //   accountType.push(AccountType.EOA_ACTIVE);
      // } else {
      //   accountType.push(AccountType.EOA_INACTIVE);
      // }
    } else {
        accountType.push(AccountType.CONTRACT_NORMAL);
      }
    
    return accountType;
  } catch (err) {
    console.log(err);
    return accountType;
  }
}
//NOTE: Done
export async function is_eoa(address: string): Promise<boolean> {
  // try {
  const url = getDrpcURLs();
  const data = {
    method: "eth_getCode",
    params: [address, "latest"],
    id: 1,
    jsonrpc: "2.0"
  };
  
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const code = await response.json();
  console.log("code", code)
    if (code === '0x') {
      return true;
    }
    return false;
  // } catch (err) {
  //   console.log("In is_eoa function")
  //   console.log(err);
  //   return false;
  // }
}
export async function is_contract(address: string): Promise<boolean> {
  try {
    const alchemy = getAlchemyAPI();

    const isContract = await alchemy.core.isContractAddress(address);
    if (!isContract) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function is_eoa_active(address: string): Promise<boolean> {
  try {
    const alchemy = getAlchemyAPI();

    const numberOfTx: number = await alchemy.core.getTransactionCount(address);
    if (numberOfTx === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.log('Error in check active EOA', error);
    console.log('Address', address);
    return false;
  }
}
function is_valid_address(address: string): boolean {
  try {
    const check = ethers.utils.isAddress(address);
    return check;
  } catch (error) {
    console.log('Error in check valid address', error);
    return false;
  }
}

async function is_eoa_inactive(address: string): Promise<boolean> {
  const alchemy = getAlchemyAPI();

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
  try {
    if (address in exchangeAddresses) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error in check EOA exchange', error);
    return false;
  }
}

//TODO:
function is_miner(address: string): boolean {
  try {
    if (address in miner) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error in check miner', error);
    return false;
  }
}

async function is_contract_exchange(address: string): Promise<boolean> {
  try {
    if (address in exchangeAddresses) {
      return true;
    }

    return false;
  } catch (error) {
    console.log('Error in check contract exchange', error);
    return false;
  }
}
async function is_contract_swap(address: string): Promise<boolean> {
  return false;
}

async function is_contract_erc20(
  contractDetectionFields: ContractDetectionFields
): Promise<boolean> {
  for (let baseContract of contractDetectionFields.base_contracts) {
    if (baseContract.toLowerCase().includes('erc')) {
      return true;
    }
  }
  return false;
}

async function is_swap(contractDetectionFields: ContractDetectionFields): Promise<boolean> {
  return false;
}
async function is_contract_erc721(address: string): Promise<boolean> {
  return false;
}

const DEFAULT_CONTRACT_DETECTION_FIELDS: ContractDetectionFields = {
  name: 'Contract',
  base_contracts: [],
  relative_contracts: [],
  verified: false,
  type: [],
  ENS: ''
};
type EthereumResponse = {
  status: string;
  message: string;
  result: EthereumSourceCode[];
};
type EthereumSourceCode = {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
};

export async function get_contract_functions(address: string): Promise<EthereumResponse> {
  try {
    const etherscanAPI = getEtherscanAPI();
    const response = await axios(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=` +
        address +
        `&apikey=` +
        etherscanAPI
    );
    const data = await response.data;

    return data;
  } catch (err) {
    console.log(err);
    return {
      status: 'error',
      message: 'error',
      result: []
    };
  }
}

async function get_contract_detection_fields(
  address: string
): Promise<ContractDetectionFields | null> {
  const data = await get_contract_functions(
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

  let sourceCode: string = '';
  let relativeContracts: string[] = [];
  try {
    const sourceCodes = JSON.parse(data.result[0].SourceCode.slice(1, -1));
    for (const [key, content] of Object.entries(sourceCodes.sources)) {
      if (key.includes(contractName)) {
        sourceCode = (content as any).content as string;
      } else {
        const path: string[] = key.split('.')[0].split('/');
        const relativeContractName = path[path.length - 1];
        relativeContracts.push(relativeContractName);
      }
    }
  } catch (error) {
    sourceCode = data.result[0].SourceCode;
    relativeContracts = [];
  }
  // return  null;

  const ast = parse(sourceCode);

  let contractDetectionTypeObject: ContractDetectionFields = DEFAULT_CONTRACT_DETECTION_FIELDS;
  contractDetectionTypeObject.verified = true;
  contractDetectionTypeObject.name = contractName;

  for (let astNode of ast.children) {
    const astNodeName = (astNode as any).name;

    // Extract base contracts data
    if (astNodeName === contractName && (astNode as any).baseContracts) {
      for (let astNodeChild of (astNode as any).baseContracts) {
        let name = astNodeChild.baseName.namePath;
        contractDetectionTypeObject.base_contracts.push(name);
      }
    }
  }

  if (relativeContracts.length === 0) {
    for (let astNode of ast.children) {
      const astNodeName = (astNode as any).name;
      const type = astNode.type;

      // Extract relative contracts data
      if (
        astNodeName !== contractName &&
        type === 'ContractDefinition' &&
        !contractDetectionTypeObject.base_contracts.includes(astNodeName)
      ) {
        contractDetectionTypeObject.relative_contracts.push(astNodeName);
      }
    }
  } else {
    contractDetectionTypeObject.relative_contracts = relativeContracts;
  }
  const isERC20 = await is_contract_erc20(contractDetectionTypeObject);
  if (isERC20) {
    contractDetectionTypeObject.name = contractName;
    contractDetectionTypeObject.type.push(CONTRACT_FUNCTIONALITY.TOKEN);
  }

  // console.log("contractDetectionTypeObject", contractDetectionTypeObject  )
  return contractDetectionTypeObject;
}

enum CONTRACT_FUNCTIONALITY {
  TOKEN = 'TOKEN'
}
// async function main() {
//   const check = await get_contract_detection_fields('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
//   console.log('check', check)
// }

// main()
