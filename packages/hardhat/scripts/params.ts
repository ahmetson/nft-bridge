export type NetworkParams = {
  selector: string;
  router: string;
};

// Main nets: Ethereum | Polygon | Avalanche C-Chain | BNB Chain
// Test nets: Sepolia | Mumbai | Fuji | BNB Testnet
// Testnets: 11155111 | 80001 | 1311 | 97
const supportedNetworkParams: { [key: number]: NetworkParams } = {
  11155111: {
    selector: "0xDE41BA4FC9D91AD9",
    router: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
  },
  80001: {
    selector: "0xADECC60412CE25A5",
    router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
  },
  1311: {
    selector: "0xCCF0A31A221F3C9B",
    router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
  },
  97: {
    selector: "0xB8159170038F96FB",
    router: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2",
  },
};

export function one(chainId: number): NetworkParams {
  return supportedNetworkParams[chainId];
}

export function listSelectors(exceptChainId: number): Array<string> {
  const selectors = new Array<string>();
  for (const chainId in supportedNetworkParams) {
    if (parseInt(chainId) === exceptChainId) {
      continue;
    }
    selectors.push(supportedNetworkParams[parseInt(chainId)].selector);
  }
  return selectors;
}

export function listRouters(exceptChainId: number): Array<string> {
  const routers = new Array<string>();
  for (const chainId in supportedNetworkParams) {
    if (parseInt(chainId) === exceptChainId) {
      continue;
    }
    routers.push(supportedNetworkParams[parseInt(chainId)].router);
  }
  return routers;
}
