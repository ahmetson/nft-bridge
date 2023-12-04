import { contracts } from "~~/utils/scaffold-eth/contract";

export function getContractNames(chainId: number) {
  if (contracts?.[chainId]) {
    return Object.keys(contracts?.[chainId]);
  }
  return [];
}
