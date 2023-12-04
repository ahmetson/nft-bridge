import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

type ChainAttributes = {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  nativeCurrencyTokenAddress?: string;
  selector?: string;
  router?: string;
};

const NETWORKS_EXTRA_DATA: Record<string, ChainAttributes> = {
  [chains.hardhat.id]: {
    color: "#b8af0c",
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e",
  },
  [chains.sepolia.id]: {
    color: ["#5f4bb6", "#87ff65"],
    selector: "0xDE41BA4FC9D91AD9",
    router: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
  },
  [chains.bscTestnet.id]: {
    color: "#0975F6",
    selector: "0xB8159170038F96FB",
    router: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2",
  },
  [chains.gnosis.id]: {
    color: "#48a9a6",
  },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  [chains.polygonMumbai.id]: {
    color: "#92D9FA",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    selector: "0xADECC60412CE25A5",
    router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
  },
  [chains.optimismGoerli.id]: {
    color: "#f01a37",
  },
  [chains.optimism.id]: {
    color: "#f01a37",
  },
  [chains.avalancheFuji.id]: {
    color: "#28a0f0",
    selector: "0xCCF0A31A221F3C9B",
    router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0",
  },
  [chains.fantom.id]: {
    color: "#1969ff",
  },
  [chains.fantomTestnet.id]: {
    color: "#1969ff",
  },
  [chains.scrollSepolia.id]: {
    color: "#fbebd4",
  },
};

/**
 * Gives the block explorer transaction URL.
 * Returns empty string if the network is a local chain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;
  // @ts-expect-error : ignoring error since `blockExplorers` key may or may not be present on some chains
  const blockExplorerTxURL = chains[targetChain]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

/**
 * Gives the block explorer URL for a given address.
 * Defaults to Etherscan if no (wagmi) block explorer is configured for the network.
 */
export function getBlockExplorerAddressLink(network: chains.Chain, address: string) {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `https://etherscan.io/address/${address}`;
  }

  return `${blockExplorerBaseURL}/address/${address}`;
}

export function getTargetById(id: number): chains.Chain & Partial<ChainAttributes> {
  const targets = getTargetNetworks();
  const i = targets.findIndex(configuredNetwork => {
    return configuredNetwork.id === id;
  });
  return targets[i];
}

/**
 * @returns targetNetworks object consisting targetNetworks from scaffold.config and extra network metadata
 */
export function getTargetNetworks(chainId?: number): Array<chains.Chain & Partial<ChainAttributes>> {
  let remove = -1;
  const targets = scaffoldConfig.targetNetworks.map((configuredNetwork, i) => {
    if (chainId && configuredNetwork.id === chainId) {
      remove = i;
    }
    return {
      ...configuredNetwork,
      ...NETWORKS_EXTRA_DATA[configuredNetwork.id],
    };
  });
  if (remove > -1) {
    targets.splice(remove, 1);
  }
  return targets;
}
