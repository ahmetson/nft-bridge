import Deployments from "./deployments";

export type NetworkParams = {
  selector: string;
  router: string;
};

// Main nets: Ethereum | Polygon | Avalanche C-Chain | BNB Chain
// Test nets: Sepolia | Mumbai | Fuji | BNB Testnet
// Testnets: 11155111 | 80001 | 1311 | 97
export const supportedNetworkParams: { [key: string]: NetworkParams } = {
  "11155111": {
    selector: "0xDE41BA4FC9D91AD9",
    router: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
  },
  "80001": {
    selector: "0xADECC60412CE25A5",
    router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
  },
  "1311": {
    selector: "0xCCF0A31A221F3C9B",
    router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
  },
  "97": {
    selector: "0xB8159170038F96FB",
    router: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2",
  },
};

export function one(chainId: string): NetworkParams {
  return supportedNetworkParams[chainId];
}
export function listSelectors(exceptChainId: string): Array<string> {
  const selectors = new Array<string>();
  for (const chainId in supportedNetworkParams) {
    if (chainId === exceptChainId) {
      continue;
    }
    selectors.push(supportedNetworkParams[parseInt(chainId)].selector);
  }
  return selectors;
}

export function listRouters(exceptChainId: string): Array<string> {
  const routers = new Array<string>();
  for (const chainId in supportedNetworkParams) {
    if (chainId === exceptChainId) {
      continue;
    }
    routers.push(supportedNetworkParams[parseInt(chainId)].router);
  }
  return routers;
}

export function contractAddress(chainId: string, name: string): string {
  if (Deployments[chainId] === undefined) {
    return "";
  }
  console.log(`Contract ${name} from ${chainId}\n`);
  const deployments = Deployments[chainId][0];
  if (deployments.contracts[name] === undefined) {
    return "";
  }

  return deployments.contracts[name].address;
}

export function chainIds(exceptChainId: string): Array<string> {
  const chainIds = Object.keys(supportedNetworkParams);
  const i = chainIds.indexOf(exceptChainId);
  if (i > -1) {
    chainIds.splice(i, 1);
  }
  return chainIds;
}

export const zeroAddr: string = "0x0000000000000000000000000000000000000000";
