import scaffoldConfig from "~~/scaffold.config";
import { ContractName, contracts } from "~~/utils/scaffold-eth/contract";

export function getContractNames() {
  console.warn(`Get contract names for the current network, for now returns all contract names`);
  const contractsData = scaffoldConfig.targetNetworks.flatMap((targetNetwork: any): any => {
    return contracts?.[targetNetwork.id];
  });
  return contractsData ? (Object.keys(contractsData) as ContractName[]) : [];
}
