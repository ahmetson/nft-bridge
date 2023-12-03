export default {
  "80001": [
    {
      name: "polygonMumbai",
      chainId: "80001",
      contracts: {
        LinkedFactory: {
          address: "0xCb3B96E8c57E90b8B74959c8475cD3245D02f053",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "InvalidRouter",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "destNetworkSelectors",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getRouter",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "nftAdmin",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeLinkedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "registrar",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "wrappers",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
        Registrar: {
          address: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint256[]",
                  name: "chainIds",
                  type: "uint256[]",
                },
                {
                  components: [
                    {
                      internalType: "uint64",
                      name: "selector",
                      type: "uint64",
                    },
                    {
                      internalType: "address",
                      name: "router",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "registrar",
                      type: "address",
                    },
                  ],
                  internalType: "struct Registrar.NetworkParams[]",
                  name: "networkParams",
                  type: "tuple[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "chainId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "target",
                  type: "address",
                },
              ],
              name: "NftAddress",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "calculateAddress",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "chainId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "calculateAddress",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedNfts",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "chainId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "deployTx",
                  type: "bytes32",
                },
                {
                  internalType: "uint256[]",
                  name: "chainIds",
                  type: "uint256[]",
                },
              ],
              name: "setup",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "supportedNetworks",
              outputs: [
                {
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  "11155111": [
    {
      name: "sepolia",
      chainId: "11155111",
      contracts: {
        Registrar: {
          address: "0xfe85D3e2bea95D44933Ce31f045E0E5C24526Ec9",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "factory",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "factory",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "nftAdmin",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeWrappedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "deployTx",
                  type: "bytes32",
                },
              ],
              name: "register",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "setup",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "wrappers",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
        SourceNftLib: {
          address: "0xF32B172072E712C282dD78152906C7Cfc8E8B7ea",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalName",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalSymbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;
