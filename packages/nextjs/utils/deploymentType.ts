export type ContractInfo = {
  address: string;
  abi: any;
};
export type Deployment = {
  name: string;
  chainId: string;
  contracts: { [key: string]: ContractInfo };
};
export type DeploymentType = { [key: string]: Array<Deployment> };
