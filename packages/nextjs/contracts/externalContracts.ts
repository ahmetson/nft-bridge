import scaffoldConfig from "~~/scaffold.config";
import deployments from "~~/utils/deployments";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *      address: "0x...",
 *      abi: [...],
 *    }
 * } as const;
 */
const externalContracts: { [key: number]: any } = {} as const;

for (const i of scaffoldConfig.targetNetworks) {
  const chainId = i.id.toString();
  if (deployments.hasOwnProperty(chainId)) {
    const depChainId = chainId as keyof typeof deployments;
    const contracts = deployments[depChainId];
    externalContracts[parseInt(chainId)] = contracts[0].contracts;
  }
}

export default externalContracts satisfies GenericContractsDeclaration;
