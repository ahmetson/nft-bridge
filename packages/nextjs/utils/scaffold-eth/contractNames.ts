import scaffoldConfig from "~~/scaffold.config";
import { ContractName, GenericContractsDeclaration, contracts } from "~~/utils/scaffold-eth/contract";

export function getContractNames() {
  const contractsData: GenericContractsDeclaration[] = [];
  for (const targetNetwork of scaffoldConfig.targetNetworks) {
    if (contracts?.[targetNetwork.id]) {
      for (const c in contracts?.[targetNetwork.id]) {
        contractsData.push(contracts?.[targetNetwork.id][c]);
      }
    }
  }
  return contractsData ? (Object.keys(contractsData) as ContractName[]) : [];
}
