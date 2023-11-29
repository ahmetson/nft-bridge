# 🏗 Scaffold-ETH 2
# [No code NFT bridge](#new-nft-bridge)
A trust-less, serverless NFT bridge framework with minimal setup.

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>
To see the how to work with it, quickly go to the [Getting Started](#getting-started) section.

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.
# Version 0
The [version 0](https://github.com/ahmetson/nft-bridge/tree/chainlink-function)
was implemented for [Ethglobal 2021 Hackathon](https://ethglobal.com/showcase/nft-bridge-tk299) using chainlink oracles.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.
That project had some issues before I wanted to announce it.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.
* Complicated setup: a developer have to deploy multiple smartcontracts and link them.
* Bad user experience: a user had to sign a transaction, switch the network then, sign again.
* Security thresh: A middleware API which verifies the data to be accessed by the Oracles.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/1171422a-0ce4-4203-bcd4-d2d1941d198b)
To solve the issues, I was eagerly researching entire internet.
Especially my concern was the security trench.

## Requirements
For me, Chainlink CCIP was the best candidate to improve the NFT Bridge.
At that time it wasn't launched. So with this hackathon
I finally want to release the more secure NFT Bridge.

Before you begin, you need to install the following tools:
> I signed up for the announcements.
> 
> I joined to the early access.
> 
> Within two years I messaged several times Chainlink, 
> about the news regarding CCIP but no response.

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart
--- 
# New NFT Bridge
A new NFT Bridge solves all the issues of the first version.

To get started with Scaffold-ETH 2, follow the steps below:
| Category        | Version 0                                | New NFT Bridge                                          |
|-----------------|------------------------------------------|---------------------------------------------------------|
| **Development** | Requires to deploy smartcontracts        | :blush: **No setup***                                   |
| **UI**          | Multiple transactions, switching network | :satisfied: **Single transaction**                      |
| **Middleware**  | Custom API in a centralized server       | :evergreen_tree: **Decentralized Oracle Network (DON)** |

1. Clone this repo & install dependencies
:blush: *No setup &ndash; If your NFT has additional parameter besides ERC721 standard, then
there is needed a minimal setup. Otherwise, no code is needed.*

---

## Getting Started
**Assume you already deployed the original NFT in one of the [supporting blockchains](#supported-blockchains)**.

In order to bridge the NFT, first we need to be the owner of the NFT.
Either the NFT must be `Ownable` or we use the deployer's address.

Then, anyone can bridge their NFTs as they want.

### Library
The NFT bridge is available as an NPM package. The package has a LinkedNFT module, which should extend the original NFT.

The LinkedNFT constructor accepts the list of networks as its argument. The NFT will be minted in all the blockchains listed in the constructor.

## Supported Blockchains
Any blockchain supported by the Chainlink CCIP.

---
# Example
For example, I will create a simple NFT on remix using the LinkedNFT. After the deployment, let's mint the first NFT.
As you see, the NFT will be visible on various blockchains. Let's transfer the NFT on the second blockchain by selling it on OpenSea.
When another account buys the NFT, he will have it on both chains.

## Todo
singleton
custom parameters or functions
A script that deploys a custom NFT on various blockchains and links them together.
A nice UI to manage the Link tokens using Dex.

## Structure
Every blockchain must have two smartcontracts.
The one is the NFT and other one is the Factory.

The NFTs must be implemented using LinkedNFT.


The all supported contracts must deploy a factory.
This factory is responsible to deploy the nfts.

Then, the original NFT must be created using LinkedNft.

The nft must use the factory to have a permission to mint it.

# How to use

1. Install [git](https://git-scm.com/), [Docker](https://www.docker.com/get-started), and [Docker Compose](https://docs.docker.com/compose/install/).

2. Clone repository
```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
