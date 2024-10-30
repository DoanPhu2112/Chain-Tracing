export type EtherscanReturn = {
  status: string;
  message: string;
  result: EtherscanContractSourceCodeFields[];
};

type EtherscanContractSourceCodeFields = {
  SourceCode: string;
  ABI: string;
  ContractName: string;
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
